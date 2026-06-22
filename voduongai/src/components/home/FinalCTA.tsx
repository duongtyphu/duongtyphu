import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[320px] bg-gradient-to-t from-brand-blue/5 via-brand-violet/5 to-transparent" />
      <div className="mx-auto max-w-2xl px-5 text-center">
        <h2 className="text-2xl font-extrabold text-brand-navy md:text-4xl">
          Bắt đầu hành trình AI của bạn hôm nay.
        </h2>
        <p className="mt-4 text-brand-gray-500">
          Tham gia Portal miễn phí để truy cập AI Toolkit, tài liệu, công cụ
          và hệ thống mà tôi đang dùng mỗi ngày.
        </p>
        <div className="mt-8">
          <Link
            href="/portal"
            className="inline-flex rounded-full gradient-surface px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 transition hover:opacity-90"
          >
            Nhận quyền truy cập Portal miễn phí
          </Link>
        </div>
      </div>
    </section>
  );
}
