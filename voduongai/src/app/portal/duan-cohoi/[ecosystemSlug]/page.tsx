import Link from "next/link";
import { notFound } from "next/navigation";
import { ecosystems, getEcosystemBySlug, type Ecosystem } from "@/data/portal/ecosystems";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { EcosystemOverview } from "@/components/portal/opportunities/EcosystemOverview";
import { EcosystemChromeProvider } from "@/components/portal/opportunities/EcosystemChromeContext";
import { EcosystemLinksBox } from "@/components/portal/opportunities/EcosystemLinksBox";
import { EcosystemFieldLinksBox } from "@/components/portal/opportunities/EcosystemFieldLinksBox";
import { EcosystemAffiliateOffersBox } from "@/components/portal/opportunities/EcosystemAffiliateOffersBox";
import { EcosystemExchangesBox } from "@/components/portal/opportunities/EcosystemExchangesBox";
import { EcosystemVideosBox } from "@/components/portal/opportunities/EcosystemVideosBox";
import { EcosystemDocumentsBox } from "@/components/portal/opportunities/EcosystemDocumentsBox";
import { SubProjectsSection } from "@/components/portal/opportunities/SubProjectsSection";
import { EcosystemArticlesSection } from "@/components/portal/opportunities/EcosystemArticlesSection";
import { PotentialAnalysisLive } from "@/components/portal/opportunities/PotentialAnalysisLive";
import { getLiveEcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import { getAllLiveEcosystemArticles } from "@/lib/portal/live-ecosystem-articles";
import { getLiveEcosystemRatingRows } from "@/lib/portal/live-ecosystem-ratings";
import { getAllLiveSubProjects } from "@/lib/portal/live-subprojects";

/**
 * Ecosystem mini-site — RESTRUCTURED per direct Product Owner instruction,
 * which supersedes docs/PROJECT_ECOSYSTEM_ARCHITECTURE.md's original 7-section
 * template for this rebuild. Five ecosystems now split into 3 structurally
 * different template shapes (`structureType`), each rendering ONLY the
 * sections the Product Owner specified — no FAQ, no repeated bottom CTA
 * band, no cross-pillar strip, nothing beyond what's listed per type.
 *
 * Rule #0: NOTHING here links to `/portal/digital-assets/**` at all — per a
 * later Product Owner instruction, even article detail pages were moved out
 * of that namespace to `/portal/duan-cohoi/bai-viet/[slug]` (still reading
 * the same real `digitalAssetArticles` data, just a different render route).
 * Rule #1: no CTA/button on this page links to a different ecosystem or a
 * different pillar (Academy/Workspace/CKOS/Journey) — every link stays
 * within this same ecosystem's own content.
 */

const SURFACE: Record<string, { chip: string; badge: string; strip: string }> = {
  digiu: {
    chip: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
    badge: "bg-blue-100 text-blue-700",
    strip: "bg-gradient-to-r from-blue-600 to-indigo-600",
  },
  solargroup: {
    chip: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
    badge: "bg-amber-100 text-amber-800",
    strip: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  "blockchain-crypto": {
    chip: "bg-gradient-to-br from-slate-800 to-emerald-600 text-white",
    badge: "bg-slate-200 text-slate-700",
    strip: "bg-gradient-to-r from-slate-800 to-emerald-600",
  },
  "lam-affilate": {
    chip: "bg-gradient-to-br from-violet-600 to-blue-500 text-white",
    badge: "bg-violet-100 text-violet-700",
    strip: "bg-gradient-to-r from-violet-600 to-blue-500",
  },
  sangiaodich: {
    chip: "bg-gradient-to-br from-emerald-700 to-green-600 text-white",
    badge: "bg-emerald-100 text-emerald-800",
    strip: "bg-gradient-to-r from-emerald-700 to-green-600",
  },
};

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
  return ecosystems.map((e) => ({ ecosystemSlug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ecosystemSlug: string }> }) {
  const { ecosystemSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemSlug);
  if (!eco) return { title: "Không tìm thấy hệ sinh thái" };
  const chrome = await getLiveEcosystemChrome(eco.id);
  return {
    title: chrome.name,
    description: chrome.shortDescription,
  };
}

/** Mở rộng riêng ("Lấy format DigiU làm chuẩn áp dụng cho các dự án
 * khác") — 3 hàm bọc mỏng dưới đây chỉ còn giữ khung `<section>`/tiêu đề
 * cấp cao nhất riêng của từng loại `structureType`; phần danh sách +
 * khả năng sửa qua Admin nằm trong `EcosystemAffiliateOffersBox`/
 * `EcosystemExchangesBox`/`EcosystemFieldLinksBox` ("use client", đọc/ghi
 * qua `useEcosystemChrome()`) — cùng cơ chế `EcosystemLinksBox` đã dùng
 * cho loại "sub-projects", KHÔNG còn đọc thẳng `eco.affiliateOffers`/
 * `eco.exchanges`/`eco.fields[].marketingLinks` tĩnh nữa (vẫn giữ nguyên
 * trong `ecosystems.ts` làm fallback/tham khảo, xem `live-ecosystem-chrome.ts`). */
function TwoFieldBoxes({ eco }: { eco: Ecosystem }) {
  const fields = eco.fields ?? [];
  return (
    <section id="lien-ket-tiep-thi">
      <SectionHeader eyebrow="Hai mảng" title="Blockchain và Crypto" />
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <GemCard key={f.id}>
            <p className="gemos-card-title mb-2 text-base font-bold text-gray-900">{f.name}</p>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">{f.description}</p>
            <EcosystemFieldLinksBox fieldId={f.id} title={`Đường link liên kết — ${f.name}`} />
          </GemCard>
        ))}
      </div>
    </section>
  );
}

