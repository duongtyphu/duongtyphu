import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ecosystems, getEcosystemBySlug, resolveCtas, type Ecosystem } from "@/data/portal/ecosystems";
import { digitalAssetArticles } from "@/data/digitalAssets";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { Button } from "@/components/portal/ui/Button";

/**
 * Portal 4.0 — Ecosystem mini-site, per docs/PROJECT_ECOSYSTEM_ARCHITECTURE.md.
 *
 * One shared template rendering all 7 sections in fixed order for whichever
 * ecosystem the slug resolves to (§1/§3). This is the route that fixes the
 * bug the Product Owner named: Hub cards used to link into
 * `/portal/digital-assets/category/[slug]` (an unrelated personal-holdings
 * catalogue) instead of the ecosystem's own home. digital-assets is NOT
 * removed — its category page is still a legitimate cross-link target for
 * this mini-site's primary CTA and Articles are read from its real
 * `digitalAssetArticles` collection (predecessor doc §1, "reference, don't
 * duplicate").
 */

// Same accent system as `ECOSYSTEM_SURFACE` on the Hub page
// (src/app/portal/duan-cohoi/page.tsx) — replicated here (not imported) so
// the Hub file's existing visual design stays untouched per the task's
// "keep the card's existing visual design as-is" instruction, while this
// mini-site still matches its Hub card's exact colors, not an invented hue.
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

/**
 * Companion copy — interpolated from THIS ecosystem's own real fields, never
 * a fixed string repeated across ecosystems (predecessor §11). Structure is
 * intentionally varied per ecosystem below rather than one templated
 * sentence, so it doesn't read as boilerplate; wording never repeats the
 * Hub's own Companion line ("Trước khi bấm vào bất kỳ hệ sinh thái nào ở
 * trên, hãy đọc Tiêu chí chia sẻ trước...").
 */
