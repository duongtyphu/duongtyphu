import { describe, it, expect } from "vitest";
import type { Goal } from "../../mentor/goal";
import type { ConversationStrategy } from "../../mentor/conversation-strategy";
import type { KnowledgeNeed } from "../../knowledge/knowledge-need";
import { createCatalogEntry, type KnowledgeCatalog } from "../knowledge-catalog";
import { resolveKnowledgeNeed } from "../knowledge-resolver";

function goalOf(category: Goal["category"]): Goal {
  return { id: "g1", title: "Học prompt", description: "d", category, priority: "medium", status: "candidate", confidence: 0.8 };
}

const strategy: ConversationStrategy = { kind: "recommend", reason: "r" };

function needOf(overrides: Partial<KnowledgeNeed> = {}): KnowledgeNeed {
  return {
    goal: goalOf("hoc-prompt"),
    strategy,
    knowledgeTypes: ["prompt", "lesson"],
    preferredSources: ["ckos", "academy"],
    requiredPlatformAreas: ["ckos", "hoc-vien-ai"],
    confidence: 0.8,
    missingInformation: [],
    ...overrides,
  };
}

describe("SPRINT R02 — Knowledge Resolver: knowledgeNeed null → resolution rỗng trung thực", () => {
  it("không đoán nhu cầu chung chung", () => {
    const result = resolveKnowledgeNeed([], null, { hasPremiumAccess: false });
    expect(result.matchedItems).toEqual([]);
    expect(result.unresolvedNeed).toEqual(["Chưa xác định được mục tiêu — chưa có nhu cầu tri thức cụ thể để tra cứu Catalog."]);
  });
});

describe("SPRINT R02 — Knowledge Resolver: Permission (Phần 7) — không bypass", () => {
  const catalog: KnowledgeCatalog = [
    createCatalogEntry({
      id: "pub-1",
      title: "Prompt công khai",
      workspace: "ckos",
      visibility: "public",
      published: true,
      knowledgeType: "prompt",
      goalCategories: ["hoc-prompt"],
      url: "/portal/prompts/pub-1",
    }),
    createCatalogEntry({
      id: "draft-1",
      title: "Prompt chưa publish",
      workspace: "ckos",
      visibility: "public",
      published: false,
      knowledgeType: "prompt",
      url: "/portal/prompts/draft-1",
    }),
    createCatalogEntry({
      id: "internal-1",
      title: "Nội bộ Admin",
      workspace: "ckos",
      visibility: "internal",
      published: true,
      knowledgeType: "prompt",
      url: "/admin/internal-1",
    }),
    createCatalogEntry({
      id: "premium-1",
      title: "Bài học Premium",
      workspace: "hoc-vien-ai",
      visibility: "premium",
      published: true,
      knowledgeType: "lesson",
      url: "/portal/premium/premium-1",
    }),
  ];

  it("không có quyền Premium → loại premium-1, đếm excludedByPermissionCount", () => {
    const result = resolveKnowledgeNeed(catalog, needOf(), { hasPremiumAccess: false });
    const ids = result.matchedItems.map((e) => e.id);
    expect(ids).toContain("pub-1");
    expect(ids).not.toContain("premium-1");
    expect(ids).not.toContain("draft-1"); // published=false
    expect(ids).not.toContain("internal-1"); // visibility=internal
    expect(result.excludedByPermissionCount).toBe(1);
  });

  it("có quyền Premium → premium-1 được lấy, internal-1 vẫn KHÔNG BAO GIỜ lộ", () => {
    const result = resolveKnowledgeNeed(catalog, needOf(), { hasPremiumAccess: true });
    const ids = result.matchedItems.map((e) => e.id);
    expect(ids).toContain("premium-1");
    expect(ids).not.toContain("internal-1");
    expect(result.excludedByPermissionCount).toBe(0);
  });
});

describe("SPRINT R02 — Knowledge Resolver: khớp theo knowledgeType/requiredPlatformAreas/goalCategories", () => {
  const catalog: KnowledgeCatalog = [
    createCatalogEntry({
      id: "match-type",
      title: "Prompt đúng loại + khu vực",
      workspace: "ckos",
      visibility: "public",
      published: true,
      knowledgeType: "prompt",
      goalCategories: ["hoc-prompt"],
      url: "/a",
    }),
    createCatalogEntry({
      id: "wrong-type",
      title: "Tool — không khớp knowledgeTypes",
      workspace: "ckos",
      visibility: "public",
      published: true,
      knowledgeType: "tool",
      url: "/b",
    }),
    createCatalogEntry({
      id: "wrong-area",
      title: "Prompt đúng loại, sai khu vực",
      workspace: "cong-dong",
      visibility: "public",
      published: true,
      knowledgeType: "prompt",
      url: "/c",
    }),
    createCatalogEntry({
      id: "wrong-goal-category",
      title: "Prompt đúng loại/khu vực, sai goalCategories",
      workspace: "ckos",
      visibility: "public",
      published: true,
      knowledgeType: "prompt",
      goalCategories: ["hoc-ai"],
      url: "/d",
    }),
  ];

  it("chỉ giữ đúng mục khớp cả 3 điều kiện", () => {
    const result = resolveKnowledgeNeed(catalog, needOf(), { hasPremiumAccess: false });
    expect(result.matchedItems.map((e) => e.id)).toEqual(["match-type"]);
  });

  it("matchedAreas/matchedSources suy đúng từ matchedItems", () => {
    const result = resolveKnowledgeNeed(catalog, needOf(), { hasPremiumAccess: false });
    expect(result.matchedAreas).toEqual(["ckos"]);
    expect(result.matchedSources).toEqual(["ckos"]);
  });

  it("không mục nào khớp → unresolvedNeed có ghi chú trung thực", () => {
    const result = resolveKnowledgeNeed([], needOf(), { hasPremiumAccess: false });
    expect(result.unresolvedNeed).toContain("Không tìm thấy tri thức đã Publish nào khớp trong Catalog cho nhu cầu này.");
  });
});

describe("SPRINT R02 — Knowledge Resolver: deterministic + không mutate", () => {
  const catalog: KnowledgeCatalog = [
    createCatalogEntry({
      id: "e1",
      title: "e1",
      workspace: "ckos",
      visibility: "public",
      published: true,
      knowledgeType: "prompt",
      url: "/e1",
    }),
  ];

  it("cùng input luôn cho cùng output", () => {
    const need = needOf();
    expect(resolveKnowledgeNeed(catalog, need, { hasPremiumAccess: false })).toEqual(
      resolveKnowledgeNeed(catalog, need, { hasPremiumAccess: false })
    );
  });

  it("không mutate catalog truyền vào", () => {
    const snapshot = JSON.parse(JSON.stringify(catalog));
    resolveKnowledgeNeed(catalog, needOf(), { hasPremiumAccess: false });
    expect(catalog).toEqual(snapshot);
  });
});
