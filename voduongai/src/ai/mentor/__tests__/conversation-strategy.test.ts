import { describe, it, expect } from "vitest";
import { createGoal } from "../goal";
import { selectConversationStrategy } from "../conversation-strategy";

function goalWith(confidence: number, status: "candidate" | "active" | "paused" | "achieved" | "abandoned" = "active") {
  return createGoal({ id: "hoc-ai", title: "Học AI", description: "d", category: "hoc-ai", confidence, status });
}

describe("SPRINT A04 — Conversation Strategy: selectConversationStrategy", () => {
  it("không có Goal → clarify", () => {
    const strategy = selectConversationStrategy({ goal: null, needsClarification: false, knowledgeGapCount: 0 });
    expect(strategy.kind).toBe("clarify");
  });

  it("cần làm rõ (needsClarification) → clarify", () => {
    const strategy = selectConversationStrategy({
      goal: goalWith(0.75),
      needsClarification: true,
      knowledgeGapCount: 0,
    });
    expect(strategy.kind).toBe("clarify");
  });

  it("Goal đã đạt (status='achieved') → reflect", () => {
    const strategy = selectConversationStrategy({
      goal: goalWith(0.75, "achieved"),
      needsClarification: false,
      knowledgeGapCount: 0,
    });
    expect(strategy.kind).toBe("reflect");
  });

  it("Goal đang tạm dừng (status='paused') → encourage", () => {
    const strategy = selectConversationStrategy({
      goal: goalWith(0.75, "paused"),
      needsClarification: false,
      knowledgeGapCount: 0,
    });
    expect(strategy.kind).toBe("encourage");
  });

  it("Goal bị bỏ dở (status='abandoned') → encourage", () => {
    const strategy = selectConversationStrategy({
      goal: goalWith(0.75, "abandoned"),
      needsClarification: false,
      knowledgeGapCount: 0,
    });
    expect(strategy.kind).toBe("encourage");
  });

  it("đủ rõ (clear) và không còn thiếu thông tin → recommend", () => {
    const strategy = selectConversationStrategy({
      goal: goalWith(0.85),
      needsClarification: false,
      knowledgeGapCount: 0,
    });
    expect(strategy.kind).toBe("recommend");
  });

  it("còn thiếu thông tin (knowledgeGapCount>0) → teach", () => {
    const strategy = selectConversationStrategy({
      goal: goalWith(0.75),
      needsClarification: false,
      knowledgeGapCount: 1,
    });
    expect(strategy.kind).toBe("teach");
  });

  it("đủ rõ nhưng band không phải 'clear' và không còn thiếu thông tin → coach", () => {
    const strategy = selectConversationStrategy({
      goal: goalWith(0.5),
      needsClarification: false,
      knowledgeGapCount: 0,
    });
    expect(strategy.kind).toBe("coach");
  });

  it("deterministic: cùng input luôn cho cùng output", () => {
    const input = { goal: goalWith(0.75), needsClarification: false, knowledgeGapCount: 1 };
    expect(selectConversationStrategy(input)).toEqual(selectConversationStrategy(input));
  });
});
