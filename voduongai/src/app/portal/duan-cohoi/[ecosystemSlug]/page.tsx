import { ecosystemsSeed, getEcosystemBySlug } from "@/data/portal/ecosystems";
import { EcosystemMiniSiteView } from "@/components/portal/opportunities/EcosystemMiniSiteView";

/**
 * PROJECTS-SPR-602 (Founder Directive: Projects & Opportunities Canonical
 * Product) — Ecosystem giờ quản trị được qua Admin thật (Supabase), nên
 * trang này không còn `generateStaticParams` (nội dung động, Founder có
 * thể thêm hệ sinh thái mới bất kỳ lúc nào mà không cần build lại). Server
 * wrapper này chỉ giữ `generateMetadata` (đọc từ `ecosystemsSeed` — dữ liệu
 * khởi tạo, có thể lệch với bản Founder đã sửa qua Admin cho tới khi có
 * SSR đọc trực tiếp Supabase ở một sprint sau; nội dung hiển thị chính vẫn
 * luôn đúng dữ liệu thật vì EcosystemMiniSiteView đọc live qua
 * useCollection). Toàn bộ render chuyển sang EcosystemMiniSiteView
 * ("use client").
 */

export async function generateMetadata({ params }: { params: Promise<{ ecosystemSlug: string }> }) {
  const { ecosystemSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemsSeed, ecosystemSlug);
  if (!eco) return { title: "Dự án & Cơ hội" };
  return {
    title: eco.name,
    description: eco.seoDescription || eco.shortDescription,
  };
}

export default async function EcosystemMiniSitePage({
  params,
}: {
  params: Promise<{ ecosystemSlug: string }>;
}) {
  const { ecosystemSlug } = await params;
  return <EcosystemMiniSiteView ecosystemSlug={ecosystemSlug} />;
}
