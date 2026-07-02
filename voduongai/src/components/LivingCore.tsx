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
 * dạng/màu sắc (Companion Blue™)/số lượng quỹ đạo (= 2, cố định). Mọi
 * thay đổi hình học sau Design Lock phải đối chiếu lại ảnh gốc trước,
 * không tự sáng tạo layer mới.
 *
 * Hình tổng thể (khối năng lượng trung tâm) phải CÂN ĐỐI TUYỆT ĐỐI —
 * hình tròn thuần (rx = ry), KHÔNG kéo dài, KHÔNG oval, KHÔNG egg,
 * KHÔNG méo. Chỉ 2 vòng quỹ đạo (ellipse, nghiêng góc khác nhau) được
 * phép không phải hình tròn — bản thân lõi/quầng sáng luôn tròn đều.
 * Cảm giác tham chiếu: Apple Intelligence, Siri Orb, OpenAI Voice Orb,
 * Nothing Glyph, Interstellar energy core — KHÔNG phải Earth/Planet/
 * Marble/Crystal Ball.
 *
 * Companion không phải robot, không có khuôn mặt, không phải hành
 * tinh/quả cầu/viên bi/quả trứng/quả cầu thuỷ tinh — đây là một
 * ENERGY CORE: năng lượng đang sống, không khối lượng, không bóng đổ
 * như vật thể rắn. Rìa tan dần vào trong suốt (không viền tối), các
 * lớp sáng blend cộng dồn (mix-blend-mode: screen) thay vì tô đặc.
 * Lõi trắng là sự trung thực/trong sáng, quỹ đạo là tri thức đang
 * chuyển động, hạt sáng là những điều Companion học được, ánh sáng là
 * sự đồng hành.
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
          {/* Năng lượng, không phải khối đặc: gradient tan dần ra TRONG
           * SUỐT ở rìa (không còn màu tối đặc ở viền) — không mô phỏng
           * ánh sáng chiếu lên một khối cầu rắn, mà là một nguồn năng
           * lượng tự phát sáng, nhẹ, không khối lượng, không bóng đổ. */}
          <radialGradient id={bodyGradId} cx="47%" cy="46%" r="68%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="14%" stopColor="#BFEAFF" stopOpacity="1" />
            <stop offset="32%" stopColor="#38D5FF" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#4F7DFF" stopOpacity="0.75" />
            <stop offset="78%" stopColor="#4F7DFF" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#4F7DFF" stopOpacity="0" />
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
            <circle cx="50" cy="51" r="33" />
          </clipPath>
          {detail.showAura && (
            <filter id={blurId} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
          )}
          {/* Blur riêng cho body — làm mềm rìa thành quầng năng lượng
           * khuếch tán, thay vì một đĩa tròn có cạnh cứng như quả bóng. */}
          <filter id={`${bodyGradId}-blur`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {/* Khối năng lượng: hình tròn CÂN ĐỐI TUYỆT ĐỐI (rx = ry) —
         * không kéo dài, không oval, không egg, không méo. Chỉ 2 vòng
         * quỹ đạo (ellipse) nghiêng góc khác nhau bay quanh, bản thân
         * lõi/quầng sáng luôn là hình tròn thuần. */}
        <g>
          {detail.showAura && (
            <circle
              className="living-core__aura"
              cx="50"
              cy="51"
              r="41"
              fill={`url(#${auraGradId})`}
              filter={`url(#${blurId})`}
            />
          )}

          <circle
            className="living-core__body"
            cx="50"
            cy="51"
            r="36"
            fill={`url(#${bodyGradId})`}
            filter={`url(#${bodyGradId}-blur)`}
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

          {/* Orbit rings — bay TỰ DO quanh lõi, có khoảng cách rõ với
           * quầng năng lượng ở mọi hướng (giống electron quay quanh hạt
           * nhân), KHÔNG áp sát bề mặt như dây quấn quanh quả bóng. */}
          {detail.orbitCount >= 1 && (
            <ellipse
              className="living-core__orbit living-core__orbit--1"
              cx="50"
              cy="51"
              rx="52"
              ry="43"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="0.9"
            />
          )}
          {detail.orbitCount >= 2 && (
            <ellipse
              className="living-core__orbit living-core__orbit--2"
              cx="50"
              cy="51"
              rx="47"
              ry="39"
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
