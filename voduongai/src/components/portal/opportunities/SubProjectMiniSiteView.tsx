"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCollection } from "@/lib/admin/store";
import {
  ecosystemsSeed,
  ECOSYSTEMS_COLLECTION_KEY,
  getEcosystemBySlug,
  getSubProjectBySlug,
  DEFAULT_POTENTIAL_ANALYSIS,
  type Ecosystem,
} from "@/data/portal/ecosystems";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Breadcrumb } from "@/components/portal/ui/Breadcrumb";
import { MarketingLinkBox } from "@/components/portal/opportunities/MarketingLinkBox";
import { PotentialAnalysisTable } from "@/components/portal/opportunities/PotentialAnalysisTable";
import { getSubProjectSurface } from "@/components/portal/opportunities/subProjectPalette";

export function SubProjectMiniSiteView({
  ecosystemSlug,
  subProjectSlug,
}: {
  ecosystemSlug: string;
  subProjectSlug: string;
}) {
  const { items, ready } = useCollection<Ecosystem>(ECOSYSTEMS_COLLECTION_KEY, ecosystemsSeed);
  const eco = useMemo(() => getEcosystemBySlug(items, ecosystemSlug), [items, ecosystemSlug]);
  const sub = useMemo(() => (eco ? getSubProjectBySlug(eco, subProjectSlug) : undefined), [eco, subProjectSlug]);

  if (!ready) {
    return (
      <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
        <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
          <div className="h-72 animate-pulse rounded-3xl border border-gray-100 bg-gray-50" />
        </div>
      </div>
    );
  }

  if (!eco || eco.structureType !== "sub-projects" || !sub) {
    return (
      <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
        <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
          <div className="rounded-3xl p-6 md:p-8">
            <GemCard>
              <p className="text-sm text-gray-500">Không tìm thấy dự án con này.</p>
              <Link href="/portal/duan-cohoi" className="mt-3 inline-block text-sm font-semibold text-brand-blue">
                ← Quay lại Dự án & Cơ hội
              </Link>
            </GemCard>
          </div>
        </div>
      </div>
    );
  }

  const surface = getSubProjectSurface(sub.colorIndex);
  const potentialAnalysis = sub.potentialAnalysis && sub.potentialAnalysis.length > 0 ? sub.potentialAnalysis : DEFAULT_POTENTIAL_ANALYSIS;

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      <div className="projects-atmosphere-bg" aria-hidden />
      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      <div className="rounded-3xl p-6 md:p-8 space-y-10">
      <Breadcrumb
        className="mb-2"
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

      <MarketingLinkBox links={sub.links} />

      <PotentialAnalysisTable items={potentialAnalysis} />

      <section id="bai-viet">
        <GemCard>
          <p className="text-sm text-gray-500">Chưa có bài viết riêng cho dự án con này, sẽ cập nhật khi có.</p>
        </GemCard>
      </section>
      </div>
      </div>
    </div>
  );
}
