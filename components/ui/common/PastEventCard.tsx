"use client";

import React from "react";
import { Event } from "@/types/database";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { formatDateJP } from "@/utils/dateUtils";

type PastEventCardProps = {
  event: Event;
  onClick: (event: Event) => void;
};

export function PastEventCard({ event, onClick }: PastEventCardProps) {
  return (
    <div
      className="group cursor-pointer bg-gray-800/30 rounded-lg border border-white/60 overflow-hidden hover:-translate-y-2 transition-all duration-300 h-full flex flex-col"
      onClick={() => onClick(event)}
    >
      <div className="relative aspect-video">
        <Image
          src={event.thumbnail_url || "/default-event.jpg"}
          alt={event.name || "イベント画像"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-2 line-clamp-1 text-white">{event.name}</h3>
        <div className="flex items-center text-gray-300 text-sm mb-2">
          <Calendar size={16} className="mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{formatDateJP(event.data)}</span>
        </div>
        <div className="flex items-center text-gray-300 text-sm mb-2">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{event.location || "場所未設定"}</span>
        </div>
        <div className="flex items-center justify-end mt-auto">
          <span className="text-lg font-bold text-white">¥{event.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}