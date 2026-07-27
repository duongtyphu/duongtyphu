"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { HeroQuestionBubbles } from "@/components/home/HeroQuestionBubbles";

const floatingBadges = [
  {
    title: "200+",
    subtitle: "Prompt AI",
    className: "left-[-6%] top-[8%] md:left-[-9%]",
    duration: 5,
  },
  {
    title: "50+",
    subtitle: "Công cụ AI",
    className: "right-[-5%] top-[2%] md:right-[-8%]",
    duration: 6.5,
  },
  {
    title: "100+",
    subtitle: "Tài nguyên",
    className: "left-[-7%] bottom-[18%] md:left-[-10%]",
    duration: 7,
  },
  {
    title: "Affiliate Hub",
    subtitle: undefined,
    className: "right-[-4%] bottom-[26%] md:right-[-7%]",
    duration: 4.5,
  },
  {
    title: "AI Academy",
    subtitle: undefined,
    className: "left-[10%] bottom-[-6%] md:left-[14%]",
    duration: 5.5,
  },
];

const vortexQuestions = [
  "Học ChatGPT như thế nào?",
  "Bắt đầu với AI từ đâu?",
  "Cách viết prompt hiệu quả?",
  "DeepSeek là gì? Bắt đầu ra sao?",
  "Claude khác ChatGPT thế nào?",
  "Top công cụ AI miễn phí?",
  "Dùng AI phân tích dữ liệu?",
  "AI tạo hình ảnh bằng gì?",
  "Viết content bằng AI?",
  "Xây trợ lý AI cá nhân?",
  "AI giúp Affiliate ra sao?",
  "AI Agent hoạt động ra sao?",
  "Học AI có kiếm được tiền?",
];

export function Hero({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  // Parallax: the background (neural mesh + glow orbs) drifts slower than
  // the foreground content as the hero scrolls out of view, so the two
  // layers separate a little instead of moving as one flat sheet.
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 180]);

  return (
    <section
      className={`relative isolate overflow-hidden pt-16 pb-10 md:pt-20 md:pb-12 ${
        isLight ? "bg-[#F6F7F9] text-[#0F172A]" : "text-white"
      }`}
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <div aria-hidden="true" className={`hero-grid-layer ${isLight ? "hero-grid-layer--light" : ""}`} />
        <div aria-hidden="true" className={`hero-mesh-blob hero-mesh-blob--blue ${isLight ? "hero-mesh-blob--light" : ""}`} />
        <div aria-hidden="true" className={`hero-mesh-blob hero-mesh-blob--violet ${isLight ? "hero-mesh-blob--light" : ""}`} />
      </motion.div>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-[1.2fr_1fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold text-brand-violet ${
              isLight ? "border-[#E2E8F0] bg-[#F6F7F9]" : "border-white/15 bg-white/5"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7C5CFC] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7C5CFC]" />
            </span>
            Thương hiệu cá nhân · Hệ sinh thái AI
          </span>

          <h1 className="mt-6 text-xl font-extrabold leading-[1.3] tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
            <span className={isLight ? "text-[#0F172A]" : "text-white"}>
              Học AI đúng hướng.
              <br />
              Ứng dụng thực tế.
            </span>
            <br />
            <span className="text-[#7C5CFC]">Tạo giá trị bền vững.</span>
          </h1>

          <p className={`mt-6 max-w-xl text-base leading-relaxed ${isLight ? "text-[#334155]" : "text-[#AEB4D8]"}`}>
            VO DUONG AI là hệ sinh thái học tập AI giúp bạn học đúng, thực
            hành đúng và từng bước xây dựng hệ thống làm việc, thương hiệu cá
            nhân và tài sản số bền vững trong kỷ nguyên trí tuệ nhân tạo.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/portal/hocvienai"
              className="rounded-full bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5B21D6]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_-5px_rgba(91,33,214,0.7)]"
            >
              Bắt đầu ngay hôm nay
            </Link>
          </div>

          <div className={`mt-5 text-[.85rem] font-semibold ${isLight ? "text-[#54637A]" : "text-[#7C84B0]"}`}>
            Miễn phí tham gia • Học mọi lúc • Đồng hành cùng Companion AI
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 4 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative [perspective:1200px]"
        >
          {/* Mesh gradient + glow behind dashboard */}
          {!isLight && (
            <>
              <div className="absolute -inset-10 -z-10 rounded-[40px] bg-[#5B21D6]/20 blur-[70px]" />
              <div className="absolute -inset-16 -z-10 rounded-[44px] bg-[radial-gradient(circle_at_30%_20%,rgba(91,140,255,0.25),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(124,92,252,0.28),transparent_55%)] blur-2xl" />
            </>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`group relative overflow-hidden rounded-[26px] border p-3 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_0_90px_-10px_rgba(37,99,235,0.45),0_50px_120px_-30px_rgba(0,0,0,0.65)] md:p-3.5 ${
              isLight ? "border-[#7C5CFC] bg-[#5B21D6] shadow-[0_20px_60px_-30px_rgba(91,33,214,0.35)]" : "border-white/12 bg-white/[0.045]"
            }`}
          >
            {/* Light reflection */}
            <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
            <div className="pointer-events-none absolute -inset-px rounded-[30px] ring-1 ring-inset ring-white/10" />

            <div className="hero-vortex-cosmic relative h-[320px] overflow-hidden rounded-[20px] sm:h-[360px]">
              <div className="hero-vortex-core" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <HeroQuestionBubbles questions={vortexQuestions} />
              </div>
            </div>
          </motion.div>

          {floatingBadges.map((badge, i) => (
            <motion.div
              key={badge.title}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: badge.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
              whileHover={{ y: -12 }}
              className={`absolute z-20 hidden cursor-default rounded-[20px] border px-4 py-2.5 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md transition-shadow hover:shadow-[0_0_30px_-2px_rgba(91,140,255,0.5)] sm:block ${
                isLight ? "border-[#E2E8F0] bg-white shadow-[0_12px_30px_-15px_rgba(15,23,42,0.25)]" : "border-white/15 bg-white/[0.08]"
              } ${badge.className}`}
            >
              {badge.subtitle ? (
                <>
                  <p className={`text-base font-extrabold leading-none ${isLight ? "text-[#0F172A]" : "text-white"}`}>{badge.title}</p>
                  <p className={`mt-0.5 text-[11px] font-medium ${isLight ? "text-[#54637A]" : "text-white/70"}`}>{badge.subtitle}</p>
                </>
              ) : (
                <p className={`flex items-center gap-1.5 text-xs font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                  <Sparkles className="h-3.5 w-3.5 text-brand-violet" strokeWidth={2} />
                  {badge.title}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
