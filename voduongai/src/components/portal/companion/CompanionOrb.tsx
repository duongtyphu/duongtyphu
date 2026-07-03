/**
 * Companion Design System™ — Layer 02: Companion Character.
 *
 * CompanionOrb là API tái dùng cho Companion Character chính thức — KHÔNG
 * phải một nhân vật mới. Bên trong luôn render `LivingCore` (Design Lock
 * v1.2, xem `src/components/LivingCore.tsx`) nguyên vẹn — file đó KHÔNG bị
 * sửa geometry/màu sắc ở đây. CompanionOrb chỉ ánh xạ một API thân thiện
 * hơn (size/state/intensity đặt tên theo ngữ cảnh Companion) và thêm các
 * biến thể thị giác thuần CSS ở LỚP BỌC NGOÀI (opacity/scale/filter/ẩn
 * orbit) — không đụng vào SVG lõi.
 *
 * One Character Principle: mọi nơi trong Portal chỉ có MỘT Companion,
 * chỉ thay đổi trạng thái/ánh sáng/kích thước/chuyển động, không bao giờ
 * đổi nhân vật. Xem `docs/Companion/CompanionCharacterSystem.md`.
 */

import { LivingCore, type LivingCoreIntensity, type LivingCoreSize, type LivingCoreState } from "@/components/LivingCore";

export type CompanionOrbSize = "sm" | "md" | "lg" | "xl" | "hero";
export type CompanionOrbState =
  | "idle"
  | "thinking"
  | "speaking"
  | "listening"
  | "celebrating"
  | "sleeping"
  | "offline";
export type CompanionOrbIntensity = "calm" | "normal" | "active" | "radiant";

const SIZE_MAP: Record<CompanionOrbSize, LivingCoreSize> = {
  sm: 32,
  md: 52,
  lg: 64,
  xl: 128,
  hero: 256,
};

const INTENSITY_MAP: Record<CompanionOrbIntensity, LivingCoreIntensity> = {
  calm: "low",
  normal: "medium",
  active: "high",
  radiant: "high",
};

/**
 * `listening` chưa có trong `LivingCoreState` (Design Lock — không thêm
 * state mới vào lõi). Ánh xạ về `idle` ở tầng LivingCore, sự khác biệt thị
 * giác ("ánh sáng mềm, ít chuyển động hơn") được tạo bằng class
 * `companion-orb--listening` ở lớp bọc (xem companion-theme.css).
 */
const STATE_MAP: Record<CompanionOrbState, LivingCoreState> = {
  idle: "idle",
  thinking: "thinking",
  speaking: "speaking",
  listening: "idle",
  celebrating: "celebrating",
  sleeping: "sleeping",
  offline: "offline",
};

export function CompanionOrb({
  size = "md",
  state = "idle",
  intensity = "normal",
  showOrbit = true,
  showParticles = true,
  className = "",
}: {
  size?: CompanionOrbSize;
  state?: CompanionOrbState;
  intensity?: CompanionOrbIntensity;
  showOrbit?: boolean;
  showParticles?: boolean;
  className?: string;
}) {
  const wrapperClasses = [
    "companion-orb",
    `companion-orb--${state}`,
    intensity === "radiant" && "companion-orb--radiant",
    intensity === "calm" && "companion-orb--calm",
    !showOrbit && "companion-orb--no-orbit",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={wrapperClasses}>
      <LivingCore
        size={SIZE_MAP[size]}
        state={STATE_MAP[state]}
        intensity={INTENSITY_MAP[intensity]}
        showParticles={showParticles}
      />
    </span>
  );
}
