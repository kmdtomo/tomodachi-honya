"use client";

import { Owner } from "@/types/database";
import Image from "next/image";
import { Youtube } from "lucide-react";

type OwnerDetailProps = {
  owner: Owner;
};

export default function OwnerDetail({ owner }: OwnerDetailProps) {
  return (
    <div className="text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center flex-col md:flex-row gap-6 md:gap-8">
          {/* 左側：アバター */}
          <div className="w-2/3 sm:w-1/2 md:w-1/4">
            <div className="rounded-full overflow-hidden aspect-square border-4 border-gray-700">
              <Image
                src={owner.image_url || '/default-avatar.jpg'}
                alt={owner.name || ''}
                width={800}
                height={800}
                quality={95}
                priority
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* 右側：詳細情報 */}
          <div className="w-full md:w-2/3">
            {/* ヘッダー情報 */}
            <div className="mb-4">
              <div className="flex flex-row items-center justify-between mb-2 gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold">{owner.name}</h1>
                <div className="flex items-center gap-4 mr-2">
                  {owner.instagram_url && (
                    <a
                      href={owner.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-400 transition-colors"
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )}
                  {owner.x_url && (
                    <a
                      href={owner.x_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {owner.youtube_url && (
                    <a
                      href={owner.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Youtube className="w-6 h-6 sm:w-7 sm:h-7" />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-400 mb-2">
                {owner.job && (
                  <p className="text-base sm:text-lg">{owner.job}</p>
                )}
                {owner.location && (
                  <>
                    <span>•</span>
                    <span className="text-sm sm:text-base">{owner.location}</span>
                  </>
                )}
                {owner.age && (
                  <>
                    <span>•</span>
                    <span className="text-sm sm:text-base">{owner.age}歳</span>
                  </>
                )}
              </div>
            </div>

            {/* 専門分野タグ */}
            {owner.hobby && owner.hobby.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {owner.hobby.map((hobby) => (
                  <span key={hobby.id} className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-800 rounded-full text-xs sm:text-sm">
                    {hobby.owner_hobby}
                  </span>
                ))}
              </div>
            )}

            {/* 自己紹介と得意分野を2カラムに */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-400 mb-2">一言メッセージ</h2>
                <p className="text-xs sm:text-sm leading-relaxed pr-0 sm:pr-4">
                  {owner.bio || "メッセージはありません。"}
                </p>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-400 mb-2">繋がりたい人</h2>
                {owner.connection ? (
                  <div className="text-xs sm:text-sm whitespace-pre-line">
                    {owner.connection}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-400">情報はありません。</p>
                )}
              </div>
            </div>

            {/* メッセージ */}
            <div className="border-t border-gray-800 pt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}