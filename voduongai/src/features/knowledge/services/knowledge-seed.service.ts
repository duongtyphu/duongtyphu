/**
 * CKOS — Sprint 02: The Knowledge Journey™
 * Service layer cho Knowledge Seed: đọc seed, tính progress/stage, chọn
 * Companion Suggestion và One Next Step™ — toàn bộ rule-based, không AI.
 */

import { knowledgeSeedJourneys } from "../data/knowledge-seed-journeys";
import { getKnowledgeAssetBySlug } from "./knowledge.service";
import {
  stageFromPercent,
  type KnowledgeSeed,
  type KnowledgeSeedProgress,
  type KnowledgeSeedStep,
} from "../types/knowledge-seed.types";

export function getAllKnowledgeSeeds(): KnowledgeSeed[] {
  return knowledgeSeedJourneys;
}

export function getKnowledgeSeedBySlug(slug: string): KnowledgeSeed | undefined {
  return knowledgeSeedJourneys.find((seed) => seed.slug === slug);
}

export function getKnowledgeSeedsByGoal(goal: string): KnowledgeSeed[] {
  return knowledgeSeedJourneys.filter((seed) => seed.goal.includes(goal));
}

/** Tính % hoàn thành dựa trên các step bắt buộc (required) đã hoàn thành. */
export function computeSeedProgress(
  seed: KnowledgeSeed,
  completedStepIds: string[]
): KnowledgeSeedProgress {
  const requiredSteps = seed.steps.filter((s) => s.required);
  const completedRequired = requiredSteps.filter((s) => completedStepIds.includes(s.id));
  const percent =
    requiredSteps.length === 0 ? 0 : Math.round((completedRequired.length / requiredSteps.length) * 100);
  return { completedStepIds, percent, stage: stageFromPercent(percent) };
}

/** Bước tiếp theo chưa hoàn thành, theo đúng thứ tự Journey. */
export function getNextIncompleteStep(
  seed: KnowledgeSeed,
  completedStepIds: string[]
): KnowledgeSeedStep | null {
  const ordered = [...seed.steps].sort((a, b) => a.order - b.order);
  return ordered.find((s) => !completedStepIds.includes(s.id)) ?? null;
}

/**
 * Companion Suggestion — rule-based, không AI:
 * - Chưa bắt đầu: gợi ý bước nhẹ nhất (Prompt) nếu có, hoặc bước 1.
 * - Đang giữa chừng: nhắc lại bước vừa xong, gợi ý bước kế tiếp.
 * - Đã xong: khen ngợi, không ép học thêm.
 */
export function getCompanionSuggestion(seed: KnowledgeSeed, completedStepIds: string[]): string {
  const { percent } = computeSeedProgress(seed, completedStepIds);
  const nextStep = getNextIncompleteStep(seed, completedStepIds);

  if (percent >= 100 || !nextStep) {
    return seed.companionNote ?? "Bạn đã hoàn thành hành trình này. Hãy áp dụng vào công việc thật trước khi học thêm.";
  }

  if (completedStepIds.length === 0) {
    const promptStep = seed.steps.find((s) => s.type === "PROMPT");
    if (promptStep) {
      return `Nếu hôm nay bạn chỉ có 10 phút, mình nghĩ bạn nên bắt đầu bằng "${promptStep.title}" trước.`;
    }
    return seed.companionNote ?? `Hãy bắt đầu từ bước đầu tiên: "${nextStep.title}".`;
  }

  return `Bước tiếp theo phù hợp nhất là "${nextStep.title}".`;
}

/** One Next Step™ — luôn chỉ trả về đúng 1 bước hành động. */
export function getOneNextStep(seed: KnowledgeSeed, completedStepIds: string[]) {
  const step = getNextIncompleteStep(seed, completedStepIds);
  if (!step) return null;
  const asset = step.assetId ? getKnowledgeAssetBySlug(step.assetId) : undefined;
  return { step, asset: asset ?? null };
}
