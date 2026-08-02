import { describe, it, expect } from "vitest";
import { createCatalogEntry } from "../knowledge-catalog";
import type { KnowledgeResolution } from "../knowledge-resolver";
import { buildMentorContext } from "../mentor-context";

function resolutionOf(overrides: Partial<KnowledgeResolution> = {}): KnowledgeResolution {
  return {
    matchedItems: [],
    matchedAreas: [],
    matchedSources: [],
    unresolvedNeed: [],
    excludedByPermissionCount: 0,
    confidence: 0,
    ...overrides,
  };
}

describe("SPRINT FIX-R02 — MentorContext: đổi tên từ KnowledgePackage, không đổi dữ liệu", () => {
  it("mỗi knowledgeType rơi đúng nhóm gợi ý (hành vi giữ nguyên 100% so với KnowledgePackage)", () => {
    const matchedItems = [
      createCatalogEntry({ id: "1", title: "Khoá học", workspace: "hoc-vien-ai", visibility: "public", published: true, knowledgeType: "course", url: "/1" }),
      createCatalogEntry({ id: "2", title: "Công cụ", workspace: "ckos", visibility: "public", published: true, knowledgeType: "tool", url: "/2" }),
      createCatalogEntry({ id: "3", title: "Prompt", workspace: "ckos", visibility: "public", published: true, knowledgeType: "prompt", url: "/3" }),
      createCatalogEntry({ id: "4", title: "Quy trình", workspace: "ckos", visibility: "public", published: true, knowledgeType: "workflow", url: "/4" }),
      createCatalogEntry({ id: "5", title: "Dự án", workspace: "du-an-co-hoi", visibility: "public", published: true, knowledgeType: "project", url: "/5" }),
      createCatalogEntry({ id: "6", title: "Case study", workspace: "ckos", visibility: "public", published: true, knowledgeType: "case-study", url: "/6" }),
    ];
    const context = buildMentorContext(resolutionOf({ matchedItems }));

    expect(context.suggestedLearning.map((r) => r.id)).toEqual(["1"]);
    expect(context.suggestedTools.map((r) => r.id)).toEqual(["2"]);
    expect(context.suggestedPrompts.map((r) => r.id)).toEqual(["3"]);
    expect(context.suggestedWorkflow.map((r) => r.id)).toEqual(["4"]);
    expect(context.suggestedProjects.map((r) => r.id)).toEqual(["5"]);
    expect(context.references.map((r) => r.id)).toEqual(["6"]);
  });

  it("mỗi reference CHỈ có id/title/url/workspace — không lộ field nào khác của CatalogEntry", () => {
    const matchedItems = [
      createCatalogEntry({
        id: "1",
        title: "Prompt",
        workspace: "ckos",
        visibility: "public",
        published: true,
        knowledgeType: "prompt",
        goalCategories: ["hoc-prompt"],
        tags: ["a", "b"],
        url: "/1",
      }),
    ];
    const context = buildMentorContext(resolutionOf({ matchedItems }));
    expect(Object.keys(context.suggestedPrompts[0]).sort()).toEqual(["id", "title", "url", "workspace"].sort());
  });
});

describe("SPRINT FIX-R02 — MentorContext: warnings minh bạch, không lộ nội dung", () => {
  it("gộp unresolvedNeed + cảnh báo số lượng Premium bị ẩn (không nêu tên)", () => {
    const context = buildMentorContext(
      resolutionOf({ unresolvedNeed: ["Chưa rõ trình độ."], excludedByPermissionCount: 2 })
    );
    expect(context.warnings).toEqual([
      "Chưa rõ trình độ.",
      "Có 2 nội dung Premium liên quan nhưng bạn chưa có quyền truy cập.",
    ]);
  });

  it("excludedByPermissionCount=0 → không thêm cảnh báo Premium", () => {
    const context = buildMentorContext(resolutionOf({ excludedByPermissionCount: 0 }));
    expect(context.warnings).toEqual([]);
  });
});

describe("SPRINT FIX-R02 — MentorContext: confidence/sourceCount (Phần 3, field mới)", () => {
  it("confidence lấy trực tiếp từ resolution.confidence, không tính lại", () => {
    expect(buildMentorContext(resolutionOf({ confidence: 0.8 })).confidence).toBe(0.8);
    expect(buildMentorContext(resolutionOf({ confidence: 0 })).confidence).toBe(0);
  });

  it("sourceCount = matchedSources.length", () => {
    expect(buildMentorContext(resolutionOf({ matchedSources: ["ckos", "academy"] })).sourceCount).toBe(2);
    expect(buildMentorContext(resolutionOf({ matchedSources: [] })).sourceCount).toBe(0);
  });
});
