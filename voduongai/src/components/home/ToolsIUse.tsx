"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { tools } from "@/data/tools";
import { logoUrl } from "@/lib/logo";
import { RevealText } from "@/components/home/RevealText";

// Duplicated once so the marquee track can loop seamlessly at -50%.
const marqueeTools = [...tools, ...tools];

export function ToolsIUse() {
  return (
    <section id="cong-cu-toi-dung" className="scroll-mt-24 overflow-hidden py-9 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-6xl px-5 text-center"
      >
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70 backdrop-blur-md">
          🛠️ Thực chiến
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-white md:text-3xl">
          <RevealText>
            Những công cụ tôi <span className="text-brand-orange">thực sự đang dùng</span>
          </RevealText>
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-white">
          Danh sách những công cụ tôi đang trải nghiệm mỗi ngày
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="tools-marquee mt-10"
      >
        <div className="tools-marquee-track gap-4 py-2">
          {marqueeTools.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="card-shine flex w-36 flex-shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4 text-center sm:w-40"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/90 p-2 sm:h-16 sm:w-16">
                <Image
                  src={logoUrl(t.id)}
                  alt={`${t.name} logo`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-xs font-bold text-white sm:text-sm">{t.name}</p>
              {t.iUseThis && (
                <span className="rounded-full bg-brand-orange/15 px-2 py-0.5 text-[9px] font-semibold text-brand-orange">
                  Tôi đang dùng
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
