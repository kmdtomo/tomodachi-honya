"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types/database";
import { BookCard } from "@/components/ui/common/BookCard";
import { SearchBar } from "@/components/ui/admin/SearchBar";

type BooksListProps = {
  books: Book[];
};

export function BooksList({ books }: BooksListProps) {
  const router = useRouter();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [titleQuery, setTitleQuery] = useState("");
  const [priceQuery, setPriceQuery] = useState("");

  const handleSearch = () => {
    let filtered = [...books];

    // タイトルでフィルタリング
    if (titleQuery.trim()) {
      const lowercaseTitle = titleQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.title?.toLowerCase().includes(lowercaseTitle)
      );
    }

    // 価格でフィルタリング
    if (priceQuery.trim()) {
      filtered = filtered.filter(book => 
        book.price?.includes(priceQuery)
      );
    }

    setFilteredBooks(filtered);
  };

  const handleTitleSearch = (query: string) => {
    setTitleQuery(query);
    const newFiltered = books.filter(book => {
      const titleMatch = !query.trim() || book.title?.toLowerCase().includes(query.toLowerCase());
      const priceMatch = !priceQuery.trim() || book.price?.includes(priceQuery);
      return titleMatch && priceMatch;
    });
    setFilteredBooks(newFiltered);
  };

  const handlePriceSearch = (query: string) => {
    setPriceQuery(query);
    const newFiltered = books.filter(book => {
      const titleMatch = !titleQuery.trim() || book.title?.toLowerCase().includes(titleQuery.toLowerCase());
      const priceMatch = !query.trim() || book.price?.includes(query);
      return titleMatch && priceMatch;
    });
    setFilteredBooks(newFiltered);
  };

  const handleBookClick = (book: Book) => {
    if (book.owner_id) {
      router.push(`/owners/${book.owner_id}`);
    }
  };

  return (
    <div className="px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 font-adobe text-white">本の一覧</h1>
        {/* 検索バー */}
        <div className="w-full sm:w-auto mb-4 sm:mb-8 flex flex-col sm:flex-row gap-4">
          <SearchBar 
            placeholder="タイトルで検索..." 
            onSearch={handleTitleSearch}
            className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px] text-white"
          />
          <SearchBar 
            placeholder="価格で検索..." 
            onSearch={handlePriceSearch}
            className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px] text-white"
          />
        </div>
      </div>

      {/* 本の一覧 */}
      {filteredBooks.length === 0 ? (
        <div className="text-center text-gray-400">
          該当する本が見つかりませんでした
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onClick={handleBookClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}