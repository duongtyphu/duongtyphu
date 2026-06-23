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
    <section className="bg-brand-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
            Học AI và Affiliate theo lộ trình thực chiến
          </h2>
          <p className="mt-3 text-brand-gray-500">
            VDAI Academy không còn là thương hiệu chính — đây là một module
            bên trong hệ sinh thái Võ Đương AI.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="rounded-[20px] border border-brand-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-blue/10"
            >
              <h3 className="text-lg font-bold text-brand-navy">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray-500">
                {m.description}
              </p>
              <span className="mt-4 inline-flex text-xs font-semibold text-brand-blue">
                Khám phá →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {lessons.map((l) => (
            <span
              key={l}
              className="rounded-full border border-brand-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-brand-gray-700"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
