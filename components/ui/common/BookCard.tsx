"use client";

import React from "react";
import { Book } from "@/types/database";
import Image from 'next/image';

type BookCardProps = {
  book: Book;
  onClick?: (book: Book) => void;
};

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div 
      key={book.id}
      className="flex flex-col sm:flex-row gap-4 cursor-pointer hover:-translate-y-2 transition-transform duration-300 bg-gray-800/30 p-4 rounded-lg"
      onClick={onClick ? () => onClick(book) : undefined}
    >
      {/* スマホ表示用のレイアウト */}
      <div className="sm:hidden w-full rounded-md overflow-hidden">
        <div className="w-[125px] h-[175px] flex-shrink-0 mx-auto mb-4">
          <Image 
            src={book.thumbnail || "/no-image.jpg"}
            alt={book.title || "書籍画像"}
            width={500}
            height={300}
            style={{ objectFit: 'cover' }}
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
        <div className="w-full space-y-2">
          <h3 className="text-base font-semibold line-clamp-1 text-white text-center">{book.title}</h3>
          <p className="text-xs text-gray-400 line-clamp-1">
            著者：{book.author || "不明"}
          </p>
          <p className="text-xs leading-relaxed line-clamp-3 text-white">
            {book.description || "詳細説明がありません。"}
          </p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <span className="text-lg font-bold text-white mr-3">¥{book.price || "未設定"}</span>
              <span className="text-xs text-gray-400">税込</span>
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[9px] text-white truncate max-w-[120px] inline-block">
              {book.owner?.name || "未設定"}
            </span>
          </div>
        </div>
      </div>

      {/* PC表示用のレイアウト */}
      <div className="hidden sm:flex sm:flex-row gap-4 ">
        <div className="w-[125px] h-[175px] flex-shrink-0">
          <Image 
            src={book.thumbnail || "/no-image.jpg"}
            alt={book.title || "書籍画像"}
            width={500}
            height={300}
            style={{ objectFit: 'cover' }}
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
        <div className="flex-1 space-y-2 flex flex-col justify-center">
          <h3 className="text-base font-semibold line-clamp-1 text-white">{book.title}</h3>
          <p className="text-xs text-gray-400 line-clamp-1">
            著者：{book.author || "不明"}
          </p>
          <p className="text-xs leading-relaxed line-clamp-3 text-white">
            {book.description || "詳細説明がありません。"}
          </p>
          <div className="flex items-center justify-between md:pt-4">
            <div className="flex items-center">
              <span className="text-lg font-bold text-white mr-3">¥{book.price || "未設定"}</span>
              <span className="text-xs text-gray-400">税込</span>
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[9px] text-white truncate max-w-[120px] inline-block">
              {book.owner?.name || "未設定"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}