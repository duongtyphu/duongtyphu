"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type TagColor = "gold" | "teal" | "violet" | "coral";

type Pillar = {
  icon: string;
  title: string;
  tagColor: TagColor;
  tagLabel: string;
  desc: string;
  stats: [string, string];
  href: string;
};

const PILLARS: Pillar[] = [
  {
    icon: "🧠",
    title: "CKOS – Hệ trí thức",
    tagColor: "gold",
    tagLabel: "12 Prompt",
    desc: "7 loại tri thức được kết nối – không phải thư viện rời rạc.",
    stats: ["📌 4 Workflow", "📚 11 Lesson"],
    href: "/portal/ckos",
  },
  {
    icon: "⚙️",
    title: "AI Workspace",
    tagColor: "teal",
    tagLabel: "6 Output",
    desc: "Biến ý tưởng thành Output thật trong 15–60 phút.",
    stats: ["📊 18 phiên", "✅ 5 kết quả thật"],
    href: "/portal/aiworkspace",
  },
  {
    icon: "🤖",
    title: "Companion",
    tagColor: "gold",
    tagLabel: "Luôn ở bên",
    desc: "Đồng hành, không phải chatbot. Một sự hiện diện thật.",
    stats: ["💬 Trò chuyện", "🧭 Dẫn đường"],
    href: "/portal/companion",
  },
  {
    icon: "📚",
    title: "Học viện AI",
    tagColor: "teal",
    tagLabel: "8 bài học",
    desc: "Học cách làm việc khác đi, không phải học công cụ.",
    stats: ["🎯 Thực hành", "📈 Trưởng thành"],
    href: "/portal/hocvienai",
  },
  {
    icon: "🚀",
    title: "Dự án & Cơ hội",
    tagColor: "gold",
    tagLabel: "5 hệ sinh thái",
    desc: "Chọn đúng điểm bắt đầu trước khi quyết định.",
    stats: ["📌 Đang nghiên cứu", "📋 Tiêu chí rõ ràng"],
    href: "/portal/duan-cohoi",
  },
];

const PREMIUM = {
  icon: "💎",
  title: "VO DUONG AI Premium",
  tagLabel: "Nâng cấp",
  desc: "Dành cho người muốn đi xa hơn – tài nguyên chuyên sâu, lộ trình riêng và hỗ trợ 1-1.",
  features: ["Lộ trình cá nhân hóa", "Tài nguyên độc quyền", "Hỗ trợ 1-1", "Cập nhật sớm"],
  stats: ["🔓 Mở khóa ngay", "🚀 Ưu đãi đặc biệt"] as [string, string],
  href: "/portal/premium",
};

export function EcosystemPillars() {
  return (
    <section className="py-9 text-white md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center md:max-w-none"
        >
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70 backdrop-blur-md">
            🌐 Hệ sinh thái
          </span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Một hệ sinh thái <span style={{ color: "#F5A623" }}>được kết nối</span>{" "}
            để dẫn lối bạn
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
            5 +1 trụ cột – mỗi trụ cột là một mảnh ghép trong hành trình làm chủ
            AI của bạn.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="ecosystem-card card-shine"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="ecosystem-card-icon" aria-hidden="true">
                  {pillar.icon}
                </span>
                <span className={`ecosystem-tag ecosystem-tag--${pillar.tagColor}`}>
                  {pillar.tagLabel}
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-white">{pillar.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-white/60">
                {pillar.desc}
              </p>
              <div className="ecosystem-card-stats">
                <span>{pillar.stats[0]}</span>
                <span>{pillar.stats[1]}</span>
              </div>
            </Link>
          ))}

          <Link
            href={PREMIUM.href}
            className="ecosystem-card ecosystem-card--premium card-shine"
          >
            <span className="ecosystem-premium-badge">⭐ Premium</span>
            <div className="flex items-start justify-between gap-3">
              <span className="ecosystem-card-icon" aria-hidden="true">
                {PREMIUM.icon}
              </span>
              <span className="ecosystem-tag ecosystem-tag--violet">
                {PREMIUM.tagLabel}
              </span>
            </div>
            <h3 className="mt-3 text-base font-bold text-white">{PREMIUM.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/60">
              {PREMIUM.desc}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PREMIUM.features.map((feature) => (
                <span key={feature} className="ecosystem-feature-chip">
                  <strong>✓</strong> {feature}
                </span>
              ))}
            </div>
            <div className="ecosystem-card-stats mt-auto">
              <span>{PREMIUM.stats[0]}</span>
              <span>{PREMIUM.stats[1]}</span>
            </div>
          </Link>
        </div>

        <p className="mt-6 text-center text-[10px] text-white/15">
          🔹 Di chuột vào từng card để cảm nhận hiệu ứng 3D nhô lên
        </p>
      </div>
    </section>
  );
}
