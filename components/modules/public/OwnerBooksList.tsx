"use client";

import { Book } from "@/types/database";
import { BookCard } from "@/components/ui/common/BookCard";
import { useRouter } from "next/navigation";

type BookListProps = {
  books: Book[];
};

export function OwnerBooksList({ books }: BookListProps) {
  const router = useRouter();

//   const handleBookClick = (book: Book) => {
//     router.push(`/books/${book.id}`);
//   };

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
            />
          ))}
        </div>
      )}
    </>
  );
}