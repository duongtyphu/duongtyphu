/**
 * Academy — Sprint 02: Learning Journey Engine™
 * Một Learning Journey = 1 CKOS Collection nhìn qua lăng kính trưởng
 * thành thay vì tiến độ hoàn thành. Không tạo dữ liệu tri thức mới —
 * Journey chỉ đọc Collection/Seed đã có trong CKOS.
 */

export enum JourneyStage {
  PREPARATION = "PREPARATION",
  LEARNING = "LEARNING",
  PRACTICE = "PRACTICE",
  APPLICATION = "APPLICATION",
  REFLECTION = "REFLECTION",
  GROWTH = "GROWTH",
  READY = "READY",
}

export const JOURNEY_STAGE_ORDER: JourneyStage[] = [
  JourneyStage.PREPARATION,
  JourneyStage.LEARNING,
  JourneyStage.PRACTICE,
  JourneyStage.APPLICATION,
  JourneyStage.REFLECTION,
  JourneyStage.GROWTH,
  JourneyStage.READY,
];

export const JOURNEY_STAGE_LABELS: Record<JourneyStage, string> = {
  [JourneyStage.PREPARATION]: "Chuẩn bị",
  [JourneyStage.LEARNING]: "Đang hiểu",
  [JourneyStage.PRACTICE]: "Đang thực hành",
  [JourneyStage.APPLICATION]: "Đang áp dụng",
  [JourneyStage.REFLECTION]: "Đang suy ngẫm",
  [JourneyStage.GROWTH]: "Đang trưởng thành",
  [JourneyStage.READY]: "Sẵn sàng",
};

/** Timeline hiển thị (Feature 04) — gộp 7 giai đoạn engine thành 5 mốc cảm nhận được. */
export const JOURNEY_TIMELINE_MILESTONES = [
  { stages: [], emoji: "🌱", label: "Khám phá" },
  { stages: [JourneyStage.PREPARATION, JourneyStage.LEARNING], emoji: "📘", label: "Hiểu" },
  { stages: [JourneyStage.PRACTICE], emoji: "✍️", label: "Thực hành" },
  { stages: [JourneyStage.APPLICATION], emoji: "🚀", label: "Áp dụng" },
  { stages: [JourneyStage.REFLECTION, JourneyStage.GROWTH, JourneyStage.READY], emoji: "🌿", label: "Trưởng thành" },
] as const;

/** Một Learning Journey — chiếu 1:1 từ KnowledgeCollection (CKOS). */
export type LearningJourney = {
  id: string;
  slug: string;
  title: string;
  goal: string;
  collectionSlug: string;
};

export type JourneyStatus = {
  stage: JourneyStage;
  /** Slug Seed hiện tại người học đang ở đó — null nếu Journey đã READY. */
  currentSeedSlug: string | null;
  /** % tiến độ nội bộ dùng để tính stage — KHÔNG hiển thị dạng progress bar cho người dùng. */
  percent: number;
};
