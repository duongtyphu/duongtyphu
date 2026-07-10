import { notFound } from "next/navigation";
import { KnowledgeCollectionView } from "@/features/knowledge/workspace/KnowledgeCollectionView";
import { getKnowledgeCollectionBySlug } from "@/features/knowledge/services/knowledge-collection.service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getKnowledgeCollectionBySlug(slug);
  return {
    title: collection ? `${collection.title} — Thư viện AI` : "Thư viện AI",
    description: collection?.description,
  };
}

export default async function KnowledgeCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getKnowledgeCollectionBySlug(slug);
  if (!collection) notFound();
  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      {/* Khí quyển CKOS ("Knowledge library") tiếp tục ở trang con. */}
      <div className="ckos-atmosphere-bg" aria-hidden />
      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
        {/* Content Gutter — cùng khoảng cách với /portal/ckos. */}
        <div className="rounded-3xl p-6 md:p-8">
          <KnowledgeCollectionView collection={collection} />
        </div>
      </div>
    </div>
  );
}
