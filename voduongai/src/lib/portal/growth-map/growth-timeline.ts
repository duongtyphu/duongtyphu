/**
 * Growth Timeline Model (Sprint 14.0 — The Human Growth Map, Nhiệm vụ
 * 04). Chuyển một danh sách `GrowthSignal` (xem `growth-signals.ts`)
 * thành ngôn ngữ con người — không phải log kỹ thuật
 * ("reflection_created"), mà một câu kể lại ("Bạn đã viết một
 * Reflection — một điều bạn nhận ra về chính mình.").
 *
 * `GrowthChapter` là một cách gọi tên ĐỊNH TÍNH cho một giai đoạn trong
 * dòng thời gian (ví dụ "một mùa lặng", "một nhịp đều đặn") — không phải
 * điểm số, không phải level. Xem `docs/HUMAN_GROWTH_PHILOSOPHY.md`.
 */

import type { GrowthSignal, GrowthSignalType } from "@/lib/portal/growth-map/growth-signals";
import { gardenStageLabel, type GardenStage } from "@/lib/portal/living-garden/garden-model";

export type GrowthChapter = "early-steps" | "quiet-season" | "steady-rhythm" | "comeback" | "deepening";

export const growthChapterLabel: Record<GrowthChapter, string> = {
  "early-steps": "Những bước đầu tiên",
  "quiet-season": "Một mùa lặng",
  "steady-rhythm": "Một nhịp đều đặn",
  comeback: "Một lần trở lại",
  deepening: "Đang đi sâu hơn",
};

export type GrowthTimelineItem = {
  id: string;
  date: Date;
  /** Câu kể lại bằng ngôn ngữ con người — không phải tên kỹ thuật của signal. */
  line: string;
  chapter: GrowthChapter;
};

export type GrowthTimelinePeriod = {
  /** Ví dụ "Tháng 6, 2026" — nhãn nhóm theo tháng, chỉ để định hướng đọc, không phải mốc thời gian KPI. */
  label: string;
  items: GrowthTimelineItem[];
};

const GARDEN_STAGE_TIMELINE_LINE: Record<GardenStage, string> = {
  dormant: "Khu vườn của bạn đang chờ những hạt giống đầu tiên.",
  sprouting: "Khu vườn của bạn bắt đầu có dấu hiệu nảy mầm.",
  rooting: "Khu vườn của bạn đang bén rễ, vững hơn từng chút.",
  rising: "Khu vườn của bạn đang vươn lên.",
  blooming: "Khu vườn của bạn đang nở hoa.",
  radiant: "Khu vườn của bạn đang tỏa sáng.",
};

/** Dịch một signal thành một câu kể lại — đây là nơi DUY NHẤT làm việc này. */
function translateSignalToLine(signal: GrowthSignal): string {
  switch (signal.type) {
    case "reflection-written":
      return "Bạn đã viết một Reflection — một điều bạn nhận ra về chính mình.";
    case "memory-saved":
      return signal.meaning ? `Bạn đã giữ lại một ký ức: "${signal.meaning}".` : "Bạn đã giữ lại một ký ức.";
    case "living-story-saved":
      return "Một câu chuyện đúng lúc đã trở thành một dấu chân trong My Story của bạn.";
    case "garden-stage-entered":
      return (
        GARDEN_STAGE_TIMELINE_LINE[signal.meaning as GardenStage] ??
        gardenStageLabel[signal.meaning as GardenStage] ??
        "Khu vườn của bạn đang thay đổi."
      );
    case "knowledge-practiced":
      return "Bạn đã dành thời gian để hiểu thêm một điều mới.";
    case "journey-step-taken":
      return "Bạn đã đi thêm một chặng trên con đường của mình.";
    case "companion-interaction":
      return "Bạn và Companion đã có một khoảnh khắc cùng nhau.";
    case "comeback-after-silence":
      return "Bạn đã quay lại sau một khoảng lặng.";
    default:
      return "Một điều nhỏ đã xảy ra trong hành trình của bạn.";
  }
}

const STEADY_RHYTHM_GAP_MS = 1000 * 60 * 60 * 24 * 3; // 3 ngày
const QUIET_SEASON_GAP_MS = 1000 * 60 * 60 * 24 * 14; // 14 ngày

function deriveChapter(type: GrowthSignalType, index: number, gapFromPreviousMs: number | null): GrowthChapter {
  if (index === 0) return "early-steps";
  if (type === "comeback-after-silence") return "comeback";
  if (gapFromPreviousMs !== null && gapFromPreviousMs >= QUIET_SEASON_GAP_MS) return "quiet-season";
  if (gapFromPreviousMs !== null && gapFromPreviousMs <= STEADY_RHYTHM_GAP_MS) return "steady-rhythm";
  return "deepening";
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

/**
 * Chuyển `GrowthSignal[]` (không thứ tự) thành dòng thời gian con người,
 * nhóm theo tháng, sắp xếp mới nhất trước. Không phải log kỹ thuật.
 */
export function buildGrowthTimeline(signals: GrowthSignal[]): GrowthTimelinePeriod[] {
  const sorted = [...signals].sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());

  const items: GrowthTimelineItem[] = sorted.map((signal, index) => {
    const date = new Date(signal.occurredAt);
    const gap = index === 0 ? null : date.getTime() - new Date(sorted[index - 1].occurredAt).getTime();
    return {
      id: signal.id,
      date,
      line: translateSignalToLine(signal),
      chapter: deriveChapter(signal.type, index, gap),
    };
  });

  const periods = new Map<string, GrowthTimelineItem[]>();
  for (const item of items) {
    const label = monthLabel(item.date);
    if (!periods.has(label)) periods.set(label, []);
    periods.get(label)!.push(item);
  }

  return [...periods.entries()]
    .map(([label, periodItems]) => ({
      label,
      items: [...periodItems].sort((a, b) => b.date.getTime() - a.date.getTime()),
    }))
    .sort((a, b) => b.items[0].date.getTime() - a.items[0].date.getTime());
}
