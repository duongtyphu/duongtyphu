"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

// Compact, purple re-creation of the "solar system" ecosystem diagram (see
// src/components/home/Ecosystem.tsx for the original, full-size version —
// that file is part of the live homepage and is never edited here). Same
// percentage-based planetPosition() trick so the diagram scales naturally
// with whatever box it's placed in. Module labels float up on a slow,
// continuous loop when idle, and mouse hover keeps the original page's
// interactive effect — the hovered planet/line lights up and its label
// stays fully visible, same behavior as Ecosystem.tsx.
type Module = { label: string; icon: LucideIcon; ring: 0 | 1 };

const MODULES: Module[] = [
  { label: "Học viện AI", icon: GraduationCap, ring: 0 },
  { label: "Tiếp thị liên kết", icon: Users, ring: 1 },
  { label: "Thư viện Prompt AI", icon: Wand2, ring: 0 },
  { label: "Thư viện Công cụ AI", icon: Wrench, ring: 1 },
  { label: "Kho Tài nguyên", icon: FolderOpen, ring: 0 },
  { label: "Cộng đồng VO DUONG AI", icon: MessageCircle, ring: 1 },
  { label: "Sản phẩm số cao cấp", icon: Crown, ring: 0 },
  { label: "Hệ sinh thái DigiU", icon: Globe, ring: 1 },
  { label: "Blockchain & Web3", icon: Blocks, ring: 0 },
  { label: "Đầu tư cổ phần", icon: Building2, ring: 1 },
  { label: "Crypto & Tài sản số", icon: Bitcoin, ring: 0 },
  { label: "Trading & Quản trị vốn", icon: TrendingUp, ring: 1 },
];

function planetPosition(i: number, total: number, ring: 0 | 1) {
  const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
  const r = ring === 0 ? 30 : 44;
  return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
}

export function LandingPreviewSolarSystem() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative mx-auto aspect-square w-full" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {MODULES.map((m, i) => {
          const { x, y } = planetPosition(i, MODULES.length, m.ring);
          const active = hovered === i;
          return (
            <line
              key={`line-${i}`}
              x1={50}
              y1={50}
              x2={x}
              y2={y}
              vectorEffect="non-scaling-stroke"
              stroke={active ? "#7C5CFC" : "rgba(124,92,252,.18)"}
              strokeWidth={active ? 1.4 : 1}
              style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
            />
          );
        })}
        {MODULES.map((m, i) => {
          const { x, y } = planetPosition(i, MODULES.length, m.ring);
          const active = hovered === i;
          return (
            <motion.line
              key={`flow-${i}`}
              x1={50}
              y1={50}
              x2={x}
              y2={y}
              vectorEffect="non-scaling-stroke"
              stroke={active ? "#5B21D6" : "#A78BFA"}
              strokeWidth={active ? 1 : 0.6}
              strokeLinecap="round"
              strokeDasharray="2 4"
              opacity={active ? 0.95 : 0.55}
              animate={{ strokeDashoffset: [0, 24] }}
              transition={{ duration: active ? 1.2 : 4.5, repeat: Infinity, ease: "linear" }}
              style={{ transition: "stroke 0.3s ease, opacity 0.3s ease" }}
            />
          );
        })}
      </svg>

      <div className="group absolute left-1/2 top-1/2 z-[2] h-[15%] w-[15%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute -inset-2 -z-10 animate-pulse rounded-full bg-[#7C5CFC]/40 blur-xl transition-all duration-500 group-hover:bg-[#7C5CFC]/70 group-hover:blur-2xl md:-inset-3" />
        <div className="spin-slow absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,rgba(124,92,252,0),rgba(124,92,252,.9),rgba(249,115,22,.6),rgba(124,92,252,0))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-full border border-white/20 bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] text-center text-white shadow-[0_12px_28px_rgba(91,33,214,.4)] transition-shadow duration-500 group-hover:shadow-[0_0_32px_-2px_rgba(124,92,252,1)]">
          <svg width="30%" height="30%" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#fff" />
            <circle cx="27" cy="7.5" r="3" fill="#5B21D6" />
          </svg>
          <span className="text-[.5rem] font-extrabold tracking-wide md:text-[.6rem]">VO DUONG AI</span>
        </div>
      </div>

      {MODULES.map((m, i) => {
        const { x, y } = planetPosition(i, MODULES.length, m.ring);
        const Icon = m.icon;
        const pulseDuration = 4 + (i % 5) * 0.8;
        const labelDuration = 7 + (i % 4) * 1.4;
        const isHovered = hovered === i;
        return (
          <motion.div
            key={`planet-${i}`}
            className="absolute z-[2] -translate-x-1/2 -translate-y-1/2 cursor-default"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={isHovered ? { scale: 1.15 } : { scale: [1, 1.08, 1] }}
            transition={
              isHovered
                ? { duration: 0.25, ease: "easeOut" }
                : { duration: pulseDuration, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
            }
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] shadow-[0_4px_14px_-2px_rgba(91,33,214,.55)] transition-shadow md:h-12 md:w-12 ${
                isHovered ? "shadow-[0_0_22px_-2px_rgba(91,33,214,.9)]" : ""
              }`}
            >
              <Icon className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2} />
            </div>

            <motion.span
              className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#ECEDF5] bg-white px-2 py-0.5 text-[7px] font-bold text-[#5B21D6] shadow-sm md:px-2.5 md:py-1 md:text-[9.5px]"
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: [0, 1, 0], y: [4, 0, -4] }}
              transition={
                isHovered
                  ? { duration: 0.2 }
                  : { duration: labelDuration, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }
              }
            >
              {m.label}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}
