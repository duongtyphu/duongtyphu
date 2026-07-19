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
  Crown,
  Compass,
  Search,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/site";
import { RevealText } from "@/components/home/RevealText";

const displayUrl = `${siteConfig.url.replace(/^https?:\/\//, "")}/portal`;

// Mirrors the real portalNavSections order (src/lib/portal/hubs.ts) so this
// preview reads as the actual sidebar, not a stand-in.
const sidebar: { label: string; icon: LucideIcon }[] = [
  { label: "Trang chủ Học viện", icon: Home },
  { label: "Companion", icon: HeartHandshake },
  { label: "Hệ tri thức AI (CKOS)", icon: Library },
  { label: "Học viện AI", icon: GraduationCap },
  { label: "AI Workspace", icon: Cpu },
  { label: "Dự án & Cơ hội", icon: Rocket },
  { label: "Premium", icon: Crown },
  { label: "Hành trình của tôi", icon: Compass },
];

type Badge = "FREE" | "PREMIUM" | "AFFILIATE";

const badgeStyle: Record<Badge, string> = {
  FREE: "bg-emerald-50 text-emerald-700",
  PREMIUM: "bg-violet-50 text-violet-700",
  AFFILIATE: "bg-orange-50 text-orange-700",
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

const highlights = ["AI Toolkit", "Affiliate Checklist", "Thư viện Công cụ"];

// A short "someone is actually using this" loop: the cursor visits the
// sidebar, the search bar, two resource cards, then the side widget, each
// stop landing a soft "click" ripple and lighting up the real element under
// it. Desktop-only — the mobile layout doesn't render this panel shape.
const CURSOR_STOPS = [
  { top: "21%", left: "9%" },
  { top: "35%", left: "47%" },
  { top: "66%", left: "19%" },
  { top: "66%", left: "53%" },
  { top: "58%", left: "89%" },
] as const;
const CURSOR_STOP_MS = 2600;
const CURSOR_TRAVEL_S = 1.1;

export function PortalPreview({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % CURSOR_STOPS.length);
    }, CURSOR_STOP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="trai-nghiem-hoc-vien-ai"
      className={`relative isolate scroll-mt-24 overflow-hidden py-9 md:py-12 ${isLight ? "bg-[#F6F7F9] text-[#0F172A]" : "text-white"}`}
    >
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center md:max-w-none"
        >
          <span
            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] backdrop-blur-md ${
              isLight ? "border-[#E2E8F0] bg-white text-[#54637A]" : "border-white/15 bg-white/5 text-white/70"
            }`}
          >
            🧭 Khám phá Học Viện
          </span>
          <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">
            <RevealText>
              Trải nghiệm bên trong <span className="text-brand-orange">Học viện AI</span>
            </RevealText>
          </h2>
          <p className={`mt-3 md:whitespace-nowrap ${isLight ? "text-[#334155]" : "text-white"}`}>
            Một không gian duy nhất để học AI, khám phá công cụ, lưu trữ tài
            nguyên, xây hệ thống và từng bước tạo tài sản số.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-10 w-full max-w-[1040px] [perspective:1600px] md:mt-14"
        >
          {/* Mesh gradient + glow behind dashboard */}
          {!isLight && (
            <>
              <div className="absolute -inset-10 -z-10 rounded-[48px] bg-brand-blue/15 blur-[80px]" />
              <div className="absolute -inset-16 -z-10 rounded-[52px] bg-[radial-gradient(circle_at_20%_10%,rgba(91,140,255,0.22),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(37,99,235,0.16),transparent_55%)] blur-2xl" />
            </>
          )}

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.01 }}
            style={{ transform: "rotateX(1deg)" }}
            className={`group relative overflow-hidden rounded-[32px] border border-white/12 bg-[#0B1220] transition-shadow duration-300 ${
              isLight
                ? "shadow-[0_30px_70px_-35px_rgba(15,23,42,0.35)] hover:shadow-[0_0_70px_-15px_rgba(37,99,235,0.35),0_30px_70px_-35px_rgba(15,23,42,0.35)]"
                : "shadow-[0_60px_140px_-40px_rgba(0,0,0,0.7)] hover:shadow-[0_0_100px_-10px_rgba(37,99,235,0.4),0_60px_140px_-40px_rgba(0,0,0,0.7)]"
            }`}
          >
            {/* Light reflection + ring */}
            <div className="pointer-events-none absolute inset-0 z-10 rounded-[32px] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
            <div className="pointer-events-none absolute -inset-px z-10 rounded-[32px] ring-1 ring-inset ring-white/10" />

            {/* Browser chrome bar */}
            <div className="relative flex items-center gap-1.5 border-b border-white/10 bg-[#0B1220] px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <span className="ml-3 flex items-center gap-1.5 text-xs font-medium text-white/50">
                <span className="text-emerald-400">🔒</span>
                {displayUrl}
              </span>
            </div>

            {/* Real portal surface — light theme, matches the actual product */}
            <div className="mesh-light relative flex text-slate-900">
              {/* Sidebar */}
              <div className="hidden w-56 flex-shrink-0 space-y-1 border-r border-slate-200/80 bg-white/70 p-4 lg:block">
                {sidebar.map(({ label, icon: Icon }, i) => {
                  const active = i === 0 || (step === 0 && i === 3);
                  return (
                    <div
                      key={label}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-300 ${
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                      {label}
                    </div>
                  );
                })}
              </div>

              {/* Main content */}
              <div className="min-w-0 flex-1 p-5 md:p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Chào mừng trở lại</h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Bạn muốn bắt đầu với tài nguyên nào hôm nay?
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                      Free Member
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400">
                      <Bell className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-violet text-xs font-bold text-white">
                      VĐ
                    </span>
                  </div>
                </div>

                {/* Search bar */}
                <div
                  className={`mt-5 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm transition-all duration-300 ${
                    step === 1
                      ? "border-brand-blue/50 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.12)] text-slate-700"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
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
                          : "border border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Resource cards + side panel */}
                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_220px]">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {cards.map((c, i) => {
                      const active = (i === 0 && step === 2) || (i === 2 && step === 3);
                      return (
                        <div
                          key={c.title}
                          className={`rounded-2xl border p-4 shadow-sm transition-all duration-300 ${
                            active
                              ? "-translate-y-1 border-brand-blue/40 bg-white shadow-lg"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide ${badgeStyle[c.badge]}`}
                          >
                            {c.badge}
                          </span>
                          <p className="mt-2.5 text-sm font-bold text-slate-900">{c.title}</p>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                            {c.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right widgets */}
                  <div className="hidden flex-col gap-3 lg:flex">
                    <div
                      className={`rounded-2xl border p-4 shadow-sm transition-all duration-300 ${
                        step === 4 ? "border-brand-blue/40 bg-white shadow-lg" : "border-slate-200 bg-white"
                      }`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Đang học tiếp
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-900">
                        Prompt Engineering cơ bản
                      </p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-brand-blue to-brand-violet" />
                      </div>
                      <p className="mt-1.5 text-[10px] text-slate-400">42% hoàn thành</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Tài nguyên nổi bật
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {highlights.map((h) => (
                          <li key={h} className="text-xs text-slate-600">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">
                        Gợi ý hôm nay
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-violet-900/80">
                        Bắt đầu với AI Toolkit nếu bạn là người mới.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated cursor — a person "using" the portal */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute z-30 hidden lg:block"
                animate={{ top: CURSOR_STOPS[step].top, left: CURSOR_STOPS[step].left }}
                transition={{ duration: CURSOR_TRAVEL_S, ease: "easeInOut" }}
              >
                <motion.span
                  key={step}
                  className="absolute -inset-3 rounded-full border-2 border-brand-blue/60"
                  initial={{ opacity: 0.9, scale: 0.3 }}
                  animate={{ opacity: 0, scale: 1.7 }}
                  transition={{ duration: 0.55, delay: CURSOR_TRAVEL_S, ease: "easeOut" }}
                />
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  className="-translate-x-1 -translate-y-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
                >
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
