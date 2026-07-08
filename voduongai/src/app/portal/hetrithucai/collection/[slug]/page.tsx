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
  return <KnowledgeCollectionView collection={collection} />;
}
