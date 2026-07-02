"use client";

/**
 * Living Core™ — biểu tượng sống của Companion.
 *
 * ⚠️ DESIGN LOCK v1.0 — xem design-system/visual-dna/companion/LIVING-CORE-001.md
 * Founder: "Hãy coi hình Companion này giống như Logo Apple. Không ai
 * được quyền thiết kế lại logo. Bạn chỉ được quyền dựng lại bằng SVG.
 * Không thay đổi ngôn ngữ thiết kế." — file PNG gốc là Visual Truth
 * DUY NHẤT, đối xử như logo đã chốt, KHÔNG phải ảnh tham khảo để lấy
 * cảm hứng. Việc duy nhất được phép: tái tạo bằng SVG + CSS animation
 * (đã làm ở component này) — KHÔNG redesign, KHÔNG đổi tỷ lệ/hình
 * dạng (khối cầu gần tròn + 2 vòng quỹ đạo lớn vươn ra ngoài rìa như
 * vành đai)/màu sắc (Companion Blue™)/số lượng quỹ đạo (= 2, cố
 * định). Mọi thay đổi hình học sau Design Lock phải đối chiếu lại
 * ảnh gốc trước, không tự sáng tạo layer mới.
 *
 * Companion không phải robot, không có khuôn mặt. Lõi trắng là sự
 * trung thực/trong sáng, quỹ đạo là tri thức đang chuyển động, hạt
 * sáng là những điều Companion học được, ánh sáng là sự đồng hành.
 *
 * Không GIF/video/ảnh tĩnh/Lottie. Toàn bộ chuyển động dùng CSS
 * animation trên transform/opacity (GPU friendly), tôn trọng
 * `prefers-reduced-motion` (dừng orbit/pulse, giữ icon tĩnh). Không
 * canvas/webgl/thư viện animation nặng.
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
 * Starfield cố định (không Math.random — tránh lệch hydration SSR/CSR).
 * Toạ độ nằm trong hệ cục bộ của group đã nghiêng -18° nên khi render
 * sẽ tự động xoay theo đúng góc nghiêng của khối hành tinh. Sắp xếp
 * dày dần về phía lõi (42, 46) giống ảnh gốc. 3 hạt cuối cùng là
 * "sparkle warm" (#FFE082) — rất ít, chỉ hiện ở size lớn.
 */
const DUST_POINTS: Array<{ x: number; y: number; r: number; warm?: boolean }> = [
  { x: 42, y: 46, r: 1.1 },
  { x: 50, y: 40, r: 1.3 },
  { x: 34, y: 40, r: 1.2 },
  { x: 48, y: 56, r: 1.4 },
  { x: 60, y: 48, r: 1.1 },
  { x: 36, y: 54, r: 1 },
  { x: 55, y: 30, r: 1.2 },
  { x: 28, y: 48, r: 1 },
  { x: 62, y: 34, r: 1 },
  { x: 44, y: 66, r: 1.2 },
  { x: 66, y: 58, r: 0.9 },
  { x: 24, y: 58, r: 1 },
  { x: 54, y: 68, r: 0.9 },
  { x: 70, y: 44, r: 0.8 },
  { x: 30, y: 30, r: 0.9 },
  { x: 22, y: 40, r: 0.8 },
  { x: 76, y: 50, r: 0.8 },
  { x: 40, y: 74, r: 0.8 },
  { x: 64, y: 68, r: 0.8 },
  { x: 20, y: 52, r: 0.7 },
  { x: 58, y: 22, r: 0.8 },
  { x: 34, y: 22, r: 0.7 },
  { x: 72, y: 62, r: 0.7 },
  { x: 26, y: 66, r: 0.7 },
  { x: 46, y: 28, r: 1.2, warm: true },
  { x: 64, y: 40, r: 0.9, warm: true },
  { x: 38, y: 60, r: 0.9, warm: true },
];

/**
 * Ngưỡng độ chi tiết theo kích thước — ở size nhỏ (16-32px) Companion
 * vẫn phải nhận ra được (giữ đúng hình oval nghiêng + màu), nên bớt số
 * lớp trang trí thay vì đổi hình dạng gốc.
 */
function detailForSize(size: LivingCoreSize) {
  const orbitCount = size >= 52 ? 2 : size >= 32 ? 1 : 0;
  const dustCount = size >= 256 ? 27 : size >= 128 ? 24 : size >= 64 ? 14 : size >= 52 ? 7 : 0;
  return {
    orbitCount,
    dustCount,
    showAura: size >= 32,
    showSparkleWarm: size >= 128,
  };
}

