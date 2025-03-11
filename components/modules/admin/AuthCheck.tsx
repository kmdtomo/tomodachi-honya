"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus) {
      const { timestamp } = JSON.parse(authStatus);
      const isValid = Date.now() - timestamp < 24 * 60 * 60 * 1000; // 24時間
      setIsAuthorized(isValid);
    }
  }, []);

  const handleAuth = () => {
    if (!password.trim()) {
      alert('パスワードを入力してください');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === 'tomodachi') {
        localStorage.setItem('adminAuth', JSON.stringify({ timestamp: Date.now() }));
        setIsAuthorized(true);
      } else {
        alert('パスワードが違います');
      }
      setIsLoading(false);
    }, 500); // 認証感を出すための短い遅延
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAuth();
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <Card className="w-full max-w-96 p-4 sm:p-6 bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 font-adobe">管理者ログイン</h2>
            <p className="text-gray-400 text-xs sm:text-sm">管理ページにアクセスするにはログインしてください</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-black/50 border-gray-700 text-white"
                autoFocus
              />
            </div>
            
            <Button 
              onClick={handleAuth} 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  認証中...
                </div>
              ) : (
                "ログイン"
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return children;
} 