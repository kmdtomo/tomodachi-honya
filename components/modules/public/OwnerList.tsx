"use client";

import { useState, useEffect } from "react";
import { Owner } from "@/types/database";
import { OwnerCard } from "@/components/ui/common/OwnerCard";
import { getOwners } from "@/actions/supabase/owner/actions";
import { Loading } from "@/components/ui/common/loading";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/ui/admin/SearchBar";

export default function OwnerList() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const { data, error } = await getOwners();
        if (error) throw error;
        setOwners(data || []);
        setFilteredOwners(data || []);
      } catch (error) {
        console.error("オーナー取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredOwners(owners);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = owners.filter(owner => 
      owner.name?.toLowerCase().includes(lowercaseQuery) ||
      owner.hobby?.some(h => h.owner_hobby?.toLowerCase().includes(lowercaseQuery))
    );
    setFilteredOwners(filtered);
  };

  const handleOwnerClick = (owner: Owner) => {
    router.push(`/owners/${owner.id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-adobe mb-4 sm:mb-0">オーナー紹介</h1>
        <div className="w-full sm:w-72">
          <SearchBar
            placeholder="名前や趣味で検索..."
            onSearch={handleSearch}
            className="text-white"
          />
        </div>
      </div>
      
      {filteredOwners.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-gray-400">
          該当するオーナーが見つかりません
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredOwners.map((owner) => (
            <OwnerCard 
              key={owner.id} 
              owner={owner} 
              onClick={handleOwnerClick} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
