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

/**
 * 画像URLを安全に正規化する
 * - 前後の空白や引用符を除去
 * - 空白を %20 にエンコード
 * - data:/blob: スキームはそのまま返す
 * - それ以外は HTTPS 化
 */
export function normalizeImageUrl(url: string, fallback: string = ""): string {
  const source = (url || fallback || "").trim().replace(/^['"]|['"]$/g, "");
  if (!source) return fallback;

  if (source.startsWith('data:') || source.startsWith('blob:')) {
    return source;
  }

  const spaceEncoded = source.replace(/\s/g, '%20');
  return convertToHttps(spaceEncoded);
}