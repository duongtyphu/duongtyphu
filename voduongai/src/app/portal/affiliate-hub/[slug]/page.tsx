import { notFound } from "next/navigation";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
import { GemCard } from "@/components/portal/ui/GemCard";
import { getLiveAffiliateProductBySlug } from "@/lib/portal/live-affiliate-hub";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getLiveAffiliateProductBySlug(slug);
  if (!product) return { title: "Sản phẩm Affiliate" };
  return { title: `${product.name} — Affiliate Hub`, description: product.shortDescription };
}

export default async function AffiliateProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getLiveAffiliateProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="space-y-8">
      <PortalBackLink href="/portal/affiliate-hub" label="Affiliate Hub" />

      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{product.category}</span>
          {product.isAffiliate && (
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-600">
              Affiliate — VO DUONG AI nhận hoa hồng nếu bạn mua qua link này
            </span>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-gray-900">{product.name}</h1>
        <p className="mt-2 text-gray-900">{product.longDescription || product.shortDescription}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <GemCard>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">Phù hợp cho</h3>
          <p className="mt-2 text-sm text-gray-700">{product.audience || "Chưa cập nhật"}</p>
        </GemCard>
        <GemCard>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">Dùng để làm gì</h3>
          <p className="mt-2 text-sm text-gray-700">{product.useCase || "Chưa cập nhật"}</p>
        </GemCard>
        <GemCard>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">Giá</h3>
          <p className="mt-2 text-sm text-gray-700">{product.pricing || "Chưa cập nhật"}</p>
        </GemCard>
      </div>

      {product.workflow && (
        <GemCard>
          <h3 className="text-sm font-bold text-gray-900">Quy trình sử dụng</h3>
          <p className="mt-2 text-sm text-gray-700">{product.workflow}</p>
        </GemCard>
      )}

      {(product.pros.length > 0 || product.cons.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {product.pros.length > 0 && (
            <GemCard>
              <h3 className="text-sm font-bold text-emerald-700">Ưu điểm</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                {product.pros.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </GemCard>
          )}
          {product.cons.length > 0 && (
            <GemCard>
              <h3 className="text-sm font-bold text-gray-500">Cần lưu ý</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                {product.cons.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </GemCard>
          )}
        </div>
      )}

      {product.affiliateUrl && (
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          Dùng thử {product.name} ↗
        </a>
      )}
    </div>
  );
}
