"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCollection } from "@/lib/admin/store";
import {
  ecosystemsSeed,
  ECOSYSTEMS_COLLECTION_KEY,
  getEcosystemBySlug,
  DEFAULT_POTENTIAL_ANALYSIS,
  type Ecosystem,
} from "@/data/portal/ecosystems";
import { digitalAssetArticles, type DigitalAssetArticle } from "@/data/digitalAssets";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { Breadcrumb } from "@/components/portal/ui/Breadcrumb";
import { MarketingLinkBox } from "@/components/portal/opportunities/MarketingLinkBox";
import { PotentialAnalysisTable } from "@/components/portal/opportunities/PotentialAnalysisTable";
import { getSubProjectSurface } from "@/components/portal/opportunities/subProjectPalette";
import { ECOSYSTEM_ICONS, getEcosystemSurface } from "@/components/portal/opportunities/ecosystemVisuals";
import { Layers } from "lucide-react";

/**
 * PROJECTS-SPR-602 — Ecosystem mini-site giờ đọc `useCollection("ecosystems")`
 * thay vì import tĩnh, nên trở thành Client Component (server wrapper ở
 * page.tsx chỉ giữ metadata). Rule #0/#1 gốc (không link sang pillar/hệ
 * sinh thái khác) vẫn giữ nguyên. Thêm mới: mục "Câu hỏi thường gặp" theo
 * từng Ecosystem (trước đây trang này chủ động KHÔNG render FAQ — giờ
 * Founder quản lý FAQ theo Ecosystem qua Admin nên Portal phải hiển thị).
 * "Bài viết liên quan" giờ ưu tiên `relatedArticleIds` Founder tự chọn qua
 * Admin, fallback về lọc theo articleCategory nếu Founder chưa chọn.
 */

function Overview({ eco }: { eco: Ecosystem }) {
  const Icon = ECOSYSTEM_ICONS[eco.icon] ?? Layers;
  const surface = getEcosystemSurface(eco.colorKey);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-token-sm">
      <div className={`h-1.5 ${surface.strip}`} aria-hidden />
      <div className="bg-white p-6 sm:p-8">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${surface.chip}`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className={`gemos-badge ${surface.badge}`}>{eco.statusBadge}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{eco.name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{eco.shortDescription}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600">{eco.fullIntro}</p>

        {eco.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {eco.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-emerald-700">Phù hợp</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{eco.whoFor}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-700">Chưa nên tham gia nếu</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{eco.whoNotReady}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">Kỳ vọng thực tế</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{eco.expectedOutcome}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticlesSection({ articles }: { articles: DigitalAssetArticle[] }) {
  if (articles.length === 0) {
    return (
      <section id="bai-viet">
        <SectionHeader eyebrow="Bài viết" title="Bài viết liên quan" />
        <GemCard>
          <p className="text-sm text-gray-500">Chưa có bài viết nào ở đây, sẽ cập nhật khi có.</p>
        </GemCard>
      </section>
    );
  }
  return (
    <section id="bai-viet">
      <SectionHeader eyebrow="Bài viết" title="Bài viết liên quan" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/portal/duan-cohoi/bai-viet/${a.slug}`}
            className="block rounded-xl border border-gray-100 bg-white p-4 text-sm font-semibold text-gray-900 shadow-token-sm transition hover:border-blue-300 hover:text-brand-blue"
          >
            {a.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ eco }: { eco: Ecosystem }) {
  const items = [...eco.faq].filter((f) => f.visible).sort((a, b) => a.order - b.order);
  return (
    <section id="cau-hoi-thuong-gap">
      <SectionHeader eyebrow="Câu hỏi" title="Câu hỏi thường gặp" />
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <GemCard key={item.id}>
              <p className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{item.question}</p>
              <p className="text-sm leading-relaxed text-gray-500">{item.answer}</p>
            </GemCard>
          ))}
        </div>
      ) : (
        <GemCard>
          <p className="text-sm text-gray-500">Chưa có câu hỏi thường gặp nào cho hệ sinh thái này, sẽ cập nhật khi có.</p>
        </GemCard>
      )}
    </section>
  );
}

