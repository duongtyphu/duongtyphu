import { describe, expect, it } from "vitest";
import { DEFAULT_QUICK_MISSIONS, getQuickMissions } from "../quick-missions";

describe("quick-missions", () => {
  it("returns module-specific missions for the 4 named modules", () => {
    expect(getQuickMissions("ckos")).toEqual(["Tóm tắt Seed này", "Thực hành Seed này", "Tạo Prompt từ Seed này"]);
    expect(getQuickMissions("academy")).toContain("Bắt đầu Mission");
    expect(getQuickMissions("opportunities")).toContain("Phân tích dự án");
    expect(getQuickMissions("khong-gian-ai")).toContain("Viết Prompt");
  });

  it("falls back to the generic 8-mission list for other modules and null", () => {
    expect(getQuickMissions("premium")).toBe(DEFAULT_QUICK_MISSIONS);
    expect(getQuickMissions("learning-journal")).toBe(DEFAULT_QUICK_MISSIONS);
    expect(getQuickMissions(null)).toBe(DEFAULT_QUICK_MISSIONS);
    expect(DEFAULT_QUICK_MISSIONS.length).toBe(8);
  });
});
