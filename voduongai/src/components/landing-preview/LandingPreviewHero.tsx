import Link from "next/link";
import Image from "next/image";

const BADGES = [
  { icon: "⚙️", label: "Học AI", bg: "bg-[#1D3A66]", border: "border-[#2E4E8A]", style: "left-[4%] top-[10%]" },
  { icon: "🧩", label: "Xây hệ thống", bg: "bg-[#3B2A66]", border: "border-[#5B3EA0]", style: "right-[2%] top-[16%]" },
  { icon: "🧪", label: "Thực hành", bg: "bg-[#3B2A66]", border: "border-[#5B3EA0]", style: "left-[-2%] top-[42%]" },
  { icon: "💰", label: "Tạo tài sản số", bg: "bg-[#5A3418]", border: "border-[#8A5327]", style: "right-[-2%] top-[46%]" },
];

export function LandingPreviewHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#05061a_0%,#0a0c2e_55%,#0b0d33_100%)] pt-16"
      style={{
        backgroundImage:
          "radial-gradient(700px 420px at 78% 30%, rgba(124,92,252,.28), transparent 60%), radial-gradient(600px 500px at 60% 95%, rgba(124,92,252,.35), transparent 60%), linear-gradient(180deg,#05061a 0%,#0a0c2e 55%,#0b0d33 100%)",
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6 pb-24 md:pb-28">
        <div className="grid items-center gap-8 md:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="text-[2.1rem] font-extrabold leading-[1.16] tracking-[-0.5px] text-white md:text-[2.7rem]">
              Học AI đúng hướng.
              <br />
              Ứng dụng thực tế.
              <br />
              <span className="text-[#7C5CFC]">Tạo giá trị bền vững.</span>
            </h1>
            <p className="mt-5 max-w-[520px] text-[1.05rem] leading-[1.7] text-[#AEB4D8]">
              VO DUONG AI là hệ sinh thái giúp bạn học AI, xây thương hiệu cá nhân, phát triển Affiliate
              Marketing và tạo tài sản số bền vững trong kỷ nguyên trí tuệ nhân tạo.
            </p>
            <div className="mt-[30px] flex flex-wrap gap-3.5">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-[26px] py-3.5 text-[.95rem] font-bold text-white shadow-[0_8px_20px_rgba(91,33,214,.35)] transition-transform hover:-translate-y-0.5"
              >
                Bắt đầu hành trình ngay
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#ecosystem"
                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-white/25 px-[26px] py-3.5 text-[.95rem] font-bold text-white transition-colors hover:bg-white/[.08]"
              >
                Khám phá hệ sinh thái
              </a>
            </div>
            <div className="mt-5 text-[.85rem] font-semibold text-[#7C84B0]">
              Miễn phí tham gia • Học mọi lúc • Đồng hành cùng Companion AI
            </div>
          </div>

          <div className="relative mx-auto aspect-[3/2] w-full max-w-[560px]">
            {/* connecting orbit lines */}
            <svg viewBox="0 0 400 267" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <ellipse cx="200" cy="150" rx="180" ry="70" fill="none" stroke="#3D3470" strokeWidth="1" opacity=".5" />
              <ellipse cx="210" cy="120" rx="150" ry="55" fill="none" stroke="#3D3470" strokeWidth="1" opacity=".4" />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[82%] w-[82%] overflow-hidden rounded-2xl drop-shadow-[0_20px_40px_rgba(91,33,214,.45)] sm:h-[70%] sm:w-[70%]">
                <Image
                  src="/images/landing-preview/companion-mascot.jpg"
                  alt="Companion AI — trợ lý AI đồng hành cùng VO DUONG AI"
                  width={1000}
                  height={1000}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {BADGES.map((b) => (
              <div
                key={b.label}
                className={`absolute inline-flex items-center gap-2 whitespace-nowrap rounded-xl border ${b.border} ${b.bg}/70 px-3 py-2 text-[.78rem] font-bold text-white shadow-lg backdrop-blur-sm ${b.style}`}
              >
                <span className="text-base leading-none">{b.icon}</span>
                {b.label}
              </div>
            ))}

            <div className="absolute bottom-[6%] right-[-4%] max-w-[190px] rounded-xl rounded-br-sm border border-[#3B2A66] bg-[#241A4A]/85 px-3.5 py-2.5 text-[.72rem] font-semibold leading-snug text-[#DCD6F5] shadow-lg backdrop-blur-sm">
              Companion AI luôn ở đây để đồng hành cùng bạn! 💜
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