function SubProjectsGrid({ eco }: { eco: Ecosystem }) {
  const subProjects = eco.subProjects ?? [];
  return (
    <section id="du-an-con">
      <SectionHeader eyebrow="Dự án con" title="Các dự án con" />
      {subProjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subProjects.map((p) => {
            const surface = getSubProjectSurface(p.colorIndex);
            return (
              <Link
                key={p.id}
                href={`/portal/duan-cohoi/${eco.slug}/${p.slug}`}
                className={`block overflow-hidden rounded-2xl border p-5 shadow-token-sm transition hover:-translate-y-1 hover:shadow-token-lg ${surface.card}`}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-sm ${surface.chip}`}>
                  🧩
                </div>
                <p className="gemos-card-title text-sm font-bold text-gray-900">{p.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{p.shortDescription}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <GemCard>
          <p className="text-sm text-gray-500">
            Chưa có dự án con thật nào cho {eco.name} — mình chưa có nội dung thật đủ chi tiết để tách theo
            từng dự án con, nên chưa hiển thị mục này thay vì bịa tên dự án.
          </p>
        </GemCard>
      )}
    </section>
  );
}

function AffiliateOffersList({ eco }: { eco: Ecosystem }) {
  const offers = eco.links.filter((o) => o.visible).sort((a, b) => a.order - b.order);
  return (
    <section id="lien-ket-tiep-thi">
      <SectionHeader eyebrow="Danh sách" title="Các chương trình tiếp thị liên kết" />
      {offers.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {offers.map((o) =>
            o.url.trim() ? (
              <a
                key={o.id}
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-token-sm transition hover:border-blue-300"
              >
                {o.category && <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{o.category}</p>}
                <p className="mt-1 text-sm font-bold text-gray-900">{o.label}</p>
              </a>
            ) : (
              <div key={o.id} className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
                {o.category && <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{o.category}</p>}
                <p className="mt-1 text-sm font-bold text-gray-900">{o.label}</p>
                <p className="mt-1 text-xs text-gray-500">Chưa có link tiếp thị thật cho mục này, sẽ cập nhật khi có.</p>
              </div>
            )
          )}
        </div>
      ) : (
        <GemCard>
          <p className="text-sm text-gray-500">Chưa có chương trình tiếp thị liên kết nào ở đây, sẽ cập nhật khi có.</p>
        </GemCard>
      )}
    </section>
  );
}

function ExchangesList({ eco }: { eco: Ecosystem }) {
  const exchanges = eco.links.filter((x) => x.visible).sort((a, b) => a.order - b.order);
  return (
    <section id="lien-ket-tiep-thi">
      <SectionHeader eyebrow="Danh sách" title="Các sàn giao dịch" />
      {exchanges.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exchanges.map((x) =>
            x.url.trim() ? (
              <a
                key={x.id}
                href={x.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-100 bg-white p-4 text-sm font-bold text-gray-900 shadow-token-sm transition hover:border-blue-300"
              >
                {x.label}
              </a>
            ) : (
              <div key={x.id} className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
                <p className="text-sm font-bold text-gray-900">{x.label}</p>
                <p className="mt-1 text-xs text-gray-500">Chưa có link tiếp thị thật, sẽ cập nhật khi có.</p>
              </div>
            )
          )}
        </div>
      ) : (
        <GemCard>
          <p className="text-sm text-gray-500">Chưa có sàn giao dịch nào ở đây, sẽ cập nhật khi có.</p>
        </GemCard>
      )}
    </section>
  );
}

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
            <MarketingLinkBox links={f.links} id={`lien-ket-tiep-thi-${f.id}`} title={`Đường link liên kết — ${f.name}`} />
          </GemCard>
        ))}
      </div>
    </section>
  );
}

export function EcosystemMiniSiteView({ ecosystemSlug }: { ecosystemSlug: string }) {
  const { items, ready } = useCollection<Ecosystem>(ECOSYSTEMS_COLLECTION_KEY, ecosystemsSeed);
  const { items: articles } = useCollection<DigitalAssetArticle>("digital-asset-articles", digitalAssetArticles);
  const eco = useMemo(() => getEcosystemBySlug(items, ecosystemSlug), [items, ecosystemSlug]);

  if (!ready) {
    return (
      <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
        <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
          <div className="h-72 animate-pulse rounded-3xl border border-gray-100 bg-gray-50" />
        </div>
      </div>
    );
  }

  if (!eco) {
    return (
      <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
        <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
          <div className="rounded-3xl p-6 md:p-8">
            <GemCard>
              <p className="text-sm text-gray-500">Không tìm thấy hệ sinh thái này.</p>
              <Link href="/portal/duan-cohoi" className="mt-3 inline-block text-sm font-semibold text-brand-blue">
                ← Quay lại Dự án & Cơ hội
              </Link>
            </GemCard>
          </div>
        </div>
      </div>
    );
  }

  const relatedArticles =
    eco.relatedArticleIds.length > 0
      ? eco.relatedArticleIds
          .map((id) => articles.find((a) => a.id === id))
          .filter((a): a is DigitalAssetArticle => !!a && a.status === "Published")
      : (() => {
          const categories = [eco.articleCategory, ...(eco.extraArticleCategories ?? [])];
          return articles.filter((a) => categories.includes(a.category) && a.status === "Published");
        })();

  const potentialAnalysis = eco.potentialAnalysis && eco.potentialAnalysis.length > 0 ? eco.potentialAnalysis : DEFAULT_POTENTIAL_ANALYSIS;

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
          { label: eco.name },
        ]}
      />

      <Overview eco={eco} />

      {eco.structureType === "sub-projects" && (
        <>
          <MarketingLinkBox links={eco.links} />
          <SubProjectsGrid eco={eco} />
          <PotentialAnalysisTable items={potentialAnalysis} />
          <ArticlesSection articles={relatedArticles} />
        </>
      )}

      {eco.structureType === "two-field" && (
        <>
          <TwoFieldBoxes eco={eco} />
          <PotentialAnalysisTable items={potentialAnalysis} />
        </>
      )}

      {eco.structureType === "affiliate-list" && (
        <>
          <AffiliateOffersList eco={eco} />
          <PotentialAnalysisTable items={potentialAnalysis} />
        </>
      )}

      {eco.structureType === "exchange-list" && (
        <>
          <ExchangesList eco={eco} />
          <PotentialAnalysisTable items={potentialAnalysis} />
        </>
      )}

      <FaqSection eco={eco} />
      </div>
      </div>
    </div>
  );
}
