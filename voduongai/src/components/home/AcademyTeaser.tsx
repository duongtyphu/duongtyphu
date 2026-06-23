import Link from "next/link";

const lessons = [
  "Affiliate Marketing là gì?",
  "Cách chọn ngách bằng AI",
  "Nghiên cứu khách hàng bằng ChatGPT",
  "Xây kế hoạch nội dung Affiliate 30 ngày",
  "Bộ công cụ AI cho người mới",
  "VDAI SOLO",
  "VDAI SCALE",
];

const modules = [
  {
    title: "AI Academy",
    description: "Lộ trình học AI từ nền tảng đến ứng dụng thực chiến.",
    href: "/portal/ai-academy",
  },
  {
    title: "VDAI Academy",
    description: "Hệ thống Affiliate Marketing ứng dụng AI, từ SOLO đến SCALE.",
    href: "/portal/vdai-academy",
  },
  {
    title: "Affiliate Hub",
    description: "Tài liệu và công cụ giúp bạn xây hệ thống Affiliate bằng AI.",
    href: "/portal/affiliate-hub",
  },
];

export function AcademyTeaser() {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold text-white md:text-3xl">
            Học AI và Affiliate theo lộ trình thực chiến
          </h2>
          <p className="mt-3 text-white/60">
            VDAI Academy không còn là thương hiệu chính — đây là một module
            bên trong hệ sinh thái Võ Đương AI.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-6"
            >
              <h3 className="text-lg font-bold text-white">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {m.description}
              </p>
              <span className="mt-4 inline-flex text-xs font-semibold text-brand-violet">
                Khám phá →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {lessons.map((l) => (
            <span
              key={l}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
