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
      const bookData = {
        title: volumeInfo.title || "",
        authors: volumeInfo.authors || [],
        description: volumeInfo.description || "概要はありません。",
        thumbnail: volumeInfo.imageLinks?.thumbnail || "",
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