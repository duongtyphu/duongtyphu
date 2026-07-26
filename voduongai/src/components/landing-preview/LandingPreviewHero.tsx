import Link from "next/link";
import Image from "next/image";

const STATS = [
  { icon: "💟", bg: "bg-[#E6F3FD]", num: "200+", label: "Prompt & Template" },
  { icon: "🧩", bg: "bg-[#FCE9F3]", num: "50+", label: "AI Tools thực chiến" },
  { icon: "📋", bg: "bg-[#E6F8EE]", num: "100+", label: "Tài liệu & Resources" },
  { icon: "👥", bg: "bg-[#FDEFE0]", num: "10,000+", label: "Thành viên học tập" },
  { icon: "🕐", bg: "bg-[#EDE9FE]", num: "24/7", label: "Companion đồng hành" },
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
      <div className="mx-auto max-w-[1280px] px-6 pb-14">
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
          <div className="flex items-center justify-center">
            <Image
              src="/images/landing-preview/hero-companion.jpg"
              alt="Companion AI — trợ lý AI đồng hành cùng VO DUONG AI"
              width={1368}
              height={870}
              priority
              className="w-full max-w-[560px] rounded-[20px]"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6">
        <div className="relative z-[5] -mt-[46px]">
          <div className="flex flex-wrap justify-between gap-3 rounded-[20px] bg-white px-6 py-7 shadow-[0_20px_50px_rgba(10,14,40,.18)] sm:px-10">
            {STATS.map((s) => (
              <div key={s.label} className="flex min-w-[150px] flex-1 items-center gap-3.5">
                <div className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl text-[22px] ${s.bg}`}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-[1.4rem] font-extrabold leading-tight text-[#5b21c9]">{s.num}</div>
                  <div className="mt-0.5 text-[.8rem] font-semibold text-[#5B6B85]">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
