import { describe, it, expect } from "vitest";
import { buildPlatformContext, findChildren, findPlatformNode, findRelatedAreas } from "../platform-context";
import { ROOT_PLATFORM_NODE_ID } from "../platform-tree";

const ALL_TOP_LEVEL_IDS = [
  "companion",
  "hoc-vien-ai",
  "ckos",
  "premium",
  "ai-workspace",
  "du-an-co-hoi",
  "cong-dong",
  "nhat-ky-hoc-tap",
  "hanh-trinh-cua-toi",
  "khu-vuon-cua-ban",
];

describe("SPRINT A05 — Platform Context: related area", () => {
  it("'hoc-vien-ai' liên quan tới đúng các khu vực chung tag ('ckos'/'nhat-ky-hoc-tap'/'premium'), đúng thứ tự theo id", () => {
    const context = buildPlatformContext("hoc-vien-ai");
    expect(context.currentArea?.id).toBe("hoc-vien-ai");
    expect(context.relatedAreas.map((a) => a.id)).toEqual(["ckos", "nhat-ky-hoc-tap", "premium"]);
  });

  it("không gồm khu vực không chung tag nào ('companion' không liên quan tới 'hoc-vien-ai')", () => {
    const context = buildPlatformContext("hoc-vien-ai");
    expect(context.relatedAreas.some((a) => a.id === "companion")).toBe(false);
  });

  it("'hanh-trinh-cua-toi' liên quan tới 'khu-vuon-cua-ban' và 'nhat-ky-hoc-tap' (chung tag 'tien-do'/'phan-anh')", () => {
    const context = buildPlatformContext("hanh-trinh-cua-toi");
    expect(context.relatedAreas.map((a) => a.id)).toEqual(["khu-vuon-cua-ban", "nhat-ky-hoc-tap"]);
  });

  it("findRelatedAreas() là helper độc lập dùng chung logic, cho kết quả giống hệt buildPlatformContext().relatedAreas", () => {
    expect(findRelatedAreas("hoc-vien-ai")).toEqual(buildPlatformContext("hoc-vien-ai").relatedAreas);
  });

  it("findRelatedAreas() với id không tồn tại trả về mảng rỗng", () => {
    expect(findRelatedAreas("khong-ton-tai")).toEqual([]);
  });
});

describe("SPRINT A05 — Platform Context: findPlatformNode() / findChildren()", () => {
  it("findPlatformNode(): id hợp lệ trả về đúng node, id không tồn tại trả về null", () => {
    expect(findPlatformNode("ckos")?.name).toBe("Hệ tri thức AI / CKOS");
    expect(findPlatformNode("khong-ton-tai")).toBeNull();
  });

  it("findChildren(root) trả về đúng 10 khu vực cấp 1", () => {
    expect(findChildren(ROOT_PLATFORM_NODE_ID).map((n) => n.id)).toEqual(ALL_TOP_LEVEL_IDS);
  });
});

describe("SPRINT A05 — Platform Context: availableAreas", () => {
  it("luôn có đủ 10 khu vực cấp 1, không phụ thuộc currentArea", () => {
    expect(buildPlatformContext("hoc-vien-ai").availableAreas.map((a) => a.id)).toEqual(ALL_TOP_LEVEL_IDS);
  });

  it("vẫn đủ 10 khu vực kể cả khi currentAreaId = null", () => {
    expect(buildPlatformContext(null).availableAreas.map((a) => a.id)).toEqual(ALL_TOP_LEVEL_IDS);
  });

  it("vẫn đủ 10 khu vực kể cả khi currentAreaId không tồn tại", () => {
    expect(buildPlatformContext("khong-ton-tai").availableAreas.map((a) => a.id)).toEqual(ALL_TOP_LEVEL_IDS);
  });
});

describe("SPRINT A05 — Platform Context: suggestedAreas + trường hợp biên", () => {
  it("khu vực lá (không có con) → suggestedAreas rỗng", () => {
    const context = buildPlatformContext("hoc-vien-ai");
    expect(context.suggestedAreas).toEqual([]);
  });

  it("currentAreaId = null → currentArea/relatedAreas/suggestedAreas rỗng, availableAreas vẫn đủ", () => {
    const context = buildPlatformContext(null);
    expect(context.currentArea).toBeNull();
    expect(context.relatedAreas).toEqual([]);
    expect(context.suggestedAreas).toEqual([]);
    expect(context.availableAreas).toHaveLength(10);
  });

  it("currentAreaId không tồn tại trong tree → currentArea/relatedAreas/suggestedAreas rỗng, availableAreas vẫn đủ", () => {
    const context = buildPlatformContext("khong-ton-tai");
    expect(context.currentArea).toBeNull();
    expect(context.relatedAreas).toEqual([]);
    expect(context.suggestedAreas).toEqual([]);
    expect(context.availableAreas).toHaveLength(10);
  });
});

describe("SPRINT A05 — Platform Context: deterministic + không mutate", () => {
  it("cùng input luôn cho cùng output", () => {
    expect(buildPlatformContext("hoc-vien-ai")).toEqual(buildPlatformContext("hoc-vien-ai"));
  });

  it("gọi buildPlatformContext không làm lệch kết quả gọi lần sau (tree không bị mutate)", () => {
    const before = buildPlatformContext("hoc-vien-ai");
    buildPlatformContext("hoc-vien-ai").relatedAreas.push(before.currentArea!);
    buildPlatformContext("hoc-vien-ai").availableAreas.pop();
    const after = buildPlatformContext("hoc-vien-ai");
    expect(after.relatedAreas).toEqual(before.relatedAreas);
    expect(after.availableAreas).toEqual(before.availableAreas);
  });
});
