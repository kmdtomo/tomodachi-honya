"use server";

import { cookies } from 'next/headers';
import { createClient } from '@/lib/db/supabase/server';
import sharp from 'sharp';

export async function uploadImages(files: File[]): Promise<string[]> {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    const CONCURRENT_UPLOADS = 3;
    const results: string[] = [];
    const errors: Error[] = [];

    for (let i = 0; i < files.length; i += CONCURRENT_UPLOADS) {
      const chunk = files.slice(i, i + CONCURRENT_UPLOADS);
      const chunkPromises = chunk.map(async (file) => {
        try {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(file.type)) {
            throw new Error(`${file.name}: JPG、PNG、GIF、WEBP形式のみアップロード可能です`);
          }

          const maxSize = 10 * 1024 * 1024;
          if (file.size > maxSize) {
            throw new Error(`${file.name}: ファイルサイズは10MB以下にしてください`);
          }

          const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `images/${fileName}`;

          const arrayBuffer = await file.arrayBuffer();
          const fileBuffer = Buffer.from(arrayBuffer);

          let optimizedImage = sharp(fileBuffer);
          
          const metadata = await optimizedImage.metadata();
          
          if (metadata.width && metadata.width > 1200 || metadata.height && metadata.height > 1200) {
            optimizedImage = optimizedImage.resize(1200, 1200, {
              fit: 'inside',
              withoutEnlargement: true
            });
          }

          const outputBuffer = await optimizedImage
            .jpeg({ quality: 85, progressive: true })
            .toBuffer();

          const { error: uploadError } = await supabase.storage
            .from('tomodati-bookstore')
            .upload(filePath, outputBuffer, {
              contentType: 'image/jpeg',
              cacheControl: '31536000',
              upsert: false
            });

          if (uploadError) {
            throw new Error(`${file.name}: アップロードに失敗しました - ${uploadError.message}`);
          }

          const { data: { publicUrl } } = supabase.storage
            .from('tomodati-bookstore')
            .getPublicUrl(filePath);

          return publicUrl;
        } catch (error) {
          if (error instanceof Error) {
            errors.push(error);
          } else {
            errors.push(new Error(`${file.name}: 不明なエラーが発生しました`));
          }
          return null;
        }
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults.filter((url): url is string => url !== null));
    }

    if (errors.length > 0) {
      console.error('一部の画像のアップロードに失敗しました:', errors);
    }

    if (results.length === 0) {
      throw new Error('すべての画像のアップロードに失敗しました');
    }

    return results;
  } catch (error) {
    console.error('画像アップロード処理エラー:', error);
    throw error;
  }
} 