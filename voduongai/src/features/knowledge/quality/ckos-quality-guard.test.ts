import { describe, it, expect } from "vitest";
import { getAllKnowledgeSeeds } from "../services/knowledge-seed.service";
import { getAllKnowledgeCollections } from "../services/knowledge-collection.service";
import { validateSeedQuality, validateGraphIntegrity } from "./ckos-quality-guard";

/**
 * CKOS Quality Guard™ — chạy `npm test` để kiểm tra toàn bộ Knowledge Seed
 * hiện có đúng chuẩn CKOS Standard Library (docs/CKOS/). Test fail ngay
 * khi có Seed mới vi phạm Standard — không cần đọc thủ công như Sprint 04.
 */
describe("CKOS Quality Guard", () => {
  const seeds = getAllKnowledgeSeeds();
  const collections = getAllKnowledgeCollections();

  it.each(seeds.map((seed) => [seed.slug, seed]))("Seed '%s' đạt chuẩn CKOS", (_slug, seed) => {
    const issues = validateSeedQuality(seed);
    expect(issues, JSON.stringify(issues, null, 2)).toHaveLength(0);
  });

  it("Knowledge Graph toàn vẹn — không dangling reference, không chu trình, không Seed cô lập", () => {
    const issues = validateGraphIntegrity(seeds, collections);
    expect(issues, JSON.stringify(issues, null, 2)).toHaveLength(0);
  });
});
