"use client";

import { Book } from "@/types/database";
import { BookCard } from "@/components/ui/common/BookCard";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminFormModal } from "@/components/ui/admin/AdminFormModal";

type BookListProps = {
  books: Book[];
};

export function OwnerBooksList({ books }: BookListProps) {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <>
      {books.length === 0 ? (
        <div className="text-center px-4 py-12 text-gray-400">
          登録されている本はありません
        </div>
      ) : (
        <div className="grid grid-cols-1 px-4 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onClick={handleBookClick}
            />
          ))}
        </div>
      )}

      <AdminFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="詳細"
        showSubmitButton={false}
      >
        {selectedBook && (
          <div className="space-y-8">
            <div className="flex flex-col items-center md:flex-row gap-6 mt-4 ">
              <div className="max-w-[150px] max-h-[220px] mx-auto md:mx-0">
                <img
                  src={selectedBook.thumbnail || "/no-image.jpg"}
                  alt={selectedBook.title || "書籍画像"}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{selectedBook.title}</h3>
                  <p className="text-gray-400 text-sm">著者：{selectedBook.author || "不明"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">¥{selectedBook.price || "未設定"}</p>
                  <p className="text-xs mt-2 text-gray-400">税込</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">オーナー</p>
                  <p>{selectedBook.owner?.name || "未設定"}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">あらすじ</p>
              <p className="text-base whitespace-pre-wrap">{selectedBook.description || "詳細説明がありません。"}</p>
            </div>
          </div>
        )}
      </AdminFormModal>
    </>
  );
}