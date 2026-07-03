/**
 * Companion Design System™ — Layer 01: Companion Design Foundation.
 * Bản sao TypeScript của các token màu trong `src/styles/companion-theme.css`
 * — dùng khi cần giá trị thật (không phải class CSS), ví dụ dựng gradient
 * inline cho `CompanionCosmicBackground`. Đổi giá trị ở CẢ HAI nơi khi cần
 * chỉnh theme (CSS là nguồn cho class, file này là nguồn cho JS/inline).
 */

export const companionColors = {
  midnightNavy: "#050B18",
  deepBlue: "#0B1B35",
  auroraPurple: "#7C3AED",
  cyanGlow: "#22D3EE",
  softViolet: "#A78BFA",
  warmGold: "#FBBF24",
  glassBorder: "rgba(167, 139, 250, 0.22)",
  glassBorderHover: "rgba(34, 211, 238, 0.4)",
  softWhiteText: "#F8FAFC",
  secondaryText: "#CBD5E1",
  mutedText: "#94A3B8",
} as const;

export const companionMotion = {
  slowFloat: "companion-anim-float",
  softPulse: "companion-anim-pulse",
  glowBreathe: "companion-anim-glow-breathe",
  fadeUp: "companion-anim-fade-up",
} as const;

/** Vị trí cố định (không dùng Math.random() để tránh lệch hydration SSR/CSR). */
export const COMPANION_STAR_FIELD: { top: string; left: string; size: number; delay: number }[] = [
  { top: "8%", left: "12%", size: 2, delay: 0 },
  { top: "14%", left: "68%", size: 1.5, delay: 0.6 },
  { top: "22%", left: "34%", size: 2.5, delay: 1.2 },
  { top: "30%", left: "82%", size: 1.5, delay: 1.8 },
  { top: "38%", left: "6%", size: 2, delay: 0.3 },
  { top: "44%", left: "52%", size: 1.5, delay: 2.4 },
  { top: "18%", left: "92%", size: 2, delay: 0.9 },
  { top: "55%", left: "20%", size: 1.5, delay: 1.5 },
  { top: "62%", left: "74%", size: 2.5, delay: 2.1 },
  { top: "70%", left: "40%", size: 1.5, delay: 0.4 },
  { top: "78%", left: "88%", size: 2, delay: 1.1 },
  { top: "86%", left: "16%", size: 1.5, delay: 1.7 },
  { top: "92%", left: "60%", size: 2, delay: 2.6 },
  { top: "50%", left: "8%", size: 1.5, delay: 3.1 },
  { top: "12%", left: "48%", size: 2, delay: 3.5 },
  { top: "66%", left: "94%", size: 1.5, delay: 2.9 },
];
