/**
 * CKOS — Sprint 06: CKOS Intelligence Layer™
 * Recommendation Rules — Companion Guide không đề xuất ngẫu nhiên. Toàn bộ
 * rule-based (if/else thuần), không AI. Xem docs/CKOS/RecommendationRules.md.
 */

import { computeSeedProgress, getKnowledgeSeedBySlug } from "./knowledge-seed.service";
import { getSeedsInCollection, computeCollectionProgress } from "./knowledge-collection.service";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";

/**
 * Rule 1 — Nếu prerequisite chưa hoàn thành, không đề xuất Seed nâng cao
 * (Seed có prerequisites) cho người học. Trả về false nếu còn bất kỳ
 * prerequisite nào chưa xong.
 */
export function canRecommendSeed(
  seed: KnowledgeSeed,
  getSeedCompletedStepIds: (seedId: string) => string[]
): boolean {
  return seed.prerequisites.every((slug) => {
    const prereq = getKnowledgeSeedBySlug(slug);
    if (!prereq) return true;
    return computeSeedProgress(prereq, getSeedCompletedStepIds(prereq.id)).percent >= 100;
  });
}

/** Ngưỡng "gần hoàn thành" — Rule 2. */
const NEAR_COMPLETE_THRESHOLD = 70;

/**
 * Rule 2 — Nếu Collection gần hoàn thành (>= 70%), ưu tiên đề xuất Seed
 * cuối cùng còn lại trong Collection đó (giúp người học "chốt" Collection
 * thay vì dạt sang chủ đề khác giữa chừng).
 */
export function getPriorityFinishingSeed(
  collection: KnowledgeCollection,
  getSeedCompletedStepIds: (seedId: string) => string[]
): KnowledgeSeed | null {
  const progress = computeCollectionProgress(collection, getSeedCompletedStepIds);
  if (progress.percent < NEAR_COMPLETE_THRESHOLD || progress.percent >= 100) return null;

  const seeds = getSeedsInCollection(collection);
  const incomplete = seeds.filter(
    (s) => computeSeedProgress(s, getSeedCompletedStepIds(s.id)).percent < 100
  );
  return incomplete.at(-1) ?? null;
}

/**
 * Rule 3 — Nếu người học chưa hoàn thành Seed nào dạy một Skill cụ thể,
 * ưu tiên đề xuất Seed đầu tiên (theo thứ tự Collection) dạy Skill đó,
 * miễn Seed thoả Rule 1 (không bị chặn bởi prerequisite chưa xong).
 */
export function getPrioritySeedForMissingSkill(
  allSeeds: KnowledgeSeed[],
  getSeedCompletedStepIds: (seedId: string) => string[]
): KnowledgeSeed | null {
  const coveredSkills = new Set(
    allSeeds
      .filter((s) => computeSeedProgress(s, getSeedCompletedStepIds(s.id)).percent >= 100)
      .flatMap((s) => s.skills)
  );

  for (const seed of allSeeds) {
    const missingSkill = seed.skills.some((skill) => !coveredSkills.has(skill));
    const alreadyDone = computeSeedProgress(seed, getSeedCompletedStepIds(seed.id)).percent >= 100;
    if (missingSkill && !alreadyDone && canRecommendSeed(seed, getSeedCompletedStepIds)) {
      return seed;
    }
  }
  return null;
}
