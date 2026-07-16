"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { HeroNeuralBackground } from "@/components/home/HeroNeuralBackground";

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

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-white md:pt-20 md:pb-12">
      <HeroNeuralBackground className="absolute inset-0 -z-10" />
      <div aria-hidden="true" className="hero-glow-orb hero-glow-orb--a" />
      <div aria-hidden="true" className="hero-glow-orb hero-glow-orb--b" />
      <div aria-hidden="true" className="hero-glow-orb hero-glow-orb--c" />

      <div className="mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-[1.2fr_1fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-violet">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            Thương hiệu cá nhân · Hệ sinh thái AI
          </span>

          <h1 className="mt-6 text-xl font-extrabold leading-[1.3] tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
            AI không thay thế bạn.
            <br />
            <span className="bg-gradient-to-r from-brand-violet to-brand-orange bg-clip-text text-transparent">
              Nhưng người biết dùng AI sẽ
              <br />
              thay thế người không biết dùng AI.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white">
            Giữa vô số công cụ AI, bạn đang loay hoay không biết bắt đầu từ
            đâu? VO DUONG AI là hệ sinh thái giúp bạn học AI đúng hướng, xây
            dựng thương hiệu cá nhân, phát triển Affiliate Marketing và tạo
            tài sản số bền vững. AI là kỹ năng sống còn của thế kỷ 21 — và
            hành trình của bạn có thể bắt đầu từ đây.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/portal/hocvienai"
              className="rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_-5px_rgba(37,99,235,0.7)]"
            >
              🚀 Bước vào Học viện
            </Link>
            <Link
              href="#cong-cu-toi-dung"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-brand-blue hover:shadow-lg hover:shadow-brand-blue/40"
            >
              Xem công cụ tôi dùng
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 4 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative [perspective:1200px]"
        >
          {/* Mesh gradient + glow behind dashboard */}
          <div className="absolute -inset-10 -z-10 rounded-[40px] bg-brand-blue/20 blur-[70px]" />
          <div className="absolute -inset-16 -z-10 rounded-[44px] bg-[radial-gradient(circle_at_30%_20%,rgba(91,140,255,0.25),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.18),transparent_55%)] blur-2xl" />

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-[26px] border border-white/12 bg-white/[0.045] p-3 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_0_90px_-10px_rgba(37,99,235,0.45),0_50px_120px_-30px_rgba(0,0,0,0.65)] md:p-3.5"
          >
            {/* Light reflection */}
            <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
            <div className="pointer-events-none absolute -inset-px rounded-[30px] ring-1 ring-inset ring-white/10" />

            <div className="relative h-[320px] overflow-hidden rounded-[20px] sm:h-[360px]">
              <div className="hero-vortex-core" aria-hidden="true" />
              <div className="hero-vortex pointer-events-none" aria-hidden="true">
                {vortexQuestions.map((question, i) => {
                  // Jittered angle + alternating radius bands so neighboring
                  // questions don't settle on the same circle (which is what
                  // caused labels to overlap) — each item gets its own lane.
                  const angleOffset =
                    (360 / vortexQuestions.length) * i + (i % 2 === 0 ? -7 : 7);
                  const radius = 100 + (i % 3) * 28;
                  const duration = 20 + (i % 5) * 2.4;
                  const delay = -((duration / vortexQuestions.length) * i);

                  return (
                    <div
                      key={question}
                      className="hero-vortex-arm"
                      style={{ transform: `rotate(${angleOffset}deg)` }}
                    >
                      <div
                        className="hero-vortex-path"
                        style={
                          {
                            "--vortex-radius": `${radius}px`,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                          } as CSSProperties
                        }
                      >
                        <span
                          className="hero-vortex-label"
                          style={
                            {
                              "--vortex-offset": `${angleOffset}deg`,
                              animationDuration: `${duration}s`,
                              animationDelay: `${delay}s`,
                            } as CSSProperties
                          }
                        >
                          {question}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
              className={`absolute z-20 hidden cursor-default rounded-[20px] border border-white/15 bg-white/[0.08] px-4 py-2.5 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md transition-shadow hover:shadow-[0_0_30px_-2px_rgba(91,140,255,0.5)] sm:block ${badge.className}`}
            >
              {badge.subtitle ? (
                <>
                  <p className="text-base font-extrabold leading-none text-white">{badge.title}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/70">{badge.subtitle}</p>
                </>
              ) : (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
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
