"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  Rocket,
  Users,
  Wand2,
  Wrench,
  FolderOpen,
  Crown,
  MessageCircle,
  Search,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/site";

const displayUrl = `${siteConfig.url.replace(/^https?:\/\//, "")}/portal`;

const sidebar: { label: string; icon: LucideIcon }[] = [
  { label: "Tổng quan", icon: LayoutDashboard },
  { label: "Học viện AI", icon: GraduationCap },
  { label: "VO DUONG AI Academy", icon: Rocket },
  { label: "Tiếp thị liên kết", icon: Users },
  { label: "Thư viện Prompt", icon: Wand2 },
  { label: "Thư viện Công cụ", icon: Wrench },
  { label: "Tài nguyên miễn phí", icon: FolderOpen },
  { label: "Sản phẩm Premium", icon: Crown },
  { label: "Cộng đồng", icon: MessageCircle },
];

type Badge = "FREE" | "PREMIUM" | "AFFILIATE";

const badgeStyle: Record<Badge, string> = {
  FREE: "bg-emerald-400/15 text-emerald-300",
  PREMIUM: "bg-brand-violet/15 text-brand-violet",
  AFFILIATE: "bg-brand-orange/15 text-brand-orange",
};

const cards: { title: string; badge: Badge; desc: string }[] = [
  {
    title: "AI Toolkit",
    badge: "FREE",
    desc: "Bộ công cụ bắt đầu học và ứng dụng AI từ con số 0.",
  },
  {
    title: "Thư viện Prompt",
    badge: "FREE",
    desc: "200+ Prompt thực chiến cho công việc, marketing và kinh doanh.",
  },
  {
    title: "Affiliate Roadmap",
    badge: "FREE",
    desc: "Lộ trình từng bước cho người mới bắt đầu tiếp thị liên kết.",
  },
  {
    title: "Thư viện Công cụ",
    badge: "AFFILIATE",
    desc: "50+ công cụ AI, thiết kế, video, website và tự động hoá.",
  },
  {
    title: "VO DUONG AI Academy",
    badge: "PREMIUM",
    desc: "Khoá học AI & Affiliate theo lộ trình thực chiến.",
  },
  {
    title: "Content Calendar",
    badge: "FREE",
    desc: "Kế hoạch nội dung 30 ngày để xây thương hiệu cá nhân.",
  },
];

const tabs = ["Tất cả", "AI", "Affiliate", "Prompt", "Công cụ", "Tài nguyên", "Premium"];

const highlights = [
  "AI Toolkit",
  "Affiliate Checklist",
  "Thư viện Công cụ",
];

export function PortalPreview() {
  return (
    <section className="py-9 text-white md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center md:max-w-none"
        >
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Trải nghiệm bên trong Học viện AI
          </h2>
          <p className="mt-3 text-white md:whitespace-nowrap">
            Một không gian duy nhất để học AI, khám phá công cụ, lưu trữ tài
            nguyên, xây hệ thống và từng bước tạo tài sản số.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/60 md:max-w-none md:whitespace-nowrap">
            Khám phá tài nguyên, công cụ và lộ trình được sắp xếp rõ ràng
            trong một dashboard duy nhất.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto mt-10 w-full max-w-[1040px] [perspective:1600px] md:mt-14"
        >
          {/* Mesh gradient + glow behind dashboard */}
          <div className="absolute -inset-10 -z-10 rounded-[48px] bg-brand-blue/15 blur-[80px]" />
          <div className="absolute -inset-16 -z-10 rounded-[52px] bg-[radial-gradient(circle_at_20%_10%,rgba(91,140,255,0.22),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(37,99,235,0.16),transparent_55%)] blur-2xl" />

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.01 }}
            style={{ transform: "rotateX(1deg)" }}
            className="group relative overflow-hidden rounded-[32px] border border-white/12 bg-white/[0.045] shadow-[0_60px_140px_-40px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_0_100px_-10px_rgba(37,99,235,0.4),0_60px_140px_-40px_rgba(0,0,0,0.7)]"
          >
            {/* Light reflection + ring */}
            <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
            <div className="pointer-events-none absolute -inset-px rounded-[32px] ring-1 ring-inset ring-white/10" />

            {/* Window bar */}
            <div className="relative flex items-center gap-1.5 border-b border-white/10 px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <span className="ml-3 text-xs font-medium text-white/60">
                {displayUrl}
              </span>
            </div>

            <div className="relative flex">
              {/* Sidebar */}
              <div className="hidden w-52 flex-shrink-0 space-y-1 border-r border-white/10 bg-black/10 p-4 lg:block">
                {sidebar.map(({ label, icon: Icon }, i) => (
                  <div
                    key={label}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition hover:bg-white/10 hover:text-white ${
                      i === 0 ? "bg-white/10 text-white" : "text-white/70"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="min-w-0 flex-1 p-5 md:p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">Chào mừng trở lại</h3>
                    <p className="mt-0.5 text-xs text-white/60">
                      Bạn muốn bắt đầu với tài nguyên nào hôm nay?
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                      Free Member
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70">
                      <Bell className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-violet text-xs font-bold text-white">
                      VĐ
                    </span>
                  </div>
                </div>

                {/* Search bar */}
                <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/50 transition focus-within:border-brand-blue/40 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]">
                  <Search className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span>Tìm kiếm prompt, công cụ, tài nguyên...</span>
                </div>

                {/* Category tabs */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {tabs.map((t, i) => (
                    <span
                      key={t}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                        i === 0
                          ? "bg-gradient-to-r from-brand-blue to-brand-violet text-white shadow-md shadow-brand-blue/30"
                          : "border border-white/12 bg-white/[0.02] text-white/70"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Resource cards + side panel */}
                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_220px]">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {cards.map((c) => (
                      <div
                        key={c.title}
                        className="card-shine rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:bg-white/[0.06]"
                      >
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide ${badgeStyle[c.badge]}`}
                        >
                          {c.badge}
                        </span>
                        <p className="mt-2.5 text-sm font-bold text-white">{c.title}</p>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">
                          {c.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Right widgets */}
                  <div className="hidden flex-col gap-3 lg:flex">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
                        Đang học tiếp
                      </p>
                      <p className="mt-2 text-xs font-semibold text-white">
                        Prompt Engineering cơ bản
                      </p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-brand-blue to-brand-violet" />
                      </div>
                      <p className="mt-1.5 text-[10px] text-white/50">42% hoàn thành</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
                        Tài nguyên nổi bật
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {highlights.map((h) => (
                          <li key={h} className="text-xs text-white/75">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-brand-violet/20 bg-brand-violet/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-violet">
                        Gợi ý hôm nay
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-white/75">
                        Bắt đầu với AI Toolkit nếu bạn là người mới.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center gap-3 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/portal/hocvienai"
              className="inline-flex rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:opacity-90"
            >
              Truy cập Học viện
            </Link>
            <Link
              href="/portal/duan-cohoi"
              className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
            >
              Xem kho tài nguyên
            </Link>
          </div>
          <p className="text-xs text-white/50">
            Miễn phí bắt đầu. Nâng cấp khi bạn cần nhiều tài nguyên chuyên sâu hơn.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
