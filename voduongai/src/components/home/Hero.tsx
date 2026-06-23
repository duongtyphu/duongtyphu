"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-white md:pt-20 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-violet">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            Thương hiệu cá nhân · Hệ sinh thái AI
          </span>

          <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            AI không thay thế bạn.{" "}
            <span className="bg-gradient-to-r from-brand-violet to-brand-orange bg-clip-text text-transparent">
              Người biết dùng AI sẽ thay thế người không biết dùng AI.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white">
            Tôi là Võ Đương AI. Tôi chia sẻ những công cụ, tài liệu, lộ trình và
            hệ thống giúp bạn học AI, xây thương hiệu cá nhân, làm Affiliate
            Marketing và tạo tài sản số bền vững.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/portal/resources"
              className="rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:opacity-90"
            >
              Nhận AI Toolkit miễn phí
            </Link>
            <Link
              href="/portal"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
            >
              Khám phá Portal →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 4 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative [perspective:1200px]"
        >
          <div className="absolute -inset-6 -z-10 rounded-[32px] bg-brand-orange/10 blur-3xl" />
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <span className="ml-3 text-xs font-medium text-white">
                voduongai.com/portal
              </span>
            </div>
            <div className="flex gap-3 p-4">
              <div className="hidden w-28 flex-shrink-0 space-y-1.5 sm:block">
                {["Tổng quan", "AI Academy", "Affiliate Hub", "Thư viện công cụ", "Cộng đồng"].map(
                  (m, i) => (
                    <div
                      key={m}
                      className={`cursor-pointer rounded-lg px-2.5 py-2 text-[11px] font-medium transition hover:bg-white/10 hover:text-white ${
                        i === 0
                          ? "bg-white/10 text-white"
                          : "text-white"
                      }`}
                    >
                      {m}
                    </div>
                  ),
                )}
              </div>
              <div className="grid flex-1 grid-cols-2 gap-3">
                {["Bộ công cụ AI", "Thư viện Prompt", "VDAI Academy", "Tài nguyên miễn phí"].map((m) => (
                  <div
                    key={m}
                    className="card-shine rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="h-7 w-7 rounded-lg gradient-surface" />
                    <p className="mt-3 text-sm font-semibold text-white">{m}</p>
                    <span className="mt-2 inline-flex rounded-full bg-brand-orange/15 px-2 py-0.5 text-[10px] font-semibold text-brand-orange">
                      Miễn phí
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
