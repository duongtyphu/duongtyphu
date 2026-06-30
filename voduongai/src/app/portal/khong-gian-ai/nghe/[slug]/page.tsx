import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  PROFESSION_GROUPS,
  AI_TOOLS,
  NEED_CATEGORIES,
  AI_ARTICLES,
} from "@/data/khong-gian-ai";

export async function generateStaticParams() {
  return PROFESSION_GROUPS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profession = PROFESSION_GROUPS.find((p) => p.slug === slug);
  if (!profession) return {};
  return {
    title: `AI cho ${profession.title} — Không gian AI | VO DUONG AI`,
    description: profession.description,
  };
}

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
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

function PricingBadge({ pricing }: { pricing: string }) {
  const styles: Record<string, string> = {
    "Miễn phí": "bg-green-100 text-green-700 border border-green-200",
    Freemium: "bg-blue-100 text-blue-700 border border-blue-200",
    "Trả phí": "bg-orange-100 text-orange-700 border border-orange-200",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[pricing] ?? "bg-gray-100 text-gray-600"}`}>
      {pricing}
    </span>
  );
}

export default async function ProfessionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profession = PROFESSION_GROUPS.find((p) => p.slug === slug);
  if (!profession) notFound();

  const needs = NEED_CATEGORIES.filter((n) => profession.popularNeedSlugs.includes(n.slug));
  const tools = AI_TOOLS.filter((t) => profession.recommendedToolSlugs.includes(t.slug));
  const articles = AI_ARTICLES.filter((a) => (profession.relatedArticleSlugs ?? []).includes(a.slug));

  return (
    <div className="space-y-10">
      <div>
        <Breadcrumb
          items={[
            { label: "Portal", href: "/portal" },
            { label: "Không gian AI", href: "/portal/khong-gian-ai" },
            { label: "Theo nghề nghiệp" },
            { label: profession.title },
          ]}
        />

        {/* Hero */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="text-5xl mb-4">{profession.emoji}</div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            AI cho <span className="text-blue-600">{profession.title}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600 leading-relaxed">
            {profession.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/portal/academy"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Bắt đầu học AI →
            </Link>
            <Link
              href="/portal/khong-gian-ai"
              className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              ← Quay về Không gian AI
            </Link>
          </div>
        </div>
      </div>

      {/* Popular needs */}
      {needs.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Nhu cầu phổ biến nhất
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {needs.map((need) => (
              <Link
                key={need.slug}
                href={`/portal/khong-gian-ai/${need.slug}`}
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{need.emoji}</span>
                  <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:text-blue-500" />
                </div>
                <h3 className="mt-3 font-bold text-gray-900">{need.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{need.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recommended tools */}
      {tools.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Công cụ AI được gợi ý cho {profession.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div
                key={tool.slug}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{tool.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{tool.tagline}</p>
                  </div>
                  <PricingBadge pricing={tool.pricing} />
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {tool.companionSummary}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/portal/khong-gian-ai/${tool.slug}`}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Xem hướng dẫn →
                  </Link>
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Thử ngay
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related articles */}
      {articles.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Bài viết thực chiến
          </h2>
          <div className="space-y-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {article.category}
                  </span>
                  <h3 className="mt-1 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-blue-500" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Sẵn sàng ứng dụng AI vào công việc {profession.title}?
        </h2>
        <p className="mt-2 text-gray-600">
          Học viện VO DUONG AI hướng dẫn từng bước — từ cơ bản đến thực chiến, theo đúng nghề của bạn.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/portal/academy"
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Xem lộ trình học AI →
          </Link>
          <Link
            href="/portal/khong-gian-ai"
            className="rounded-full border border-blue-200 bg-white px-6 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-400"
          >
            Khám phá thêm công cụ
          </Link>
        </div>
      </div>
    </div>
  );
}
