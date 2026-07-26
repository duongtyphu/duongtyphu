import Link from "next/link";
import Image from "next/image";

const LIST = [
  { icon: "🖥️", label: "Giao diện hiện đại, dễ sử dụng" },
  { icon: "🎯", label: "Học tập cá nhân hóa theo mục tiêu" },
  { icon: "✅", label: "Theo dõi tiến độ & kết quả rõ ràng" },
  { icon: "💬", label: "Companion AI hỗ trợ 24/7" },
  { icon: "🤝", label: "Cộng đồng tích cực, cùng nhau phát triển" },
];

export function LandingPreviewPlatform() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr]">
          <div className="overflow-hidden rounded-xl border border-[#ECEDF5] shadow-[0_20px_50px_rgba(15,23,60,.14)]">
            <Image
              src="/images/landing-preview/dashboard-mockup.jpg"
              alt="Giao diện Portal học tập VO DUONG AI"
              width={1137}
              height={569}
              className="w-full"
            />
          </div>
          <div>
            <h2 className="text-[1.5rem] font-extrabold leading-[1.3] text-[#0B0F2E] md:text-[1.75rem]">
              Nền tảng toàn diện, trải nghiệm liền mạch
            </h2>
            <ul className="mt-[26px] flex flex-col gap-4">
              {LIST.map((item) => (
                <li key={item.label} className="flex items-center gap-3.5 text-[.95rem] font-semibold text-[#0B0F2E]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[rgba(124,92,252,.12)] text-base">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="mt-[26px] inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-[26px] py-3.5 text-[.95rem] font-bold text-white shadow-[0_8px_20px_rgba(91,33,214,.35)]"
            >
              Khám phá nền tảng
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
