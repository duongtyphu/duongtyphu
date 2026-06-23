import Link from "next/link";
import { tools } from "@/data/tools";

export function ToolsIUse() {
  return (
    <section className="bg-brand-gray-50 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
              Những công cụ tôi thực sự đang dùng
            </h2>
            <p className="mt-2 max-w-lg text-brand-gray-500">
              Không phải danh sách chung chung — đây là những gì tôi đang
              dùng thật, mỗi ngày.
            </p>
          </div>
          <Link
            href="/portal/tools"
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            Xem Thư viện công cụ →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {tools.slice(0, 9).map((t) => (
            <div
              key={t.id}
              className="card-shine rounded-[20px] border border-brand-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg gradient-surface" />
                {t.iUseThis && (
                  <span className="rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-orange">
                    Tôi đang dùng
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-sm font-bold text-brand-navy">{t.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-brand-gray-500">
                {t.description}
              </p>
              <p className="mt-2 text-[11px] font-medium text-brand-gray-400">
                {t.audience}
              </p>
              <Link
                href={`/portal/tools/${t.id}`}
                className="mt-3 inline-flex text-xs font-semibold text-brand-blue hover:underline"
              >
                Xem chi tiết →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
