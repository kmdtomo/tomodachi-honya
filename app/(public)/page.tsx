"use client";

import { useRouter } from "next/navigation"; 
import Image from "next/image";
import OwnerList from "@/components/modules/public/OwnerList";


export default function Home() {
  const router = useRouter()

  return (
    <div className="text-white px-4">
      <div className="container mx-auto">
        <div className="flex justify-center pt-10 pb-4">
          <Image 
            src="/tomodati.png" 
            alt="友達本屋ロゴ" 
            width={600} 
            height={200} 
            priority
            className="mx-auto w-full max-w-2xl"
          />
        </div>
     
       
        <div className="flex flex-col md:flex-row gap-4 px-4 mb-10">
          {/* ミッション（左） */}
          <div className="w-full md:w-1/2 flex">
            <div className="relative flex-1">
              <div className="border-2 border-white/40 shadow-lg transition-shadow hover:shadow-2xl rounded-lg p-4 md:p-6 relative h-full flex flex-col justify-center">
                {/* 既存の左側アクセントバーをそのまま適用 */}
                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-[#ccb054] rounded-l-lg"></div>
                {/* 以下、既存のミッション内容 */}
                <h2 className="text-lg md:text-3xl font-bold mb-1 font-adobe">
                  読書で、人生を楽しむ人を増やす
                </h2>
                <p className="text-sm md:text-base font-medium tracking-wide text-[#ccb054] drop-shadow-md">
                  Make life better through reading
                </p>
                <aside className="mt-3 md:mt-4 text-xs md:text-sm text-white/80 max-w-2xl mx-auto">
                  <p className="mb-1 md:mb-2 text-sm md:text-base text-white">ミッション</p>
                  <p className="line-clamp-6 md:line-clamp-none">
                    「人生を楽しむ(仕事もプライベートも)」これが僕たちがもっとも大切にしてる価値観です。今までの僕は仕事やプライベートを心から楽しめてませんでした。ただ読書や人とのつながりから本気で仕事もプライベートも楽しく感じてから幸せです。仕事もプライベートも楽しめてる人って魅力的で充実した人生を過ごせるはずだし、友達本屋にも関わるすべての人にも「人生を楽しんでほしい」、そう思いこのミッションにしました
                  </p>
                </aside>
              </div>
            </div>
          </div>

          {/* ビジョン（右） */}
          <div className="w-full md:w-1/2 flex">
            <div className="relative flex-1">
              <div className="border-2 border-white/40 shadow-lg transition-shadow hover:shadow-2xl rounded-lg p-4 md:p-6 relative h-full flex flex-col justify-center">
                {/* 既存の左側アクセントバーをそのまま適用 */}
                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-[#ccb054] rounded-l-lg"></div>
                {/* 以下、既存のビジョン内容 */}
                <h2 className="text-lg md:text-3xl font-bold mb-1 font-adobe">
                  日本一coolな(格好良い)本屋さん
                </h2>
                <p className="text-sm md:text-base font-medium tracking-wide text-[#ccb054] drop-shadow-md">
                  Japan&apos;s coolest bookstore
                </p>
                <aside className="mt-3 md:mt-4 text-xs md:text-sm text-white/80 max-w-2xl mx-auto">
                  <p className="mb-1 md:mb-2 text-white text-sm md:text-base">ビジョン</p>
                  <p className="line-clamp-6 md:line-clamp-none">
                    読書する人を増やすための切り口は「cool(格好良い)」だ。「読書してる人ってカッコいい」そんな文化を創りたい。だからこそ、本屋自体のあり方ももっと変えられると僕たちは考えています。出張本屋でDJイベント、起業家やアーティストとのコラボ、大規模フェスの開催、メンバーもカッコよく個性豊かで"かっこいいが溢れる場所"を作る。本屋の業界では異端な存在だからこそ面白いし、ownerが増えてサービスが拡大していくことが一番ワクワクする。このビジョンを追い求めて、友達本屋を運営していきます。
                  </p>
                </aside>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <OwnerList />
        </div>
      </div>
    </div>
  );
}