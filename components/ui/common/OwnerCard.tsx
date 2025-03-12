"use client";

import React from "react";
import { Owner } from "@/types/database";
import { MapPin, Instagram, Youtube } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

// Xアイコンのカスタムコンポーネント
const XIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

type OwnerCardProps = {
  owner: Owner;
  onClick: (owner: Owner) => void;
};

type HobbyType = {
  owner_hobby: string | null;
};

export function OwnerCard({ owner, onClick }: OwnerCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick(owner);
  };

  return (
    <Card
      key={owner.id}
      className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
      onClick={handleClick}
    >
      <div className="absolute inset-0">
        <Image
          src={owner.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyMDIwMjAiLz48cGF0aCBkPSJNMTAwIDEyMEM4OC45NTQzIDEyMCA4MCAxMTEuMDQ2IDgwIDEwMEM4MCA4OC45NTQzIDg4Ljk1NDMgODAgMTAwIDgwQzExMS4wNDYgODAgMTIwIDg4Ljk1NDMgMTIwIDEwMEMxMjAgMTExLjA0NiAxMTEuMDQ2IDEyMCAxMDAgMTIwWiIgZmlsbD0iIzQwNDA0MCIvPjwvc3ZnPg=='}
          alt={owner.name || ''}
          width={1200}
          height={800}
          quality={95}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/70" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 p-6">
        <div className="flex flex-col h-[400px]">
          <div className="mx-auto mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/30 transition-all duration-300 group-hover:ring-white/50">
              <Image
                src={owner.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyMDIwMjAiLz48cGF0aCBkPSJNMTAwIDEyMEM4OC45NTQzIDEyMCA4MCAxMTEuMDQ2IDgwIDEwMEM4MCA4OC45NTQzIDg4Ljk1NDMgODAgMTAwIDgwQzExMS4wNDYgODAgMTIwIDg4Ljk1NDMgMTIwIDEwMEMxMjAgMTExLjA0NiAxMTEuMDQ2IDEyMCAxMDAgMTIwWiIgZmlsbD0iIzQwNDA0MCIvPjwvc3ZnPg=='}
                alt={owner.name || ''}
                width={192}
                height={192}
                quality={95}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center flex-grow">
            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1">
              {owner.name}
            </h3>
            {owner.job && (
              <p className="text-gray-300 text-sm mb-2 line-clamp-1">
                {owner.job}
              </p>
            )}
            <div className="flex items-center justify-center text-gray-300 text-sm mb-4">
              <MapPin size={16} className="mr-1" />
              <span>{owner.location}</span>
              <span className="mx-2">•</span>
              <span>{owner.age}歳</span>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-4 max-h-[4.5rem] overflow-hidden">
              {owner.hobby?.slice(0, 5).map((h: HobbyType, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white max-w-[138px] truncate inline-block"
                >
                  {h.owner_hobby}
                </span>
              ))}
            </div>

            <p className="text-gray-200 text-sm mb-6 line-clamp-2">
              {owner.bio}
            </p>
          </div>

          <div className="flex justify-center space-x-4 mt-auto">
            {owner.instagram_url && (
              <a href={owner.instagram_url} className="text-pink-300 hover:text-pink-200">
                <Instagram size={24} />
              </a>
            )}
            {owner.x_url && (
              <a href={owner.x_url} className="text-blue-300 hover:text-blue-200">
                <XIcon size={24} />
              </a>
            )}
            {owner.youtube_url && (
              <a href={owner.youtube_url} className="text-red-400 hover:text-red-300">
                <Youtube size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}