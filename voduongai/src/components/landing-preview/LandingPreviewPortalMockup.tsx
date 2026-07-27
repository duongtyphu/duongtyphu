"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  HeartHandshake,
  Library,
  GraduationCap,
  Cpu,
  Rocket,
  Search,
  Bell,
  type LucideIcon,
} from "lucide-react";

// Compact, self-contained re-creation of the animated portal dashboard
// mockup (see src/components/home/PortalPreview.tsx for the original,
// full-width version — that file is part of the live homepage and is never
// edited here). Uses container queries (`@lg:`) instead of viewport
// breakpoints so the sidebar/columns adapt to the width of the box this
// mockup is placed in, not the browser viewport.
const sidebar: { label: string; icon: LucideIcon }[] = [
  { label: "Trang chủ Học viện", icon: Home },
  { label: "Companion", icon: HeartHandshake },
  { label: "Hệ tri thức AI (CKOS)", icon: Library },
  { label: "Học viện AI", icon: GraduationCap },
  { label: "AI Workspace", icon: Cpu },
  { label: "Dự án & Cơ hội", icon: Rocket },
];

type Badge = "FREE" | "PREMIUM";

const badgeStyle: Record<Badge, string> = {
  FREE: "bg-emerald-50 text-emerald-700",
  PREMIUM: "bg-violet-50 text-violet-700",
};

const cards: { title: string; badge: Badge; desc: string }[] = [
  { title: "AI Toolkit", badge: "FREE", desc: "Bắt đầu học và ứng dụng AI từ con số 0." },
  { title: "Thư viện Prompt", badge: "FREE", desc: "200+ Prompt thực chiến cho công việc." },
  { title: "Affiliate Roadmap", badge: "FREE", desc: "Lộ trình cho người mới bắt đầu." },
  { title: "VO DUONG AI Academy", badge: "PREMIUM", desc: "Khoá học AI theo lộ trình thực chiến." },
];

const tabs = ["Tất cả", "AI", "Affiliate", "Prompt"];

// Cursor visits the sidebar, the search bar, then two resource cards — each
// stop lands a soft "click" ripple and lights up the element under it.
const CURSOR_STOPS = [
  { top: "18%", left: "10%" },
  { top: "34%", left: "50%" },
  { top: "64%", left: "27%" },
  { top: "64%", left: "76%" },
] as const;
const CURSOR_STOP_MS = 2600;
const CURSOR_TRAVEL_S = 1.1;

export function LandingPreviewPortalMockup() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % CURSOR_STOPS.length);
    }, CURSOR_STOP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="@container flex h-full flex-col bg-[#0B1220]">
      <div className="relative flex h-full flex-col">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

        {/* Browser chrome bar */}
        <div className="relative flex shrink-0 items-center gap-1.5 border-b border-white/10 bg-[#0B1220] px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
          <span className="h-2 w-2 rounded-full bg-green-400/80" />
          <span className="ml-2.5 flex items-center gap-1.5 text-[11px] font-medium text-white/50">
            <span className="text-emerald-400">🔒</span>
            voduongai.com/portal
          </span>
        </div>

        {/* Portal surface */}
        <div className="relative flex flex-1 text-slate-900" style={{ background: "#F6F7F9" }}>
          {/* Sidebar — only when the box is wide enough to fit it */}
          <div className="hidden w-[168px] shrink-0 space-y-1 border-r border-slate-200/80 bg-white/70 p-3 @lg:block">
            {sidebar.map(({ label, icon: Icon }, i) => {
              const active = i === 0 || (step === 0 && i === 3);
              return (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[10.5px] font-medium leading-tight transition-colors duration-300 ${
                    active ? "bg-blue-50 text-blue-700" : "text-slate-500"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  {label}
                </div>
              );
            })}
          </div>

          {/* Main content */}
          <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Chào mừng trở lại</h3>
                <p className="mt-0.5 text-[10px] text-slate-500">Bạn muốn bắt đầu với tài nguyên nào?</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400">
                  <Bell className="h-3 w-3" strokeWidth={2} />
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-violet text-[9px] font-bold text-white">
                  VĐ
                </span>
              </div>
            </div>

            {/* Search bar */}
            <div
              className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] transition-all duration-300 ${
                step === 1
                  ? "border-brand-blue/50 bg-white text-slate-700 shadow-[0_0_0_3px_rgba(37,99,235,.12)]"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              <span>Tìm kiếm prompt, công cụ...</span>
            </div>

            {/* Category tabs */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {tabs.map((t, i) => (
                <span
                  key={t}
                  className={`rounded-full px-2.5 py-1 text-[9.5px] font-semibold ${
                    i === 0
                      ? "bg-gradient-to-r from-brand-blue to-brand-violet text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Resource cards */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {cards.map((c, i) => {
                const active = (i === 0 && step === 2) || (i === 1 && step === 3);
                return (
                  <div
                    key={c.title}
                    className={`rounded-xl border p-2.5 shadow-sm transition-all duration-300 ${
                      active ? "-translate-y-0.5 border-brand-blue/40 bg-white shadow-md" : "border-slate-200 bg-white"
                    }`}
                  >
                    <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[7.5px] font-bold tracking-wide ${badgeStyle[c.badge]}`}>
                      {c.badge}
                    </span>
                    <p className="mt-1.5 text-[10.5px] font-bold leading-tight text-slate-900">{c.title}</p>
                    <p className="mt-1 text-[9px] leading-snug text-slate-500">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulated cursor */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute z-30 hidden @lg:block"
            animate={{ top: CURSOR_STOPS[step].top, left: CURSOR_STOPS[step].left }}
            transition={{ duration: CURSOR_TRAVEL_S, ease: "easeInOut" }}
          >
            <motion.span
              key={step}
              className="absolute -inset-2.5 rounded-full border-2 border-brand-blue/60"
              initial={{ opacity: 0.9, scale: 0.3 }}
              animate={{ opacity: 0, scale: 1.7 }}
              transition={{ duration: 0.55, delay: CURSOR_TRAVEL_S, ease: "easeOut" }}
            />
            <svg width="16" height="16" viewBox="0 0 24 24" className="-translate-x-1 -translate-y-1 drop-shadow-[0_4px_8px_rgba(0,0,0,.35)]">
              <path
                d="M4 2 L4 20 L9 16 L12 22 L15 20.5 L12 14.5 L18 14.5 Z"
                fill="white"
                stroke="#0f172a"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
