import { notFound } from "next/navigation";
import { KnowledgeWorkspace } from "@/features/knowledge/workspace/KnowledgeWorkspace";
import { getKnowledgeSeedBySlug } from "@/features/knowledge/services/knowledge-seed.service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seed = getKnowledgeSeedBySlug(slug);
  return {
    title: seed ? `${seed.title} — Thư viện AI` : "Thư viện AI",
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
  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      {/* Khí quyển CKOS ("Knowledge library") tiếp tục ở trang con — cùng
       * khí quyển với /portal/ckos, không rơi về trang trắng mặc định. */}
      <div className="ckos-atmosphere-bg" aria-hidden />
      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
        <KnowledgeWorkspace seed={seed} />
      </div>
    </div>
  );
}
