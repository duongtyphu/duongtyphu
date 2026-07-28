"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { tools } from "@/data/tools";
import { logoUrl } from "@/lib/logo";
import { RevealText } from "@/components/home/RevealText";

// Duplicated once so the marquee track can loop seamlessly at -50%.
const marqueeTools = [...tools, ...tools];

export function ToolsIUse({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <section
      id="cong-cu-toi-dung"
      className={`scroll-mt-24 overflow-hidden py-[32.4px] md:py-[43.2px] ${isLight ? "bg-[#F6F7F9] text-[#0F172A]" : "text-white"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl px-6 text-center"
      >
        <span
          className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] backdrop-blur-md ${
            isLight ? "border-[#E2E8F0] bg-white text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
          }`}
        >
          🛠️ Thực chiến
        </span>
        <h2 className="mt-4 text-[1.4rem] font-extrabold tracking-[-.3px] text-[#0B0F2E] md:text-[1.6rem]">
          <RevealText>Những công cụ tôi thực sự đang dùng</RevealText>
        </h2>
        <p className={`mx-auto mt-2 max-w-lg ${isLight ? "text-[#334155]" : "text-white"}`}>
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
              className={`card-shine flex w-36 flex-shrink-0 flex-col items-center gap-2.5 rounded-[10.8px] border px-3 py-4 text-center sm:w-40 ${
                isLight ? "border-[#E2E8F0] bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]" : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[10.8px] bg-white/90 p-2 sm:h-16 sm:w-16">
                <Image
                  src={logoUrl(t.id)}
                  alt={`${t.name} logo`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className={`text-xs font-bold sm:text-sm ${isLight ? "text-[#0F172A]" : "text-white"}`}>{t.name}</p>
              {t.iUseThis && (
                <span className="rounded-full bg-[#7C5CFC]/15 px-2 py-0.5 text-[9px] font-semibold text-[#7C5CFC]">
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
