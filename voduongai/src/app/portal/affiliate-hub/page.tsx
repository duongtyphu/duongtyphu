import Link from "next/link";
import { affiliateResources } from "@/data/affiliate";
import { tools } from "@/data/tools";
import { logoUrl } from "@/lib/logo";

export const metadata = { title: "Trung tâm Affiliate" };

const featuredOffers = tools.filter((t) => t.iUseThis);

export default function AffiliateHubPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Affiliate Hub</h1>
        <p className="mt-2 text-white">
          Tài liệu và công cụ giúp bạn xây hệ thống Affiliate Marketing bằng AI.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-white">Ưu đãi nổi bật — công cụ tôi đang dùng</h2>
        <p className="mt-1 text-sm text-white/60">
          Đây là những công cụ tôi đã dùng thật và muốn giới thiệu lại cho bạn — không phải quảng cáo đại trà.
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
              {t.pros && (
                <ul className="mt-3 space-y-1 text-xs text-white/70">
                  {t.pros.slice(0, 2).map((p) => <li key={p}>• {p}</li>)}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/portal/tools/${t.id}`}
                  className="rounded-full bg-brand-blue/10 px-3 py-1.5 text-xs font-semibold text-brand-blue transition hover:bg-brand-blue/20"
                >
                  Xem Workflow & Hướng dẫn
                </Link>
                <Link
                  href={`/portal/tools/${t.id}`}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">Kiến thức Affiliate</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {affiliateResources.map((a) => (
            <div key={a.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-bold text-white">{a.title}</h3>
              <p className="mt-2 text-sm text-white">{a.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
