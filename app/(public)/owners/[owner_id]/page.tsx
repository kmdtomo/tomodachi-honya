import { getOwnerById } from "@/actions/supabase/owner/actions";
import { getBooksByOwnerId } from "@/actions/supabase/book/actions";
import OwnerDetail from "@/components/modules/public/OwnerDetail";
import { OwnerBooksList } from "@/components/modules/public/OwnerBooksList";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    owner_id: string;
  }>;
};

export default async function OwnerDetailPage({ params }: Props) {
  const { owner_id } = await params;

  const [ownerResponse, booksResponse] = await Promise.all([
    getOwnerById(owner_id),
    getBooksByOwnerId(owner_id)
  ]);

  if (ownerResponse.error || !ownerResponse.data) {
    notFound();
  }

  return (
    <div className="pt-16">
      <OwnerDetail owner={ownerResponse.data} />
      <div className="container mx-auto px-10 pt-8">
        <h2 className="text-2xl font-bold text-white mb-4 font-adobe">
          {ownerResponse.data.name}さんの本棚
        </h2>
        <div className="pb-10 px-4">
        <OwnerBooksList books={booksResponse.data || []} />
        </div>
      </div>

    </div>
  );
}
