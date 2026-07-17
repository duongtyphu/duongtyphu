"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { RevealText } from "@/components/home/RevealText";

export function FounderStory() {
  return (
    <section className="overflow-hidden py-9 text-white md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 md:grid-cols-[minmax(0,520px)_1fr] md:items-center"
        >
          <div className="relative mx-auto flex w-full max-w-[520px] flex-col">
            <div className="absolute -inset-12 -z-10 rounded-[52px] bg-brand-blue/25 blur-3xl" />
            <div className="absolute -inset-16 -z-10 rounded-[56px] bg-brand-violet/20 blur-[80px]" />
            <div className="absolute -inset-8 -z-10 rounded-[44px] bg-brand-orange/10 blur-2xl" />

            <div className="relative w-full overflow-hidden rounded-[36px] border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_0_70px_-5px_rgba(37,99,235,0.55),0_40px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur">
              <Image
                src="/founder.png"
                alt="Võ Đương — Người sáng lập, Võ Đương AI"
                width={1536}
                height={1024}
                className="h-auto w-full object-contain pointer-events-none select-none"
                sizes="520px"
                priority
                draggable={false}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center gap-x-10 gap-y-16 overflow-hidden opacity-[0.08]"
                style={{ transform: "rotate(-24deg) scale(1.4)" }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap text-sm font-extrabold uppercase tracking-widest text-white"
                  >
                    VO DUONG AI
                  </span>
                ))}
              </div>
              <div className="absolute inset-0 rounded-[36px] ring-1 ring-inset ring-white/10" />
            </div>

            <div className="mt-5 flex justify-center">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-orange/30 bg-gradient-to-r from-brand-orange/15 via-white/[0.04] to-brand-blue/15 px-5 py-2 shadow-[0_0_24px_rgba(255,122,0,0.15)] backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
                </span>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                  Đại diện Quốc gia khu vực Miền Nam
                  <span className="text-red-500"> — DigiU Việt Nam</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur md:p-8">
            <h2 className="text-xl font-extrabold md:text-2xl">
              <RevealText>Tại sao tôi xây Võ Đương AI?</RevealText>
            </h2>

            <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-white">
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

            <p className="mt-6 inline-flex items-center gap-2 text-base font-extrabold tracking-wide">
              <span className="h-px w-6 bg-brand-blue" />
              <span className="text-brand-blue">
                Nhà sáng lập Võ Đương AI
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
