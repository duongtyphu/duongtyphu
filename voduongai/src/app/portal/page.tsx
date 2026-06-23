import Link from "next/link";
import { tools } from "@/data/tools";
import { vdaiCourses } from "@/data/courses";
import { freeResources } from "@/data/resources";
import { affiliateResources } from "@/data/affiliate";
import { logoUrl } from "@/lib/logo";

export const metadata = { title: "Portal" };

const todayTasks = [
  { label: "Đọc 1 bài trong Học viện AI hoặc Affiliate", href: "/portal/ai-academy" },
  { label: "Copy 1 prompt và áp dụng ngay vào công việc", href: "/portal/prompts" },
  { label: "Xem lại bước hiện tại trong Lộ trình thành công", href: "/portal/roadmap" },
];

export default function PortalDashboard() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white">
          Chào mừng đến với Võ Đương AI Portal
        </h1>
        <p className="mt-2 text-white">
          Học AI, làm Affiliate và xây tài sản số — mọi thứ bạn cần đều ở đây.
        </p>
      </div>

      <section className="card-shine rounded-[24px] border border-brand-blue/30 bg-brand-blue/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Tiến độ lộ trình</h2>
            <p className="mt-1 text-sm text-white/70">
              Chưa biết bắt đầu từ đâu? Lộ trình 7 bước sẽ chỉ đúng bước tiếp theo cho bạn.
            </p>
          </div>
          <Link
            href="/portal/roadmap"
            className="shrink-0 rounded-full bg-brand-blue px-5 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
          >
            Xem lộ trình của tôi →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">Nhiệm vụ hôm nay</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {todayTasks.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Tiếp tục học</h2>
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
          <h2 className="text-lg font-bold text-white">Công cụ nổi bật</h2>
          <Link href="/portal/tools" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {tools.slice(0, 4).map((t) => (
            <Link
              key={t.id}
              href="/portal/tools"
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 p-1.5">
                <img
                  src={logoUrl(t.id)}
                  alt={`${t.name} logo`}
                  width={20}
                  height={20}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{t.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Đề xuất hôm nay — Affiliate</h2>
          <Link href="/portal/affiliate-hub" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {affiliateResources.slice(0, 3).map((a) => (
            <Link
              key={a.id}
              href="/portal/affiliate-hub"
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:shadow-lg hover:shadow-black/30"
            >
              <p className="text-sm font-semibold text-white">{a.title}</p>
              <p className="mt-1 text-xs text-white">{a.description}</p>
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
            <Link
              key={r.id}
              href={`/portal/resources/${r.id}`}
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:shadow-lg hover:shadow-black/30"
            >
              <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                {r.type}
              </span>
              <p className="mt-2 text-sm font-semibold text-white">{r.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
