"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  paramName?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ 
  placeholder = "名前で検索...", 
  className = "",
  paramName = "q",
  onSearch
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get(paramName) || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // onSearchが提供されている場合はそれを使用
    if (onSearch) {
      onSearch(query);
      return;
    }
    
    // 現在のURLパラメータを取得
    const params = new URLSearchParams(searchParams.toString());
    
    // 検索クエリをURLパラメータに設定
    if (query.trim()) {
      params.set(paramName, query);
    } else {
      params.delete(paramName);
    }
    
    // 新しいURLにナビゲート
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex w-full ${className}`}>
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-800/50 border-white/70 pr-10 w-full"
      />
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon"
        className="absolute right-0 top-0 h-full"
      >
        <Search className="h-4 w-4 text-gray-400" />
      </Button>
    </form>
  );
}