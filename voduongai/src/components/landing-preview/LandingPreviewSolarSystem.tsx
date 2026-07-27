"use client";

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
// with whatever box it's placed in; tooltips are dropped since this is a
// small, purely decorative recreation.
type Module = { icon: LucideIcon; ring: 0 | 1 };

const MODULES: Module[] = [
  { icon: GraduationCap, ring: 0 },
  { icon: Users, ring: 1 },
  { icon: Wand2, ring: 0 },
  { icon: Wrench, ring: 1 },
  { icon: FolderOpen, ring: 0 },
  { icon: MessageCircle, ring: 1 },
  { icon: Crown, ring: 0 },
  { icon: Globe, ring: 1 },
  { icon: Blocks, ring: 0 },
  { icon: Building2, ring: 1 },
  { icon: Bitcoin, ring: 0 },
  { icon: TrendingUp, ring: 1 },
];

function planetPosition(i: number, total: number, ring: 0 | 1) {
  const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
  const r = ring === 0 ? 30 : 44;
  return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
}

export function LandingPreviewSolarSystem() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {MODULES.map((m, i) => {
          const { x, y } = planetPosition(i, MODULES.length, m.ring);
          return (
            <line
              key={`line-${i}`}
              x1={50}
              y1={50}
              x2={x}
              y2={y}
              vectorEffect="non-scaling-stroke"
              stroke="rgba(124,92,252,.18)"
              strokeWidth={1}
            />
          );
        })}
        {MODULES.map((m, i) => {
          const { x, y } = planetPosition(i, MODULES.length, m.ring);
          return (
            <motion.line
              key={`flow-${i}`}
              x1={50}
              y1={50}
              x2={x}
              y2={y}
              vectorEffect="non-scaling-stroke"
              stroke="#A78BFA"
              strokeWidth={0.6}
              strokeLinecap="round"
              strokeDasharray="2 4"
              opacity={0.55}
              animate={{ strokeDashoffset: [0, 24] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 z-[2] flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] text-center text-white shadow-[0_12px_28px_rgba(91,33,214,.4)]">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" className="shrink-0">
          <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#fff" />
          <circle cx="27" cy="7.5" r="3" fill="#F97316" />
        </svg>
        <span className="text-[6.5px] font-extrabold tracking-wide">VO DUONG AI</span>
      </div>

      {MODULES.map((m, i) => {
        const { x, y } = planetPosition(i, MODULES.length, m.ring);
        const Icon = m.icon;
        const duration = 4 + (i % 5) * 0.8;
        return (
          <motion.div
            key={`planet-${i}`}
            className="absolute z-[2] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] shadow-[0_4px_14px_-2px_rgba(91,33,214,.55)]">
              <Icon className="h-3.5 w-3.5 text-white" strokeWidth={2} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
