import { describe, it, expect } from "vitest";
import {
  ROOT_PLATFORM_NODE_ID,
  getPlatformChildren,
  getPlatformNode,
  getPlatformParent,
  getPlatformSiblings,
  isPlatformTreeIntegrityValid,
  listAllPlatformNodes,
} from "../platform-tree";

const EXPECTED_CHILD_IDS = [
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

describe("SPRINT A05 — Platform Tree: tính toàn vẹn", () => {
  it("isPlatformTreeIntegrityValid() trả về true", () => {
    expect(isPlatformTreeIntegrityValid()).toBe(true);
  });

  it("có đúng 11 node (1 root + 10 khu vực cấp 1), không id nào trùng", () => {
    const nodes = listAllPlatformNodes();
    expect(nodes).toHaveLength(11);
    expect(new Set(nodes.map((n) => n.id)).size).toBe(11);
  });

  it("root có đúng 10 childrenIds, đúng thứ tự đã chốt", () => {
    const root = getPlatformNode(ROOT_PLATFORM_NODE_ID);
    expect(root?.childrenIds).toEqual(EXPECTED_CHILD_IDS);
  });
});

describe("SPRINT A05 — Platform Tree: Parent/child lookup", () => {
  it("getPlatformNode: id hợp lệ trả về đúng node, id không tồn tại trả về null", () => {
    expect(getPlatformNode("companion")?.name).toBe("Companion");
    expect(getPlatformNode("khong-ton-tai")).toBeNull();
  });

  it("getPlatformChildren(root) trả về đúng 10 node, đúng thứ tự", () => {
    const children = getPlatformChildren(ROOT_PLATFORM_NODE_ID);
    expect(children.map((c) => c.id)).toEqual(EXPECTED_CHILD_IDS);
  });

  it("getPlatformChildren của node lá (không có con) trả về mảng rỗng", () => {
    expect(getPlatformChildren("companion")).toEqual([]);
  });

  it("getPlatformChildren với id không tồn tại trả về mảng rỗng", () => {
    expect(getPlatformChildren("khong-ton-tai")).toEqual([]);
  });

  it("getPlatformParent: node cấp 1 trả về root, root trả về null", () => {
    expect(getPlatformParent("companion")?.id).toBe(ROOT_PLATFORM_NODE_ID);
    expect(getPlatformParent(ROOT_PLATFORM_NODE_ID)).toBeNull();
  });

  it("getPlatformParent với id không tồn tại trả về null", () => {
    expect(getPlatformParent("khong-ton-tai")).toBeNull();
  });

  it("getPlatformSiblings: trả về đúng 9 node còn lại, không gồm chính nó", () => {
    const siblings = getPlatformSiblings("companion");
    expect(siblings).toHaveLength(9);
    expect(siblings.some((s) => s.id === "companion")).toBe(false);
  });

  it("getPlatformSiblings của root trả về mảng rỗng", () => {
    expect(getPlatformSiblings(ROOT_PLATFORM_NODE_ID)).toEqual([]);
  });
});

describe("SPRINT A05 — Platform Tree: deterministic + không mutate", () => {
  it("listAllPlatformNodes() gọi 2 lần cho cùng kết quả", () => {
    expect(listAllPlatformNodes()).toEqual(listAllPlatformNodes());
  });

  it("mutate mảng trả về không ảnh hưởng tới lần gọi sau", () => {
    const first = listAllPlatformNodes();
    first.push({
      id: "fake",
      name: "fake",
      type: "module",
      description: "",
      parentId: null,
      childrenIds: [],
      tags: [],
      supportedGoalCategories: [],
      supportedKnowledgeTypes: [],
    });
    const second = listAllPlatformNodes();
    expect(second).toHaveLength(11);
    expect(second.some((n) => n.id === "fake")).toBe(false);
  });

  it("mutate mảng con trả về từ getPlatformChildren không ảnh hưởng lần gọi sau", () => {
    const first = getPlatformChildren(ROOT_PLATFORM_NODE_ID);
    first.pop();
    const second = getPlatformChildren(ROOT_PLATFORM_NODE_ID);
    expect(second).toHaveLength(10);
  });
});
