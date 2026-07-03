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

/**
 * Sprint 03 — Knowledge Experience: một Seed là "một buổi học hoàn chỉnh",
 * không phải một bài viết. Các field dưới đây bổ sung cho Learning Hero,
 * Step-by-Step Guide và Prompt Experience — không thay Companion Content
 * Standard, chỉ mở rộng cách trình bày.
 */
export type KnowledgeExperienceContent = {
  subtitle: string;
  skillsGained: string[];
  whyMatters: string;
  /** Từng bước cụ thể của phần Hướng dẫn — Step 1 → Step 2 → ... → Done. */
  guideSteps: string[];
  promptTips: string[];
  promptExampleInput: string;
  promptExampleOutput: string;
  /** Prompt Pack — tối thiểu 5 prompt thật, dùng được ngay (Sprint 03). */
  prompts: string[];
  /** Chuẩn bị nhãn cho tính năng download sau này (chưa xây file thật). */
  downloadPack: { promptPackLabel: string; checklistLabel: string; templateLabel: string };
};

/**
 * Sprint 05 — Knowledge Intelligence™: kết nối Seed vào một hệ tri thức
 * thay vì đứng độc lập. Toàn bộ id tham chiếu tới taxonomy chuẩn hoá trong
 * `data/knowledge-taxonomy.ts` — không phải tag tự do (xem Tag_Standard.md).
 */
export type KnowledgeGraphLinks = {
  /** id trong SKILL_TAXONOMY — Seed thuộc 1+ Skill. */
  skills: string[];
  /** id trong AI_TOOL_TAXONOMY — công cụ AI Seed này dùng. */
  aiTools: string[];
  /** id trong SCENARIO_TAXONOMY — tình huống kinh doanh áp dụng được. */
  scenarios: string[];
  /**
   * Slug Seed nên học TRƯỚC seed này (Knowledge Dependency, Feature 06) —
   * độc lập với thứ tự Collection, dùng khi phụ thuộc bắc cầu giữa các Collection.
   */
  prerequisites: string[];
  /**
   * Sprint 06 — slug Seed nên học SAU seed này, tường minh trong data thay vì
   * chỉ suy ra từ thứ tự Collection (`getAdjacentSeeds`). Cho phép gợi ý bắc
   * cầu sang Collection khác khi Seed này là cuối Collection hiện tại.
   */
  nextSeeds: string[];
};

export type KnowledgeSeed = CompanionContentStandard &
  KnowledgeExperienceContent &
  KnowledgeGraphLinks & {
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
    /** Related Knowledge (Feature 02) — chọn thủ công theo logic Skill/Scenario chung, không random. */
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
