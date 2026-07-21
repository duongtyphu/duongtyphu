import { notFound } from "next/navigation";
import { KnowledgeWorkspace } from "@/features/knowledge/workspace/KnowledgeWorkspace";
import { getLiveKnowledgeSeeds } from "@/lib/portal/live-knowledge";

// Không có generateStaticParams() ở trang này (khác /portal/aiworkspace/[slug])
// — render theo request thật, nên getLiveKnowledgeSeeds() (getSupabasePublic())
// gọi trực tiếp ở đây an toàn, không gặp bug build-time cookies() đã ghi ở
// CLAUDE.md.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seeds = await getLiveKnowledgeSeeds();
  const seed = seeds.find((s) => s.slug === slug);
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
  const seeds = await getLiveKnowledgeSeeds();
  const seed = seeds.find((s) => s.slug === slug);
  if (!seed) notFound();
  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      {/* Khí quyển CKOS ("Knowledge library") tiếp tục ở trang con — cùng
       * khí quyển với /portal/ckos, không rơi về trang trắng mặc định. */}
      <div className="ckos-atmosphere-bg" aria-hidden />
      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
        {/* Content Gutter — cùng khoảng cách với /portal/ckos. */}
        <div className="rounded-3xl p-6 md:p-8">
          <KnowledgeWorkspace seed={seed} />
        </div>
      </div>
    </div>
  );
}
