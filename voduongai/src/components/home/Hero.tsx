import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-brand-blue/5 via-brand-violet/5 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-gray-200 bg-brand-gray-50 px-4 py-1.5 text-xs font-semibold text-brand-blue">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
            Personal Brand · AI Ecosystem
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-brand-navy md:text-5xl">
            AI không thay thế bạn.{" "}
            <span className="gradient-text">
              Người biết dùng AI sẽ thay thế người không biết dùng AI.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-gray-500">
            Tôi là Võ Đương AI. Tôi chia sẻ những công cụ, tài liệu, lộ trình
            và hệ thống AI giúp bạn học nhanh hơn, làm việc hiệu quả hơn, xây
            thương hiệu cá nhân và tạo thêm thu nhập online.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/portal/resources"
              className="rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 transition hover:opacity-90"
            >
              Nhận AI Toolkit miễn phí
            </Link>
            <Link
              href="/portal"
              className="rounded-full border border-brand-gray-200 px-6 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue"
            >
              Khám phá Portal →
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-brand-gray-200 bg-white p-3 shadow-2xl shadow-brand-navy/10">
            <div className="flex items-center gap-1.5 border-b border-brand-gray-100 px-3 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs font-medium text-brand-gray-400">
                voduongai.com/portal
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {[
                "AI Academy",
                "VDAI Academy",
                "Affiliate Hub",
                "Tool Library",
              ].map((m) => (
                <div
                  key={m}
                  className="rounded-xl border border-brand-gray-100 bg-brand-gray-50 p-4"
                >
                  <div className="h-7 w-7 rounded-lg gradient-surface" />
                  <p className="mt-3 text-sm font-semibold text-brand-navy">
                    {m}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-2xl gradient-surface opacity-90 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
