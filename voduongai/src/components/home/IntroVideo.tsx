"use client";

import { motion } from "framer-motion";
import { RevealText } from "@/components/home/RevealText";

// Placeholder intro video — swap this ID via Admin once video management
// for the homepage ships. For now it's a hardcoded constant.
const INTRO_YOUTUBE_ID = "5eJK7AZi6ZA";

export function IntroVideo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";

  return (
    <section className={`py-9 md:py-12 ${isLight ? "bg-[#F6F7F9] text-[#0F172A]" : "text-white"}`}>
      <div className="mx-auto max-w-4xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md ${
              isLight ? "border-[#E2E8F0] bg-white text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
            }`}
          >
            🎬 Xem ngay
          </span>

          <h2 className="mt-5 text-2xl font-extrabold md:text-3xl">
            <RevealText>
              Hành trình xây <span className="text-brand-orange">VO DUONG AI</span>
            </RevealText>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative mx-auto mt-9 aspect-video w-full overflow-hidden rounded-[1.2rem] border border-white/12 bg-black/60 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.75)] backdrop-blur-xl md:mt-11"
        >
          <iframe
            src={`https://www.youtube.com/embed/${INTRO_YOUTUBE_ID}?autoplay=1&mute=1&playsinline=1&rel=0`}
            title="Hành trình xây VO DUONG AI"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </motion.div>

        <div className="mx-auto mt-6 max-w-2xl text-center">
          <p className={`text-sm ${isLight ? "text-[#C2410C]" : "text-orange-200/80"}`}>
            💡 Video giới thiệu về hành trình xây dựng hệ sinh thái tri thức AI
          </p>
          <p className={`mt-1.5 text-xs ${isLight ? "text-[#54637A]" : "text-white/40"}`}>
            ⏱️ 2-3 phút · Xem để hiểu hành trình phía sau VO DUONG AI
          </p>
        </div>
      </div>
    </section>
  );
}
