import { describe, it, expect } from "vitest";
import { getAllKnowledgeSeeds } from "./knowledge-seed.service";
import { getAllKnowledgeCollections } from "./knowledge-collection.service";
import {
  canRecommendSeed,
  getPriorityFinishingSeed,
  getPrioritySeedForMissingSkill,
} from "./recommendation-rules.service";

describe("Recommendation Rules (Sprint 06)", () => {
  const seeds = getAllKnowledgeSeeds();
  const collections = getAllKnowledgeCollections();
  const promptSeed = seeds.find((s) => s.slug === "viet-prompt-hieu-qua")!;
  const excelSeed = seeds.find((s) => s.slug === "phan-tich-excel-bang-ai")!;

  it("Rule 1 — không đề xuất Seed khi prerequisite chưa hoàn thành", () => {
    expect(canRecommendSeed(excelSeed, () => [])).toBe(false);
  });

  it("Rule 1 — cho phép đề xuất khi mọi prerequisite đã hoàn thành", () => {
    const allRequiredStepIds = promptSeed.steps.filter((s) => s.required).map((s) => s.id);
    expect(canRecommendSeed(excelSeed, (id) => (id === promptSeed.id ? allRequiredStepIds : []))).toBe(true);
  });

  it("Rule 1 — Seed không có prerequisite luôn được phép đề xuất", () => {
    expect(canRecommendSeed(promptSeed, () => [])).toBe(true);
  });

  it("Rule 2 — không ưu tiên Seed cuối khi Collection chưa gần hoàn thành (0%)", () => {
    const collection = collections.find((c) => c.slug === "ai-office")!;
    expect(getPriorityFinishingSeed(collection, () => [])).toBeNull();
  });

  it("Rule 2 — không ưu tiên khi Collection đã hoàn thành 100%", () => {
    const collection = collections.find((c) => c.slug === "ai-research-presentation")!;
    const completedMap = new Map(collection.seedSlugs.map((slug) => {
      const seed = seeds.find((s) => s.slug === slug)!;
      return [seed.id, seed.steps.filter((s) => s.required).map((s) => s.id)];
    }));
    expect(getPriorityFinishingSeed(collection, (id) => completedMap.get(id) ?? [])).toBeNull();
  });

  it("Rule 3 — đề xuất Seed dạy Skill người học chưa có, khi không có Seed nào hoàn thành", () => {
    const result = getPrioritySeedForMissingSkill(seeds, () => []);
    expect(result).not.toBeNull();
  });
});
