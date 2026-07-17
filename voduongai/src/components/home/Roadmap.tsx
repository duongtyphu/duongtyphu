// Unified landing-page accent (orange), replacing the spec's yellow.
const ACCENT = "#FF6B35";
const OUTPUT_COLOR = "#06D6A0";

const STEPS = [
  {
    number: "CHẶNG 01",
    icon: "🧭",
    title: "Tò mò",
    desc: "Làm quen với AI, hiểu cách nó hoạt động và khám phá công cụ cơ bản.",
    output: "Hiểu được giá trị của AI",
  },
  {
    number: "CHẶNG 02",
    icon: "🛠️",
    title: "Làm quen",
    desc: "Sử dụng AI vào công việc hàng ngày, viết prompt hiệu quả, chọn công cụ phù hợp.",
    output: "5 prompt có thể tái sử dụng",
  },
  {
    number: "CHẶNG 03",
    icon: "⚡",
    title: "Ứng dụng",
    desc: "Xây hệ thống AI cho công việc cụ thể: content, affiliate, marketing, tự động hóa.",
    output: "1 dự án AI hoàn chỉnh",
  },
  {
    number: "CHẶNG 04",
    icon: "🏆",
    title: "Làm chủ",
    desc: "Tạo tài sản số bền vững, nhân bản hệ thống, xây dựng thương hiệu cá nhân bằng AI.",
    output: "Hệ thống vận hành khi bạn không có mặt",
  },
];

export function Roadmap() {
  return (
    <section className="border-t border-white/5 py-9 text-white md:py-12">
      <div className="mx-auto max-w-4xl px-5">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/70 backdrop-blur-md">
            🗺️ Lộ trình của bạn
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Từ <span style={{ color: ACCENT }}>tò mò</span> đến{" "}
            <span style={{ color: ACCENT }}>làm chủ AI</span>
          </h2>
          <p className="mt-3 text-sm text-white/50">
            4 chặng đường – mỗi chặng bạn đạt được một cột mốc cụ thể
          </p>
        </div>

        <div className="roadmap-glass-card mt-10">
          {STEPS.map((step) => (
            <div key={step.number} className="roadmap-timeline-item">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                {step.number}
              </p>
              <p className="mt-1 text-base font-bold text-white sm:text-lg">
                {step.icon} {step.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                {step.desc}
              </p>
              <p
                className="mt-2 text-xs font-semibold"
                style={{ color: OUTPUT_COLOR }}
              >
                ✓ Output: {step.output}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
