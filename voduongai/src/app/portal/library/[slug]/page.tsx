import { notFound } from "next/navigation";
import { KnowledgeWorkspace } from "@/features/knowledge/workspace/KnowledgeWorkspace";
import { getKnowledgeSeedBySlug } from "@/features/knowledge/services/knowledge-seed.service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seed = getKnowledgeSeedBySlug(slug);
  return {
    title: seed ? `${seed.title} — Thư viện tri thức` : "Thư viện tri thức",
    description: seed?.summary,
  };
}

export default async function KnowledgeSeedWorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seed = getKnowledgeSeedBySlug(slug);
  if (!seed) notFound();
  return <KnowledgeWorkspace seed={seed} />;
}
