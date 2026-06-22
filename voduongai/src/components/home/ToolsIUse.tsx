import Link from "next/link";
import { tools } from "@/data/tools";

export function ToolsIUse() {
  return (
    <section className="bg-brand-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
              Công cụ tôi đang sử dụng
            </h2>
            <p className="mt-2 max-w-lg text-brand-gray-500">
              Những công cụ AI thực chiến trong công việc, nội dung và
              Affiliate hàng ngày của tôi.
            </p>
          </div>
          <Link
            href="/portal/tools"
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            Xem Tool Library →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {tools.slice(0, 8).map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-brand-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg gradient-surface" />
                {t.iUseThis && (
                  <span className="rounded-full bg-brand-violet/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-violet">
                    I Use This
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-sm font-bold text-brand-navy">
                {t.name}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-brand-gray-500">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
