/**
 * Growth Milestone Rules (Sprint 14.0 — The Human Growth Map, Nhiệm vụ
 * 05). Một "mốc trưởng thành" KHÔNG phải achievement/unlock/badge — nó
 * chỉ ghi nhận một lần đầu tiên đáng nhớ đã xảy ra. Không có rank,
 * không có streak pressure, không so sánh người dùng này với người
 * khác. Xem `docs/HUMAN_GROWTH_PHILOSOPHY.md`.
 *
 * Mỗi milestone chỉ ĐƯỢC GHI NHẬN, không bao giờ ĐƯỢC THIẾU — nếu chưa
 * có signal phù hợp, `detect()` trả `null`, không phải một trạng thái
 * "chưa unlock" hiển thị mờ/xám trên UI.
 */

import type { GrowthSignal } from "@/lib/portal/growth-map/growth-signals";

export type GrowthMilestoneId =
  | "first-reflection"
  | "first-memory"
  | "first-living-story-saved"
  | "first-comeback"
  | "first-knowledge-practice"
  | "first-contribution"
  | "garden-begins-to-grow"
  | "quiet-season"
  | "return-after-silence";

export type GrowthMilestone = {
  id: GrowthMilestoneId;
  title: string;
  line: string;
  occurredAt: string;
};

const CONTRIBUTION_MEANINGS = ["Chia sẻ", "Phụng sự"];

function earliest(signals: GrowthSignal[]): GrowthSignal | undefined {
  return [...signals].sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())[0];
}

function latest(signals: GrowthSignal[]): GrowthSignal | undefined {
  return [...signals].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())[0];
}

type MilestoneDefinition = {
  id: GrowthMilestoneId;
  title: string;
  line: string;
  detect: (signals: GrowthSignal[]) => GrowthSignal | undefined;
};

const MILESTONE_DEFINITIONS: MilestoneDefinition[] = [
  {
    id: "first-reflection",
    title: "Reflection đầu tiên",
    line: "Bạn đã viết một Reflection đầu tiên.",
    detect: (signals) => earliest(signals.filter((s) => s.type === "reflection-written")),
  },
  {
    id: "first-memory",
    title: "Ký ức đầu tiên",
    line: "Bạn đã giữ lại ký ức đầu tiên của mình.",
    detect: (signals) => earliest(signals.filter((s) => s.type === "memory-saved")),
  },
  {
    id: "first-living-story-saved",
    title: "Câu chuyện đầu tiên được lưu lại",
    line: "Một câu chuyện đúng lúc đã trở thành ký ức đầu tiên dạng này trong hành trình của bạn.",
    detect: (signals) => earliest(signals.filter((s) => s.type === "living-story-saved")),
  },
  {
    id: "first-knowledge-practice",
    title: "Lần thực hành đầu tiên",
    line: "Bạn đã dành thời gian thực hành một điều mới — không chỉ đọc qua.",
    detect: (signals) => earliest(signals.filter((s) => s.type === "knowledge-practiced")),
  },
  {
    id: "first-contribution",
    title: "Lần đóng góp đầu tiên",
    line: "Có một điều bạn đã chia sẻ hoặc giúp ai đó — và điều đó cũng là một phần trưởng thành.",
    detect: (signals) =>
      earliest(
        signals.filter(
          (s) => s.type === "reflection-written" && s.meaning && CONTRIBUTION_MEANINGS.includes(s.meaning)
        )
      ),
  },
  {
    id: "garden-begins-to-grow",
    title: "Khu vườn bắt đầu lớn lên",
    line: "Khu vườn của bạn đã rời khỏi sự tĩnh lặng ban đầu — những dấu hiệu đầu tiên đã xuất hiện.",
    detect: (signals) =>
      earliest(signals.filter((s) => s.type === "garden-stage-entered" && s.meaning !== "dormant")),
  },
  {
    id: "first-comeback",
    title: "Lần trở lại đầu tiên",
    line: "Bạn đã quay lại lần đầu tiên sau một khoảng lặng.",
    detect: (signals) => earliest(signals.filter((s) => s.type === "comeback-after-silence")),
  },
  {
    id: "return-after-silence",
    title: "Trở lại sau một khoảng lặng",
    line: "Bạn vừa quay lại sau một khoảng lặng — điều đó cũng đáng được ghi nhận.",
    detect: (signals) => {
      const comeback = latest(signals.filter((s) => s.type === "comeback-after-silence"));
      if (!comeback) return undefined;
      const isRecent = Date.now() - new Date(comeback.occurredAt).getTime() <= 1000 * 60 * 60 * 24 * 7;
      return isRecent ? comeback : undefined;
    },
  },
  {
    id: "quiet-season",
    title: "Một mùa lặng",
    line: "Có một khoảng lặng trong hành trình của bạn — và điều đó cũng là một phần của trưởng thành.",
    detect: (signals) => {
      const sorted = [...signals].sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
      for (let i = 1; i < sorted.length; i++) {
        const gap = new Date(sorted[i].occurredAt).getTime() - new Date(sorted[i - 1].occurredAt).getTime();
        if (gap >= 1000 * 60 * 60 * 24 * 21) return sorted[i];
      }
      return undefined;
    },
  },
];

/** Trả về mọi milestone đã đạt được, sắp xếp theo thời điểm xảy ra — không phải theo "thứ tự unlock". */
export function detectGrowthMilestones(signals: GrowthSignal[]): GrowthMilestone[] {
  return MILESTONE_DEFINITIONS.map((def) => {
    const signal = def.detect(signals);
    if (!signal) return null;
    return { id: def.id, title: def.title, line: def.line, occurredAt: signal.occurredAt };
  })
    .filter((m): m is GrowthMilestone => m !== null)
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
}
