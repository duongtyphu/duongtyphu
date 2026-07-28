"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const ITEMS = [
  {
    id: "hoc-vien-ai",
    icon: "/images/landing-preview/icons/eco-hoc-vien-ai.png",
    title: "Học viện AI",
    desc: "Lộ trình bài bản từ cơ bản đến nâng cao, học đi đôi với thực hành.",
  },
  {
    id: "companion-ai",
    icon: "/images/landing-preview/icons/eco-companion-ai.png",
    title: "Companion AI",
    desc: "AI Mentor cá nhân hóa, hiểu bạn, nhớ bạn và đồng hành cùng bạn mỗi ngày.",
  },
  {
    id: "ckos",
    icon: "/images/landing-preview/icons/eco-ckos.png",
    title: "Hệ tri thức AI (CKOS)",
    desc: "Thư viện tri thức chọn lọc, cập nhật liên tục, sẵn sàng cho mọi nhu cầu.",
  },
  {
    id: "ai-workspace",
    icon: "/images/landing-preview/icons/eco-ai-workspace.png",
    title: "AI Workspace",
    desc: "Nơi bạn thực hành, lưu trữ và triển khai ý tưởng thành sản phẩm thực tế.",
  },
  {
    id: "du-an-co-hoi",
    icon: "/images/landing-preview/icons/eco-du-an-co-hoi.png",
    title: "Dự án & Cơ hội",
    desc: "Cơ hội hợp tác, đầu tư và đồng hành trong các dự án công nghệ AI.",
  },
  {
    id: "premium",
    icon: "/images/landing-preview/icons/eco-premium.png",
    title: "Premium",
    desc: "Nội dung chuyên sâu, công cụ cao cấp và tư vấn 1:1 cùng chuyên gia.",
  },
];

const STEPS = [
  {
    icon: "/images/landing-preview/icons/roadmap-khoi-dau.png",
    title: "Khởi đầu",
    desc: "Hiểu AI là gì, tư duy đúng và chọn hướng đi phù hợp.",
  },
  {
    icon: "/images/landing-preview/icons/roadmap-hoc-thuc-hanh.png",
    title: "Học & Thực hành",
    desc: "Học kiến thức cốt lõi, thực hành với công cụ thực chiến.",
  },
  {
    icon: "/images/landing-preview/icons/roadmap-ung-dung-xay-dung.png",
    title: "Ứng dụng & Xây dựng",
    desc: "Ứng dụng vào công việc, xây hệ thống & sản phẩm của riêng bạn.",
  },
  {
    icon: "/images/landing-preview/icons/roadmap-phat-trien-mo-rong.png",
    title: "Phát triển & Mở rộng",
    desc: "Mở rộng thương hiệu, tự động hóa và tối ưu hiệu quả.",
  },
  {
    icon: "/images/landing-preview/icons/roadmap-tao-gia-tri-tai-san.png",
    title: "Tạo giá trị & Tài sản",
    desc: "Tạo thu nhập bền vững, đóng góp giá trị cho cộng đồng.",
  },
];

/**
 * "Hệ sinh thái" section — content ported verbatim from the now-removed
 * /landing-preview design preview, replacing the old pillar-card content.
 * Section background follows the same theme-aware pattern as IntroVideo
 * (light: bg-[#F6F7F9], dark: transparent) so the old page's background
 * stays one continuous, unbroken sweep behind every section.
 */
