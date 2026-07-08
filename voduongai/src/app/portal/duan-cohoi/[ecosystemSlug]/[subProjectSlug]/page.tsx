import Link from "next/link";
import { notFound } from "next/navigation";
import { ecosystems, getEcosystemBySlug, getSubProjectBySlug, DEFAULT_POTENTIAL_ANALYSIS } from "@/data/portal/ecosystems";
import { GemCard } from "@/components/portal/ui/GemCard";
import { MarketingLinkBox } from "@/components/portal/opportunities/MarketingLinkBox";
import { PotentialAnalysisTable } from "@/components/portal/opportunities/PotentialAnalysisTable";
import { getSubProjectSurface } from "@/components/portal/opportunities/subProjectPalette";

/**
 * Sub-project detail page — only meaningful for Type A ("sub-projects")
 * ecosystems (digiu, solargroup). `notFound()`s gracefully for any ecosystem
 * with no sub-projects or an unmatched slug, per task instructions.
 *
 * Renders ONLY: title + intro, Marketing/Affiliate Link Box, Potential
 * Analysis table, and an honest "chưa có bài viết riêng" articles empty
 * state (there is no real per-sub-project article tagging in the data
 * today). Nothing else.
 */

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-gray-300">/</span>}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-blue-600">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function generateStaticParams() {
  return ecosystems.flatMap((e) =>
    (e.subProjects ?? []).map((p) => ({ ecosystemSlug: e.slug, subProjectSlug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ecosystemSlug: string; subProjectSlug: string }>;
}) {
  const { ecosystemSlug, subProjectSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemSlug);
  const sub = eco ? getSubProjectBySlug(eco, subProjectSlug) : undefined;
  if (!eco || !sub) return { title: "Không tìm thấy dự án con" };
  return { title: `${sub.name} — ${eco.name}`, description: sub.shortDescription };
}

export default async function SubProjectPage({
  params,
}: {
  params: Promise<{ ecosystemSlug: string; subProjectSlug: string }>;
}) {
  const { ecosystemSlug, subProjectSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemSlug);
  if (!eco || eco.structureType !== "sub-projects") notFound();

  const sub = getSubProjectBySlug(eco, subProjectSlug);
  if (!sub) notFound();

  const surface = getSubProjectSurface(sub.colorIndex);
  const potentialAnalysis = sub.potentialAnalysis ?? DEFAULT_POTENTIAL_ANALYSIS;

  return (
    <div className="space-y-10">
      <Breadcrumb
        items={[
          { label: "Portal", href: "/portal" },
          { label: "Dự án & Cơ hội", href: "/portal/duan-cohoi" },
          { label: eco.name, href: `/portal/duan-cohoi/${eco.slug}` },
          { label: sub.name },
        ]}
      />

      <div className={`overflow-hidden rounded-2xl border p-6 shadow-token-sm sm:p-8 ${surface.card}`}>
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl shadow-sm ${surface.chip}`}>
          🧩
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{sub.name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{sub.shortDescription}</p>
      </div>

      <MarketingLinkBox links={sub.marketingLinks} />

      <PotentialAnalysisTable items={potentialAnalysis} />

      <section id="bai-viet">
        <GemCard>
          <p className="text-sm text-gray-500">Chưa có bài viết riêng cho dự án con này, sẽ cập nhật khi có.</p>
        </GemCard>
      </section>
    </div>
  );
}
