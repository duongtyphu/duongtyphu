import Link from "next/link";
import { notFound } from "next/navigation";
import { ecosystems, getEcosystemBySlug, DEFAULT_POTENTIAL_ANALYSIS, type Ecosystem } from "@/data/portal/ecosystems";
import { digitalAssetArticles } from "@/data/digitalAssets";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { MarketingLinkBox } from "@/components/portal/opportunities/MarketingLinkBox";
import { PotentialAnalysisTable } from "@/components/portal/opportunities/PotentialAnalysisTable";
import { getSubProjectSurface } from "@/components/portal/opportunities/subProjectPalette";

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
  crypto: {
    chip: "bg-gradient-to-br from-slate-800 to-emerald-600 text-white",
    badge: "bg-slate-200 text-slate-700",
    strip: "bg-gradient-to-r from-slate-800 to-emerald-600",
  },
  blockchain: {
    chip: "bg-gradient-to-br from-violet-600 to-blue-500 text-white",
    badge: "bg-violet-100 text-violet-700",
    strip: "bg-gradient-to-r from-violet-600 to-blue-500",
  },
  trading: {
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
  return {
    title: eco.name,
    description: eco.shortDescription,
  };
}

function Overview({ eco, surface }: { eco: Ecosystem; surface: { chip: string; badge: string; strip: string } }) {
  const Icon = eco.icon;
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

function ArticlesSection({ articles }: { articles: (typeof digitalAssetArticles)[number][] }) {
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
  const offers = (eco.affiliateOffers ?? []).filter((o) => o.visible).sort((a, b) => a.order - b.order);
  return (
    <section id="lien-ket-tiep-thi">
      <SectionHeader eyebrow="Danh sách" title="Các chương trình tiếp thị liên kết" />
      {offers.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {offers.map((o) =>
            o.url ? (
              <a
                key={o.id}
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-token-sm transition hover:border-blue-300"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{o.category}</p>
                <p className="mt-1 text-sm font-bold text-gray-900">{o.name}</p>
              </a>
            ) : (
              <div key={o.id} className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{o.category}</p>
                <p className="mt-1 text-sm font-bold text-gray-900">{o.name}</p>
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
  const exchanges = (eco.exchanges ?? []).filter((x) => x.visible).sort((a, b) => a.order - b.order);
  return (
    <section id="lien-ket-tiep-thi">
      <SectionHeader eyebrow="Danh sách" title="Các sàn giao dịch" />
      {exchanges.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exchanges.map((x) =>
            x.url ? (
              <a
                key={x.id}
                href={x.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-100 bg-white p-4 text-sm font-bold text-gray-900 shadow-token-sm transition hover:border-blue-300"
              >
                {x.name}
              </a>
            ) : (
              <div key={x.id} className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
                <p className="text-sm font-bold text-gray-900">{x.name}</p>
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
            <MarketingLinkBox
              links={f.marketingLinks}
              id={`lien-ket-tiep-thi-${f.id}`}
              title={`Đường link liên kết — ${f.name}`}
            />
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
  const categories = [eco.articleCategory, ...(eco.extraArticleCategories ?? [])];
  const articles = digitalAssetArticles.filter(
    (a) => categories.includes(a.category) && a.status === "Published"
  );
  const potentialAnalysis = eco.potentialAnalysis ?? DEFAULT_POTENTIAL_ANALYSIS;

  return (
    <div className="space-y-10">
      <Breadcrumb
        items={[
          { label: "Portal", href: "/portal" },
          { label: "Dự án & Cơ hội", href: "/portal/duan-cohoi" },
          { label: eco.name },
        ]}
      />

      <Overview eco={eco} surface={surface} />

      {eco.structureType === "sub-projects" && (
        <>
          <MarketingLinkBox links={eco.marketingLinks} />
          <SubProjectsGrid eco={eco} />
          <PotentialAnalysisTable items={potentialAnalysis} />
          <ArticlesSection articles={articles} />
        </>
      )}

      {eco.structureType === "two-field" && (
        <>
          <TwoFieldBoxes eco={eco} />
          <PotentialAnalysisTable items={potentialAnalysis} />
          <ArticlesSection articles={articles} />
        </>
      )}

      {eco.structureType === "affiliate-list" && (
        <>
          <AffiliateOffersList eco={eco} />
          <PotentialAnalysisTable items={potentialAnalysis} />
          <ArticlesSection articles={articles} />
        </>
      )}

      {eco.structureType === "exchange-list" && (
        <>
          <ExchangesList eco={eco} />
          <PotentialAnalysisTable items={potentialAnalysis} />
          <ArticlesSection articles={articles} />
        </>
      )}
    </div>
  );
}
