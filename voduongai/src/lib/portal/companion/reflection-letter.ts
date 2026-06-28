/**
 * Companion Reflection Letter — Framework (Sprint 15.0 — The Mirror of
 * Growth, Nhiệm vụ 06). Đây KHÔNG phải bộ sinh thư tự động bằng AI —
 * Companion (con người viết) chịu trách nhiệm viết câu văn thật. Hàm ở
 * đây chỉ cho biết phần nào của khung 5 phần đã có đủ "nguyên liệu" thật
 * để viết, dựa trên dữ liệu đã tồn tại. Xem
 * `docs/COMPANION_REFLECTION_LETTER_FRAMEWORK.md`.
 */

import type { GrowthSignal } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones } from "@/lib/portal/growth-map/growth-milestones";

export type ReflectionLetterSection = "opening" | "earlyDays" | "turningPoint" | "today" | "closing";

export type ReflectionLetterFramework = {
  hasEarlyDaysMaterial: boolean;
  hasTurningPointMaterial: boolean;
  hasTodayMaterial: boolean;
  /** Thứ tự phần nên có trong lá thư, dựa trên nguyên liệu thật đang có. */
  sections: ReflectionLetterSection[];
};

export function buildReflectionLetterFramework(signals: GrowthSignal[]): ReflectionLetterFramework {
  const hasEarlyDaysMaterial = signals.length > 0;
  const hasTurningPointMaterial = detectGrowthMilestones(signals).length > 0;
  const hasTodayMaterial = signals.length >= 3;

  const sections: ReflectionLetterSection[] = ["opening"];
  if (hasEarlyDaysMaterial) sections.push("earlyDays");
  if (hasTurningPointMaterial) sections.push("turningPoint");
  if (hasTodayMaterial) sections.push("today");
  sections.push("closing");

  return { hasEarlyDaysMaterial, hasTurningPointMaterial, hasTodayMaterial, sections };
}
