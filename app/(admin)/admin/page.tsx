"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookIcon, UserIcon, CalendarIcon, SearchIcon, HomeIcon } from "lucide-react";

export default function AdminPage() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminAuth');
      setIsLoggedOut(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold font-adobe">管理者ページ</h1>
          
          <Link href="/">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded flex items-center gap-2 w-full sm:w-auto"
            >
              <HomeIcon size={18} />
              友達本屋へ
            </Button>
          </Link>
        </div>
        
        {isLoggedOut ? (
          <div className="bg-gray-900/50 rounded-lg p-6 sm:p-12 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 font-adobe">ログアウトしました</h2>
            <p className="text-gray-400 mb-6 sm:mb-8">再度ログインするには、ページを更新してください。</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded"
            >
              ページを更新する
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:gap-8">
              <Link href="/admin/owner">
                <Card className="p-6 sm:p-8 hover:bg-white/10 transition-colors border border-gray-800 rounded-lg">
                  <div className="flex items-center sm:flex-col sm:items-center text-left sm:text-center">
                    <div className="bg-gray-800 p-3 sm:p-4 rounded-full mr-4 sm:mr-0 sm:mb-4">
                      <UserIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 font-adobe">オーナー管理</h2>
                      <p className="text-gray-400 text-sm sm:text-base">オーナー情報の追加・編集・検索</p>
                    </div>
                  </div>
                </Card>
              </Link>
              
              <Link href="/admin/book">
                <Card className="p-6 sm:p-8 hover:bg-white/10 transition-colors border border-gray-800 rounded-lg">
                  <div className="flex items-center sm:flex-col sm:items-center text-left sm:text-center">
                    <div className="bg-gray-800 p-3 sm:p-4 rounded-full mr-4 sm:mr-0 sm:mb-4">
                      <BookIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 font-adobe">本の管理</h2>
                      <p className="text-gray-400 text-sm sm:text-base">ISBNから本の情報を取得・保存・検索</p>
                    </div>
                  </div>
                </Card>
              </Link>
              
              <Link href="/admin/event">
                <Card className="p-6 sm:p-8 hover:bg-white/10 transition-colors border border-gray-800 rounded-lg">
                  <div className="flex items-center sm:flex-col sm:items-center text-left sm:text-center">
                    <div className="bg-gray-800 p-3 sm:p-4 rounded-full mr-4 sm:mr-0 sm:mb-4">
                      <CalendarIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 font-adobe">イベント管理</h2>
                      <p className="text-gray-400 text-sm sm:text-base">イベント情報の追加・編集・検索</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
            
          </>
        )}
      </div>
    </div>
  );
} 