import { getOwners } from "@/actions/supabase/owner/actions";
import OwnerManagement from "@/components/modules/admin/OwnerManagement";

export default async function OwnerPage() {
  // サーバーサイドでデータを取得
  const { data: owners, error } = await getOwners();
  
  // エラーハンドリング
  if (error) {
    console.error("オーナー取得エラー:", error);
  }

  return <OwnerManagement initialOwners={owners || []} />;
} 