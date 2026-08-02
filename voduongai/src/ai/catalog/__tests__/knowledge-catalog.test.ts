import { describe, it, expect } from "vitest";
import {
  createCatalogEntry,
  isCatalogWorkspace,
  isCatalogVisibility,
  CATALOG_WORKSPACES,
  CATALOG_VISIBILITIES,
} from "../knowledge-catalog";

describe("SPRINT R02 — Knowledge Catalog: type guards", () => {
  it("isCatalogWorkspace đúng cho 6 khu vực đã chốt, sai cho giá trị lạ", () => {
    for (const w of CATALOG_WORKSPACES) expect(isCatalogWorkspace(w)).toBe(true);
    expect(isCatalogWorkspace("khong-ton-tai")).toBe(false);
  });

  it("isCatalogVisibility đúng cho public/premium/internal, sai cho giá trị lạ", () => {
    for (const v of CATALOG_VISIBILITIES) expect(isCatalogVisibility(v)).toBe(true);
    expect(isCatalogVisibility("draft")).toBe(false);
  });
});

describe("SPRINT R02 — Knowledge Catalog: createCatalogEntry", () => {
  it("mặc định goalCategories/tags rỗng khi không truyền", () => {
    const entry = createCatalogEntry({
      id: "e1",
      title: "Prompt mẫu",
      workspace: "ckos",
      visibility: "public",
      published: true,
      knowledgeType: "prompt",
      url: "/portal/prompts/e1",
    });
    expect(entry.goalCategories).toEqual([]);
    expect(entry.tags).toEqual([]);
  });

  it("giữ nguyên field truyền vào", () => {
    const entry = createCatalogEntry({
      id: "e2",
      title: "Khoá học Premium",
      workspace: "premium",
      visibility: "premium",
      published: true,
      knowledgeType: "premium-content",
      goalCategories: ["premium"],
      tags: ["nang-cao"],
      url: "/portal/premium/e2",
    });
    expect(entry).toEqual({
      id: "e2",
      title: "Khoá học Premium",
      workspace: "premium",
      visibility: "premium",
      published: true,
      knowledgeType: "premium-content",
      goalCategories: ["premium"],
      tags: ["nang-cao"],
      url: "/portal/premium/e2",
    });
  });
});
