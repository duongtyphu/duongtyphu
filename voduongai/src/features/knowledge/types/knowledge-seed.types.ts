/**
 * CKOS — Sprint 02: The Knowledge Journey™
 * Tầng Journey phía trên Knowledge Asset (Sprint 01) — gom nhiều Asset
 * thành một Knowledge Seed: một kỹ năng nhỏ có thể trưởng thành.
 */

import type { Difficulty, KnowledgeType } from "./knowledge.types";

export enum KnowledgeSeedStage {
  SEEDING = "SEEDING",
  NURTURING = "NURTURING",
  MATURED = "MATURED",
}

export type KnowledgeSeedStep = {
  id: string;
  type: KnowledgeType;
  /** slug của Knowledge Asset (Sprint 01). Null nếu asset chưa có — hiển thị "sắp có". */
  assetId: string | null;
  title: string;
  order: number;
  required: boolean;
};

/**
 * Companion Content Standard — 14 phần bắt buộc cho mỗi Knowledge Seed.
 * (1) Hero = title/summary, (2) whatYouWillGain, (3) persona, (4) problem,
 * (5) coreIdea, (6) guide (Hướng dẫn), (7) samplePrompt, (8) example,
 * (9) commonMistakes, (10) checklist, (11) exercise, (12) reflectionQuestions,
 * (13) companionNote, (14) nextStep.
 */
export type CompanionContentStandard = {
  whatYouWillGain: string[];
  problem: string;
  coreIdea: string;
  guide: string;
  samplePrompt: string;
  example: string;
  commonMistakes: string[];
  checklist: string[];
  exercise: string;
  reflectionQuestions: string[];
  companionNote: string;
  nextStep: string;
};

export type KnowledgeSeed = CompanionContentStandard & {
  id: string;
  slug: string;
  title: string;
  summary: string;
  goal: string[];
  persona: string[];
  difficulty: Difficulty;
  estimatedTime: string;
  steps: KnowledgeSeedStep[];
  /** slug của Collection chứa Seed này — dùng để tính thứ tự Previous/Next. */
  collectionSlug: string;
  relatedSeeds: string[];
};

/** Trạng thái tiến độ của một Seed đối với một người dùng cụ thể (client-side). */
export type KnowledgeSeedProgress = {
  completedStepIds: string[];
  percent: number;
  stage: KnowledgeSeedStage;
};

export const SEED_STAGE_LABELS: Record<KnowledgeSeedStage, string> = {
  [KnowledgeSeedStage.SEEDING]: "Đang gieo",
  [KnowledgeSeedStage.NURTURING]: "Đang chăm",
  [KnowledgeSeedStage.MATURED]: "Đã trưởng thành",
};

export function stageFromPercent(percent: number): KnowledgeSeedStage {
  if (percent >= 80) return KnowledgeSeedStage.MATURED;
  if (percent >= 1) return KnowledgeSeedStage.NURTURING;
  return KnowledgeSeedStage.SEEDING;
}
