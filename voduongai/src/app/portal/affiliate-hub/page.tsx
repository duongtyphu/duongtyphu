import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import {
  getLiveAffiliateHubSections,
  getLiveAffiliateHubTopProducts,
  getLiveAffiliateProducts,
} from "@/lib/portal/live-affiliate-hub";

export const metadata = {
  title: "Affiliate Hub — Hướng dẫn làm tiếp thị liên kết",
  description: "Lộ trình bắt đầu, chọn ngách, chọn sản phẩm, xây nội dung và công cụ đề xuất cho Affiliate Marketing.",
};

export default async function AffiliateHubPage() {
  const [sections, topProducts, products] = await Promise.all([
    getLiveAffiliateHubSections(),
    getLiveAffiliateHubTopProducts(),
    getLiveAffiliateProducts(),
  ]);

  const productById = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="space-y-10">
      <PortalBackLink href="/portal/duan-cohoi/lam-affilate" label="Làm tiếp thị liên kết" />

      <PageHeader
        title="Affiliate Hub"
        description="Hướng dẫn thực chiến làm Affiliate Marketing bằng AI — từ bắt đầu, chọn ngách, chọn sản phẩm, xây nội dung, tới công cụ và case study thật."
      />

      <section>
        <h2 className="text-lg font-bold text-gray-900">Lộ trình làm Affiliate</h2>
        {sections.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
            Chưa có nội dung hướng dẫn nào được đăng.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <GemCard key={s.id}>
                <span className="text-2xl">{s.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-gray-900">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{s.description}</p>
                {s.ctaHref && s.ctaText && (
                  <Link
                    href={s.ctaHref}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
                  >
                    {s.ctaText} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </GemCard>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">Nổi bật tháng này</h2>
        <p className="mt-1 text-sm text-gray-500">Sản phẩm Affiliate đang được VO DUONG AI đề xuất dùng thử.</p>
        {topProducts.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
            Chưa có sản phẩm nổi bật nào tháng này.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topProducts.map((t) => {
              const product = productById.get(t.productId);
              return (
                <GemCard key={t.id} variant="featured">
                  <span className="inline-block rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-blue">
                    {t.badge}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-gray-900">{t.productName}</h3>
                  {product && <p className="mt-1 text-sm text-gray-500">{product.shortDescription}</p>}
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link href={t.guideHref} className="text-xs font-semibold text-brand-blue hover:underline">
                      Xem hướng dẫn
                    </Link>
                    {t.trialHref && (
                      <a
                        href={t.trialHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                      >
                        Dùng thử ↗
                      </a>
                    )}
                  </div>
                </GemCard>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">Sản phẩm Affiliate đề xuất</h2>
        <p className="mt-1 text-sm text-gray-500">
          Công cụ VO DUONG AI đã dùng thật và đang giới thiệu — mỗi mục ghi rõ khi nào nên dùng.
        </p>
        {products.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
            Chưa có sản phẩm nào được đăng.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link key={p.id} href={`/portal/affiliate-hub/${p.slug}`} className="block">
                <GemCard className="h-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{p.category}</span>
                    {p.isAffiliate && (
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-600">
                        Affiliate
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-gray-900">{p.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{p.shortDescription}</p>
                  <p className="mt-3 text-xs font-semibold text-gray-700">{p.pricing}</p>
                </GemCard>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
