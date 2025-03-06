"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X, Calendar, CalendarCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loading } from "@/components/ui/common/loading";
import { SearchBar } from "@/components/ui/admin/SearchBar";
import { AdminFormModal } from "@/components/ui/admin/AdminFormModal";
import { PastEventCard } from "@/components/ui/common/PastEventCard";
import { Event, EventImage } from "@/types/database";
import { createEvent, updateEvent, getEventDetails, getEventsLight } from "@/actions/supabase/event/actions";
import { uploadImages } from "@/utils/uploadImage";
import { toast } from "react-hot-toast";
import { formatForDateTimeInput } from "@/utils/dateUtils";

type EventManagementProps = {
  initialEvents: Event[];
};

export default function EventManagement({ initialEvents }: EventManagementProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>(
    initialEvents.filter((event) => event.status === "upcoming")
  );
  const [pastEvents, setPastEvents] = useState<Event[]>(
    initialEvents.filter((event) => event.status === "past")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUpcomingEvents, setFilteredUpcomingEvents] = useState<Event[]>(
    initialEvents.filter((event) => event.status === "upcoming")
  );
  const [filteredPastEvents, setFilteredPastEvents] = useState<Event[]>(
    initialEvents.filter((event) => event.status === "past")
  );
  const [activeTab, setActiveTab] = useState<string>("upcoming");

  // フォーム関連
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [name, setName] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("upcoming");
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<EventImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // 検索機能
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredUpcomingEvents(upcomingEvents);
      setFilteredPastEvents(pastEvents);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    
    const filteredUpcoming = upcomingEvents.filter(event => 
      event.name?.toLowerCase().includes(lowercaseQuery) ||
      event.location?.toLowerCase().includes(lowercaseQuery) ||
      event.description?.toLowerCase().includes(lowercaseQuery)
    );
    
    const filteredPast = pastEvents.filter(event => 
      event.name?.toLowerCase().includes(lowercaseQuery) ||
      event.location?.toLowerCase().includes(lowercaseQuery) ||
      event.description?.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredUpcomingEvents(filteredUpcoming);
    setFilteredPastEvents(filteredPast);
  };

  // イベント一覧を再取得
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // 最新の一覧を取得
      const { data } = await getEventsLight();
      if (data) {
        const typedData = data as Event[];

        // サムネイルURLや画像の情報は別テーブル(event_images)なので、詳細を都度取得する例
        const eventsWithThumbnails = await Promise.all(
          typedData.map(async (event) => {
            const { data: eventDetails } = await getEventDetails(event.id);
            return {
              ...event,
              thumbnail_url: eventDetails?.thumbnail_url || "",
              event_images: eventDetails?.event_images || [],
            };
          })
        );

        setEvents(eventsWithThumbnails);
        
        const upcoming = eventsWithThumbnails.filter((event) => event.status === "upcoming");
        const past = eventsWithThumbnails.filter((event) => event.status === "past");
        
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        
        // 検索クエリがある場合は、フィルタリングを維持
        if (searchQuery) {
          handleSearch(searchQuery);
        } else {
          setFilteredUpcomingEvents(upcoming);
          setFilteredPastEvents(past);
        }
      }
    } catch (error) {
      console.error("fetchEvents エラー:", error);
      toast.error("イベント一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 画像アップロード処理
  const handleImageUpload = async () => {
    setUploadingImages(true);
    let thumbnailUrl = "";
    let newImageUrls: string[] = [];

    try {
      // サムネイル画像のアップロード
      if (selectedThumbnail) {
        const thumbnailSize = selectedThumbnail.size / (1024 * 1024); // MBに変換
        if (thumbnailSize > 5) {
          toast.error(`サムネイル画像のサイズが大きすぎます（${thumbnailSize.toFixed(2)}MB）。5MB以下にしてください。`);
          return null;
        }
        
        const thumbnailUrls = await uploadImages([selectedThumbnail]);
        if (thumbnailUrls && thumbnailUrls.length > 0) {
          thumbnailUrl = thumbnailUrls[0];
        }
      }

      // 複数画像のアップロード
      if (selectedImages.length > 0) {
        // 画像サイズの合計を計算
        const totalSize = selectedImages.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);
        if (totalSize > 15) {
          toast.error(`画像の合計サイズが大きすぎます（${totalSize.toFixed(2)}MB）。15MB以下にしてください。`);
          return null;
        }
        
        newImageUrls = await uploadImages(selectedImages) || [];
      }

      return { thumbnailUrl, newImageUrls };
    } catch (error) {
      console.error("画像アップロードエラー:", error);
      toast.error("画像のアップロードに失敗しました。ファイルサイズを小さくするか、数を減らしてお試しください。");
      return null;
    } finally {
      setUploadingImages(false);
    }
  };

  // イベント作成・更新送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || uploadingImages) return;

    try {
      setIsSubmitting(true);
      
      // 画像アップロード処理
      const uploadResult = await handleImageUpload();
      if (!uploadResult) {
        setIsSubmitting(false);
        return;
      }
      
      const { thumbnailUrl, newImageUrls } = uploadResult;
      
      // 最終的にSupabaseへ送るイベントデータ
      const eventData: Partial<Event> = {
        name,
        data,
        price: Number(price),
        location,
        description,
        status,
        thumbnail_url: thumbnailUrl || editingEvent?.thumbnail_url,
      };

      if (editingEvent) {
        // 既存イベントを更新
        const { data: updatedEvent } = await updateEvent(
          editingEvent.id,
          eventData,
          newImageUrls,
          imagesToDelete
        );
        if (updatedEvent) {
          await fetchEvents();
          toast.success("イベントを更新しました");
        }
      } else {
        // 新規イベントを作成
        const { data: newEvent } = await createEvent(eventData, newImageUrls);
        if (newEvent) {
          await fetchEvents();
          toast.success("イベントを作成しました");
        }
      }

      setIsOpen(false);
      setEditingEvent(null);
      resetForm();
    } catch (error) {
      console.error("イベント保存エラー:", error);
      toast.error("イベントの保存に失敗しました。入力内容を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 日時入力処理
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value; // "2025-02-27T09:23" など
    if (!inputValue) {
      setData("");
      return;
    }

    // 入力された日時をそのまま保存
    setData(inputValue);
  };

  // フォームリセット
  const resetForm = () => {
    setName("");
    setData("");
    setPrice("");
    setLocation("");
    setDescription("");
    setStatus("upcoming");
    setSelectedThumbnail(null);
    setSelectedImages([]);
    setExistingImages([]);
    setImagesToDelete([]);
  };

  // イベント編集用データ取得
  const handleEditEvent = async (event: Event) => {
    setEditingEvent(event);
    setName(event.name || "");
    
    // 日時の表示形式を修正
    if (event.data) {
      // datetime-local入力用の値を設定
      const localDateString = formatForDateTimeInput(event.data);
      
      setData(event.data);
      
      // datetime-local入力用の値を設定
      const dateTimeInput = document.getElementById("event-datetime") as HTMLInputElement;
      if (dateTimeInput) {
        dateTimeInput.value = localDateString;
      }
    } else {
      setData("");
    }
    
    setPrice(event.price?.toString() || "");
    setLocation(event.location || "");
    setDescription(event.description || "");
    setStatus(event.status || "upcoming");
    setSelectedThumbnail(null);
    setSelectedImages([]);
    setImagesToDelete([]);
    
    // 既存の画像を取得
    const { data: eventDetails } = await getEventDetails(event.id);
    setExistingImages(eventDetails?.event_images || []);
    
    setIsOpen(true);
  };

  // 画像削除処理
  const handleImageDelete = (imageUrl: string) => {
    setImagesToDelete([...imagesToDelete, imageUrl]);
    setExistingImages(existingImages.filter((img) => img.image_url !== imageUrl));
  };

  return (
    <div className="min-h-screen text-white">
      {loading ? (
        <Loading fullScreen />
      ) : (
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold font-adobe">イベント管理</h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="イベント名で検索..." 
                className="w-full"
              />

              <Button
                onClick={() => {
                  setEditingEvent(null);
                  resetForm();
                  setIsOpen(true);
                }}
                className="border border-gray-500 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto hover:bg-gray-800 hover:border-white transition-all duration-200"
              >
                <Plus className="mr-2" size={18} />
                新規イベント作成
              </Button>
              
              <AdminFormModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                title={
                  <div className="flex flex-col">
                    <div className="text-xl font-bold">
                      {editingEvent ? "イベントを編集" : "新規イベント作成"}
                    </div>
                    {editingEvent && (
                      <div className="text-sm mt-1 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          editingEvent.status === "upcoming" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {editingEvent.status === "upcoming" ? "開催予定" : "過去の開催"}
                        </span>
                        <span className="text-gray-400 ml-2">
                          {activeTab === "upcoming" ? "「開催予定」タブから編集中" : "「過去の開催」タブから編集中"}
                        </span>
                      </div>
                    )}
                  </div>
                }
                description="イベントの詳細情報を入力してください"
                isSubmitting={isSubmitting || uploadingImages}
                onSubmit={handleSubmit}
                submitLabel={editingEvent ? "更新" : "作成"}
              >
                {/* サムネイル画像 */}
                <div>
                  <label className="block mb-2">サムネイル画像</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {editingEvent?.thumbnail_url && (
                      <div className="relative w-full sm:w-[500px] h-[150px] sm:h-[250px]">
                        <Image
                          src={editingEvent.thumbnail_url || "/default-event.jpg"}
                          alt="Current thumbnail"
                          fill
                          className="object-cover rounded"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedThumbnail(e.target.files?.[0] || null)
                      }
                      className="bg-gray-800 w-full"
                    />
                  </div>
                </div>

                {/* イベント名 */}
                <div>
                  <label className="block mb-2">イベント名</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-800"
                  />
                </div>

                {/* 開催日時 */}
                <div>
                  <label className="block mb-2">開催日時</label>
                  <Input
                    id="event-datetime"
                    type="datetime-local"
                    defaultValue={data ? formatForDateTimeInput(data) : ""}
                    onChange={handleDateChange}
                    className="bg-gray-800"
                  />
                </div>

                {/* 価格 */}
                <div>
                  <label className="block mb-2">価格</label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-gray-800"
                  />
                </div>

                {/* 場所 */}
                <div>
                  <label className="block mb-2">場所</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-gray-800"
                  />
                </div>

                {/* 説明 */}
                <div>
                  <label className="block mb-2">説明</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="bg-gray-800"
                  />
                </div>

                {/* ステータス */}
                <div>
                  <label className="block mb-2">ステータス</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-md p-2"
                  >
                    <option value="upcoming">開催予定</option>
                    <option value="past">過去の開催</option>
                  </select>
                </div>

                {/* イベント画像（複数可） */}
                <div>
                  <label className="block mb-2">イベント画像（複数可）</label>
                  {existingImages.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <Image
                            src={image.image_url || "/default-event.jpg"}
                            alt={`Event image ${index + 1}`}
                            fill
                            className="object-cover rounded"
                            style={{ objectFit: "contain" }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageDelete(image.image_url || "");
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setSelectedImages(files);
                    }}
                    className="bg-gray-800"
                  />
                </div>
              </AdminFormModal>
            </div>
          </div>

          {/* タブ表示：開催予定 / 過去の開催 */}
          <Tabs 
            defaultValue="upcoming" 
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
            value={activeTab}
          >
            <TabsList className="mb-6 sm:mb-8 bg-gray-800 p-1 rounded-lg w-full flex overflow-x-auto">
              <TabsTrigger 
                value="upcoming" 
                className="flex-1 flex items-center justify-center data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 sm:px-6 py-2 rounded-md transition-all whitespace-nowrap"
              >
                <Calendar className="mr-2" size={18} />
                開催予定 {filteredUpcomingEvents.length > 0 && `(${filteredUpcomingEvents.length})`}
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="flex-1 flex items-center justify-center data-[state=active]:bg-gray-600 data-[state=active]:text-white px-4 sm:px-6 py-2 rounded-md transition-all whitespace-nowrap"
              >
                <CalendarCheck className="mr-2" size={18} />
                過去の開催 {filteredPastEvents.length > 0 && `(${filteredPastEvents.length})`}
              </TabsTrigger>
            </TabsList>

            {/* 開催予定タブ */}
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredUpcomingEvents.length === 0 ? (
                  <div className="col-span-full text-center py-8 sm:py-12 text-gray-400">
                    {searchQuery ? "検索条件に一致するイベントはありません" : "開催予定のイベントはありません"}
                  </div>
                ) : (
                  filteredUpcomingEvents.map((event) => (
                    <PastEventCard 
                      key={event.id} 
                      event={event} 
                      onClick={handleEditEvent} 
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* 過去の開催タブ */}
            <TabsContent value="past">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPastEvents.length === 0 ? (
                  <div className="col-span-full text-center py-8 sm:py-12 text-gray-400">
                    {searchQuery ? "検索条件に一致するイベントはありません" : "過去のイベントはありません"}
                  </div>
                ) : (
                  filteredPastEvents.map((event) => (
                    <PastEventCard 
                      key={event.id} 
                      event={event} 
                      onClick={handleEditEvent} 
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}