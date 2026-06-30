"use client";

import Link from "next/link";
import { logoUrl } from "@/lib/logo";
import { useCollection } from "@/lib/admin/store";
import { affiliateHubSeed } from "@/data/admin/affiliateHub";
import { affiliateHubTopProductsSeed } from "@/data/admin/affiliateHub";
import { affiliateProductsSeed } from "@/data/admin/affiliate";

const NICHE_TIPS = [
  "Chọn ngách bạn am hiểu hoặc đang dùng sản phẩm thật — dễ tạo nội dung thuyết phục hơn.",
  "Ưu tiên ngách có cộng đồng lớn và nhu cầu lặp lại (SaaS, công cụ AI, giáo dục online).",
  "Dùng AI để nghiên cứu đối thủ và đối tượng mục tiêu trước khi chọn sản phẩm.",
];

const PRODUCT_CRITERIA = [
  "Sản phẩm bạn đã dùng thật hoặc tin tưởng chất lượng.",
  "Hoa hồng và chính sách thanh toán rõ ràng, minh bạch.",
  "Có tài liệu/landing page hỗ trợ người mới dễ giới thiệu lại.",
];

const TOOL_CATEGORIES = [
  { label: "Hosting & Landing page", items: ["Hostinger / Vercel"] },
  { label: "AI Tools", items: ["ChatGPT", "Claude", "Canva"] },
  { label: "Email & Automation", items: ["Make / n8n", "Google Workspace"] },
];

export default function AffiliateHubPage() {
  const { items: hubSections } = useCollection("affiliate-hub-sections", affiliateHubSeed);
  const { items: topProducts } = useCollection("affiliate-hub-top-products", affiliateHubTopProductsSeed);
  const { items: affiliateProducts } = useCollection("affiliate-products", affiliateProductsSeed);

  const sections = [...hubSections]
    .filter((s) => s.status === "Published")
    .sort((a, b) => a.order - b.order);
  const products = [...topProducts]
    .filter((p) => p.status === "Active")
    .sort((a, b) => a.order - b.order)
    .map((p) => ({ ...p, product: affiliateProducts.find((ap) => ap.id === p.productId) }));

  return (
    <div className="space-y-12">
      <div className="card-shine glow-blue rounded-[24px] border border-brand-blue/30 bg-brand-blue/5 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Tiếp thị liên kết thông minh hơn với AI</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Tìm sản phẩm phù hợp, xây nội dung đúng hướng và tạo hệ thống Affiliate bền vững — không phải
          quảng cáo đại trà, mà là hệ thống thật bạn có thể nhân bản.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-gray-900">1. Bắt đầu Affiliate</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Affiliate Marketing là gì?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Mô hình giới thiệu sản phẩm/dịch vụ và nhận hoa hồng khi có người mua qua liên kết của bạn.
            </p>
          </div>
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Lộ trình cho người mới</h3>
            <Link href="/portal/start-here" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Xem lộ trình 5 bước →
            </Link>
          </div>
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Sai lầm cần tránh</h3>
            <p className="mt-2 text-sm text-gray-600">
              Quảng cáo sản phẩm chưa dùng, spam link, bỏ qua việc xây nội dung giá trị trước khi giới thiệu.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">2. Chọn ngách</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Checklist chọn ngách bằng AI</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
              {NICHE_TIPS.map((t) => <li key={t}>• {t}</li>)}
            </ul>
          </div>
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Prompt nghiên cứu thị trường</h3>
            <p className="mt-2 text-sm text-gray-600">
              Dùng prompt nghiên cứu đối thủ và đối tượng mục tiêu có sẵn trong Thư viện Prompt.
            </p>
            <Link href="/portal/prompts" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Mở Thư viện Prompt →
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">3. Chọn sản phẩm</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Tiêu chí chọn sản phẩm</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
              {PRODUCT_CRITERIA.map((c) => <li key={c}>• {c}</li>)}
            </ul>
          </div>
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Công cụ nên dùng</h3>
            <p className="mt-2 text-sm text-gray-600">Xem danh sách công cụ Affiliate ở mục 5 bên dưới.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">4. Xây nội dung</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Kế hoạch nội dung 30 ngày</h3>
            <Link href="/portal/templates" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Xem Template →
            </Link>
          </div>
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Prompt viết bài</h3>
            <Link href="/portal/prompts" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Xem Prompt →
            </Link>
          </div>
          <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">Template review sản phẩm</h3>
            <Link href="/portal/templates" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Xem Template →
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">5. Công cụ Affiliate</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {TOOL_CATEGORIES.map((c) => (
            <div key={c.label} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
              <h3 className="text-sm font-bold text-gray-900">{c.label}</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {c.items.map((i) => <li key={i}>• {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">6. Case Study</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.id}
              href={s.ctaHref || "#"}
              className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
            >
              <h3 className="text-sm font-bold text-gray-900">
                {s.icon} {s.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">7. Top sản phẩm tháng này</h2>
        <p className="mt-1 text-sm text-gray-500">
          Công cụ tôi đã dùng thật và muốn giới thiệu lại cho bạn.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 p-1.5">
                  <img src={logoUrl(p.product?.slug || p.productId)} alt={`${p.productName} logo`} width={28} height={28} className="h-full w-full object-contain" />
                </div>
                {p.badge ? (
                  <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-900">
                    {p.badge}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900">{p.productName}</h3>
              {p.product?.shortDescription ? (
                <p className="mt-1 text-xs text-gray-600">{p.product.shortDescription}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={p.guideHref || "#"}
                  className="rounded-full bg-brand-blue/10 px-3 py-1.5 text-xs font-semibold text-brand-blue transition hover:bg-brand-blue/20"
                >
                  Xem hướng dẫn
                </Link>
                <Link
                  href={p.trialHref || "#"}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 transition hover:border-brand-violet hover:text-brand-violet"
                >
                  Dùng thử
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
