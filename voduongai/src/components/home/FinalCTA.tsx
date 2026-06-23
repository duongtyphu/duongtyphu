import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden mesh-light py-14 text-brand-navy md:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <h2 className="whitespace-nowrap text-lg font-extrabold sm:text-2xl md:text-3xl">
          Bắt đầu hành trình AI của bạn hôm nay
        </h2>
        <p className="mt-4 whitespace-nowrap text-[11px] text-brand-gray-500 sm:text-sm md:text-base">
          Tôi đã chuẩn bị sẵn tài nguyên, công cụ và lộ trình bên trong Portal. Việc của bạn là bắt đầu.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/portal"
            className="inline-flex rounded-full gradient-surface px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:opacity-90"
          >
            Nhận quyền truy cập Portal miễn phí
          </Link>
          <Link
            href="/portal/resources"
            className="inline-flex rounded-full border border-brand-gray-200 px-8 py-3.5 text-sm font-semibold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue"
          >
            Xem kho tài nguyên
          </Link>
        </div>
      </div>
    </section>
  );
}
