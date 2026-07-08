/**
 * Academy — Sprint 02: Learning Journey Engine™
 * Đọc dữ liệu từ CKOS (không tạo tri thức mới, không sửa dữ liệu CKOS) và
 * chiếu thành Learning Journey theo 7 giai đoạn. Toàn bộ rule-based, không AI.
 * Xem quy tắc đầy đủ: docs/Academy/JourneyRules.md
 */

import {
  getAllKnowledgeCollections,
  computeCollectionProgress,
  getNextSeedToLearn,
  getSeedCompletedStepIds,
  getPrerequisiteGuidance,
  getSuggestedNextCollection,
  type KnowledgeCollection,
  type KnowledgeSeed,
} from "@/features/knowledge";
import { isJourneyMarkedReady } from "../utils/use-journey-ready";
import { JourneyStage, type LearningJourney, type JourneyStatus } from "../types/journey.types";

/** Mỗi Learning Journey chiếu 1:1 từ 1 CKOS Collection — không tạo Journey độc lập. */
export function getAllLearningJourneys(): LearningJourney[] {
  return getAllKnowledgeCollections().map((collection) => toJourney(collection));
}

export function getLearningJourneyBySlug(slug: string): LearningJourney | undefined {
  const collection = getAllKnowledgeCollections().find((c) => c.slug === slug);
  return collection ? toJourney(collection) : undefined;
}

function toJourney(collection: KnowledgeCollection): LearningJourney {
  return {
    id: `journey-${collection.slug}`,
    slug: collection.slug,
    title: collection.title,
    goal: collection.description,
    collectionSlug: collection.slug,
  };
}

/**
 * Rule chuyển % tiến độ CKOS Collection thành 1 trong 7 giai đoạn Journey.
 * Xem JourneyRules.md — ngưỡng này KHÔNG hiển thị dạng % cho người dùng,
 * chỉ dùng nội bộ để xác định stage.
 */
function stageFromPercent(percent: number, isReady: boolean): JourneyStage {
  if (percent >= 100 && isReady) return JourneyStage.READY;
  if (percent >= 100) return JourneyStage.GROWTH;
  if (percent >= 70) return JourneyStage.REFLECTION;
  if (percent >= 45) return JourneyStage.APPLICATION;
  if (percent >= 15) return JourneyStage.PRACTICE;
  if (percent > 0) return JourneyStage.LEARNING;
  return JourneyStage.PREPARATION;
}

export function computeJourneyStatus(journey: LearningJourney): JourneyStatus {
  const collection = getAllKnowledgeCollections().find((c) => c.slug === journey.collectionSlug);
  if (!collection) return { stage: JourneyStage.PREPARATION, currentSeedSlug: null, percent: 0 };

  const progress = computeCollectionProgress(collection, getSeedCompletedStepIds);
  const nextSeed = getNextSeedToLearn(collection, getSeedCompletedStepIds);
  const isReady = isJourneyMarkedReady(journey.slug);

  return {
    stage: stageFromPercent(progress.percent, isReady),
    currentSeedSlug: nextSeed?.slug ?? null,
    percent: progress.percent,
  };
}

/** Seed hiện tại người học nên tiếp tục — dùng cho Journey Card "Bạn nên làm gì tiếp theo". */
export function getCurrentSeedForJourney(journey: LearningJourney): KnowledgeSeed | null {
  const collection = getAllKnowledgeCollections().find((c) => c.slug === journey.collectionSlug);
  if (!collection) return null;
  return getNextSeedToLearn(collection, getSeedCompletedStepIds);
}

/**
 * Phase 6 — Academy Experience. Academy KHÔNG tự tạo "Purpose/Who this is
 * for/Prerequisites/Expected Output" — mọi field dưới đây đọc thẳng từ Seed
 * hiện tại (CKOS, `features/knowledge`), không có nội dung mới nào được
 * viết ra ở đây. Nếu Journey đã xong hết (không còn seed nào), field liên
 * quan trả về rỗng một cách trung thực thay vì lấy tạm seed khác.
 */
export type JourneyLearnerProfile = {
  persona: string[];
  whatYouWillGain: string[];
  expectedOutput: string | null;
  prerequisiteGuidance: string | null;
};

export function getJourneyLearnerProfile(journey: LearningJourney): JourneyLearnerProfile {
  const seed = getCurrentSeedForJourney(journey);
  if (!seed) {
    return { persona: [], whatYouWillGain: [], expectedOutput: null, prerequisiteGuidance: null };
  }
  return {
    persona: seed.persona,
    whatYouWillGain: seed.whatYouWillGain,
    expectedOutput: seed.exercise || null,
    prerequisiteGuidance: getPrerequisiteGuidance(seed, getSeedCompletedStepIds),
  };
}

/**
 * Next Journey (Feature 09, CKOS Collection Relationship) — chỉ gợi ý khi
 * Journey hiện tại đã thật sự hoàn thành hoặc gần xong; không tạo Collection
 * giả để luôn có gợi ý. Trả về null nếu CKOS chưa có Collection kế tiếp nào.
 */
export function getSuggestedNextJourney(journey: LearningJourney): LearningJourney | null {
  const collection = getAllKnowledgeCollections().find((c) => c.slug === journey.collectionSlug);
  if (!collection) return null;
  const next = getSuggestedNextCollection(collection, getSeedCompletedStepIds);
  return next ? toJourney(next) : null;
}

/**
 * Companion Guidance (Feature 06) — không nói "bạn còn N bài", chỉ gợi ý
 * hành động cụ thể theo giọng đồng hành. Xem JourneyRules.md.
 */
export function getCompanionJourneyGuidance(journey: LearningJourney, status: JourneyStatus): string {
  switch (status.stage) {
    case JourneyStage.PREPARATION:
      return `Mình nghĩ hôm nay bạn nên bắt đầu với "${journey.title}" — chỉ cần 10-15 phút đầu tiên để làm quen.`;
    case JourneyStage.LEARNING:
      return "Mình thấy bạn đang tìm hiểu dần. Đừng vội — hiểu chắc từng phần rồi hẵng thực hành.";
    case JourneyStage.PRACTICE: {
      const seed = getCurrentSeedForJourney(journey);
      return seed
        ? `Mình nghĩ bạn đã sẵn sàng để thử "${seed.title}" — làm luôn với công việc thật của bạn.`
        : "Mình nghĩ bạn đã sẵn sàng để thực hành phần tiếp theo.";
    }
    case JourneyStage.APPLICATION:
      return "Bạn đang áp dụng khá tốt rồi. Hôm nay thử dùng lại kỹ năng này cho một việc thật khác xem sao.";
    case JourneyStage.REFLECTION:
      return "Bạn đã đi được một chặng dài. Dành 2 phút nhìn lại — bạn thấy mình khác gì so với lúc bắt đầu?";
    case JourneyStage.GROWTH:
      return "Bạn đã hoàn thành hành trình này. Mình nghĩ đã đến lúc bạn tự xác nhận mình đã sẵn sàng.";
    case JourneyStage.READY:
      return "Bạn đã sẵn sàng. Hành trình tiếp theo đang chờ khi bạn muốn.";
    default:
      return "";
  }
}
