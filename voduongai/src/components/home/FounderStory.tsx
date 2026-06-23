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
          className="grid gap-10 md:grid-cols-[minmax(0,380px)_1fr] md:items-stretch"
        >
          <div className="relative mx-auto flex w-full max-w-[380px] flex-col">
            <div className="absolute -inset-8 -z-10 rounded-[40px] bg-brand-orange/10 blur-3xl" />
            <div className="absolute -inset-10 -z-10 rounded-[44px] bg-brand-violet/10 blur-3xl" />

            <div className="relative aspect-[4/5] w-full flex-1 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/50 backdrop-blur md:aspect-auto">
              <Image
                src="/founder.png"
                alt="Võ Đương — Founder, Võ Đương AI"
                fill
                className="object-cover object-top"
                sizes="380px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-brand-navy/0 to-brand-navy/10" />

              {/* hidden tech/blockchain badges overlaid on the photo */}
              <motion.div
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-brand-blue/30 bg-brand-navy/60 shadow-[0_0_18px_rgba(91,140,255,0.35)] backdrop-blur"
                animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6">
                  <circle cx="24" cy="24" r="20" stroke="#5B8CFF" strokeWidth="1.3" />
                  <path
                    d="M14 20 Q19 15 24 20 Q29 25 34 20"
                    stroke="#5B8CFF"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="14" cy="20" r="1.6" fill="#5B8CFF" />
                  <circle cx="24" cy="20" r="1.6" fill="#5B8CFF" />
                  <circle cx="34" cy="20" r="1.6" fill="#5B8CFF" />
                  <path d="M24 20v10" stroke="#5B8CFF" strokeWidth="1.2" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute left-4 top-10 flex h-9 w-9 items-center justify-center rounded-full border border-brand-orange/30 bg-brand-navy/60 shadow-[0_0_16px_rgba(255,122,0,0.3)] backdrop-blur"
                animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                  <path
                    d="M12 2 20 6.5V17.5L12 22 4 17.5V6.5L12 2Z"
                    stroke="#FF7A00"
                    strokeWidth="1.3"
                  />
                  <path d="M12 2V22M4 6.5L20 17.5M20 6.5L4 17.5" stroke="#FF7A00" strokeWidth="0.7" opacity="0.5" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-10 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-brand-violet/30 bg-brand-navy/60 shadow-[0_0_14px_rgba(91,140,255,0.3)] backdrop-blur"
                animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="h-2 w-2 rounded-full bg-brand-violet" />
              </motion.div>

              <motion.div
                className="absolute bottom-6 left-6 flex h-10 w-10 items-center justify-center rounded-full border border-brand-blue/30 bg-brand-navy/60 shadow-[0_0_16px_rgba(91,140,255,0.3)] backdrop-blur"
                animate={{ y: [0, 8, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <rect x="4" y="4" width="6" height="6" rx="1" stroke="#5B8CFF" strokeWidth="1.2" />
                  <rect x="14" y="4" width="6" height="6" rx="1" stroke="#5B8CFF" strokeWidth="1.2" />
                  <rect x="4" y="14" width="6" height="6" rx="1" stroke="#5B8CFF" strokeWidth="1.2" />
                  <rect x="14" y="14" width="6" height="6" rx="1" stroke="#5B8CFF" strokeWidth="1.2" />
                  <path d="M10 7H14M7 10V14M17 10V14M10 17H14" stroke="#5B8CFF" strokeWidth="1" opacity="0.6" />
                </svg>
              </motion.div>

              <div className="absolute inset-x-5 bottom-5 z-10">
                <p className="text-center text-xs font-medium text-white/60">
                  Đại diện Quốc gia khu vực Miền Nam — DigiU Việt Nam
                </p>
              </div>
            </div>
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
