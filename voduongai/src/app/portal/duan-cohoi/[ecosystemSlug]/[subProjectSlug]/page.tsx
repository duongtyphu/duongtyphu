import Link from "next/link";
import { notFound } from "next/navigation";
import { getEcosystemBySlug } from "@/data/portal/ecosystems";
import { SubProjectChromeProvider } from "@/components/portal/opportunities/SubProjectChromeContext";
import { SubProjectOverview } from "@/components/portal/opportunities/SubProjectOverview";
import { SubProjectLinksBox } from "@/components/portal/opportunities/SubProjectLinksBox";
import { SubProjectVideosBox } from "@/components/portal/opportunities/SubProjectVideosBox";
import { SubProjectDocumentsBox } from "@/components/portal/opportunities/SubProjectDocumentsBox";
import { getSubProjectSurface } from "@/components/portal/opportunities/subProjectPalette";
import { EcosystemArticlesSection } from "@/components/portal/opportunities/EcosystemArticlesSection";
import { PotentialAnalysisLive } from "@/components/portal/opportunities/PotentialAnalysisLive";
import { getAllLiveEcosystemArticles } from "@/lib/portal/live-ecosystem-articles";
import { getLiveEcosystemRatingRows } from "@/lib/portal/live-ecosystem-ratings";
import { getLiveSubProjects } from "@/lib/portal/live-subprojects";

/**
 * Sub-project detail page — only meaningful for Type A ("sub-projects")
 * ecosystems (digiu, solargroup). `notFound()`s gracefully for any ecosystem
 * with no sub-projects or an unmatched slug, per task instructions.
 *
 * Mở rộng riêng ("Thêm được các dự án con") — sub-project giờ đọc từ bảng
 * `ecosystem_subprojects` sống qua `getLiveSubProjects()` (KHÔNG còn
 * `getSubProjectBySlug()` tĩnh trong ecosystems.ts nữa — bảng đó vẫn giữ
 * `subProjects` làm tham khảo/rollback nhưng không còn consumer nào đọc).
 * Màu thẻ (`colorIndex`) suy ra từ VỊ TRÍ trong danh sách đã Published+sắp
 * `displayOrder` — khớp đúng màu đã hiện ở lưới "Các dự án con" của trang
 * hệ sinh thái cha.
 *
 * Route này KHÔNG còn `generateStaticParams()` — dự án con giờ động (Admin
 * tự thêm), route `/portal/*` vốn đã luôn render dynamic bất kể có
 * generateStaticParams hay không (xem ghi chú ở live-ecosystem-chrome.ts).
 *
 * Renders: title + intro, Marketing/Affiliate Link Box, Đánh giá (Live-edit,
 * dùng chung `ecosystem_ratings` với cấp hệ sinh thái, khoá theo `sub.id`),
 * và "Cập nhật thông tin mới" — băng bài viết RIÊNG của dự án con này
 * (`ecosystem_articles`, lọc `subProjectId === sub.id`, không lẫn với băng
 * bài viết cấp hệ sinh thái cha).
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ecosystemSlug: string; subProjectSlug: string }>;
}) {
  const { ecosystemSlug, subProjectSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemSlug);
  if (!eco) return { title: "Không tìm thấy dự án con" };
  const subProjects = await getLiveSubProjects(eco.id);
  const sub = subProjects.find((p) => p.slug === subProjectSlug);
  if (!sub) return { title: "Không tìm thấy dự án con" };
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

  const subProjects = await getLiveSubProjects(eco.id);
  const subIndex = subProjects.findIndex((p) => p.slug === subProjectSlug);
  if (subIndex === -1) notFound();
  const sub = subProjects[subIndex];

  const surface = getSubProjectSurface(subIndex);
  const allArticlesSeed = await getAllLiveEcosystemArticles();
  const ratingSeed = await getLiveEcosystemRatingRows(sub.id);

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      {/* Khí quyển Projects & Opportunities ("Opportunity center") tiếp tục
       * ở trang con. */}
      <div className="projects-atmosphere-bg" aria-hidden />
      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — cùng khoảng cách với /portal/duan-cohoi. */}
      <div className="rounded-3xl p-6 md:p-8 space-y-10">
      <Breadcrumb
        items={[
          { label: "Portal", href: "/portal" },
          { label: "Dự án & Cơ hội", href: "/portal/duan-cohoi" },
          { label: eco.name, href: `/portal/duan-cohoi/${eco.slug}` },
          { label: sub.name },
        ]}
      />

      <SubProjectChromeProvider seedSub={sub}>
        <SubProjectOverview surface={surface} />

        <SubProjectLinksBox />

        <SubProjectVideosBox />
        <SubProjectDocumentsBox />

        <PotentialAnalysisLive entityId={sub.id} seedRows={ratingSeed} />

        <EcosystemArticlesSection
          allSeed={allArticlesSeed}
          ecosystemId={eco.id}
          ecosystemSlug={eco.slug}
          subProjectId={sub.id}
        />
      </SubProjectChromeProvider>
      </div>
      </div>
    </div>
  );
}
