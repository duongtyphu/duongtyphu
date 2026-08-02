import { describe, it, expect } from "vitest";
import { createEmptyGoalSummary } from "../goal-summary";

describe("EPIC-A02 Goal Engine Foundation — createEmptyGoalSummary", () => {
  it("trả về summary trung thực — primaryGoal null, không bịa dữ liệu", () => {
    const summary = createEmptyGoalSummary();
    expect(summary.primaryGoal).toBeNull();
    expect(summary.confidence).toBe(0);
    expect(summary.missingInformation).toEqual([]);
    expect(summary.suggestedQuestions).toEqual([]);
  });

  it("mỗi lần gọi trả về object mới, không chia sẻ tham chiếu mảng", () => {
    const a = createEmptyGoalSummary();
    const b = createEmptyGoalSummary();
    expect(a).not.toBe(b);
    expect(a.missingInformation).not.toBe(b.missingInformation);
    expect(a.suggestedQuestions).not.toBe(b.suggestedQuestions);
  });
});
