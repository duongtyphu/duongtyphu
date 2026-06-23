"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function FounderStory() {
  return (
    <section className="mesh-navy py-16 text-white md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid gap-10 md:grid-cols-[minmax(0,380px)_1fr] md:items-start"
        >
          <div className="relative mx-auto w-full max-w-[380px]">
            <div className="absolute -inset-8 -z-10 rounded-[40px] bg-brand-orange/10 blur-3xl" />
            <div className="absolute -inset-10 -z-10 rounded-[44px] bg-brand-violet/10 blur-3xl" />

            {/* blockchain-style orbiting nodes */}
            <svg
              className="pointer-events-none absolute -inset-6 -z-0 h-[calc(100%+3rem)] w-[calc(100%+3rem)]"
              viewBox="0 0 100 100"
              fill="none"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                stroke="rgba(91,140,255,0.25)"
                strokeWidth="0.3"
                strokeDasharray="1 3"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50%", originY: "50%" }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="38"
                stroke="rgba(255,122,0,0.2)"
                strokeWidth="0.3"
                strokeDasharray="0.5 2.5"
                animate={{ rotate: -360 }}
                transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50%", originY: "50%" }}
              />
              <motion.line
                x1="50"
                y1="4"
                x2="50"
                y2="12"
                stroke="rgba(91,140,255,0.4)"
                strokeWidth="0.4"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50%", originY: "50%" }}
              />
              <motion.line
                x1="50"
                y1="96"
                x2="50"
                y2="88"
                stroke="rgba(255,122,0,0.4)"
                strokeWidth="0.4"
                animate={{ rotate: -360 }}
                transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50%", originY: "50%" }}
              />
            </svg>

            {[
              { top: "0%", left: "8%", size: 8, color: "bg-brand-blue", delay: 0 },
              { top: "12%", left: "92%", size: 6, color: "bg-brand-orange", delay: 0.4 },
              { top: "50%", left: "-4%", size: 5, color: "bg-brand-violet", delay: 0.8 },
              { top: "88%", left: "94%", size: 7, color: "bg-brand-blue", delay: 1.2 },
              { top: "96%", left: "12%", size: 6, color: "bg-brand-orange", delay: 1.6 },
              { top: "38%", left: "98%", size: 5, color: "bg-brand-violet", delay: 2 },
            ].map((dot, i) => (
              <motion.span
                key={i}
                className={`absolute -z-0 rounded-full ${dot.color} shadow-[0_0_12px_2px_rgba(91,140,255,0.6)]`}
                style={{
                  top: dot.top,
                  left: dot.left,
                  width: dot.size,
                  height: dot.size,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: dot.delay,
                }}
              />
            ))}

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/50 backdrop-blur">
              <Image
                src="/founder.png"
                alt="Võ Đương — Founder, Võ Đương AI"
                fill
                className="object-cover object-top"
                sizes="380px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent" />
            </div>
            <p className="mt-5 text-center text-xs font-medium text-white/40">
              Đại diện Quốc gia khu vực Miền Nam — DigiU Việt Nam
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur md:p-10">
            <h2 className="text-2xl font-extrabold md:text-3xl">
              Tại sao tôi xây Võ Đương AI?
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/70 md:text-base">
              <p>
                Tôi là Võ Đương — nhà đầu tư, người ứng dụng AI thực chiến và
                hiện đang đồng hành phát triển cộng đồng DigiU Việt Nam với
                vai trò Đại diện Quốc gia khu vực Miền Nam.
              </p>
              <p>
                Trong nhiều năm làm việc, đầu tư và xây dựng hệ thống, tôi
                nhận ra rằng vấn đề lớn nhất không phải là thiếu công cụ hay
                thiếu khóa học. Vấn đề là có quá nhiều thông tin rời rạc, quá
                nhiều lựa chọn và rất ít lộ trình rõ ràng để người mới bắt
                đầu có thể áp dụng ngay vào thực tế.
              </p>
              <p>
                Tôi xây Võ Đương AI như một hệ sinh thái tập hợp những công
                cụ, tài liệu, kinh nghiệm và phương pháp mà chính tôi đang sử
                dụng mỗi ngày trong công việc, kinh doanh, AI và Affiliate
                Marketing.
              </p>
              <p className="font-semibold text-white">
                Mục tiêu của tôi rất đơn giản: giúp bạn học AI nhanh hơn, xây
                hệ thống hiệu quả hơn và từng bước tạo ra tài sản số bền vững
                cho tương lai.
              </p>
            </div>

            <p className="mt-8 font-serif text-lg italic text-white/80">
              — Võ Đương AI
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
