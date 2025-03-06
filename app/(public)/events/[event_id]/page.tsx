"use client";

import React, { useEffect, useState } from "react";
import { Event } from "@/types/database";
import { EventDetail } from "@/components/modules/public/EvnetDetail";
import { getEventDetails } from "@/actions/supabase/event/actions";
import { Loading } from "@/components/ui/common/loading";
import { useParams } from "next/navigation";

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getEventDetails(params.event_id as string);
        if (error) {
          console.error("イベント詳細の取得に失敗しました:", error);
          return;
        }
        if (data) {
          setEvent(data);
        }
      } catch (error) {
        console.error("イベント詳細の取得中にエラーが発生しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.event_id) {
      fetchEventDetails();
    }
  }, [params.event_id]);

  if (isLoading) {
    return <Loading fullScreen text="イベント情報を読み込み中..." />;
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center bg-black text-white">
        イベントが見つかりませんでした
      </div>
    );
  }

  return <EventDetail event={event} />;
}