const INTENSITY_SCALE: Record<LivingCoreIntensity, number> = {
  low: 0.7,
  medium: 1,
  high: 1.35,
};

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
  const dust = showParticles && state !== "offline" ? DUST_POINTS.slice(0, detail.dustCount) : [];

  const bodyGradId = `lc-body-${uid}`;
  const auraGradId = `lc-aura-${uid}`;
  const coreGradId = `lc-core-${uid}`;
  const clipId = `lc-clip-${uid}`;
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
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className="living-core__svg"
      >
        <defs>
          {/* Lõi gần tâm: trắng → cyan → xanh dương → tím, đúng
           * Companion Blue™ — theo Official Visual Design v1.0, lõi
           * sáng nằm gần chính giữa khối cầu (không lệch mạnh như bản
           * trước). */}
          <radialGradient id={bodyGradId} cx="47%" cy="46%" r="68%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="14%" stopColor="#BFEAFF" />
            <stop offset="34%" stopColor="#38D5FF" />
            <stop offset="60%" stopColor="#4F7DFF" />
            <stop offset="84%" stopColor="#2447B8" />
            <stop offset="100%" stopColor="#1B3A96" />
          </radialGradient>
          <radialGradient id={auraGradId} cx="47%" cy="46%" r="62%">
            <stop offset="0%" stopColor="rgba(180,220,255,0.5)" />
            <stop offset="55%" stopColor="rgba(120,190,255,0.22)" />
            <stop offset="100%" stopColor="rgba(120,190,255,0)" />
          </radialGradient>
          <radialGradient id={coreGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <clipPath id={clipId}>
            <ellipse cx="50" cy="51" rx="36" ry="34" />
          </clipPath>
          {detail.showAura && (
            <filter id={blurId} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
          )}
        </defs>

        {/* Toàn bộ khối hành tinh nghiêng nhẹ -14° — khối cầu gần tròn
         * (Official Visual Design v1.0), 2 vòng quỹ đạo lớn vươn ra
         * NGOÀI rìa khối cầu (kiểu vành đai Saturn), cắt nhau gần lõi. */}
        <g transform="rotate(-14 50 51)">
          {detail.showAura && (
            <ellipse
              className="living-core__aura"
              cx="50"
              cy="51"
              rx="42"
              ry="40"
              fill={`url(#${auraGradId})`}
              filter={`url(#${blurId})`}
            />
          )}

          <ellipse
            className="living-core__body"
            cx="50"
            cy="51"
            rx="37"
            ry="35"
            fill={`url(#${bodyGradId})`}
          />

          {dust.length > 0 && (
            <g clipPath={`url(#${clipId})`} className="living-core__dust">
              {dust.map((d, i) => (
                <circle
                  key={i}
                  className="living-core__mote"
                  style={{ animationDelay: `${(i % 7) * 0.35}s`, animationDuration: `${3.6 + (i % 5) * 0.4}s` }}
                  cx={d.x}
                  cy={d.y}
                  r={d.r}
                  fill={d.warm && detail.showSparkleWarm ? "#FFE082" : "#EAF4FF"}
                  opacity={d.warm && !detail.showSparkleWarm ? 0 : undefined}
                />
              ))}
            </g>
          )}

          {/* Orbit rings — đúng 2 vòng quỹ đạo, bán kính lớn hơn khối
           * cầu (vươn ra ngoài rìa như vành đai), nghiêng góc khác
           * nhau, cắt nhau gần lõi, giống ảnh gốc v1.0. */}
          {detail.orbitCount >= 1 && (
            <ellipse
              className="living-core__orbit living-core__orbit--1"
              cx="50"
              cy="51"
              rx="53"
              ry="16"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="0.9"
            />
          )}
          {detail.orbitCount >= 2 && (
            <ellipse
              className="living-core__orbit living-core__orbit--2"
              cx="50"
              cy="51"
              rx="49"
              ry="14"
              stroke="rgba(224,244,255,0.75)"
              strokeWidth="0.8"
            />
          )}

          {/* Core — lõi hiện diện, trắng sáng, gần chính giữa khối cầu */}
          <circle className="living-core__core-glow" cx="48" cy="49" r="17" fill={`url(#${coreGradId})`} />
          <circle className="living-core__core" cx="48" cy="49" r="6.5" fill="#FFFFFF" />
        </g>
      </svg>
    </span>
  );
}
