"use client";

import React, { useEffect, useState } from "react";
import { Event } from "@/types/database";
import { PastEventCard } from "@/components/ui/common/PastEventCard";
import { UpcomingEvents } from "@/components/ui/common/UpcomingEvents";
import { SearchBar } from "@/components/ui/admin/SearchBar";
import { getEvents, getEventsByYearMonth } from "@/actions/supabase/event/actions";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/common/loading";

export default function EventPage() {
  const router = useRouter();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [filteredPastEvents, setFilteredPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(0); // 初期値を0に設定
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 初期値を0に設定

  // 年の選択肢（現在から過去3年分）
  const currentYear = new Date().getFullYear();
  const years = [0, ...Array.from({ length: 4 }, (_, i) => currentYear - i)];
  // 月の選択肢
  const months = [0, ...Array.from({ length: 12 }, (_, i) => i + 1)];

  useEffect(() => {
    fetchEvents();
  }, [selectedYear, selectedMonth]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      
      // 開催予定のイベントは常に全件取得
      const upcomingResult = await getEvents();
      if (upcomingResult.error) {
        console.error("開催予定イベントの取得に失敗しました:", upcomingResult.error);
        return;
      }
      
      // 過去のイベントは年月フィルターに応じて取得
      let pastData;
      if (selectedYear === 0 || selectedMonth === 0) {
        // 年月が選択されていない場合は全件取得
        pastData = upcomingResult.data?.filter(event => event.status === "past") || [];
      } else {
        // 年月が選択されている場合は絞り込み検索
        const pastResult = await getEventsByYearMonth(selectedYear, selectedMonth);
        if (pastResult.error) {
          console.error("過去のイベントの取得に失敗しました:", pastResult.error);
          return;
        }
        pastData = pastResult.data?.filter(event => event.status === "past") || [];
      }

      // 開催予定のイベントをセット
      const upcomingData = upcomingResult.data?.filter(event => event.status === "upcoming") || [];
      setUpcomingEvents(upcomingData);

      // 過去のイベントをセット
      setPastEvents(pastData);
      setFilteredPastEvents(pastData);

    } catch (error) {
      console.error("イベントの取得中にエラーが発生しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPastEvents(pastEvents);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = pastEvents.filter(event =>
      event.name?.toLowerCase().includes(lowercaseQuery) ||
      event.location?.toLowerCase().includes(lowercaseQuery) ||
      event.description?.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredPastEvents(filtered);
  };

  const handleEventClick = (event: Event) => {
    router.push(`/events/${event.id}`);
  };

  if (isLoading) {
    return <Loading fullScreen text="イベント情報を読み込み中..." />;
  }

  return (
    <div className="pb-10 bg-black pt-10 px-6">
      <div className="container mx-auto px-4">
        <UpcomingEvents 
          events={upcomingEvents} 
          onEventClick={handleEventClick}
        />
        
        {/* 過去の開催のセクション */}
        <section>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white font-adobe">過去の開催</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                >
                  <option value={0}>年を選択</option>
                  {years.filter(year => year !== 0).map(year => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                >
                  <option value={0}>月を選択</option>
                  {months.filter(month => month !== 0).map(month => (
                    <option key={month} value={month}>{month}月</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-72">
                <SearchBar
                  placeholder="過去のイベントを検索..."
                  onSearch={handleSearch}
                  className="text-white"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPastEvents.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                該当するイベントが見つかりません
              </div>
            ) : (
              filteredPastEvents.map((event) => (
                <PastEventCard
                  key={event.id}
                  event={event}
                  onClick={handleEventClick}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
