import { describe, it, expect } from "vitest";
import { KNOWLEDGE_SOURCE_PRIORITY_ORDER, sortSourcesByPriority } from "../knowledge-source";

describe("SPRINT A05 — Knowledge Source: source priority", () => {
  it("sắp xếp đúng theo KNOWLEDGE_SOURCE_PRIORITY_ORDER dù input không theo thứ tự", () => {
    expect(sortSourcesByPriority(["community", "ckos", "premium", "academy"])).toEqual([
      "ckos",
      "academy",
      "premium",
      "community",
    ]);
  });

  it("khử trùng lặp", () => {
    expect(sortSourcesByPriority(["ckos", "academy", "ckos", "academy"])).toEqual(["ckos", "academy"]);
  });

  it("CKOS luôn ưu tiên cao nhất, kiến thức chung của model luôn thấp nhất", () => {
    const sorted = sortSourcesByPriority([...KNOWLEDGE_SOURCE_PRIORITY_ORDER].reverse());
    expect(sorted[0]).toBe("ckos");
    expect(sorted[sorted.length - 1]).toBe("general-model-knowledge");
  });

  it("deterministic: cùng input luôn cho cùng output", () => {
    const input = ["premium", "ckos", "community"] as const;
    expect(sortSourcesByPriority(input)).toEqual(sortSourcesByPriority(input));
  });

  it("không mutate mảng input", () => {
    const input = ["community", "ckos", "academy"] as const;
    const snapshot = [...input];
    sortSourcesByPriority(input);
    expect(input).toEqual(snapshot);
  });
});
