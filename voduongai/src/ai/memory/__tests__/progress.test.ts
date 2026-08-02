import { describe, it, expect } from "vitest";
import { createMemoryEntry } from "../memory-model";
import { buildProgressSnapshot } from "../progress";

function entryOf(summary: string) {
  return createMemoryEntry({
    id: summary,
    type: "learning",
    title: "learning",
    summary,
    confidence: 0.8,
    source: "test",
    timestamp: "t",
  });
}

describe("SPRINT A06 — Progress: learningTrend", () => {
  it("không có entry nào → unknown", () => {
    const progress = buildProgressSnapshot({ activeGoals: 1, completedGoals: 0, recentMemoryEntries: [] });
    expect(progress.learningTrend).toBe("unknown");
  });

  it("thành tựu nhiều hơn khó khăn → improving", () => {
    const progress = buildProgressSnapshot({
      activeGoals: 1,
      completedGoals: 0,
      recentMemoryEntries: [entryOf("Tôi đã hoàn thành bài học đầu tiên."), entryOf("Tôi đã đạt mục tiêu tuần này.")],
    });
    expect(progress.learningTrend).toBe("improving");
  });

  it("khó khăn nhiều hơn thành tựu → declining", () => {
    const progress = buildProgressSnapshot({
      activeGoals: 1,
      completedGoals: 0,
      recentMemoryEntries: [entryOf("Tôi gặp khó khăn khi viết prompt.")],
    });
    expect(progress.learningTrend).toBe("declining");
  });

  it("bằng nhau (đều >0) → steady", () => {
    const progress = buildProgressSnapshot({
      activeGoals: 1,
      completedGoals: 0,
      recentMemoryEntries: [entryOf("Tôi đã hoàn thành bài học đầu tiên."), entryOf("Tôi gặp khó khăn khi viết prompt.")],
    });
    expect(progress.learningTrend).toBe("steady");
  });
});

describe("SPRINT A06 — Progress: activeGoals/completedGoals do nơi gọi cung cấp nguyên vẹn", () => {
  it("giữ đúng số truyền vào, không tự đọc/suy luận thêm", () => {
    const progress = buildProgressSnapshot({ activeGoals: 3, completedGoals: 5, recentMemoryEntries: [] });
    expect(progress.activeGoals).toBe(3);
    expect(progress.completedGoals).toBe(5);
  });
});

describe("SPRINT A06 — Progress: recommendedFocus", () => {
  it("activeGoals=0 → khuyên xác định mục tiêu, bất kể trend", () => {
    const progress = buildProgressSnapshot({
      activeGoals: 0,
      completedGoals: 0,
      recentMemoryEntries: [entryOf("Tôi đã hoàn thành bài học đầu tiên.")],
    });
    expect(progress.recommendedFocus).toContain("xác định 1 mục tiêu");
  });

  it("trend declining, có activeGoals → khuyên xem lại khó khăn", () => {
    const progress = buildProgressSnapshot({
      activeGoals: 1,
      completedGoals: 0,
      recentMemoryEntries: [entryOf("Tôi gặp khó khăn khi viết prompt.")],
    });
    expect(progress.recommendedFocus).toContain("khó khăn");
  });

  it("trend improving → khuyên tiếp tục đà tiến bộ", () => {
    const progress = buildProgressSnapshot({
      activeGoals: 1,
      completedGoals: 0,
      recentMemoryEntries: [entryOf("Tôi đã hoàn thành bài học đầu tiên.")],
    });
    expect(progress.recommendedFocus).toContain("đà tiến bộ");
  });
});

describe("SPRINT A06 — Progress: confidence suy từ số lượng entries", () => {
  it("nhiều entries hơn → confidence cao hơn (kẹp tại 1)", () => {
    const few = buildProgressSnapshot({ activeGoals: 1, completedGoals: 0, recentMemoryEntries: [entryOf("a")] });
    const many = buildProgressSnapshot({
      activeGoals: 1,
      completedGoals: 0,
      recentMemoryEntries: [entryOf("a"), entryOf("b"), entryOf("c"), entryOf("d"), entryOf("e"), entryOf("f")],
    });
    expect(many.confidence).toBeGreaterThan(few.confidence);
    expect(many.confidence).toBeLessThanOrEqual(1);
  });
});

describe("SPRINT A06 — Progress: deterministic + không mutate", () => {
  it("cùng input luôn cho cùng output", () => {
    const entries = [entryOf("Tôi gặp khó khăn khi viết prompt.")];
    const input = { activeGoals: 1, completedGoals: 0, recentMemoryEntries: entries };
    expect(buildProgressSnapshot(input)).toEqual(buildProgressSnapshot(input));
  });

  it("không mutate recentMemoryEntries truyền vào", () => {
    const entries = [entryOf("Tôi gặp khó khăn khi viết prompt.")];
    const snapshot = entries.map((e) => ({ ...e }));
    buildProgressSnapshot({ activeGoals: 1, completedGoals: 0, recentMemoryEntries: entries });
    expect(entries).toEqual(snapshot);
  });
});
