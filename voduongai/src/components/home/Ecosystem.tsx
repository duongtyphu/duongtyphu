"use client";

import Image from "next/image";
import { Crown, Orbit } from "lucide-react";
import { motion } from "framer-motion";
import { LandingPreviewSolarSystem } from "@/components/landing-preview/LandingPreviewSolarSystem";
import { EditableRegion } from "@/components/home/EditableRegion";
import { useLandingChrome } from "@/components/home/LandingChromeContext";
import type { FieldConfig } from "@/lib/admin/fields";

const ECOSYSTEM_BADGE_FIELDS: FieldConfig[] = [
  { key: "eyebrowBadge", label: "Badge nhỏ phía trên", type: "text", required: true },
];

const FOUNDER_FIELDS: FieldConfig[] = [
  { key: "founderQuote", label: "Câu trích dẫn", type: "textarea", full: true, required: true },
  { key: "founderQuoteAttribution", label: "Người trích dẫn (vd. — Võ Đương)", type: "text", required: true },
  { key: "founderBioParagraph1", label: "Đoạn giới thiệu 1", type: "textarea", full: true, required: true },
  { key: "founderBioParagraph2", label: "Đoạn giới thiệu 2", type: "textarea", full: true, required: true },
  { key: "founderTitle", label: "Chức danh Nhà sáng lập", type: "text", required: true },
];

/**
 * "Hệ sinh thái của tôi" section — the solar-system ecosystem diagram +
 * the founder card, replacing the old page's solar diagram and the
 * entire former FounderStory section (image, "Tại sao tôi xây...", "Đại
 * diện Quốc gia..."). `LandingPreviewSolarSystem` is a shared component
 * (also historically used by the now-removed /landing-preview design
 * preview) — do not delete it when cleaning up unrelated code. Section
 * background follows the same theme-aware pattern as the rest of the
 * page so the background stays one continuous, unbroken sweep.
 */
export function Ecosystem({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  const chrome = useLandingChrome("ecosystem");
  return (
    <section
      id="he-sinh-thai-cua-toi"
      className={`scroll-mt-24 overflow-hidden py-[32.4px] md:py-[43.2px] ${isLight ? "bg-[#F6F7F9] text-[#0F172A]" : "text-white"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <EditableRegion record={chrome} fields={ECOSYSTEM_BADGE_FIELDS} update={chrome.update} as="span">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${
                isLight ? "border-[#E2E8F0] bg-white text-[#5B21D6]" : "border-white/15 bg-white/5 text-[#A78BFA]"
              }`}
            >
              <Orbit className="h-3.5 w-3.5" strokeWidth={2.25} />
              {chrome.eyebrowBadge}
            </span>
          </EditableRegion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="grid items-center gap-8 md:grid-cols-2"
        >
          <div className="flex items-center justify-center">
            <LandingPreviewSolarSystem />
          </div>

          <div
            className={`card-shine mx-auto flex w-full flex-col overflow-hidden rounded-[10.8px] border md:w-[95%] ${
              isLight
                ? "border-[#ECEDF5] bg-white shadow-[0_4px_24px_rgba(15,23,60,.06)]"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="relative aspect-[3/1.9] w-full shrink-0 overflow-hidden">
              <Image
                src="/founder.png"
                alt="Võ Đương — Nhà sáng lập VO DUONG AI"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center px-5 py-[19px] md:px-6 md:py-[23px]">
              <EditableRegion record={chrome} fields={FOUNDER_FIELDS} update={chrome.update}>
                <p className="text-[.98rem] font-extrabold leading-[1.5] md:text-[1.02rem]">
                  <span className={isLight ? "text-[#0B0F2E]" : "text-white"}>
                    &ldquo;{chrome.founderQuote}&rdquo;
                  </span>{" "}
                  <span className={isLight ? "text-[#5B21D6]" : "text-[#A78BFA]"}>{chrome.founderQuoteAttribution}</span>
                </p>
                <p className={`mt-2.5 text-[.83rem] leading-[1.6] ${isLight ? "text-[#5B6B85]" : "text-white/60"}`}>
                  {chrome.founderBioParagraph1}
                </p>
                <p className={`mt-2 text-[.83rem] leading-[1.6] ${isLight ? "text-[#5B6B85]" : "text-white/60"}`}>
                  {chrome.founderBioParagraph2}
                </p>
                <div
                  className={`mt-2.5 flex items-center gap-1.5 text-[.83rem] font-bold ${
                    isLight ? "text-[#5B21D6]" : "text-[#A78BFA]"
                  }`}
                >
                  <Crown className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                  {chrome.founderTitle}
                </div>
              </EditableRegion>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
