import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Event } from "@/types/database";
import { formatDateJP } from "@/utils/dateUtils";
import { Calendar, MapPin } from "lucide-react";

type UpcomingEventsProps = {
  events: Event[];
  onEventClick: (event: Event) => void;
};

export function UpcomingEvents({ events, onEventClick }: UpcomingEventsProps) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6 font-adobe">開催予定のイベント</h2>
      <div className="space-y-6">
        {events.map((event) => (
          <Card
            key={event.id}
            className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
            onClick={() => onEventClick(event)}
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                <Image
                  src={event.thumbnail_url || "/default-event.jpg"}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              <div className="flex-1 p-4 md:p-6 bg-gradient-to-r from-black/90 to-black/70">
                <div className="h-full flex flex-col">
                  <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-xl mb-3">
                    {event.name}
                  </h2>
                  
                  <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-2 text-white mb-4">
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar size={16} className="mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{formatDateJP(event.data)}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin size={16} className="mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location || "場所未設定"}</span>
                    </div>
                    <div className="text-lg font-bold">
                      ¥{event.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <p className="text-sm text-white whitespace-pre-line leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}