/**
 * Growth Signal Model (Sprint 14.0 — The Human Growth Map, Nhiệm vụ 03).
 * Một `GrowthSignal` là một dấu chân — một lần Reflection được viết, một
 * ký ức được giữ lại, một câu chuyện được lưu, một bước trên Journey...
 * Đây KHÔNG phải sự kiện analytics (không có pageview/click) và không
 * mang điểm số. Xem triết lý đầy đủ tại `docs/HUMAN_GROWTH_PHILOSOPHY.md`
 * và `docs/HUMAN_GROWTH_MAP.md`.
 *
 * Sprint này CHỈ định nghĩa model + 2 adapter có dữ liệu thật
 * (Reflection, Memory Capsule — gồm cả capsule lưu từ Living Story) và 1
 * adapter snapshot cho Garden Stage. `knowledge_activity`, `journey_step`,
 * `companion_interaction` tồn tại trong type union để các sprint sau nối
 * dữ liệu thật vào — giống cách `learningTouchpoints` từng được khai báo
 * trước khi có dữ liệu thật ở `garden-model.ts`.
 */

import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule } from "@/lib/portal/memoryCapsules";
import type { GardenStage } from "@/lib/portal/living-garden/garden-model";
import { inferInsight } from "@/lib/portal/human-insight";

export type GrowthSignalSource =
  | "reflection"
  | "memory_capsule"
  | "living_story"
  | "garden_stage"
  | "knowledge_activity"
  | "journey_step"
  | "companion_interaction";

export type GrowthSignalType =
  | "reflection-written"
  | "memory-saved"
  | "living-story-saved"
  | "garden-stage-entered"
  | "knowledge-practiced"
  | "journey-step-taken"
  | "companion-interaction"
  | "comeback-after-silence";

/**
 * Một cụm từ ngắn, con người (ví dụ một `ValueTag`/`ThemeTag`, tên một
 * Garden Stage, hoặc title của một ký ức) — KHÔNG phải điểm số, KHÔNG
 * phải nhãn phân loại kỹ thuật. Có thể để trống nếu không suy ra được gì
 * có ý nghĩa.
 */
export type GrowthSignalMeaning = string;

/**
 * Chỉ dùng nội bộ để sắp xếp/ưu tiên khi nhiều signal cùng lúc (ví dụ
 * Companion Growth Reflection chọn signal nào để nói tới) — KHÔNG BAO GIỜ
 * hiển thị ra UI dưới dạng điểm/thanh tiến trình.
 */
export type GrowthSignalStrength = "subtle" | "clear" | "strong";

export type GrowthSignal = {
  id: string;
  source: GrowthSignalSource;
  type: GrowthSignalType;
  /** ISO date string — thời điểm dấu chân này xảy ra. */
  occurredAt: string;
  meaning?: GrowthSignalMeaning;
  /** Internal only — xem ghi chú ở `GrowthSignalStrength`. */
  strength?: GrowthSignalStrength;
};

const LIVING_STORY_CAPSULE_KINDS = ["living_story", "companion_story", "wisdom_story", "garden_story"];

/** Mỗi Reflection là một dấu chân "điều người dùng nhận ra". */
export function signalsFromReflections(reflections: Reflection[]): GrowthSignal[] {
  return reflections.map((r) => {
    const insight = inferInsight(r.answer);
    return {
      id: `reflection-${r.id}`,
      source: "reflection",
      type: "reflection-written",
      occurredAt: r.createdAt,
      meaning: insight.value ?? insight.theme,
      strength: insight.value ? "clear" : "subtle",
    };
  });
}

/** Mỗi Memory Capsule là một dấu chân "điều người dùng chọn giữ lại". */
export function signalsFromMemoryCapsules(capsules: MemoryCapsule[]): GrowthSignal[] {
  return capsules.map((c) => {
    const isLivingStory = LIVING_STORY_CAPSULE_KINDS.includes(c.kind);
    return {
      id: `memory-capsule-${c.id}`,
      source: isLivingStory ? "living_story" : "memory_capsule",
      type: isLivingStory ? "living-story-saved" : "memory-saved",
      occurredAt: c.occurredAt,
      meaning: c.title,
      strength: "clear",
    };
  });
}

/**
 * Garden không lưu lịch sử "vào stage X lúc nào" — đây là một signal
 * snapshot tại thời điểm gọi (`now`), không phải một signal được phát
 * hiện từ dữ liệu lịch sử. Dùng để Timeline/Companion biết stage hiện
 * tại, không dùng để suy ra "lần đầu vào stage này là khi nào".
 */
export function signalFromCurrentGardenStage(stage: GardenStage, now: string): GrowthSignal {
  return {
    id: `garden-stage-${stage}-${now}`,
    source: "garden_stage",
    type: "garden-stage-entered",
    occurredAt: now,
    meaning: stage,
    strength: stage === "dormant" ? "subtle" : "clear",
  };
}

/**
 * Một lần người dùng quay lại sau một khoảng lặng dài — suy ra từ
 * khoảng cách giữa hai signal liên tiếp theo thời gian, không phải một
 * nguồn dữ liệu riêng. `gapDays` mặc định 14 ngày — cùng tinh thần
 * "khoảng lặng" đã dùng ở `proactive-thought-engine.ts`.
 */
export function deriveComebackSignals(signals: GrowthSignal[], gapDays = 14): GrowthSignal[] {
  const sorted = [...signals].sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
  const comebacks: GrowthSignal[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].occurredAt).getTime();
    const curr = new Date(sorted[i].occurredAt).getTime();
    if (curr - prev >= gapDays * 24 * 60 * 60 * 1000) {
      comebacks.push({
        id: `comeback-${sorted[i].id}`,
        source: sorted[i].source,
        type: "comeback-after-silence",
        occurredAt: sorted[i].occurredAt,
        strength: "clear",
      });
    }
  }
  return comebacks;
}
