"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Users,
  Wand2,
  Wrench,
  FolderOpen,
  MessageCircle,
  Crown,
  Globe,
  Blocks,
  Building2,
  Bitcoin,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type Module = {
  label: string;
  desc: string;
  icon: LucideIcon;
  ring: 0 | 1;
};

const modules: Module[] = [
  { label: "Học viện AI", desc: "Lộ trình học AI từ nền tảng đến thực chiến.", icon: GraduationCap, ring: 0 },
  { label: "Tiếp thị liên kết", desc: "Hệ thống Affiliate Marketing ứng dụng AI.", icon: Users, ring: 1 },
  { label: "Thư viện Prompt AI", desc: "200+ prompt thực chiến cho công việc.", icon: Wand2, ring: 0 },
  { label: "Thư viện Công cụ AI", desc: "50+ công cụ AI được chọn lọc.", icon: Wrench, ring: 1 },
  { label: "Kho Tài nguyên", desc: "Tài liệu, mẫu và checklist miễn phí.", icon: FolderOpen, ring: 0 },
  { label: "Cộng đồng Võ Đương AI", desc: "Nơi học hỏi và kết nối cùng nhau.", icon: MessageCircle, ring: 1 },
  { label: "Sản phẩm số cao cấp", desc: "Khoá học và sản phẩm Premium chuyên sâu.", icon: Crown, ring: 0 },
  { label: "Hệ sinh thái DigiU", desc: "Mạng lưới đối tác công nghệ quốc gia.", icon: Globe, ring: 1 },
  { label: "Blockchain & Web3", desc: "Ứng dụng công nghệ chuỗi khối thực tế.", icon: Blocks, ring: 0 },
  { label: "Đầu tư cổ phần doanh nghiệp", desc: "Danh mục đầu tư dài hạn vào doanh nghiệp.", icon: Building2, ring: 1 },
  { label: "Crypto & Tài sản số", desc: "Quản lý và tăng trưởng tài sản số.", icon: Bitcoin, ring: 0 },
  { label: "Trading & Quản trị vốn", desc: "Chiến lược giao dịch và quản trị rủi ro vốn.", icon: TrendingUp, ring: 1 },
];

function planetPosition(i: number, total: number, ring: 0 | 1) {
  const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
  const r = ring === 0 ? 30 : 44;
  return {
    x: 50 + r * Math.cos(angle),
    y: 50 + r * Math.sin(angle),
  };
}

const particles = [
  { top: "12%", left: "18%", size: 3, duration: 6 },
  { top: "75%", left: "8%", size: 2, duration: 8 },
  { top: "20%", left: "85%", size: 2.5, duration: 7 },
  { top: "82%", left: "88%", size: 3, duration: 5.5 },
  { top: "50%", left: "4%", size: 2, duration: 9 },
  { top: "8%", left: "55%", size: 2.5, duration: 6.5 },
];

export function Ecosystem() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [autoIndex, setAutoIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAutoIndex((prev) => (prev + 1) % modules.length);
    }, 1800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const activeIndex = hovered ?? autoIndex;

  return (
    <section className="relative overflow-hidden py-12 text-white md:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(37,99,235,0.12),transparent_60%)]" />
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center md:max-w-none"
        >
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Hệ sinh thái Võ Đương AI
          </h2>
          <p className="mt-3 text-white md:whitespace-nowrap">
            Một hệ sinh thái đang vận hành và phát triển — không phải một
            website tĩnh.
          </p>
        </motion.div>

        {/* Desktop: solar system */}
        <div className="relative mx-auto mt-12 hidden h-[620px] max-w-4xl md:block">
          {particles.map((p, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
              className="absolute rounded-full bg-brand-violet/70"
              style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            />
          ))}

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {modules.map((m, i) => {
              const { x, y } = planetPosition(i, modules.length, m.ring);
              const active = activeIndex === i;
              return (
                <line
                  key={m.label}
                  x1={50}
                  y1={50}
                  x2={x}
                  y2={y}
                  vectorEffect="non-scaling-stroke"
                  stroke={active ? "#5B8CFF" : "rgba(255,255,255,0.12)"}
                  strokeWidth={active ? 1.4 : 1}
                  style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                />
              );
            })}
          </svg>

          {/* Sun */}
          <div className="group absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute -inset-12 -z-10 animate-pulse rounded-full bg-brand-blue/40 blur-3xl transition-all duration-500 group-hover:bg-brand-blue/60 group-hover:blur-[70px]" />
            <div className="spin-slow absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,rgba(91,140,255,0),rgba(91,140,255,0.85),rgba(255,122,0,0.6),rgba(91,140,255,0))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex h-32 w-32 flex-col items-center justify-center gap-1.5 rounded-full border border-white/20 bg-gradient-to-br from-brand-blue to-brand-violet text-center shadow-[0_0_70px_-5px_rgba(37,99,235,0.85)] transition-shadow duration-500 group-hover:shadow-[0_0_100px_-5px_rgba(91,140,255,1)]">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
                <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#fff" />
                <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
              </svg>
              <span className="text-[11px] font-extrabold tracking-wide text-white">VO DUONG AI</span>
            </div>
            <p className="shimmer-gold mt-3 text-center text-[10px] font-semibold">
              Học AI • Xây hệ thống • Tạo tài sản số
            </p>
          </div>

          {/* Planets */}
          {modules.map((m, i) => {
            const { x, y } = planetPosition(i, modules.length, m.ring);
            const Icon = m.icon;
            const duration = 4 + (i % 5) * 0.8;
            const isHovered = hovered === i;
            return (
              <motion.div
                key={m.label}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                animate={isHovered ? { y: 0 } : { y: [0, -8, 0] }}
                transition={
                  isHovered
                    ? { duration: 0.3, ease: "easeOut" }
                    : { duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }
                }
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.12, y: -4 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex h-16 w-16 cursor-default flex-col items-center justify-center gap-1 rounded-2xl border border-white/15 bg-gradient-to-br from-brand-blue to-brand-violet shadow-[0_0_24px_-4px_rgba(37,99,235,0.7)] transition-shadow hover:border-white/30 hover:shadow-[0_0_36px_-2px_rgba(91,140,255,0.9)]"
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </motion.div>

                <AnimatePresence>
                  {activeIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-[calc(100%+10px)] z-30 w-44 -translate-x-1/2 rounded-xl border border-white/15 bg-[#0B1F4D]/95 p-3 text-center shadow-xl backdrop-blur-md"
                    >
                      <p className="text-xs font-bold text-white">{m.label}</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-white/60">{m.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: carousel */}
        <div className="mt-10 flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory md:hidden">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="card-shine flex min-w-[200px] flex-shrink-0 flex-col gap-2 snap-start rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/25 to-brand-violet/15 text-brand-violet">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-white">{m.label}</p>
                <p className="text-xs leading-relaxed text-white/60">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
