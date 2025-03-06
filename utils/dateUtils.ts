/**
 * 日付処理のためのユーティリティ関数
 */

// 日本のタイムゾーンオフセット（+09:00）
const JST_OFFSET = 9 * 60; // 分単位

/**
 * 日本時間の日付文字列をISO形式に変換する
 * @param dateString 日本時間の日付文字列（例: "2023-05-20T15:30"）
 * @returns ISO形式の日付文字列（タイムゾーン情報付き）
 */
export function formatToISOWithJST(dateString: string): string {
  if (!dateString) return "";
  
  // 入力された日時文字列をDateオブジェクトに変換
  const date = new Date(dateString);
  
  // 年月日時分秒を取得（ローカルタイムゾーンで）
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  // ISO形式の文字列を生成（JSTタイムゾーン情報付き）
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
}

/**
 * ISO形式の日付文字列をdatetime-local入力用の形式に変換する
 * @param isoString ISO形式の日付文字列
 * @returns datetime-local入力用の日付文字列（YYYY-MM-DDThh:mm）
 */
export function formatForDateTimeInput(isoString: string): string {
  if (!isoString) return "";
  
  // 日時文字列をDateオブジェクトに変換
  const date = new Date(isoString);
  
  // 年月日時分を取得（ローカルタイムゾーンで）
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  // datetime-local入力用の形式に変換
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * 日付を日本語形式でフォーマットする
 * @param dateString 日付文字列
 * @returns 日本語形式の日付文字列
 */
export function formatDateJP(dateString: string): string {
  if (!dateString) return "日時未設定";
  
  // 日時文字列をDateオブジェクトに変換
  const date = new Date(dateString);
  
  // 日本時間でフォーマット
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo"
  }).format(date);
} 