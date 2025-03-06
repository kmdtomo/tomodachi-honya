import { getBooks } from "@/actions/supabase/book/actions";
import { BooksList } from "@/components/modules/public/BooksList";
import { Loading } from "@/components/ui/common/loading";

export default async function BooksPage() {
  const { data: books, error } = await getBooks();

  if (error) {
    console.error("本の取得エラー:", error);
    return <div>本の一覧を取得できませんでした</div>;
  }

  return (
    <div className="pb-10 bg-black pt-16">
      <div className="container mx-auto px-4">
        {!books ? (
          <Loading fullScreen text="本の情報を読み込み中..." />
        ) : (
          <BooksList books={books} />
        )}
      </div>
    </div>
  );
}
