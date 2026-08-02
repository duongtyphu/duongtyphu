import { describe, it, expect } from "vitest";
import { createGoal, type GoalCategory } from "../../mentor/goal";
import type { ConversationStrategy } from "../../mentor/conversation-strategy";
import { routeKnowledge } from "../knowledge-routing";
import { sortSourcesByPriority } from "../knowledge-source";

const TEACH: ConversationStrategy = { kind: "teach", reason: "test" };
const CLARIFY: ConversationStrategy = { kind: "clarify", reason: "test" };

function goalOf(category: GoalCategory, confidence = 0.8) {
  return createGoal({ id: category, title: category, description: "d", category, confidence });
}

describe("SPRINT A05 — Knowledge Routing: route theo Goal rõ ràng", () => {
  it("Goal học Prompt, confidence cao → primaryRoute là CKOS, alternativeRoutes là Học viện AI", () => {
    const result = routeKnowledge({ goal: goalOf("hoc-prompt"), strategy: TEACH });

    expect(result.primaryRoute?.platformAreaId).toBe("ckos");
    expect(result.primaryRoute?.knowledgeTypes).toEqual(["prompt", "lesson", "best-practice"]);
    expect(result.alternativeRoutes).toHaveLength(1);
    expect(result.alternativeRoutes[0].platformAreaId).toBe("hoc-vien-ai");
    expect(result.alternativeRoutes[0].knowledgeTypes).toEqual(["lesson", "best-practice"]);
    expect(result.unresolvedQuestions).toEqual([]);
  });

  it("mỗi KnowledgeRoute chỉ chứa knowledgeType mà khu vực đó thật sự hỗ trợ (không bịa)", () => {
    const result = routeKnowledge({ goal: goalOf("premium"), strategy: TEACH });
    // premium node hỗ trợ premium-content/course; hoc-vien-ai hỗ trợ cả 2 cũng có premium-content.
    expect(result.primaryRoute?.knowledgeTypes).toEqual(["premium-content", "course"]);
    expect(result.alternativeRoutes[0].knowledgeTypes).toEqual(["premium-content", "course"]);
  });

  it("sourcePriority khớp đúng sortSourcesByPriority(knowledgeNeed.preferredSources)", () => {
    const result = routeKnowledge({ goal: goalOf("du-an-co-hoi"), strategy: TEACH });
    expect(result.sourcePriority).toEqual(sortSourcesByPriority(result.knowledgeNeed.preferredSources));
    expect(result.primaryRoute?.platformAreaId).toBe("du-an-co-hoi");
  });

  it("reason không chứa URL/nội dung bịa — chỉ nhắc tên khu vực + nhãn category thật", () => {
    const result = routeKnowledge({ goal: goalOf("hoc-cong-cu-ai"), strategy: TEACH });
    expect(result.reason).not.toMatch(/https?:\/\//);
    expect(result.reason).toContain("Học Công cụ AI");
  });
});

describe("SPRINT A05 — Knowledge Routing: Goal mơ hồ → không chọn route chắc chắn", () => {
  it("confidence thấp (< 0.4) → primaryRoute null, có unresolvedQuestions", () => {
    const result = routeKnowledge({ goal: goalOf("hoc-ai", 0.3), strategy: TEACH });
    expect(result.primaryRoute).toBeNull();
    expect(result.alternativeRoutes).toEqual([]);
    expect(result.unresolvedQuestions.length).toBeGreaterThan(0);
  });
});

describe("SPRINT A05 — Knowledge Routing: fallback khi không có route an toàn", () => {
  it("strategy='clarify' → luôn ưu tiên làm rõ, không chọn route dù confidence cao", () => {
    const result = routeKnowledge({ goal: goalOf("hoc-prompt", 0.9), strategy: CLARIFY });
    expect(result.primaryRoute).toBeNull();
    expect(result.reason).toContain("chưa đủ rõ");
    expect(result.unresolvedQuestions.length).toBeGreaterThan(0);
  });

  it("Goal category 'khac' (không có khu vực nào ánh xạ) → luôn no-safe-route dù confidence cao", () => {
    const result = routeKnowledge({ goal: goalOf("khac", 0.9), strategy: TEACH });
    expect(result.primaryRoute).toBeNull();
    expect(result.unresolvedQuestions.length).toBeGreaterThan(0);
  });
});

describe("SPRINT A05 — Knowledge Routing: deterministic + không mutate input", () => {
  it("cùng input luôn cho cùng output", () => {
    const goal = goalOf("hoc-prompt");
    expect(routeKnowledge({ goal, strategy: TEACH })).toEqual(routeKnowledge({ goal, strategy: TEACH }));
  });

  it("không mutate Goal truyền vào", () => {
    const goal = goalOf("hoc-prompt");
    const snapshot = { ...goal };
    routeKnowledge({ goal, strategy: TEACH });
    expect(goal).toEqual(snapshot);
  });

  it("mutate kết quả trả về không ảnh hưởng lần gọi sau", () => {
    const goal = goalOf("hoc-prompt");
    const first = routeKnowledge({ goal, strategy: TEACH });
    first.alternativeRoutes.push({ platformAreaId: "fake", knowledgeTypes: [], sources: [], reason: "", priority: 99 });
    const second = routeKnowledge({ goal, strategy: TEACH });
    expect(second.alternativeRoutes).toHaveLength(1);
  });
});
