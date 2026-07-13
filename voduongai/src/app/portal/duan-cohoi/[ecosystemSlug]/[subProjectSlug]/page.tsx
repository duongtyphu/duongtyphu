import { ecosystemsSeed, getEcosystemBySlug, getSubProjectBySlug } from "@/data/portal/ecosystems";
import { SubProjectMiniSiteView } from "@/components/portal/opportunities/SubProjectMiniSiteView";

/**
 * PROJECTS-SPR-602 — cùng lý do với [ecosystemSlug]/page.tsx: bỏ
 * generateStaticParams (nội dung động qua Admin), giữ generateMetadata đọc
 * seed, chuyển toàn bộ render sang SubProjectMiniSiteView ("use client").
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ecosystemSlug: string; subProjectSlug: string }>;
}) {
  const { ecosystemSlug, subProjectSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemsSeed, ecosystemSlug);
  const sub = eco ? getSubProjectBySlug(eco, subProjectSlug) : undefined;
  if (!eco || !sub) return { title: "Dự án & Cơ hội" };
  return { title: `${sub.name} — ${eco.name}`, description: sub.shortDescription };
}

export default async function SubProjectPage({
  params,
}: {
  params: Promise<{ ecosystemSlug: string; subProjectSlug: string }>;
}) {
  const { ecosystemSlug, subProjectSlug } = await params;
  return <SubProjectMiniSiteView ecosystemSlug={ecosystemSlug} subProjectSlug={subProjectSlug} />;
}
