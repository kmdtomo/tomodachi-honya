"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Event } from "@/types/database";
import { formatDateJP } from "@/utils/dateUtils";

type EventDetailProps = {
  event: Event;
};

// ... existing code ...

export function EventDetail({ event }: EventDetailProps) {
    return (
      <div className="flex items-center justify-center bg-black pt-10 md:px-4">
        <div className="container md:px-4 px-4 py-3 md:py-0">
          {/* イベント詳細カード */}
          <section className="mb-8 md:mb-16 mx-2 md:ml-8">
            <Card className="group relative rounded-xl transition-all duration-300 border-0">
              <div className="flex flex-col md:flex-row">
                {/* サムネイル部分 - PC版は元のまま維持 */}
                <div className="relative h-[200px] md:h-auto md:max-w-[450px] md:min-h-[300px] w-full flex-shrink-0 rounded-xl">
                  <Image
                    src={event.thumbnail_url || "/default-event.jpg"}
                    alt={event.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
  
                {/* コンテンツ部分 */}
                <div className="flex-1 p-2 md:p-6 bg-gradient-to-r from-black/90 to-black/70 relative">
                  <div className="h-full flex flex-col">
                    <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-xl mt-5 md:mt-0 mb-4 md:mb-5">
                      {event.name}
                    </h2>
  
                    {/* イベント情報を横並びに */}
                    <div className="flex flex-col md:flex-wrap md:flex-row gap-y-2 md:gap-x-6 text-white mb-3 md:mb-4">
                      <p className="text-sm">
                        <span className="px-2 md:px-3 py-1 bg-gray-800 rounded-full text-xs md:text-sm mr-2">
                          日時
                        </span>
                        {formatDateJP(event.data)}
                      </p>
                      <p className="text-sm">
                        <span className="px-2 md:px-3 py-1 bg-gray-800 rounded-full text-xs md:text-sm mr-2">
                          値段
                        </span>
                        ¥{event.price.toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <span className="px-2 md:px-3 py-1 bg-gray-800 rounded-full text-xs md:text-sm mr-2">
                          場所
                        </span>
                        {event.location}
                      </p>
                    </div>
  
                    {/* 概要部分（全文表示） */}
                    <div className="mt-2 md:mt-3">
                      <div className="text-xs md:text-sm text-white">
                        <span className="px-2 md:px-3 py-1 bg-gray-800 rounded-full text-xs md:text-sm mr-2">
                          概要
                        </span>
                        <p className="whitespace-pre-line leading-relaxed mt-2 ml-1 md:ml-2 text-sm">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>
  
          {/* ギャラリーセクション */}
          {event.event_images && event.event_images.length > 0 && (
            <section className="px-2 md:px-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {event.event_images.map((image, index) => (
                  <div key={index} className="relative h-48 sm:h-40 md:h-48 w-full">
                    <Image
                      src={image.image_url || "/default-event.jpg"}
                      alt={`Gallery Image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }