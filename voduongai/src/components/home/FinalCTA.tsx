"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RevealText } from "@/components/home/RevealText";

export function FinalCTA({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <section
      id="cta-cuoi"
      className={`relative scroll-mt-24 overflow-hidden py-[32.4px] md:py-[43.2px] ${isLight ? "bg-white text-[#0F172A]" : "text-white"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl px-5 text-center"
      >
        <h2 className="text-[1.4rem] font-extrabold tracking-[-.3px] text-[#0B0F2E] md:text-[1.6rem]">
          <RevealText>
            Bắt đầu hành trình AI của bạn <span className="text-[#7C5CFC]">hôm nay</span>
          </RevealText>
        </h2>
        <p className={`mt-4 text-[11px] sm:text-sm md:text-base ${isLight ? "text-[#334155]" : "text-white"}`}>
          Tôi đã chuẩn bị sẵn tài nguyên, công cụ và lộ trình bên trong Học viện AI. Việc của bạn là bắt đầu.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex h-[52px] items-center rounded-full bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-8 text-sm font-semibold text-white shadow-lg shadow-[#5B21D6]/30 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
          >
            Vào Học viện miễn phí
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
