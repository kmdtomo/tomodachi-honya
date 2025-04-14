/**
 * HTTP URLをHTTPSに変換するユーティリティ関数
 * 特にGoogle Books APIから返されるURLをNext.js Image用に最適化します
 */
export function convertToHttps(url: string): string {
  if (!url) return "";
  
  // すでにHTTPSの場合はそのまま返す
  if (url.startsWith('https://')) {
    return url;
  }
  
  // HTTPをHTTPSに変換
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  // プロトコルなしの場合はHTTPSを追加
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  return url;
} 