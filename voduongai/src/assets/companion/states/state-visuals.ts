/**
 * Companion State Visuals (Sprint 8.2 — Nhiệm vụ 02). Mô tả glow/halo cho
 * mỗi trạng thái — dùng bởi `CompanionCrystal` placeholder. Đối chiếu
 * `docs/design/companion/Companion_States.md` và
 * `docs/design/companion/Companion_Motion.md`. Animation chỉ tác động lên
 * glow/halo/breathing — không bao giờ đổi hình dạng viên ngọc.
 */

import type { CompanionStateKey } from "@/lib/portal/companion/companion-identity";

export type CompanionStateVisual = {
  glowOpacity: number;
  breatheDurationSeconds: number;
  haloIntensity: number;
};

export const stateVisuals: Record<CompanionStateKey, CompanionStateVisual> = {
  idle: { glowOpacity: 0.55, breatheDurationSeconds: 7, haloIntensity: 0.5 },
  listening: { glowOpacity: 0.6, breatheDurationSeconds: 9, haloIntensity: 0.5 },
  thinking: { glowOpacity: 0.7, breatheDurationSeconds: 7.5, haloIntensity: 0.65 },
  encouraging: { glowOpacity: 0.8, breatheDurationSeconds: 7, haloIntensity: 0.8 },
  celebrating: { glowOpacity: 0.95, breatheDurationSeconds: 2.5, haloIntensity: 1 },
  comeback: { glowOpacity: 0.78, breatheDurationSeconds: 8, haloIntensity: 0.75 },
};
