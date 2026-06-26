"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { digitalAssetCategories, digitalAssetProjects, type DigitalAssetProject } from "@/data/digitalAssets";
import { useCollection } from "@/lib/admin/store";
import { DigitalAssetProjectCard } from "@/components/portal/DigitalAssetProjectCard";
import { DigitalAssetDisclaimer } from "@/components/portal/DigitalAssetDisclaimer";

export default function DigitalAssetCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { items: categories, ready: categoriesReady } = useCollection("digital-asset-categories", digitalAssetCategories);
  const { items: projects, ready: projectsReady } = useCollection<DigitalAssetProject>(
    "digital-asset-projects",
    digitalAssetProjects
  );

  const category = categories.find((c) => c.key === categorySlug);

  if (categoriesReady && !category) notFound();
  if (!category) return null;

  const sortedProjects = projects
    .filter((p) => p.category === category.key && p.status === "Published")
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <Link href="/portal/digital-assets" className="text-sm font-semibold text-brand-blue hover:underline">
        ← ĐẦU TƯ CÙNG TÔI
      </Link>

      <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <h1 className="text-2xl font-extrabold text-white">{category.name}</h1>
        </div>
        <p className="mt-3 max-w-2xl text-white/70">{category.description}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white">Dự án ({sortedProjects.length})</h2>
        {!projectsReady ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : sortedProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white/60">
            Chưa có dự án nào trong lĩnh vực này.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {sortedProjects.map((p) => (
              <DigitalAssetProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      <DigitalAssetDisclaimer />
    </div>
  );
}
