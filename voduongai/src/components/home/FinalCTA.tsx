"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RevealText } from "@/components/home/RevealText";

export function FinalCTA() {
  return (
    <section id="cta-cuoi" className="relative scroll-mt-24 overflow-hidden py-9 text-white md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl px-5 text-center"
      >
        <h2 className="text-2xl font-extrabold md:text-3xl">
          <RevealText>
            Bắt đầu hành trình AI của bạn <span className="text-brand-orange">hôm nay</span>
          </RevealText>
        </h2>
        <p className="mt-4 text-[11px] text-white sm:text-sm md:text-base">
          Tôi đã chuẩn bị sẵn tài nguyên, công cụ và lộ trình bên trong Học viện AI. Việc của bạn là bắt đầu.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex rounded-full gradient-surface px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
          >
            Vào Học viện miễn phí
          </Link>
          <button
            type="button"
            className="inline-flex rounded-full bg-red-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            🎁 Nhận tài liệu AI
          </button>
        </div>
      </motion.div>
    </section>
  );
}
