import { describe, it, expect, beforeEach } from "vitest";
import { computeGoal001Progress } from "@/lib/portal/foundation/goal-001-dashboard";

/**
 * GOAL 001 — Production Beta Dashboard.
 *
 * Test này khoá dashboard vào SỰ THẬT của repo — nếu Workforce Registry/
 * Provider Registry/Mission Catalog thay đổi số lượng mà dashboard không
 * cập nhật, test này sẽ fail (chống trôi dữ liệu giữa docs và code).
 */
describe("GOAL 001 — Production Beta Dashboard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("computeGoal001Progress() trả về 6 category, mỗi category có % hợp lệ (0-100)", () => {
    const progress = computeGoal001Progress();
    expect(progress.categories).toHaveLength(6);
    expect(progress.categories.map((c) => c.category)).toEqual([
      "Workforce Progress",
      "Blueprint Progress",
      "Workspace Progress",
      "AI Provider Progress",
      "Portfolio Progress",
      "Memory Progress",
    ]);
    for (const c of progress.categories) {
      expect(c.percent).toBeGreaterThanOrEqual(0);
      expect(c.percent).toBeLessThanOrEqual(100);
      expect(c.items.length).toBeGreaterThan(0);
    }
    expect(progress.overallPercent).toBeGreaterThan(0);
    expect(progress.overallPercent).toBeLessThan(100); // chưa Production thật — không được báo 100% khi còn hạng mục "false"
  });

  it("Workforce Progress phản ánh đúng 30/30 Companion, 7/7 Department (Sprint 002 đã hoàn thành)", () => {
    const progress = computeGoal001Progress();
    const workforce = progress.categories.find((c) => c.category === "Workforce Progress")!;
    expect(workforce.items.find((i) => i.label.includes("30/30"))?.done).toBe(true);
    expect(workforce.items.find((i) => i.label.includes("7/7 Department"))?.done).toBe(true);
  });

  it("Blueprint Progress phản ánh đúng 10/10 Golden Mission", () => {
    const progress = computeGoal001Progress();
    const blueprint = progress.categories.find((c) => c.category === "Blueprint Progress")!;
    expect(blueprint.items.find((i) => i.label.includes("10/10 Golden Mission"))?.done).toBe(true);
  });

  it("Không category nào báo 100% khi còn hạng mục Production thật chưa đạt (vd chưa có Provider thật)", () => {
    const progress = computeGoal001Progress();
    const aiProvider = progress.categories.find((c) => c.category === "AI Provider Progress")!;
    expect(aiProvider.percent).toBeLessThan(100);
  });
});
