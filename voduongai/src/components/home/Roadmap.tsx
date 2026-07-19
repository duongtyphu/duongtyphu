"use client";

import { motion } from "framer-motion";
import { RevealText } from "@/components/home/RevealText";

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

export function Roadmap({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <section className={`border-t py-9 md:py-12 ${isLight ? "border-[#E2E8F0] bg-[#F6F7F9] text-[#0F172A]" : "border-white/5 text-white"}`}>
      <div className="mx-auto max-w-4xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md ${
              isLight ? "border-[#E2E8F0] bg-white text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
            }`}
          >
            🗺️ Lộ trình của bạn
          </span>
          <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">
            <RevealText>
              Từ <span style={{ color: ACCENT }}>tò mò</span> đến{" "}
              <span style={{ color: ACCENT }}>làm chủ AI</span>
            </RevealText>
          </h2>
          <p className={`mt-3 text-sm ${isLight ? "text-[#54637A]" : "text-white/50"}`}>
            4 chặng đường – mỗi chặng bạn đạt được một cột mốc cụ thể
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className={`roadmap-glass-card mt-10 ${isLight ? "roadmap-glass-card--light" : ""}`}
        >
          {STEPS.map((step) => (
            <div key={step.number} className="roadmap-timeline-item">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? "text-[#94A3B8]" : "text-white/35"}`}>
                {step.number}
              </p>
              <p className={`mt-1 text-base font-bold sm:text-lg ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                {step.icon} {step.title}
              </p>
              <p className={`mt-1.5 text-sm leading-relaxed ${isLight ? "text-[#54637A]" : "text-white/60"}`}>
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
        </motion.div>
      </div>
    </section>
  );
}
