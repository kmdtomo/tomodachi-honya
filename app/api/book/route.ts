import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isbn = searchParams.get('isbn');
    
    if (!isbn) {
      return NextResponse.json(
        { error: 'ISBNパラメータが必要です' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const query = `isbn:${isbn.replace(/-/g, "")}`;
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
    );

    if (!res.ok) {
      throw new Error(`APIリクエストに失敗しました: ${res.statusText}`);
    }

    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      const volumeInfo = data.items[0].volumeInfo;
      
      // サムネイルURLの最適化
      let thumbnailUrl = volumeInfo.imageLinks?.thumbnail || "";
      
      // Google Booksの画像URLを高解像度版に変換
      // zoom=1は標準サイズ、zoom=2は大きいサイズ
      if (thumbnailUrl) {
        // HTTPSに変換
        thumbnailUrl = thumbnailUrl.replace('http://', 'https://');
        
        // 画像サイズパラメータを変更（より高解像度に）
        thumbnailUrl = thumbnailUrl.replace('zoom=1', 'zoom=2');
        
        // エッジ除去パラメータを追加（より良い表示のため）
        if (!thumbnailUrl.includes('edge=curl')) {
          thumbnailUrl = thumbnailUrl.replace('&source=gbs_api', '&edge=nocurl&source=gbs_api');
        }
      }
      
      const bookData = {
        title: volumeInfo.title || "",
        authors: volumeInfo.authors || [],
        description: volumeInfo.description || "概要はありません。",
        thumbnail: thumbnailUrl,
      };
      return NextResponse.json(bookData);
    } else {
      return NextResponse.json(
        { error: '該当する本の情報が見つかりませんでした' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('本の情報取得エラー:', error);
    return NextResponse.json(
      { error: error.message || '本の情報が取得できませんでした' },
      { status: 500 }
    );
  }
} 