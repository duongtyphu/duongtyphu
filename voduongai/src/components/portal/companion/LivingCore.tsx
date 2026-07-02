"use client";

/**
 * Living Core™ — biểu tượng sống của Companion, dựng bằng SVG + CSS
 * thuần (không GIF/video/ảnh tĩnh/Lottie). Companion không phải robot,
 * không có khuôn mặt — đây là một "hành tinh ánh sáng": lõi trắng ở
 * giữa là sự trung thực/trong sáng, quỹ đạo là tri thức đang chuyển
 * động, hạt sáng là những điều Companion học được, ánh sáng là sự
 * đồng hành. Xem NHIỆM VỤ "LIVING CORE™" trong lịch sử trò chuyện.
 *
 * Toàn bộ chuyển động dùng CSS animation (transform/opacity — GPU
 * friendly), tôn trọng `prefers-reduced-motion` (dừng orbit/pulse,
 * giữ icon tĩnh). Không dùng canvas/webgl/thư viện animation nặng.
 */

import { useId } from "react";

export type LivingCoreSize = 16 | 32 | 52 | 64 | 128 | 256;
export type LivingCoreState =
  | "idle"
  | "thinking"
  | "speaking"
  | "celebrating"
  | "sleeping"
  | "offline";
export type LivingCoreIntensity = "low" | "medium" | "high";

export type LivingCoreProps = {
  size?: LivingCoreSize;
  state?: LivingCoreState;
  intensity?: LivingCoreIntensity;
  showParticles?: boolean;
  className?: string;
};

/**
 * Ngưỡng độ chi tiết theo kích thước — ở size nhỏ (16-32px) Companion
 * vẫn phải nhận ra được, nên bớt layer thay vì thu nhỏ mọi thứ lại.
 */
function detailForSize(size: LivingCoreSize) {
  return {
    showOrbits: size >= 32 ? (size >= 52 ? (size >= 64 ? 3 : 2) : 1) : 0,
    showGlow: size >= 32,
    showAura: size >= 64,
    showDust: size >= 128,
    showSparkleWarm: size >= 256,
  };
}

const INTENSITY_SCALE: Record<LivingCoreIntensity, number> = {
  low: 0.7,
  medium: 1,
  high: 1.35,
}

const STATE_LABEL: Record<LivingCoreState, string> = {
  idle: "đang hiện diện",
  thinking: "đang suy nghĩ",
  speaking: "đang nói",
  celebrating: "đang ăn mừng",
  sleeping: "đang nghỉ",
  offline: "ngoại tuyến",
};

export function LivingCore({
  size = 64,
  state = "idle",
  intensity = "medium",
  showParticles = true,
  className = "",
}: LivingCoreProps) {
  const uid = useId().replace(/[:]/g, "");
  const detail = detailForSize(size);
  const scale = INTENSITY_SCALE[intensity];
  const particlesOn = showParticles && detail.showDust && state !== "offline";

  const coreGradId = `lc-core-${uid}`;
  const glowGradId = `lc-glow-${uid}`;
  const auraGradId = `lc-aura-${uid}`;
  const blurId = `lc-blur-${uid}`;

  return (
    <span
      role="img"
      aria-label={`Companion Living Core — ${STATE_LABEL[state]}`}
      className={`living-core living-core--${state} inline-block ${className}`}
      style={
        {
          width: size,
          height: size,
          "--lc-scale": scale,
        } as React.CSSProperties
      }
    >
      {detail.showAura && <span className="living-core__aura" aria-hidden="true" />}

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className="living-core__svg"
      >
        <defs>
          <radialGradient id={coreGradId} cx="50%" cy="46%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="28%" stopColor="#DCEBFF" />
            <stop offset="60%" stopColor="#4F7DFF" />
            <stop offset="100%" stopColor="#8B7DFF" />
          </radialGradient>
          <radialGradient id={glowGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(120,190,255,0.55)" />
            <stop offset="100%" stopColor="rgba(120,190,255,0)" />
          </radialGradient>
          <radialGradient id={auraGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(79,125,255,0.28)" />
            <stop offset="100%" stopColor="rgba(79,125,255,0)" />
          </radialGradient>
          {detail.showGlow && (
            <filter id={blurId} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          )}
        </defs>

        {/* Outer glow — ánh sáng mềm phía sau lõi, không neon gắt */}
        {detail.showGlow && (
          <circle
            className="living-core__glow"
            cx="50"
            cy="50"
            r="46"
            fill={`url(#${glowGradId})`}
          />
        )}

        {/* Orbit rings — quỹ đạo tri thức, mỗi vòng nghiêng góc khác nhau */}
        {detail.showOrbits >= 1 && (
          <ellipse
            className="living-core__orbit living-core__orbit--1"
            cx="50"
            cy="50"
            rx="44"
            ry="16"
            stroke="rgba(220,235,255,0.55)"
            strokeWidth="1.1"
          />
        )}
        {detail.showOrbits >= 2 && (
          <ellipse
            className="living-core__orbit living-core__orbit--2"
            cx="50"
            cy="50"
            rx="40"
            ry="18"
            stroke="rgba(139,125,255,0.45)"
            strokeWidth="1"
            transform="rotate(58 50 50)"
          />
        )}
        {detail.showOrbits >= 3 && (
          <ellipse
            className="living-core__orbit living-core__orbit--3"
            cx="50"
            cy="50"
            rx="41"
            ry="15"
            stroke="rgba(56,213,255,0.4)"
            strokeWidth="1"
            transform="rotate(-52 50 50)"
          />
        )}

        {/* Galaxy dust — những hạt sáng nhỏ, những điều Companion học được */}
        {particlesOn && (
          <g className="living-core__dust">
            <circle className="living-core__mote living-core__mote--1" cx="24" cy="30" r="1.6" fill="#BFE0FF" />
            <circle className="living-core__mote living-core__mote--2" cx="78" cy="34" r="1.3" fill="#8B7DFF" />
            <circle className="living-core__mote living-core__mote--3" cx="70" cy="76" r="1.4" fill="#38D5FF" />
            <circle className="living-core__mote living-core__mote--4" cx="20" cy="68" r="1.1" fill="#DCEBFF" />
            {detail.showSparkleWarm && (
              <circle className="living-core__mote living-core__mote--5" cx="55" cy="16" r="1.1" fill="#FFE082" />
            )}
          </g>
        )}

        {/* Core planet — lõi hiện diện, trắng sáng ở giữa */}
        <circle
          className="living-core__core"
          cx="50"
          cy="50"
          r="22"
          fill={`url(#${coreGradId})`}
        />
        {/* Inner glow pulse riêng, nằm trên core để "thở" độc lập */}
        <circle
          className="living-core__inner-glow"
          cx="50"
          cy="46"
          r="9"
          fill="#FFFFFF"
          opacity="0.5"
          filter={detail.showGlow ? `url(#${blurId})` : undefined}
        />
      </svg>
    </span>
  );
}
