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
          className="grid gap-10 md:grid-cols-[minmax(0,280px)_1fr] md:items-start"
        >
          <div className="relative mx-auto w-full max-w-[280px]">
            <div className="absolute -inset-4 -z-10 rounded-[32px] bg-brand-orange/10 blur-2xl" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur">
              <Image
                src="/founder.png"
                alt="Võ Đương — Founder, Võ Đương AI"
                fill
                className="object-cover"
                sizes="280px"
                priority
              />
            </div>
            <p className="mt-4 text-center text-xs font-medium text-white/40">
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
