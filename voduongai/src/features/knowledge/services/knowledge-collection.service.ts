/**
 * CKOS — Collection System
 * Service layer cho Knowledge Collection: đọc collection, resolve danh
 * sách Seed thuộc collection, tính progress tổng hợp toàn Collection.
 */

import { knowledgeCollections } from "../data/knowledge-collections";
import { getKnowledgeSeedBySlug, computeSeedProgress } from "./knowledge-seed.service";
import type { KnowledgeCollection, KnowledgeCollectionProgress } from "../types/knowledge-collection.types";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";

/** ○ Chưa bắt đầu / ◐ Đang học / ✓ Hoàn thành — Learning Status theo Seed. */
export type LearningStatus = "not_started" | "in_progress" | "completed";

export function learningStatusFromPercent(percent: number): LearningStatus {
  if (percent >= 100) return "completed";
  if (percent >= 1) return "in_progress";
  return "not_started";
}

export const LEARNING_STATUS_SYMBOL: Record<LearningStatus, string> = {
  not_started: "○",
  in_progress: "◐",
  completed: "✓",
};

/** Tổng thời gian ước tính của Collection — cộng dồn số phút đầu mỗi Seed.estimatedTime. */
export function getCollectionTotalMinutes(collection: KnowledgeCollection): number {
  return getSeedsInCollection(collection).reduce((sum, seed) => {
    const match = seed.estimatedTime.match(/\d+/);
    return sum + (match ? Number(match[0]) : 0);
  }, 0);
}

export function getAllKnowledgeCollections(): KnowledgeCollection[] {
  return knowledgeCollections;
}

export function getKnowledgeCollectionBySlug(slug: string): KnowledgeCollection | undefined {
  return knowledgeCollections.find((c) => c.slug === slug);
}

export function getSeedsInCollection(collection: KnowledgeCollection): KnowledgeSeed[] {
  return collection.seedSlugs
    .map((slug) => getKnowledgeSeedBySlug(slug))
    .filter((s): s is KnowledgeSeed => Boolean(s));
}

export type SeedWithStatus = { seed: KnowledgeSeed; percent: number; status: LearningStatus };

/** Learning Status của từng Seed trong Collection, đúng thứ tự Learning Path. */
export function getSeedsWithStatus(
  collection: KnowledgeCollection,
  getSeedCompletedStepIds: (seedId: string) => string[]
): SeedWithStatus[] {
  return getSeedsInCollection(collection).map((seed) => {
    const { percent } = computeSeedProgress(seed, getSeedCompletedStepIds(seed.id));
    return { seed, percent, status: learningStatusFromPercent(percent) };
  });
}

/**
 * Progress toàn Collection — một Seed được tính "hoàn thành" khi Learning
 * Status là "completed" (100%), nhất quán với ✓ hiển thị ở Learning Path.
 */
export function computeCollectionProgress(
  collection: KnowledgeCollection,
  getSeedCompletedStepIds: (seedId: string) => string[]
): KnowledgeCollectionProgress {
  const withStatus = getSeedsWithStatus(collection, getSeedCompletedStepIds);
  const completedSeeds = withStatus.filter((s) => s.status === "completed").length;
  const totalSeeds = withStatus.length;
  return {
    totalSeeds,
    completedSeeds,
    percent: totalSeeds === 0 ? 0 : Math.round((completedSeeds / totalSeeds) * 100),
  };
}

/** Seed tiếp theo nên học — Seed đầu tiên (đúng thứ tự) chưa hoàn thành 100%. Null nếu Collection đã xong hết. */
export function getNextSeedToLearn(
  collection: KnowledgeCollection,
  getSeedCompletedStepIds: (seedId: string) => string[]
): KnowledgeSeed | null {
  const withStatus = getSeedsWithStatus(collection, getSeedCompletedStepIds);
  return withStatus.find((s) => s.status !== "completed")?.seed ?? null;
}

/** Companion Guide — chỉ dẫn đường, không chat/trả lời. Rule-based theo tiến độ Collection. */
export function getCollectionCompanionGuidance(
  collection: KnowledgeCollection,
  getSeedCompletedStepIds: (seedId: string) => string[]
): string {
  const withStatus = getSeedsWithStatus(collection, getSeedCompletedStepIds);
  const completed = withStatus.filter((s) => s.status === "completed").length;
  const total = withStatus.length;
  const remaining = total - completed;

  if (remaining === 0) {
    return `Bạn đã hoàn thành cả ${total} Seed trong Collection này.`;
  }
  if (remaining === 1) {
    return `Bạn đã hoàn thành ${completed} Seed. Chỉ còn 1 Seed nữa để hoàn thành Collection này.`;
  }
  const next = withStatus.find((s) => s.status !== "completed");
  if (completed === 0) {
    return next ? `Seed tiếp theo phù hợp nhất với mục tiêu của bạn là "${next.seed.title}".` : "";
  }
  return next
    ? `Bạn đã hoàn thành ${completed}/${total} Seed. Seed tiếp theo phù hợp nhất là "${next.seed.title}".`
    : "";
}

/** Feature 09 — Collection Complete: Companion đề xuất Collection phù hợp nhất tiếp theo (chưa hoàn thành). */
export function getSuggestedNextCollection(
  currentCollection: KnowledgeCollection,
  getSeedCompletedStepIds: (seedId: string) => string[]
): KnowledgeCollection | null {
  const others = knowledgeCollections.filter((c) => c.slug !== currentCollection.slug);
  return (
    others.find((c) => computeCollectionProgress(c, getSeedCompletedStepIds).percent < 100) ?? others[0] ?? null
  );
}
