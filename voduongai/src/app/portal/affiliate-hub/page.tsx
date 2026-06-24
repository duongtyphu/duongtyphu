import Link from "next/link";
import { affiliateResources } from "@/data/affiliate";
import { tools } from "@/data/tools";
import { logoUrl } from "@/lib/logo";

export const metadata = { title: "Affiliate Hub" };

const featuredOffers = tools.filter((t) => t.iUseThis);

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
  return (
    <div className="space-y-12">
      <div className="card-shine glow-blue rounded-[24px] border border-brand-blue/30 bg-brand-blue/5 p-8">
        <h1 className="text-2xl font-extrabold text-white">Tiếp thị liên kết thông minh hơn với AI</h1>
        <p className="mt-2 max-w-2xl text-white/70">
          Tìm sản phẩm phù hợp, xây nội dung đúng hướng và tạo hệ thống Affiliate bền vững — không phải
          quảng cáo đại trà, mà là hệ thống thật bạn có thể nhân bản.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-white">1. Bắt đầu Affiliate</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Affiliate Marketing là gì?</h3>
            <p className="mt-2 text-sm text-white/70">
              Mô hình giới thiệu sản phẩm/dịch vụ và nhận hoa hồng khi có người mua qua liên kết của bạn.
            </p>
          </div>
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Lộ trình cho người mới</h3>
            <Link href="/portal/start-here" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Xem lộ trình 5 bước →
            </Link>
          </div>
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Sai lầm cần tránh</h3>
            <p className="mt-2 text-sm text-white/70">
              Quảng cáo sản phẩm chưa dùng, spam link, bỏ qua việc xây nội dung giá trị trước khi giới thiệu.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">2. Chọn ngách</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Checklist chọn ngách bằng AI</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-white/70">
              {NICHE_TIPS.map((t) => <li key={t}>• {t}</li>)}
            </ul>
          </div>
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Prompt nghiên cứu thị trường</h3>
            <p className="mt-2 text-sm text-white/70">
              Dùng prompt nghiên cứu đối thủ và đối tượng mục tiêu có sẵn trong Thư viện Prompt.
            </p>
            <Link href="/portal/prompts" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Mở Thư viện Prompt →
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">3. Chọn sản phẩm</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Tiêu chí chọn sản phẩm</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-white/70">
              {PRODUCT_CRITERIA.map((c) => <li key={c}>• {c}</li>)}
            </ul>
          </div>
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Công cụ nên dùng</h3>
            <p className="mt-2 text-sm text-white/70">Xem danh sách công cụ Affiliate ở mục 5 bên dưới.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">4. Xây nội dung</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Kế hoạch nội dung 30 ngày</h3>
            <Link href="/portal/templates" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Xem Template →
            </Link>
          </div>
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Prompt viết bài</h3>
            <Link href="/portal/prompts" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Xem Prompt →
            </Link>
          </div>
          <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">Template review sản phẩm</h3>
            <Link href="/portal/templates" className="mt-2 inline-flex text-sm font-semibold text-brand-blue hover:underline">
              Xem Template →
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">5. Công cụ Affiliate</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {TOOL_CATEGORIES.map((c) => (
            <div key={c.label} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-bold text-white">{c.label}</h3>
              <ul className="mt-2 space-y-1 text-sm text-white/70">
                {c.items.map((i) => <li key={i}>• {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">6. Case Study</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {affiliateResources.map((a) => (
            <div key={a.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-bold text-white">{a.title}</h3>
              <p className="mt-2 text-sm text-white/70">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">7. Top sản phẩm tháng này</h2>
        <p className="mt-1 text-sm text-white/60">
          Công cụ tôi đã dùng thật và muốn giới thiệu lại cho bạn.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {featuredOffers.map((t) => (
            <div key={t.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 p-1.5">
                  <img src={logoUrl(t.id)} alt={`${t.name} logo`} width={28} height={28} className="h-full w-full object-contain" />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {t.pricing}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">{t.name}</h3>
              <p className="mt-1 text-xs text-white/70">{t.useCase}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/portal/tools/${t.id}`}
                  className="rounded-full bg-brand-blue/10 px-3 py-1.5 text-xs font-semibold text-brand-blue transition hover:bg-brand-blue/20"
                >
                  Xem hướng dẫn
                </Link>
                <Link
                  href={`/portal/tools/${t.id}`}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
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
