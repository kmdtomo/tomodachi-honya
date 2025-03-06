"use server";

import { cookies } from 'next/headers';
import { createClient } from '@/lib/db/supabase/server';
import sharp from 'sharp';

export async function uploadImages(files: File[]): Promise<string[]> {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    const uploadPromises = files.map(async (file) => {
      try {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('JPG、PNG、GIF、WEBP形式のみアップロード可能です');
        }

        // ファイルサイズチェック
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          throw new Error('ファイルサイズは10MB以下にしてください');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `images/${fileName}`;

        // ファイルをArrayBufferに変換
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // 画像の最適化
        const optimizedImage = await sharp(fileBuffer)
          .resize(1200, 1200, { // 最大サイズを設定
            fit: 'inside', // アスペクト比を保持
            withoutEnlargement: true // 元のサイズより大きくしない
          })
          .jpeg({ quality: 85 }) // JPEG形式で保存、画質85%
          .toBuffer();

        // Supabaseストレージにアップロード
        const { error: uploadError } = await supabase.storage
          .from('tomodati-bookstore')
          .upload(filePath, optimizedImage, {
            contentType: 'image/jpeg',
            cacheControl: '31536000', // 1年間のキャッシュ
            upsert: false
          });

        if (uploadError) {
          console.error('アップロードエラー:', uploadError);
          throw uploadError;
        }

        // 公開URLを取得
        const { data: { publicUrl } } = supabase.storage
          .from('tomodati-bookstore')
          .getPublicUrl(filePath);

        return publicUrl;
      } catch (error) {
        console.error('画像アップロードエラー:', error);
        throw error;
      }
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('画像アップロード処理エラー:', error);
    throw error;
  }
} 