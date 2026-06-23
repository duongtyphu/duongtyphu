import Link from "next/link";
import { tools } from "@/data/tools";
import { vdaiCourses } from "@/data/courses";
import { freeResources } from "@/data/resources";
import { premiumProducts } from "@/data/premium";
import { logoUrl } from "@/lib/logo";

export const metadata = { title: "Portal" };

export default function PortalDashboard() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white">
          Chào mừng đến với Võ Đương AI Portal
        </h1>
        <p className="mt-2 text-white">
          Nơi tập hợp tài nguyên, công cụ, khóa học và lộ trình giúp bạn học
          AI, làm Affiliate và xây tài sản số.
        </p>
      </div>

      <section className="rounded-[24px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold text-white">Bắt đầu tại đây</h2>
        <p className="mt-1 text-sm text-white">
          Hai điểm khởi đầu nhanh nhất nếu bạn mới tham gia Portal.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/portal/resources"
            className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
          >
            <p className="text-sm font-bold text-white">Bộ công cụ AI</p>
            <p className="mt-1 text-xs text-white">
              Bộ công cụ AI cần thiết để bắt đầu, nhận miễn phí ngay.
            </p>
          </Link>
          <Link
            href="/portal/affiliate-hub"
            className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
          >
            <p className="text-sm font-bold text-white">Lộ trình Affiliate</p>
            <p className="mt-1 text-xs text-white">
              Lộ trình từng bước để bắt đầu Affiliate Marketing đúng hướng.
            </p>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">
            Công cụ đề xuất
          </h2>
          <Link href="/portal/tools" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {tools.slice(0, 4).map((t) => (
            <div key={t.id} className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 p-1.5">
                <img
                  src={logoUrl(t.link)}
                  alt={`${t.name} logo`}
                  width={20}
                  height={20}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">VDAI Academy</h2>
          <Link href="/portal/vdai-academy" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {vdaiCourses.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:shadow-lg hover:shadow-black/30"
            >
              <p className="text-sm font-semibold text-white">{c.title}</p>
              <p className="mt-1 text-xs text-white">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Tài nguyên mới nhất</h2>
          <Link href="/portal/resources" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {freeResources.slice(0, 3).map((r) => (
            <div key={r.id} className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
              <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                {r.type}
              </span>
              <p className="mt-2 text-sm font-semibold text-white">{r.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Sản phẩm nổi bật</h2>
          <Link href="/portal/premium" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {premiumProducts.slice(0, 2).map((p) => (
            <div key={p.id} className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
              <span className="inline-flex rounded-full bg-brand-violet/10 px-2.5 py-0.5 text-xs font-semibold text-brand-violet">
                {p.type}
              </span>
              <p className="mt-2 text-sm font-semibold text-white">{p.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