function companionMessage(eco: Ecosystem): string {
  switch (eco.slug) {
    case "digiu":
      return `${eco.name} là gì? ${eco.fullIntro} Bạn phù hợp nếu ${eco.whoFor.charAt(0).toLowerCase()}${eco.whoFor.slice(1)} Nếu ${eco.whoNotReady.charAt(0).toLowerCase()}${eco.whoNotReady.slice(1)} thì nên đọc "${eco.learnFirst.label}" trước khi xem tiếp.`;
    case "solargroup":
      return `Trước khi xem ${eco.name}: đây là ${eco.shortDescription.toLowerCase()} ${eco.expectedOutcome} Câu hỏi cần tự trả lời trước — bạn có phải người "${eco.whoFor}" hay đang rơi vào nhóm "${eco.whoNotReady}"?`;
    case "crypto":
      return `${eco.name} phù hợp với người "${eco.whoFor.toLowerCase()}". Nếu bạn "${eco.whoNotReady.toLowerCase()}", hãy dừng lại đọc "${eco.learnFirst.label}" trước — kỳ vọng thực tế ở đây là: ${eco.expectedOutcome.toLowerCase()}`;
    case "blockchain":
      return `Đây là phần nối tiếp của Blockchain & Crypto. ${eco.whoNotReady} Nếu bạn đã sẵn sàng — tức là "${eco.whoFor.toLowerCase()}" — thì kỳ vọng thực tế của mục này là: ${eco.expectedOutcome.toLowerCase()}`;
    case "trading":
    default:
      return `${eco.name}: ${eco.fullIntro} Phù hợp nếu bạn "${eco.whoFor.toLowerCase()}"; chưa nên xem tiếp nếu bạn "${eco.whoNotReady.toLowerCase()}". Nên học trước: ${eco.learnFirst.label}.`;
  }
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

export default async function EcosystemMiniSitePage({
  params,
}: {
  params: Promise<{ ecosystemSlug: string }>;
}) {
  const { ecosystemSlug } = await params;
  const eco = getEcosystemBySlug(ecosystemSlug);
  if (!eco) notFound();

  const surface = SURFACE[eco.slug] ?? SURFACE.digiu;
  const { primary, secondary } = resolveCtas(eco);
  const articles = digitalAssetArticles.filter(
    (a) => a.category === eco.articleCategory && a.status === "Published"
  );
  const Icon = eco.icon;

  return (
    <div className="space-y-10">
      <Breadcrumb
        items={[
          { label: "Portal", href: "/portal" },
          { label: "Dự án & Cơ hội", href: "/portal/duan-cohoi" },
          { label: eco.name },
        ]}
      />

      {/* 3.1 Overview / Hero — required */}
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
          <Link
            href={eco.learnFirst.href}
            className="mt-4 inline-block text-xs font-semibold text-blue-600 hover:underline"
          >
            Nên học trước: {eco.learnFirst.label} →
          </Link>

          {/* 3.7 CTA — required, exactly one primary rendered distinctly */}
          <div className="mt-6 flex flex-wrap gap-3">
            {primary && (
              <Button href={primary.url} variant="primary">
                {primary.label}
              </Button>
            )}
            {secondary.map((c) => (
              <Button key={c.id} href={c.url} variant="secondary">
                {c.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Companion — one advisor block, never sales-toned, never repeats Hub's line */}
      <CompanionGuide message={companionMessage(eco)} action={{ label: eco.learnFirst.label, href: eco.learnFirst.href }} />

      {/* 3.2 Intro Video — optional, honest-empty: section fully omitted when absent */}
      {eco.video ? (
        <section id="video">
          <SectionHeader eyebrow="Giới thiệu" title="Video" />
          {/* video renders here once a real video exists */}
        </section>
      ) : null}

      {/* 3.3 Products — optional, but gets an honest empty-state line (not omitted) */}
      <section id="products">
        <SectionHeader eyebrow="Sản phẩm" title="Sản phẩm / Dự án con" />
        {eco.products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eco.products
              .filter((p) => p.visible)
              .sort((a, b) => a.order - b.order)
              .map((p) => (
                <GemCard key={p.id}>
                  <p className="gemos-card-title text-sm font-bold text-gray-900">{p.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{p.shortDescription}</p>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Xem thêm <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </GemCard>
              ))}
          </div>
        ) : (
          <GemCard>
            <p className="text-sm text-gray-500">
              Chưa có danh sách sản phẩm/dự án con riêng cho {eco.name} — mình chưa có nội dung thật đủ chi
              tiết để tách theo từng sản phẩm, nên chưa hiển thị mục này thay vì bịa tên sản phẩm.
            </p>
          </GemCard>
        )}
      </section>

      {/* 3.4 Articles — optional, honest-empty if absent, reading the real digitalAssetArticles collection */}
      {articles.length > 0 && (
        <section id="articles">
          <SectionHeader eyebrow="Bài viết" title="Bài viết liên quan" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <GemCard key={a.id}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{a.publishedAt}</p>
                <Link
                  href={`/portal/digital-assets/articles/${a.slug}`}
                  className="mt-1 block text-sm font-bold text-gray-900 hover:text-brand-blue"
                >
                  {a.title}
                </Link>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">{a.excerpt}</p>
                <Link
                  href={`/portal/digital-assets/articles/${a.slug}`}
                  className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline"
                >
                  Đọc bài viết →
                </Link>
              </GemCard>
            ))}
          </div>
        </section>
      )}

      {/* 3.5 FAQ — optional, honest-empty if absent */}
      {eco.faq.length > 0 && (
        <section id="faq">
          <SectionHeader eyebrow="Câu hỏi" title="Câu hỏi thường gặp" />
          <div className="space-y-3">
            {eco.faq.map((item) => (
              <GemCard key={item.question}>
                <p className="gemos-card-title mb-2 text-sm font-bold text-gray-900">{item.question}</p>
                <p className="text-sm leading-relaxed text-gray-500">{item.answer}</p>
              </GemCard>
            ))}
          </div>
        </section>
      )}

      {/* 3.6 Resources — fully optional, simply does not render if empty */}
      {eco.resources.length > 0 && (
        <section id="resources">
          <SectionHeader eyebrow="Tài nguyên" title="Tài nguyên" />
          <div className="grid gap-3 sm:grid-cols-2">
            {eco.resources
              .sort((a, b) => a.order - b.order)
              .map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-100 bg-white p-4 text-sm font-semibold text-gray-900 shadow-token-sm hover:border-blue-300"
                >
                  {r.title} <span className="text-xs font-normal text-gray-400">({r.type})</span>
                </a>
              ))}
          </div>
        </section>
      )}

      {/* Repeated CTA band at the bottom, same pattern as long-form landing pages elsewhere */}
      <GemCard className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Bước tiếp theo</p>
          <p className="text-sm text-gray-600">{eco.expectedOutcome}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          {primary && (
            <Button href={primary.url} variant="primary">
              {primary.label}
            </Button>
          )}
          <Button href="/portal/duan-cohoi" variant="secondary">
            ← Về Dự án &amp; Cơ hội
          </Button>
        </div>
      </GemCard>
    </div>
  );
}
