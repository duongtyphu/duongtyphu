/**
 * Companion Crystal — CSS/SVG placeholder (Sprint 8.2 — Nhiệm vụ 02).
 * Asset tạm thời cho đến khi Product Team xuất asset chính thức từ
 * `docs/design/companion/Companion_Master_V1.png`. Giữ đúng DNA (viên
 * ngọc/tinh thể sống hình cầu) + Identity (V trắng trung tâm, V vàng kim
 * đỉnh) + tỷ lệ + màu sắc theo `Companion_Guidelines.md` — chỉ giảm hiệu
 * ứng (glow đơn giản hóa, không particle).
 */

import type { CompanionStateKey } from "@/lib/portal/companion/companion-identity";
import { stateVisuals } from "@/assets/companion/states/state-visuals";

export function CompanionCrystal({
  state = "idle",
  size = 56,
  className = "",
}: {
  state?: CompanionStateKey;
  size?: number;
  className?: string;
}) {
  const visual = stateVisuals[state];

  return (
    <div
      className={`companion-crystal companion-crystal--${state} ${className}`}
      style={{
        width: size,
        height: size,
        "--companion-glow-opacity": visual.glowOpacity,
        "--companion-halo-intensity": visual.haloIntensity,
        "--companion-breathe-duration": `${visual.breatheDurationSeconds}s`,
      } as React.CSSProperties}
    >
      <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
        <defs>
          <radialGradient id="companion-body" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#6D4FE0" />
            <stop offset="45%" stopColor="#2A4BD8" />
            <stop offset="100%" stopColor="#0B1F4D" />
          </radialGradient>
          <radialGradient id="companion-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="32" cy="56" rx="16" ry="4" fill="#FBBF24" opacity="0.25" />

        <circle cx="32" cy="30" r="26" fill="url(#companion-glow)" className="companion-crystal__halo" />
        <circle cx="32" cy="30" r="20" fill="url(#companion-body)" />
        <circle cx="32" cy="30" r="20" fill="none" stroke="#FBBF24" strokeWidth="1" opacity="0.6" />

        <path d="M21 26 L26 35 L32 26" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M27 12 L31 18 L35 12" stroke="#FBBF24" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        <path d="M25 33 q3 2.5 6 0" stroke="#0B1F4D" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M23 29 q1.5 -1.5 3 0" stroke="#0B1F4D" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M35 29 q1.5 -1.5 3 0" stroke="#0B1F4D" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
}
