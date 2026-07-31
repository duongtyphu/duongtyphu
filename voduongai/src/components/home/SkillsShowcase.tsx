"use client";

import { useState } from "react";
import { Check, Play } from "lucide-react";
import { motion } from "framer-motion";
import { EditableRegion } from "@/components/home/EditableRegion";
import { useLandingChrome } from "@/components/home/LandingChromeContext";
import type { FieldConfig } from "@/lib/admin/fields";

const SKILLS_SHOWCASE_FIELDS: FieldConfig[] = [
  { key: "eyebrowBadge", label: "Badge nhỏ phía trên", type: "text", required: true },
  { key: "heading", label: "Tiêu đề section", type: "textarea", full: true, required: true },
  { key: "youtubeId", label: "YouTube video ID", type: "text", required: true },
];

const LEFT_SKILLS = [
  "Viết Prompt hiệu quả",
  "Tìm kiếm & kiểm chứng thông tin",
  "Viết nội dung với AI",
  "Thiết kế hình ảnh bằng AI",
  "Tạo video với AI",
];

const RIGHT_SKILLS = [
  "Phân tích dữ liệu bằng AI",
  "Tự động hóa công việc",
  "Xây dựng thương hiệu cá nhân",
  "Ứng dụng AI tạo thu nhập",
  "Tư duy và giải quyết vấn đề",
];

/**
 * "10 Kỹ năng AI cần có" section — sits between QuizAssessment and
 * ToolsIUse. A single card split 55/45 (text/video). Video is a
 * click-to-play facade (thumbnail + purple play button) so nothing
 * autoplays or shows a title/channel name on load; once clicked the real
 * YouTube iframe takes over and autoplays with minimal chrome.
 */
export function SkillsShowcase({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  const [playing, setPlaying] = useState(false);
  const chrome = useLandingChrome("skills-showcase");

  return (
    <section
      id="ky-nang-ai"
      className={`scroll-mt-24 py-[32.4px] md:py-[43.2px] ${isLight ? "bg-[#F6F7F9] text-[#0F172A]" : "text-white"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <EditableRegion record={chrome} fields={SKILLS_SHOWCASE_FIELDS} update={chrome.update} as="span">
            <span
              className={`inline-flex items-center rounded-full border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${
                isLight ? "border-[#E2E8F0] bg-white text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
              }`}
            >
              {chrome.eyebrowBadge}
            </span>
          </EditableRegion>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`card-shine grid overflow-hidden rounded-[10.8px] border lg:grid-cols-[55fr_45fr] ${
            isLight
              ? "border-[#ECEDF5] bg-white shadow-[0_4px_24px_rgba(15,23,60,.06)]"
              : "border-white/10 bg-white/[0.04]"
          }`}
        >
          <div className="flex flex-col justify-center p-6 md:p-8">
            <EditableRegion record={chrome} fields={SKILLS_SHOWCASE_FIELDS} update={chrome.update}>
              <h2
                className={`text-[1.4rem] font-extrabold leading-[1.35] tracking-[-.3px] md:text-[1.6rem] ${
                  isLight ? "text-[#0B0F2E]" : "text-white"
                }`}
              >
                {chrome.heading}
              </h2>
            </EditableRegion>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3.5">
              <ul className="flex flex-col gap-3.5">
                {LEFT_SKILLS.map((skill, i) => (
                  <li key={skill} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7C5CFC]">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <span
                      className={`text-[.88rem] font-semibold leading-snug ${
                        isLight ? "text-[#334155]" : "text-white/80"
                      }`}
                    >
                      {i + 1}. {skill}
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-3.5">
                {RIGHT_SKILLS.map((skill, i) => (
                  <li key={skill} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7C5CFC]">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <span
                      className={`text-[.88rem] font-semibold leading-snug ${
                        isLight ? "text-[#334155]" : "text-white/80"
                      }`}
                    >
                      {i + 6}. {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className={`relative aspect-video border-t bg-black lg:aspect-auto lg:border-l lg:border-t-0 ${
              isLight ? "border-[#ECEDF5]" : "border-white/10"
            }`}
          >
            {playing ? (
              <iframe
                src={`https://www.youtube.com/embed/${chrome.youtubeId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                title="Võ Đương Official"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 h-full w-full"
                aria-label="Phát video"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail, no remote pattern configured for next/image */}
                <img
                  src={`https://img.youtube.com/vi/${chrome.youtubeId}/maxresdefault.jpg`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#7C5CFC] shadow-[0_8px_30px_-4px_rgba(91,33,214,.7)] transition-transform group-hover:scale-110 md:h-20 md:w-20">
                  <Play className="ml-1 h-7 w-7 fill-white text-white md:h-8 md:w-8" strokeWidth={0} />
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
