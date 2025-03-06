import { getBooks } from "@/actions/supabase/book/actions";
import { getOwners } from "@/actions/supabase/owner/actions";
import BookManagement from "@/components/modules/admin/BookManagement";

export default async function BookPage() {
  // サーバーサイドでデータを取得
  const { data: books, error: booksError } = await getBooks();
  const { data: owners, error: ownersError } = await getOwners();
  
  // エラーハンドリング
  if (booksError) {
    console.error("本の取得エラー:", booksError);
  }
  
  if (ownersError) {
    console.error("オーナー取得エラー:", ownersError);
  }

  return <BookManagement initialBooks={books || []} initialOwners={owners || []} />;
}
