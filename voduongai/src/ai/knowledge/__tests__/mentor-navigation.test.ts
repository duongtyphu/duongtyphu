import { describe, it, expect } from "vitest";
import { createGoal, type GoalCategory } from "../../mentor/goal";
import type { ConversationStrategy } from "../../mentor/conversation-strategy";
import { buildMentorNavigation } from "../mentor-navigation";

function goalOf(category: GoalCategory, confidence = 0.8) {
  return createGoal({ id: category, title: category, description: "d", category, confidence });
}

function strategyOf(kind: ConversationStrategy["kind"]): ConversationStrategy {
  return { kind, reason: "test" };
}

describe("SPRINT A05 — Mentor Navigation: ánh xạ strategy → nextActionType", () => {
  it("teach → search-knowledge, recommendedArea = khu vực primaryRoute", () => {
    const result = buildMentorNavigation({ goal: goalOf("hoc-prompt"), strategy: strategyOf("teach") });
    expect(result.nextActionType).toBe("search-knowledge");
    expect(result.recommendedArea?.id).toBe("ckos");
  });

  it("coach → explore-platform", () => {
    const result = buildMentorNavigation({ goal: goalOf("hoc-prompt"), strategy: strategyOf("coach") });
    expect(result.nextActionType).toBe("explore-platform");
  });

  it("recommend → open-learning-content", () => {
    const result = buildMentorNavigation({ goal: goalOf("hoc-prompt"), strategy: strategyOf("recommend") });
    expect(result.nextActionType).toBe("open-learning-content");
  });

  it("encourage → review-progress, recommendedArea CỐ ĐỊNH 'Nhật ký học tập' (không theo primaryRoute)", () => {
    const result = buildMentorNavigation({ goal: goalOf("hoc-prompt"), strategy: strategyOf("encourage") });
    expect(result.nextActionType).toBe("review-progress");
    expect(result.recommendedArea?.id).toBe("nhat-ky-hoc-tap");
  });

  it("reflect → reflect, recommendedArea CỐ ĐỊNH 'Hành trình của tôi'", () => {
    const result = buildMentorNavigation({ goal: goalOf("hoc-prompt"), strategy: strategyOf("reflect") });
    expect(result.nextActionType).toBe("reflect");
    expect(result.recommendedArea?.id).toBe("hanh-trinh-cua-toi");
  });

  it("clarify → clarify, recommendedArea null (chưa xác định được gì cụ thể)", () => {
    const result = buildMentorNavigation({ goal: goalOf("hoc-prompt"), strategy: strategyOf("clarify") });
    expect(result.nextActionType).toBe("clarify");
    expect(result.recommendedArea).toBeNull();
    expect(result.knowledgeRoute.primaryRoute).toBeNull();
  });
});

describe("SPRINT A05 — Mentor Navigation: fallback khi không có route an toàn", () => {
  it("Goal mơ hồ (confidence thấp) + strategy='teach' → no-safe-route, recommendedArea null", () => {
    const result = buildMentorNavigation({ goal: goalOf("hoc-ai", 0.2), strategy: strategyOf("teach") });
    expect(result.nextActionType).toBe("no-safe-route");
    expect(result.recommendedArea).toBeNull();
    expect(result.explanation.length).toBeGreaterThan(0);
  });
});

describe("SPRINT A05 — Mentor Navigation: không tạo URL/điều hướng thật", () => {
  it("explanation không chứa URL nào", () => {
    const result = buildMentorNavigation({ goal: goalOf("hoc-prompt"), strategy: strategyOf("teach") });
    expect(result.explanation).not.toMatch(/https?:\/\//);
    expect(result.explanation).not.toContain("/portal");
  });
});

describe("SPRINT A05 — Mentor Navigation: deterministic + không mutate", () => {
  it("cùng input luôn cho cùng output", () => {
    const goal = goalOf("hoc-prompt");
    const strategy = strategyOf("teach");
    expect(buildMentorNavigation({ goal, strategy })).toEqual(buildMentorNavigation({ goal, strategy }));
  });

  it("không mutate Goal truyền vào", () => {
    const goal = goalOf("hoc-prompt");
    const snapshot = { ...goal };
    buildMentorNavigation({ goal, strategy: strategyOf("teach") });
    expect(goal).toEqual(snapshot);
  });
});
