import { getEventsLight, getEventDetails, updateEventStatus } from "@/actions/supabase/event/actions";
import EventManagement from "@/components/modules/admin/EventManagement";

export default async function EventPage() {
  // サーバーサイドでデータを取得
  // 1) ページ読み込み時にstatusを更新 (現在時刻より過去の "upcoming" を "past" へ)
  await updateEventStatus();

  // 2) 最新の一覧を取得
  const { data } = await getEventsLight();
  
  // サムネイルURLや画像の情報を取得
  const eventsWithThumbnails = await Promise.all(
    (data || []).map(async (event) => {
      const { data: eventDetails } = await getEventDetails(event.id);
      return {
        ...event,
        created_at: new Date().toISOString(),
        thumbnail_url: eventDetails?.thumbnail_url || "",
        event_images: eventDetails?.event_images || [],
      };
    })
  );

  return <EventManagement initialEvents={eventsWithThumbnails || []} />;
}
