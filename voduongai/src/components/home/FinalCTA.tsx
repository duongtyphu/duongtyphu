import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-9 text-white md:py-12">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <h2 className="whitespace-nowrap text-lg font-extrabold sm:text-2xl md:text-3xl">
          Bắt đầu hành trình AI của bạn hôm nay
        </h2>
        <p className="mt-4 whitespace-nowrap text-[11px] text-white sm:text-sm md:text-base">
          Tôi đã chuẩn bị sẵn tài nguyên, công cụ và lộ trình bên trong Học viện AI. Việc của bạn là bắt đầu.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/portal/hocvienai"
            className="inline-flex rounded-full gradient-surface px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:opacity-90"
          >
            Nhận quyền truy cập Học viện miễn phí
          </Link>
          <Link
            href="/portal/premium"
            className="inline-flex rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
          >
            Xem kho tài nguyên
          </Link>
        </div>
      </div>
    </section>
  );
}
