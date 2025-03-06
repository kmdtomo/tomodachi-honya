"use client"

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function AdminHeader() {
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

        {/* ロゴ */}
        <div className="flex items-center md:space-x-4">
          <Link
            href="/admin"
            className="text-white text-xl font-bold hover:text-gray-300 transition-colors"
          >
            管理者
          </Link>
        </div>

        {/* デスクトップ用ナビゲーション */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/admin"
                className="text-white hover:text-gray-300 transition-colors"
              >
                ダッシュボード
              </Link>
            </li>
            <li>
              <Link
                href="/admin/owner"
                className="text-white hover:text-gray-300 transition-colors"
              >
                オーナー管理
              </Link>
            </li>
            <li>
              <Link
                href="/admin/event"
                className="text-white hover:text-gray-300 transition-colors"
              >
                イベント管理
              </Link>
            </li>
            <li>
              <Link
                href="/admin/book"
                className="text-white hover:text-gray-300 transition-colors"
              >
                本管理
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
              <h2 className="text-xl font-bold text-white font-adobe">管理メニュー</h2>
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
                    href="/admin"
                    className="text-white hover:text-gray-300 transition-colors block py-2"
                    onClick={closeMenu}
                  >
                    ダッシュボード
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/owner"
                    className="text-white hover:text-gray-300 transition-colors block py-2"
                    onClick={closeMenu}
                  >
                    オーナー管理
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/event"
                    className="text-white hover:text-gray-300 transition-colors block py-2"
                    onClick={closeMenu}
                  >
                    イベント管理
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/book"
                    className="text-white hover:text-gray-300 transition-colors block py-2"
                    onClick={closeMenu}
                  >
                    本管理
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
