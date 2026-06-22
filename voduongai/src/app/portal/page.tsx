import Link from "next/link";
import { tools } from "@/data/tools";
import { vdaiCourses } from "@/data/courses";
import { freeResources } from "@/data/resources";
import { premiumProducts } from "@/data/premium";

export const metadata = { title: "Portal" };

export default function PortalDashboard() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">
          Chào mừng trở lại 👋
        </h1>
        <p className="mt-2 text-brand-gray-500">
          Đây là không gian học tập, công cụ và sản phẩm của bạn trong hệ
          sinh thái Võ Đương AI.
        </p>
      </div>

      <section className="rounded-2xl border border-brand-gray-200 bg-brand-gray-50 p-6">
        <h2 className="text-lg font-bold text-brand-navy">Start Here</h2>
        <p className="mt-1 text-sm text-brand-gray-500">
          Nhận AI Toolkit miễn phí và bắt đầu lộ trình Affiliate Roadmap.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/portal/resources"
            className="rounded-full gradient-surface px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Nhận AI Toolkit
          </Link>
          <Link
            href="/portal/affiliate-hub"
            className="rounded-full border border-brand-gray-200 px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue"
          >
            Affiliate Roadmap
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-brand-navy">
            Recommended Tools
          </h2>
          <Link href="/portal/tools" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {tools.slice(0, 4).map((t) => (
            <div key={t.id} className="rounded-2xl border border-brand-gray-200 bg-white p-4">
              <div className="h-8 w-8 rounded-lg gradient-surface" />
              <p className="mt-3 text-sm font-semibold text-brand-navy">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-brand-navy">VDAI Academy</h2>
          <Link href="/portal/vdai-academy" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {vdaiCourses.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="rounded-2xl border border-brand-gray-200 bg-white p-4 transition hover:shadow-lg hover:shadow-brand-blue/10"
            >
              <p className="text-sm font-semibold text-brand-navy">{c.title}</p>
              <p className="mt-1 text-xs text-brand-gray-500">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-brand-navy">Latest Resources</h2>
          <Link href="/portal/resources" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {freeResources.slice(0, 3).map((r) => (
            <div key={r.id} className="rounded-2xl border border-brand-gray-200 bg-white p-4">
              <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                {r.type}
              </span>
              <p className="mt-2 text-sm font-semibold text-brand-navy">{r.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-brand-navy">Featured Products</h2>
          <Link href="/portal/premium" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {premiumProducts.slice(0, 2).map((p) => (
            <div key={p.id} className="rounded-2xl border border-brand-gray-200 bg-white p-4">
              <span className="inline-flex rounded-full bg-brand-violet/10 px-2.5 py-0.5 text-xs font-semibold text-brand-violet">
                {p.type}
              </span>
              <p className="mt-2 text-sm font-semibold text-brand-navy">{p.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
