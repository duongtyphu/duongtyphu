import { describe, it, expect } from "vitest";
import { createGoal, type GoalCategory } from "../../mentor/goal";
import type { ConversationStrategy } from "../../mentor/conversation-strategy";
import { inferKnowledgeNeed } from "../knowledge-need";

const TEACH: ConversationStrategy = { kind: "teach", reason: "test" };
const CLARIFY: ConversationStrategy = { kind: "clarify", reason: "test" };

function goalOf(category: GoalCategory, confidence = 0.8) {
  return createGoal({ id: category, title: category, description: "d", category, confidence });
}

describe("SPRINT A05 — Knowledge Need: theo từng Goal category", () => {
  it("Goal học AI (hoc-ai)", () => {
    const need = inferKnowledgeNeed(goalOf("hoc-ai"), TEACH);
    expect(need.knowledgeTypes).toEqual(["lesson", "course", "best-practice"]);
    expect(need.preferredSources).toEqual(["ckos", "academy"]);
    expect(need.requiredPlatformAreas).toEqual(["ckos", "hoc-vien-ai"]);
  });

  it("Goal học Prompt (hoc-prompt) — khớp đúng ví dụ mẫu Sprint", () => {
    const need = inferKnowledgeNeed(goalOf("hoc-prompt"), TEACH);
    expect(need.knowledgeTypes).toEqual(["prompt", "lesson", "best-practice"]);
    expect(need.preferredSources).toEqual(["ckos", "academy"]);
    expect(need.requiredPlatformAreas).toEqual(["ckos", "hoc-vien-ai"]);
  });

  it("Goal tìm Tool (hoc-cong-cu-ai) — khớp đúng ví dụ mẫu Sprint", () => {
    const need = inferKnowledgeNeed(goalOf("hoc-cong-cu-ai"), TEACH);
    expect(need.knowledgeTypes).toEqual(["tool", "workflow", "best-practice"]);
    expect(need.preferredSources).toEqual(["ckos"]);
    expect(need.requiredPlatformAreas).toEqual(["ckos", "ai-workspace"]);
  });

  it("Goal Premium — khớp đúng ví dụ mẫu Sprint (sources sắp theo priority: academy trước premium)", () => {
    const need = inferKnowledgeNeed(goalOf("premium"), TEACH);
    expect(need.knowledgeTypes).toEqual(["premium-content", "course"]);
    expect(need.preferredSources).toEqual(["academy", "premium"]);
    expect(need.requiredPlatformAreas).toEqual(["premium", "hoc-vien-ai"]);
  });

  it("Goal Dự án & Cơ hội (du-an-co-hoi)", () => {
    const need = inferKnowledgeNeed(goalOf("du-an-co-hoi"), TEACH);
    expect(need.knowledgeTypes).toEqual(["project", "case-study", "resource"]);
    expect(need.preferredSources).toEqual(["projects", "community"]);
    expect(need.requiredPlatformAreas).toEqual(["du-an-co-hoi", "cong-dong"]);
  });

  it("Goal 'khac' (fallback) — chỉ hướng dẫn chung, không khu vực nào, có missingInformation", () => {
    const need = inferKnowledgeNeed(goalOf("khac"), TEACH);
    expect(need.knowledgeTypes).toEqual(["general-guidance"]);
    expect(need.preferredSources).toEqual(["general-model-knowledge"]);
    expect(need.requiredPlatformAreas).toEqual([]);
    expect(need.missingInformation.length).toBeGreaterThan(0);
  });
});

describe("SPRINT A05 — Knowledge Need: strategy 'clarify' ghi đè mọi category", () => {
  it("Goal rõ ràng ('hoc-prompt') nhưng strategy='clarify' → vẫn về hướng dẫn chung, không khu vực nào", () => {
    const need = inferKnowledgeNeed(goalOf("hoc-prompt"), CLARIFY);
    expect(need.knowledgeTypes).toEqual(["general-guidance"]);
    expect(need.preferredSources).toEqual(["general-model-knowledge"]);
    expect(need.requiredPlatformAreas).toEqual([]);
    expect(need.missingInformation.length).toBeGreaterThan(0);
  });
});

describe("SPRINT A05 — Knowledge Need: multi-goal — không lẫn lộn giữa các lần gọi", () => {
  it("2 Goal khác category cho 2 kết quả độc lập, không ảnh hưởng lẫn nhau", () => {
    const needA = inferKnowledgeNeed(goalOf("hoc-ai"), TEACH);
    const needB = inferKnowledgeNeed(goalOf("premium"), TEACH);

    expect(needA.requiredPlatformAreas).toEqual(["ckos", "hoc-vien-ai"]);
    expect(needB.requiredPlatformAreas).toEqual(["premium", "hoc-vien-ai"]);

    // Mutate kết quả A không ảnh hưởng tới B lẫn 1 lần gọi lại A khác.
    needA.requiredPlatformAreas.push("mutated");
    const needAAgain = inferKnowledgeNeed(goalOf("hoc-ai"), TEACH);
    expect(needAAgain.requiredPlatformAreas).toEqual(["ckos", "hoc-vien-ai"]);
    expect(needB.requiredPlatformAreas).toEqual(["premium", "hoc-vien-ai"]);
  });
});

describe("SPRINT A05 — Knowledge Need: deterministic + không mutate input", () => {
  it("cùng input luôn cho cùng output", () => {
    const goal = goalOf("hoc-prompt");
    expect(inferKnowledgeNeed(goal, TEACH)).toEqual(inferKnowledgeNeed(goal, TEACH));
  });

  it("không mutate Goal truyền vào", () => {
    const goal = goalOf("hoc-prompt");
    const snapshot = { ...goal };
    inferKnowledgeNeed(goal, TEACH);
    expect(goal).toEqual(snapshot);
  });

  it("confidence kế thừa trực tiếp từ goal.confidence", () => {
    const goal = goalOf("hoc-ai", 0.65);
    expect(inferKnowledgeNeed(goal, TEACH).confidence).toBe(0.65);
  });
});
