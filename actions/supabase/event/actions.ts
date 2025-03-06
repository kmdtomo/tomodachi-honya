"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/db/supabase/server";
import { Event } from "@/types/database";
import { formatToISOWithJST } from "@/utils/dateUtils";

/**
 * 新規イベントを作成し、画像URLを紐づける
 */
export async function createEvent(eventData: Partial<Event>, imageUrls: string[]) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // 日付データがある場合、タイムゾーンを考慮して保存
    if (eventData.data) {
      // 日本時間として明示的にISO形式に変換
      eventData.data = formatToISOWithJST(eventData.data);
    }

    // イベントの作成
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert([eventData])
      .select()
      .single();

    if (eventError) {
      console.error("イベント作成エラー:", eventError);
      throw eventError;
    }

    if (!event) {
      throw new Error("イベントの作成に失敗しました");
    }

    // イベント画像の登録
    if (imageUrls.length > 0) {
      const imageData = imageUrls.map((url) => ({
        event_id: event.id,
        image_url: url,
      }));

      const { error: imageError } = await supabase.from("event_images").insert(imageData);

      if (imageError) {
        console.error("イベント画像の登録エラー:", imageError);
        // イベント画像の登録に失敗した場合、作成したイベントも削除
        await supabase.from("events").delete().eq("id", event.id);
        throw imageError;
      }
    }

    return { data: event, error: null };
  } catch (error) {
    console.error("createEvent エラー:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("不明なエラーが発生しました"),
    };
  }
}

/**
 * イベントを更新し、追加・削除された画像を反映する
 */
export async function updateEvent(
  id: string,
  eventData: Partial<Event>,
  newImageUrls: string[],
  imagesToDelete: string[]
) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // 日付データがある場合、タイムゾーンを考慮して保存
    if (eventData.data) {
      // 日本時間として明示的にISO形式に変換
      eventData.data = formatToISOWithJST(eventData.data);
    }

    // 既存の画像を削除
    if (imagesToDelete.length > 0) {
      for (const imageUrl of imagesToDelete) {
        const { error: deleteError } = await supabase
          .from("event_images")
          .delete()
          .eq("image_url", imageUrl)
          .eq("event_id", id);

        if (deleteError) {
          console.error("イベント画像の削除エラー:", deleteError);
          throw deleteError;
        }
      }
    }

    // 新しい画像を追加
    if (newImageUrls.length > 0) {
      const imageData = newImageUrls.map((url) => ({
        event_id: id,
        image_url: url,
      }));

      const { error: imageError } = await supabase.from("event_images").insert(imageData);

      if (imageError) {
        console.error("イベント画像の追加エラー:", imageError);
        throw imageError;
      }
    }

    // イベント情報を更新
    const { data, error } = await supabase
      .from("events")
      .update(eventData)
      .eq("id", id)
      .select("*, event_images(*)")
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * イベントを削除し、紐づく画像も削除する
 */
export async function deleteEvent(id: string) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // 関連する画像も削除
    await supabase.from("event_images").delete().eq("event_id", id);

    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * すべてのイベントを取得（画像含む）
 */
export async function getEvents() {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("events")
      .select("*, event_images(*)")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * イベントをIDで1件取得（画像含む）
 */
export async function getEventById(id: string) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("events")
      .select("*, event_images(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * 一覧表示用の軽量クエリ（画像を取得しない）
 */
export async function getEventsLight() {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("events")
      .select("id, name, data, price, location, description, status")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * イベントの詳細を取得（画像含む）
 */
export async function getEventDetails(id: string) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("events")
      .select("*, event_images(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * 現在(UTC)時刻を過ぎた "upcoming" のイベントを "past" に更新する
 */
export async function updateEventStatus() {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // 現在の日本時間を取得
    const now = new Date();
    const nowISO = now.toISOString();

    console.log('現在時刻:', nowISO);

    // 現在時刻を過ぎたイベントのステータスを更新
    const { data, error } = await supabase
      .from('events')
      .update({ status: 'past' })
      .eq('status', 'upcoming')
      .lt('data', nowISO);

    if (error) {
      console.error('イベントステータス更新エラー:', error);
      return { error: 'イベントステータス更新に失敗しました' };
    }

    // 更新されたイベント数を取得するために、再度クエリを実行
    const { data: selectData, error: selectError } = await supabase
      .from('events')
      .select('id, data, status')
      .eq('status', 'past')
      .lt('data', nowISO);

    if (selectError) {
      console.error('イベント数取得エラー:', selectError);
      return { error: 'イベント数取得に失敗しました' };
    }

    console.log('更新されたイベント数:', selectData ? selectData.length : 0);
    if (selectData) {
      selectData.forEach(event => {
        console.log(`イベントID: ${event.id}, data: ${event.data}, status: ${event.status}`);
      });
    }
    return { data: 'イベントステータスを更新しました' };
  } catch (error) {
    console.error('イベントステータス更新エラー:', error);
    return { error: 'イベントステータス更新に失敗しました' };
  }
}

/**
 * 年月でイベントを検索（画像含む）
 */
export async function getEventsByYearMonth(year: number, month: number) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // 指定された年月の開始日と終了日を設定
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();

    const { data, error } = await supabase
      .from("events")
      .select("*, event_images(*)")
      .gte("data", startDate)  // 開始日以降
      .lte("data", endDate)    // 終了日以前
      .order("data", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
