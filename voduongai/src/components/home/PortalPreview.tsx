import Link from "next/link";
import Image from "next/image";
import { LandingPreviewPortalMockup } from "@/components/landing-preview/LandingPreviewPortalMockup";

const LIST = [
  { icon: "/images/landing-preview/icons/platform-interface.png", label: "Giao diện hiện đại, dễ sử dụng" },
  { icon: "/images/landing-preview/icons/platform-goal.png", label: "Học tập cá nhân hóa theo mục tiêu" },
  { icon: "/images/landing-preview/icons/platform-progress.png", label: "Theo dõi tiến độ & kết quả rõ ràng" },
  { icon: "/images/landing-preview/icons/platform-companion.png", label: "Companion AI hỗ trợ 24/7" },
  { icon: "/images/landing-preview/icons/platform-community.png", label: "Cộng đồng tích cực, cùng nhau phát triển" },
];

/**
 * "Khám phá Học Viện" section — only the eyebrow badge is kept from the
 * old page; everything else is ported verbatim from the new landing
 * preview (LandingPreviewPlatform): the animated portal mockup + the
 * "Nền tảng toàn diện, trải nghiệm liền mạch" feature list box. Section
 * background follows the same theme-aware pattern as IntroVideo (light:
 * bg-[#F6F7F9], dark: transparent) so the old page's background stays one
 * continuous, unbroken sweep behind every section.
 */
export function PortalPreview({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <section id="trai-nghiem-hoc-vien-ai" className={`scroll-mt-24 py-16 ${isLight ? "bg-[#F6F7F9]" : ""}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#54637A]">
            🧭 Khám phá Học Viện
          </span>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-[65fr_35fr]">
          <div className="overflow-hidden rounded-xl border border-[#ECEDF5] shadow-[0_4px_24px_rgba(15,23,60,.06)]">
            <LandingPreviewPortalMockup />
          </div>
          <div className="flex flex-col justify-center rounded-xl border border-[#ECEDF5] bg-white p-6 shadow-[0_4px_24px_rgba(15,23,60,.06)] md:p-8">
            <h2 className="text-[1.5rem] font-extrabold leading-[1.3] text-[#0B0F2E] md:text-[1.75rem]">
              Nền tảng toàn diện, trải nghiệm liền mạch
            </h2>
            <ul className="mt-[26px] flex flex-col gap-4">
              {LIST.map((item) => (
                <li key={item.label} className="flex items-center gap-3.5 text-[.95rem] font-semibold text-[#0B0F2E]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                    <Image
                      src={item.icon}
                      alt=""
                      width={400}
                      height={400}
                      className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(91,33,214,.25)]"
                    />
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="mt-[26px] inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-[26px] py-3.5 text-[.95rem] font-bold text-white shadow-[0_8px_20px_rgba(91,33,214,.35)]"
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
