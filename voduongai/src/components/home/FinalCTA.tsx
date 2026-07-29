"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RevealText } from "@/components/home/RevealText";
import { EditableRegion } from "@/components/home/EditableRegion";
import { useLandingChrome } from "@/components/home/LandingChromeContext";
import type { FieldConfig } from "@/lib/admin/fields";

const FINAL_CTA_FIELDS: FieldConfig[] = [
  { key: "heading", label: "Tiêu đề", type: "textarea", full: true, required: true },
  { key: "ctaLabel", label: "Nhãn nút CTA", type: "text", required: true },
];

export function FinalCTA({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  const chrome = useLandingChrome("final-cta");
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
        <EditableRegion record={chrome} fields={FINAL_CTA_FIELDS} update={chrome.update}>
          <h2
            className={`text-[1.4rem] font-extrabold tracking-[-.3px] md:text-[1.6rem] ${
              isLight ? "text-[#0B0F2E]" : "text-white"
            }`}
          >
            <RevealText>{chrome.heading ?? ""}</RevealText>
          </h2>
        </EditableRegion>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex h-[52px] items-center rounded-full bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-8 text-sm font-semibold text-white shadow-lg shadow-[#5B21D6]/30 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
          >
            {chrome.ctaLabel}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
