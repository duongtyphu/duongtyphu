import { describe, it, expect } from "vitest";
import { createCatalogEntry, type KnowledgeCatalog } from "../knowledge-catalog";
import { summarizePlatformAreas } from "../platform-resolver";

describe("SPRINT R02 — Platform Resolver: chỉ làm việc với Catalog, không đọc DB", () => {
  it("trả đúng 6 khu vực Companion biết tới, kể cả khi Catalog rỗng", () => {
    const summaries = summarizePlatformAreas([]);
    expect(summaries.map((s) => s.areaId)).toEqual(["ckos", "hoc-vien-ai", "premium", "ai-workspace", "du-an-co-hoi", "cong-dong"]);
    expect(summaries.every((s) => s.itemCount === 0)).toBe(true);
  });

  it("đếm đúng số mục Published theo từng khu vực, dùng tên PlatformNode thật", () => {
    const catalog: KnowledgeCatalog = [
      createCatalogEntry({
        id: "a",
        title: "a",
        workspace: "ckos",
        visibility: "public",
        published: true,
        knowledgeType: "tool",
        url: "/a",
      }),
      createCatalogEntry({
        id: "b",
        title: "b",
        workspace: "ckos",
        visibility: "public",
        published: true,
        knowledgeType: "prompt",
        url: "/b",
      }),
      createCatalogEntry({
        id: "c-draft",
        title: "c",
        workspace: "ckos",
        visibility: "public",
        published: false,
        knowledgeType: "tool",
        url: "/c",
      }),
    ];
    const summaries = summarizePlatformAreas(catalog);
    const ckos = summaries.find((s) => s.areaId === "ckos");
    expect(ckos?.itemCount).toBe(2); // không đếm c-draft (published=false)
    expect(ckos?.knowledgeTypes.sort()).toEqual(["prompt", "tool"]);
    expect(ckos?.areaName).toBe("Hệ tri thức AI / CKOS");
  });
});
