"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wrench, Wand2, Rocket, FolderOpen, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";

const displayUrl = `${siteConfig.url.replace(/^https?:\/\//, "")}/portal/hocvienai`;

const navItems = ["Tổng quan", "Học viện AI", "Affiliate Hub", "Thư viện công cụ", "Cộng đồng"];

const tiles = [
  { label: "Bộ công cụ AI", icon: Wrench },
  { label: "Thư viện Prompt", icon: Wand2 },
  { label: "VO DUONG AI Academy", icon: Rocket },
  { label: "Tài nguyên miễn phí", icon: FolderOpen },
];

const floatingBadges = [
  {
    title: "200+",
    subtitle: "Prompt AI",
    className: "left-[-6%] top-[8%] md:left-[-9%]",
    duration: 5,
  },
  {
    title: "50+",
    subtitle: "Công cụ AI",
    className: "right-[-5%] top-[2%] md:right-[-8%]",
    duration: 6.5,
  },
  {
    title: "100+",
    subtitle: "Tài nguyên",
    className: "left-[-7%] bottom-[18%] md:left-[-10%]",
    duration: 7,
  },
  {
    title: "Affiliate Hub",
    subtitle: undefined,
    className: "right-[-4%] bottom-[26%] md:right-[-7%]",
    duration: 4.5,
  },
  {
    title: "AI Academy",
    subtitle: undefined,
    className: "left-[10%] bottom-[-6%] md:left-[14%]",
    duration: 5.5,
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-white md:pt-20 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-[1.2fr_1fr] md:items-center">
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
              href="/portal/hetrithucai"
              className="rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:opacity-90"
            >
              Học AI miễn phí
            </Link>
            <Link
              href="/portal/hocvienai"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
            >
              Khám phá Học viện AI →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 4 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative [perspective:1200px]"
        >
          {/* Mesh gradient + glow behind dashboard */}
          <div className="absolute -inset-10 -z-10 rounded-[40px] bg-brand-blue/20 blur-[70px]" />
          <div className="absolute -inset-16 -z-10 rounded-[44px] bg-[radial-gradient(circle_at_30%_20%,rgba(91,140,255,0.25),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.18),transparent_55%)] blur-2xl" />

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-[26px] border border-white/12 bg-white/[0.045] p-3 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_0_90px_-10px_rgba(37,99,235,0.45),0_50px_120px_-30px_rgba(0,0,0,0.65)] md:p-3.5"
          >
            {/* Light reflection */}
            <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
            <div className="pointer-events-none absolute -inset-px rounded-[30px] ring-1 ring-inset ring-white/10" />

            <div className="relative flex items-center gap-1.5 border-b border-white/10 px-2.5 pb-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <span className="ml-3 text-xs font-medium text-white">
                {displayUrl}
              </span>
            </div>
            <div className="relative flex gap-3 p-3.5">
              <div className="hidden w-28 flex-shrink-0 space-y-1.5 sm:block">
                {navItems.map((m, i) => (
                  <div
                    key={m}
                    className={`cursor-pointer rounded-lg px-2.5 py-2 text-[11px] font-medium transition hover:bg-white/10 hover:text-white ${
                      i === 0 ? "bg-white/10 text-white" : "text-white"
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>
              <div className="grid flex-1 grid-cols-2 gap-3">
                {tiles.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="card-shine rounded-xl border border-white/10 bg-white/[0.035] p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue/25 to-brand-violet/15 text-brand-violet">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">{label}</p>
                    <span className="mt-2 inline-flex rounded-full bg-brand-orange/15 px-2 py-0.5 text-[10px] font-semibold text-brand-orange">
                      Miễn phí
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {floatingBadges.map((badge, i) => (
            <motion.div
              key={badge.title}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: badge.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
              whileHover={{ y: -12 }}
              className={`absolute z-20 hidden cursor-default rounded-[20px] border border-white/15 bg-white/[0.08] px-4 py-2.5 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md transition-shadow hover:shadow-[0_0_30px_-2px_rgba(91,140,255,0.5)] sm:block ${badge.className}`}
            >
              {badge.subtitle ? (
                <>
                  <p className="text-base font-extrabold leading-none text-white">{badge.title}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/70">{badge.subtitle}</p>
                </>
              ) : (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Sparkles className="h-3.5 w-3.5 text-brand-violet" strokeWidth={2} />
                  {badge.title}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