export function EcosystemPillars({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <section id="ecosystem" className={`py-[32.4px] md:py-[43.2px] ${isLight ? "bg-[#F6F7F9]" : ""}`}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 max-w-[760px] text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${
              isLight ? "border-[#E2E8F0] bg-white text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
            }`}
          >
            🌐 Hệ sinh thái
          </span>
          <h2 className={`mt-4 text-[1.4rem] font-extrabold tracking-[-.3px] md:text-[1.6rem] ${isLight ? "text-[#0B0F2E]" : "text-white"}`}>
            Tất cả những gì bạn cần, trong một hệ sinh thái
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-stretch justify-center gap-4 xl:flex-nowrap"
        >
          {ITEMS.map(({ id, icon, title, desc }) => (
            <div
              id={id}
              key={id}
              className={`card-shine flex w-[200px] scroll-mt-24 flex-1 flex-col items-center gap-3 rounded-[10.8px] border px-5 py-7 text-center ${
                isLight
                  ? "border-[#ECEDF5] bg-white shadow-[0_4px_20px_rgba(15,23,60,.05)]"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex h-[77px] w-[77px] items-center justify-center">
                <Image
                  src={icon}
                  alt={title}
                  width={400}
                  height={400}
                  className="h-full w-full object-contain drop-shadow-[0_8px_14px_rgba(15,23,60,.22)]"
                />
              </div>
              <h3 className={`text-[.9rem] font-bold leading-snug ${isLight ? "text-[#0B0F2E]" : "text-white"}`}>
                {title}
              </h3>
              <p className={`text-[.78rem] leading-[1.55] ${isLight ? "text-[#5B6B85]" : "text-white/60"}`}>
                {desc}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-stretch"
        >
          <div
            className={`card-shine flex flex-col justify-center rounded-[10.8px] border p-6 lg:w-[300px] lg:shrink-0 lg:p-8 ${
              isLight
                ? "border-[#ECEDF5] bg-white shadow-[0_4px_24px_rgba(15,23,60,.06)]"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <h3
              className={`text-[1.15rem] font-extrabold leading-[1.3] md:text-[1.25rem] ${
                isLight ? "text-[#0B0F2E]" : "text-white"
              }`}
            >
              Lộ trình học tập dành cho mọi người
            </h3>
            <p className={`mt-2.5 text-[.82rem] leading-[1.6] ${isLight ? "text-[#5B6B85]" : "text-white/60"}`}>
              Dù bạn là người mới bắt đầu hay đã có kinh nghiệm, chúng tôi có lộ trình phù hợp để bạn tiến xa
              hơn mỗi ngày.
            </p>
            <Link
              href="/login"
              className={`mt-4 inline-flex items-center justify-center gap-2 rounded-[10.8px] border-[1.5px] px-5 py-3 text-[.85rem] font-bold transition-colors ${
                isLight
                  ? "border-[#DADCF0] bg-white text-[#0B0F2E] hover:border-[#7C5CFC] hover:text-[#5b21c9]"
                  : "border-white/15 bg-white/5 text-white hover:border-[#7C5CFC] hover:text-[#A78BFA]"
              }`}
            >
              Xem tất cả lộ trình
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div
            className={`card-shine flex-1 rounded-[10.8px] border p-6 lg:p-7 ${
              isLight
                ? "border-[#ECEDF5] bg-white shadow-[0_4px_24px_rgba(15,23,60,.06)]"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="relative grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:items-start">
              <div
                className={`absolute left-[10%] right-[10%] top-[18px] hidden h-[2px] lg:block ${
                  isLight ? "bg-[#ECEDF5]" : "bg-white/10"
                }`}
              />
              {STEPS.map((s, i) => (
                <div key={s.title} className="group relative z-[1] px-1.5 text-center">
                  <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#7C5CFC] text-[.9rem] font-extrabold text-white transition-transform duration-300 ease-out group-hover:-translate-y-1.5">
                    {i + 1}
                  </div>
                  <div className="mx-auto mb-2.5 flex h-14 w-14 items-center justify-center">
                    <Image
                      src={s.icon}
                      alt={s.title}
                      width={400}
                      height={400}
                      className="h-full w-full object-contain drop-shadow-[0_6px_12px_rgba(15,23,60,.15)]"
                    />
                  </div>
                  <h4 className={`text-[.92rem] font-extrabold ${isLight ? "text-[#0B0F2E]" : "text-white"}`}>
                    {s.title}
                  </h4>
                  <p className={`mt-2 text-[.78rem] leading-[1.55] ${isLight ? "text-[#5B6B85]" : "text-white/60"}`}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
