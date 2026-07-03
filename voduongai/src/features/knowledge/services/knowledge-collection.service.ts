/**
 * CKOS — Collection System
 * Service layer cho Knowledge Collection: đọc collection, resolve danh
 * sách Seed thuộc collection, tính progress tổng hợp toàn Collection.
 */

import { knowledgeCollections } from "../data/knowledge-collections";
import { getKnowledgeSeedBySlug, computeSeedProgress } from "./knowledge-seed.service";
import type { KnowledgeCollection, KnowledgeCollectionProgress } from "../types/knowledge-collection.types";
import type { KnowledgeSeed, KnowledgeSeedStage } from "../types/knowledge-seed.types";
import { stageFromPercent } from "../types/knowledge-seed.types";

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

/**
 * Progress toàn Collection — một Seed được tính "hoàn thành" khi stage
 * của nó là MATURED (>= 80%). `getSeedCompletedStepIds` là callback đọc
 * tiến độ client-side (localStorage) cho từng seedId.
 */
export function computeCollectionProgress(
  collection: KnowledgeCollection,
  getSeedCompletedStepIds: (seedId: string) => string[]
): KnowledgeCollectionProgress {
  const seeds = getSeedsInCollection(collection);
  const stages: KnowledgeSeedStage[] = seeds.map((seed) => {
    const { percent } = computeSeedProgress(seed, getSeedCompletedStepIds(seed.id));
    return stageFromPercent(percent);
  });
  const completedSeeds = stages.filter((s) => s === "MATURED").length;
  const totalSeeds = seeds.length;
  return {
    totalSeeds,
    completedSeeds,
    percent: totalSeeds === 0 ? 0 : Math.round((completedSeeds / totalSeeds) * 100),
  };
}
