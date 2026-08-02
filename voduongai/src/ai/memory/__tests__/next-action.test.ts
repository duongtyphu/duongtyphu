import { describe, it, expect } from "vitest";
import type { MemoryCandidate } from "../memory-candidate";
import type { MemoryDecision } from "../memory-policy";
import type { ProgressSnapshot } from "../progress";
import { buildNextAction } from "../next-action";

function candidateOf(overrides: Partial<MemoryCandidate>): MemoryCandidate {
  return { content: "c", type: "learning", confidence: 0.8, shouldRemember: true, reason: "r", ...overrides };
}

function decisionOf(overrides: Partial<MemoryDecision>): MemoryDecision {
  return { status: "keep", reason: "r", candidate: candidateOf({}), ...overrides };
}

function progressOf(overrides: Partial<ProgressSnapshot>): ProgressSnapshot {
  return {
    activeGoals: 1,
    completedGoals: 0,
    learningTrend: "steady",
    confidence: 0.5,
    recommendedFocus: "f",
    ...overrides,
  };
}

describe("SPRINT A06 — Next Action: 6 nhánh đều có đúng 1 điều kiện kích hoạt", () => {
  it("activeGoals=0 → clarify-goal (ưu tiên cao nhất, bất kể memoryDecision)", () => {
    const result = buildNextAction({ memoryDecision: decisionOf({ status: "keep" }), progress: progressOf({ activeGoals: 0 }) });
    expect(result.actionType).toBe("clarify-goal");
    expect(result.priority).toBe(1);
  });

  it("memoryDecision.status='review' → review", () => {
    const result = buildNextAction({
      memoryDecision: decisionOf({ status: "review", candidate: candidateOf({ type: "learning" }) }),
      progress: progressOf({}),
    });
    expect(result.actionType).toBe("review");
  });

  it("learningTrend='declining' → rest", () => {
    const result = buildNextAction({
      memoryDecision: decisionOf({ status: "discard", candidate: null }),
      progress: progressOf({ learningTrend: "declining" }),
    });
    expect(result.actionType).toBe("rest");
  });

  it("status='keep' + type='preference' → practice", () => {
    const result = buildNextAction({
      memoryDecision: decisionOf({ status: "keep", candidate: candidateOf({ type: "preference" }) }),
      progress: progressOf({ learningTrend: "steady" }),
    });
    expect(result.actionType).toBe("practice");
  });

  it("status='keep' + type='learning' + trend='improving' → continue-learning", () => {
    const result = buildNextAction({
      memoryDecision: decisionOf({ status: "keep", candidate: candidateOf({ type: "learning" }) }),
      progress: progressOf({ learningTrend: "improving" }),
    });
    expect(result.actionType).toBe("continue-learning");
  });

  it("còn lại (vd. status='discard', trend='steady') → explore-platform", () => {
    const result = buildNextAction({
      memoryDecision: decisionOf({ status: "discard", candidate: null }),
      progress: progressOf({ learningTrend: "steady" }),
    });
    expect(result.actionType).toBe("explore-platform");
    expect(result.priority).toBe(3);
  });
});

describe("SPRINT A06 — Next Action: deterministic + không mutate", () => {
  it("cùng input luôn cho cùng output", () => {
    const input = { memoryDecision: decisionOf({}), progress: progressOf({}) };
    expect(buildNextAction(input)).toEqual(buildNextAction(input));
  });

  it("không mutate memoryDecision/progress truyền vào", () => {
    const memoryDecision = decisionOf({});
    const progress = progressOf({});
    const decisionSnapshot = { ...memoryDecision };
    const progressSnapshot = { ...progress };
    buildNextAction({ memoryDecision, progress });
    expect(memoryDecision).toEqual(decisionSnapshot);
    expect(progress).toEqual(progressSnapshot);
  });
});
