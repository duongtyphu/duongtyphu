import { describe, it, expect } from "vitest";
import { createCatalogEntry, type CatalogEntry, type CatalogWorkspace } from "../knowledge-catalog";
import { selectByPriority } from "../content-selection";

function entryOf(id: string, workspace: CatalogWorkspace): CatalogEntry {
  return createCatalogEntry({
    id,
    title: id,
    workspace,
    visibility: "public",
    published: true,
    knowledgeType: "resource",
    url: `/x/${id}`,
  });
}

describe("SPRINT R02 — Content Selection: đúng thứ tự CKOS → Academy → Premium → Workspace → Community → General", () => {
  it("sắp đúng thứ tự đã chốt, không đảo", () => {
    const shuffled = [
      entryOf("community", "cong-dong"),
      entryOf("workspace", "ai-workspace"),
      entryOf("premium", "premium"),
      entryOf("projects", "du-an-co-hoi"),
      entryOf("academy", "hoc-vien-ai"),
      entryOf("ckos", "ckos"),
    ];
    const result = selectByPriority(shuffled).map((e) => e.id);
    expect(result).toEqual(["ckos", "academy", "premium", "workspace", "community", "projects"]);
  });

  it("workspace không có trong thứ tự (du-an-co-hoi) rơi vào bậc cuối cùng, cùng mức General", () => {
    const entries = [entryOf("projects", "du-an-co-hoi"), entryOf("community", "cong-dong")];
    expect(selectByPriority(entries).map((e) => e.id)).toEqual(["community", "projects"]);
  });

  it("stable sort — giữ nguyên thứ tự gốc trong cùng 1 bậc ưu tiên", () => {
    const entries = [entryOf("ckos-2", "ckos"), entryOf("ckos-1", "ckos")];
    expect(selectByPriority(entries).map((e) => e.id)).toEqual(["ckos-2", "ckos-1"]);
  });

  it("không mutate input", () => {
    const entries = [entryOf("b", "cong-dong"), entryOf("a", "ckos")];
    const snapshot = entries.map((e) => e.id);
    selectByPriority(entries);
    expect(entries.map((e) => e.id)).toEqual(snapshot);
  });
});
