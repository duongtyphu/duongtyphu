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
          className="grid gap-10 md:grid-cols-[minmax(0,420px)_1fr] md:items-center"
        >
          <div className="relative mx-auto flex w-full max-w-[420px] flex-col">
            <div className="absolute -inset-8 -z-10 rounded-[40px] bg-brand-orange/10 blur-3xl" />
            <div className="absolute -inset-10 -z-10 rounded-[44px] bg-brand-violet/10 blur-3xl" />

            <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/50 backdrop-blur">
              <Image
                src="/founder.png"
                alt="Võ Đương — Founder, Võ Đương AI"
                width={1536}
                height={1024}
                className="h-auto w-full object-contain"
                sizes="420px"
                priority
              />

              {/* blockchain node badges overlaid on the photo */}
              <motion.div
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-brand-blue/30 bg-brand-navy/60 shadow-[0_0_18px_rgba(91,140,255,0.35)] backdrop-blur"
                animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                  <path d="M12 2 21 7V17L12 22 3 17V7L12 2Z" stroke="#5B8CFF" strokeWidth="1.2" />
                  <path d="M12 2V12M21 7L12 12M3 7L12 12" stroke="#5B8CFF" strokeWidth="0.8" opacity="0.6" />
                  <circle cx="12" cy="12" r="1.6" fill="#5B8CFF" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute left-4 top-10 flex h-9 w-9 items-center justify-center rounded-full border border-brand-orange/30 bg-brand-navy/60 shadow-[0_0_16px_rgba(255,122,0,0.3)] backdrop-blur"
                animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="1.2" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="1.2" />
                  <path d="M10 6.5H14M14 6.5V14M14 6.5C16 6.5 17.5 8 17.5 10V14" stroke="#FF7A00" strokeWidth="1" opacity="0.7" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-10 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-brand-violet/30 bg-brand-navy/60 shadow-[0_0_14px_rgba(91,140,255,0.3)] backdrop-blur"
                animate={{ y: [0, -6, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                  <circle cx="6" cy="6" r="2" stroke="#5B8CFF" strokeWidth="1.2" />
                  <circle cx="18" cy="6" r="2" stroke="#5B8CFF" strokeWidth="1.2" />
                  <circle cx="12" cy="18" r="2" stroke="#5B8CFF" strokeWidth="1.2" />
                  <path d="M7.7 7L10.6 16.4M16.3 7L13.4 16.4M8 6H16" stroke="#5B8CFF" strokeWidth="0.9" opacity="0.7" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-6 left-6 flex h-10 w-10 items-center justify-center rounded-full border border-brand-blue/30 bg-brand-navy/60 shadow-[0_0_16px_rgba(91,140,255,0.3)] backdrop-blur"
                animate={{ y: [0, 8, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
                    stroke="#5B8CFF"
                    strokeWidth="1.1"
                  />
                  <path d="M12 3v9M4 7.5L12 12M20 7.5L12 12" stroke="#5B8CFF" strokeWidth="0.7" opacity="0.6" />
                  <path d="M12 12v9" stroke="#5B8CFF" strokeWidth="0.7" opacity="0.6" />
                </svg>
              </motion.div>
            </div>

            <p className="mt-4 text-center text-xs font-medium text-white/40">
              Đại diện Quốc gia khu vực Miền Nam — DigiU Việt Nam
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8">
            <h2 className="text-xl font-extrabold md:text-2xl">
              Tại sao tôi xây Võ Đương AI?
            </h2>

            <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-white/70">
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

            <p className="mt-6 font-serif text-base italic text-white/80">
              — Võ Đương AI
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
