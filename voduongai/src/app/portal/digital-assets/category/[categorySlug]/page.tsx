import Link from "next/link";
import { notFound } from "next/navigation";
import { digitalAssetCategories, digitalAssetProjects } from "@/data/digitalAssets";
import { DigitalAssetProjectCard } from "@/components/portal/DigitalAssetProjectCard";
import { DigitalAssetDisclaimer } from "@/components/portal/DigitalAssetDisclaimer";

export function generateStaticParams() {
  return digitalAssetCategories.map((c) => ({ categorySlug: c.key }));
}

export async function generateMetadata({ params }: PageProps<"/portal/digital-assets/category/[categorySlug]">) {
  const { categorySlug } = await params;
  const category = digitalAssetCategories.find((c) => c.key === categorySlug);
  const title = category ? `ĐẦU TƯ CÙNG TÔI — ${category.name}` : "ĐẦU TƯ CÙNG TÔI";
  const description = category?.description ?? "ĐẦU TƯ CÙNG TÔI mà VO DUONG AI đang theo dõi và chia sẻ.";
  return { title, description, openGraph: { title, description }, twitter: { title, description } };
}

export default async function DigitalAssetCategoryPage({
  params,
}: PageProps<"/portal/digital-assets/category/[categorySlug]">) {
  const { categorySlug } = await params;
  const category = digitalAssetCategories.find((c) => c.key === categorySlug);
  if (!category) notFound();

  const projects = digitalAssetProjects
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
        <h2 className="text-sm font-bold text-white">Dự án ({projects.length})</h2>
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white/60">
            Chưa có dự án nào trong lĩnh vực này.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((p) => (
              <DigitalAssetProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      <DigitalAssetDisclaimer />
    </div>
  );
}
