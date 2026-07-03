/**
 * CKOS — Knowledge Intelligence™ (Sprint 05)
 * Service layer cho Knowledge Graph: resolve Skill/AI Tool/Scenario, tính
 * Knowledge Dependency (prerequisite) và Collection Relationship. Toàn bộ
 * rule-based, đọc dữ liệu tĩnh — không AI, không thay đổi Learning Engine.
 */

import { getKnowledgeSeedBySlug } from "./knowledge-seed.service";
import { getKnowledgeCollectionBySlug } from "./knowledge-collection.service";
import { getSkillLabel, getAiToolLabel, getScenarioLabel } from "../data/knowledge-taxonomy";
import type { KnowledgeSeed } from "../types/knowledge-seed.types";
import type { KnowledgeCollection } from "../types/knowledge-collection.types";

export type KnowledgeGraphView = {
  skills: { id: string; label: string }[];
  aiTools: { id: string; label: string }[];
  scenarios: { id: string; label: string }[];
};

/** Resolve id taxonomy của Seed thành label hiển thị được (Feature 03/04/05). */
export function getKnowledgeGraphView(seed: KnowledgeSeed): KnowledgeGraphView {
  return {
    skills: seed.skills.map((id) => ({ id, label: getSkillLabel(id) })),
    aiTools: seed.aiTools.map((id) => ({ id, label: getAiToolLabel(id) })),
    scenarios: seed.scenarios.map((id) => ({ id, label: getScenarioLabel(id) })),
  };
}

/** Knowledge Dependency (Feature 06) — Seed nên học trước, độc lập với thứ tự Collection. */
export function getPrerequisiteSeeds(seed: KnowledgeSeed): KnowledgeSeed[] {
  return seed.prerequisites
    .map((slug) => getKnowledgeSeedBySlug(slug))
    .filter((s): s is KnowledgeSeed => Boolean(s));
}

/** Seed nào coi Seed này là điều kiện tiên quyết — "học xong Seed này, bạn nên học tiếp...". */
export function getDependentSeeds(seed: KnowledgeSeed, allSeeds: KnowledgeSeed[]): KnowledgeSeed[] {
  return allSeeds.filter((s) => s.prerequisites.includes(seed.slug));
}

/** Collection Relationship (Feature 07) — chuỗi Collection nên học tiếp theo. */
export function getRelatedCollectionObjects(collection: KnowledgeCollection): KnowledgeCollection[] {
  return collection.relatedCollections
    .map((slug) => getKnowledgeCollectionBySlug(slug))
    .filter((c): c is KnowledgeCollection => Boolean(c));
}

/** Tìm Seed khác cùng ít nhất 1 Skill — dùng để kiểm chứng Related Knowledge không random (Feature 02/09). */
export function getSeedsBySharedSkill(seed: KnowledgeSeed, allSeeds: KnowledgeSeed[]): KnowledgeSeed[] {
  return allSeeds.filter(
    (s) => s.slug !== seed.slug && s.skills.some((skill) => seed.skills.includes(skill))
  );
}
