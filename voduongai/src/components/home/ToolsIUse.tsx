"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { tools } from "@/data/tools";
import { logoUrl } from "@/lib/logo";
import { RevealText } from "@/components/home/RevealText";
import { EditableRegion } from "@/components/home/EditableRegion";
import { useLandingChrome } from "@/components/home/LandingChromeContext";
import type { FieldConfig } from "@/lib/admin/fields";

const TOOLS_I_USE_FIELDS: FieldConfig[] = [
  { key: "eyebrowBadge", label: "Badge nhỏ phía trên", type: "text", required: true },
  { key: "heading", label: "Tiêu đề section", type: "text", required: true },
];

// Duplicated once so the marquee track can loop seamlessly at -50%.
const marqueeTools = [...tools, ...tools];

export function ToolsIUse({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  // WCAG 2.2.2 (Pause, Stop, Hide) — the marquee auto-scrolls indefinitely
  // and previously only paused on :hover, leaving keyboard/touch users with
  // no way to stop it. This button gives everyone an explicit control.
  const [paused, setPaused] = useState(false);
  const chrome = useLandingChrome("tools-i-use");
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
        <EditableRegion record={chrome} fields={TOOLS_I_USE_FIELDS} update={chrome.update}>
          <span
            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] backdrop-blur-md ${
              isLight ? "border-[#E2E8F0] bg-white text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
            }`}
          >
            {chrome.eyebrowBadge}
          </span>
          <h2
            className={`mt-4 text-[1.4rem] font-extrabold tracking-[-.3px] md:text-[1.6rem] ${
              isLight ? "text-[#0B0F2E]" : "text-white"
            }`}
          >
            <RevealText>{chrome.heading ?? ""}</RevealText>
          </h2>
        </EditableRegion>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative mt-10"
      >
        <div className="tools-marquee">
          <div
            className="tools-marquee-track gap-4 py-2"
            style={{ animationPlayState: paused ? "paused" : undefined }}
          >
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
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Tiếp tục cuộn danh sách công cụ" : "Tạm dừng cuộn danh sách công cụ"}
          className={`absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition sm:right-6 ${
            isLight
              ? "border-[#E2E8F0] bg-white/90 text-[#54637A] hover:text-[#0F172A]"
              : "border-white/15 bg-black/30 text-white/70 hover:text-white"
          }`}
        >
          {paused ? <Play className="h-4 w-4" strokeWidth={2.25} /> : <Pause className="h-4 w-4" strokeWidth={2.25} />}
        </button>
      </motion.div>
    </section>
  );
}
