"use client"

import { useState } from "react";
import Link from "next/link";
import { Instagram, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full fixed top-0 z-50 bg-black border-b-2 border-white/40">
      <div className="container mx-auto flex items-center justify-between px-4 py-5 font-adobe">
        {/* モバイル用ハンバーガーメニュー */}
        <button 
          className="text-white md:hidden font-adobe" 
          onClick={toggleMenu}
          aria-label="メニュー"
        >
          <Menu size={24} />
        </button>

        {/* ロゴ - モバイルでは中央に配置 */}
        <div className="flex items-center md:space-x-4">
          <Link
            href="/"
            className="text-white text-xl font-bold hover:text-gray-300 transition-colors font-adobe"
          >
            友達本屋
          </Link>
        </div>

        {/* インスタグラムアイコン - モバイルでは右側に配置 */}
        <div className="md:hidden">
          <Link href="https://www.instagram.com/tomodachi_honya" className="text-pink-500 hover:text-pink-200 transition-colors">
            <Instagram size={24} />
          </Link>
        </div>

        {/* デスクトップ用ナビゲーション */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="text-white hover:text-gray-300 transition-colors font-adobe"
              >
                ホーム
              </Link>
            </li>
            <li>
              <Link
                href="/owners"
                className="text-white hover:text-gray-300 transition-colors font-adobe"
              >
                オーナー
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="text-white hover:text-gray-300 transition-colors font-adobe  "
              >
                イベント一覧
              </Link>
            </li>
            <li>
              <Link
                href="/books"
                className="text-white hover:text-gray-300 transition-colors font-adobe"
              >
                本一覧
              </Link>
            </li>
            <li>
              <Link href="https://www.instagram.com/tomodachi_honya" className="text-pink-500 hover:text-pink-200 transition-colors">
                <Instagram size={24} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* モバイル用モーダルメニュー */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* 右側の余白部分（クリックでモーダルを閉じる） */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={closeMenu}
          ></div>
          
          {/* メニュー本体 */}
          <div className="absolute top-0 left-0 w-3/4 h-full bg-black border-r border-white/20 p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white font-adobe">メニュー</h2>
              <button 
                className="text-white font-adobe" 
                onClick={closeMenu}
                aria-label="閉じる"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="text-white hover:text-gray-300 transition-colors block py-2 font-adobe"
                    onClick={closeMenu}
                  >
                    ホーム
                  </Link>
                </li>
                <li>
                  <Link
                    href="/owners"
                    className="text-white hover:text-gray-300 transition-colors block py-2 font-adobe"
                    onClick={closeMenu}
                  >
                    オーナー
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-white hover:text-gray-300 transition-colors block py-2 font-adobe"
                    onClick={closeMenu}
                  >
                    イベント一覧
                  </Link>
                </li>
                <li>
                  <Link
                    href="/books"
                    className="text-white hover:text-gray-300 transition-colors block py-2 font-adobe"
                    onClick={closeMenu}
                  >
                    本一覧
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
