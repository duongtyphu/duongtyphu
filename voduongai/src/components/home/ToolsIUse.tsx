import Link from "next/link";
import { tools } from "@/data/tools";
import { logoUrl } from "@/lib/logo";

export function ToolsIUse() {
  return (
    <section className="py-9 md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white md:text-3xl">
              Những công cụ tôi thực sự đang dùng
            </h2>
            <p className="mt-2 max-w-lg text-white md:max-w-none md:whitespace-nowrap">
              Không phải danh sách chung chung — đây là những gì tôi đang
              dùng thật, mỗi ngày.
            </p>
          </div>
          <Link
            href="/portal/tools"
            className="text-sm font-semibold text-brand-violet hover:underline"
          >
            Xem Thư viện công cụ →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {tools.slice(0, 9).map((t) => (
            <div
              key={t.id}
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 p-1.5">
                  <img
                    src={logoUrl(t.link)}
                    alt={`${t.name} logo`}
                    width={28}
                    height={28}
                    className="h-full w-full object-contain"
                  />
                </div>
                {t.iUseThis && (
                  <span className="rounded-full bg-brand-orange/15 px-2.5 py-0.5 text-[10px] font-semibold text-brand-orange">
                    Tôi đang dùng
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">{t.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white">
                {t.description}
              </p>
              <p className="mt-2 text-[11px] font-medium text-white">
                {t.audience}
              </p>
              <Link
                href={`/portal/tools/${t.id}`}
                className="mt-3 inline-flex text-xs font-semibold text-brand-violet hover:underline"
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