export default async function EcosystemMiniSitePage({
  params,
}: {
  params: Promise<{ ecosystemSlug: string }>;
}) {
  const { ecosystemSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemSlug);
  if (!eco) notFound();

  const surface = SURFACE[eco.slug] ?? SURFACE.digiu;
  const chrome = await getLiveEcosystemChrome(eco.id);
  // "Cập nhật thông tin mới" (mở rộng riêng, sau Nhóm 3) — Founder xác
  // nhận áp dụng lại cho CẢ 5 hệ sinh thái (kể cả 3 trang từng bị bỏ băng
  // bài viết cũ trước đây), dùng bảng `ecosystem_articles` mới — không
  // liên quan `digitalAssetArticles` (route cũ `/duan-cohoi/bai-viet/[slug]`
  // vẫn giữ nguyên, đọc dữ liệu khác, không đụng).
  const allArticlesSeed = await getAllLiveEcosystemArticles();
  const ratingSeed = await getLiveEcosystemRatingRows(eco.id);
  // "Thêm được các dự án con" (mở rộng riêng) — thay eco.subProjects tĩnh.
  const allSubProjectsSeed = await getAllLiveSubProjects();
  // `eco.icon` là 1 component/function reference (LucideIcon) — KHÔNG
  // serialize được qua ranh giới Server→Client Component. Tách riêng
  // trước khi truyền xuống `EcosystemOverview` ("use client"), thay bằng
  // `iconSlug` (chuỗi thuần) để component đó tự resolve icon thật.
  const { icon: _ecoIcon, ...ecoWithoutIcon } = eco;
  void _ecoIcon;

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
          { label: chrome.name },
        ]}
      />

      <EcosystemChromeProvider seedChrome={chrome}>
        <EcosystemOverview eco={ecoWithoutIcon} iconSlug={eco.slug} surface={surface} />

        {eco.structureType === "sub-projects" && (
          <>
            <EcosystemLinksBox />
            <SubProjectsSection
              allSeed={allSubProjectsSeed}
              ecosystemId={eco.id}
              ecosystemSlug={eco.slug}
              ecosystemName={chrome.name}
            />
            <EcosystemVideosBox />
            <EcosystemDocumentsBox />
            <PotentialAnalysisLive entityId={eco.id} seedRows={ratingSeed} />
          </>
        )}

        {eco.structureType === "two-field" && (
          <>
            <TwoFieldBoxes eco={eco} />
            <EcosystemVideosBox />
            <EcosystemDocumentsBox />
            <PotentialAnalysisLive entityId={eco.id} seedRows={ratingSeed} />
          </>
        )}

        {eco.structureType === "affiliate-list" && (
          <>
            <EcosystemAffiliateOffersBox />
            <GemCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Affiliate Hub — hướng dẫn thực chiến</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Lộ trình bắt đầu, chọn ngách, chọn sản phẩm, xây nội dung và công cụ đề xuất.
                </p>
              </div>
              <Link
                href="/portal/affiliate-hub"
                className="shrink-0 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
              >
                Xem Affiliate Hub →
              </Link>
            </GemCard>
            <EcosystemVideosBox />
            <EcosystemDocumentsBox />
            <PotentialAnalysisLive entityId={eco.id} seedRows={ratingSeed} />
          </>
        )}

        {eco.structureType === "exchange-list" && (
          <>
            <EcosystemExchangesBox />
            <EcosystemVideosBox />
            <EcosystemDocumentsBox />
            <PotentialAnalysisLive entityId={eco.id} seedRows={ratingSeed} />
          </>
        )}

        {/* "Cập nhật thông tin mới" — áp dụng cho CẢ 4 loại structureType
         * (Founder xác nhận áp dụng lại cho tất cả 5 hệ sinh thái), đặt
         * ngoài khối if/else theo structureType vì không phụ thuộc loại
         * trang. */}
        <EcosystemArticlesSection allSeed={allArticlesSeed} ecosystemId={eco.id} ecosystemSlug={eco.slug} />
      </EcosystemChromeProvider>
      </div>
      </div>
    </div>
  );
}
