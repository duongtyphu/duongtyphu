import { describe, it, expect } from "vitest";
import { createGoal } from "../goal";
import { buildGoalPlan } from "../goal-plan";

describe("SPRINT A04 — Goal Planning: buildGoalPlan", () => {
  it("desiredOutcome dùng description khi có", () => {
    const goal = createGoal({
      id: "hoc-ai",
      title: "Học AI",
      description: "Muốn dùng AI để tăng năng suất công việc văn phòng.",
      category: "hoc-ai",
      confidence: 0.75,
    });
    const plan = buildGoalPlan({ goal });
    expect(plan.desiredOutcome).toBe("Muốn dùng AI để tăng năng suất công việc văn phòng.");
  });

  it("desiredOutcome fallback theo title khi description rỗng", () => {
    const goal = createGoal({ id: "hoc-ai", title: "Học AI", description: "", category: "hoc-ai", confidence: 0.75 });
    const plan = buildGoalPlan({ goal });
    expect(plan.desiredOutcome).toBe("Đạt được mục tiêu: Học AI");
  });

  it("currentState theo dải confidence 'clear' (>=0.70)", () => {
    const goal = createGoal({ id: "hoc-ai", title: "Học AI", description: "d", category: "hoc-ai", confidence: 0.75 });
    const plan = buildGoalPlan({ goal });
    expect(plan.currentState).toBe("Đã đủ rõ để bắt đầu từ trạng thái hiện tại.");
  });

  it("currentState theo dải confidence 'potential' (0.40-0.69)", () => {
    const goal = createGoal({ id: "hoc-ai", title: "Học AI", description: "d", category: "hoc-ai", confidence: 0.55 });
    const plan = buildGoalPlan({ goal });
    expect(plan.currentState).toBe("Đã có manh mối ban đầu nhưng chưa đủ rõ điểm xuất phát.");
  });

  it("currentState theo dải confidence 'unclear' (<0.40)", () => {
    const goal = createGoal({ id: "hoc-ai", title: "Học AI", description: "d", category: "hoc-ai", confidence: 0.3 });
    const plan = buildGoalPlan({ goal });
    expect(plan.currentState).toBe("Chưa rõ điểm xuất phát hiện tại.");
  });

  it("knowledgeGap tái dùng nguyên missingInformation truyền vào, mặc định rỗng", () => {
    const goal = createGoal({ id: "hoc-ai", title: "Học AI", description: "d", category: "hoc-ai", confidence: 0.75 });
    expect(buildGoalPlan({ goal }).knowledgeGap).toEqual([]);
    const missing = ["Chưa rõ mốc thời gian mong muốn hoàn thành."];
    expect(buildGoalPlan({ goal, missingInformation: missing }).knowledgeGap).toEqual(missing);
  });

  it("firstStep: có knowledgeGap thì hỏi làm rõ mục đầu tiên, không thì gợi ý bắt đầu tìm hiểu", () => {
    const goal = createGoal({ id: "hoc-ai", title: "Học AI", description: "d", category: "hoc-ai", confidence: 0.75 });
    const withGap = buildGoalPlan({ goal, missingInformation: ["Chưa rõ mục đích."] });
    expect(withGap.firstStep).toBe("Làm rõ: Chưa rõ mục đích.");
    const withoutGap = buildGoalPlan({ goal });
    expect(withoutGap.firstStep).toBe("Bắt đầu tìm hiểu về Học AI.");
  });

  it("nextStep: >1 knowledgeGap thì làm rõ mục thứ 2, ngược lại đề xuất bước tiếp theo", () => {
    const goal = createGoal({ id: "hoc-ai", title: "Học AI", description: "d", category: "hoc-ai", confidence: 0.75 });
    const twoGaps = buildGoalPlan({ goal, missingInformation: ["A", "B"] });
    expect(twoGaps.nextStep).toBe("Sau khi rõ hơn, tiếp tục làm rõ: B");
    const oneGap = buildGoalPlan({ goal, missingInformation: ["A"] });
    expect(oneGap.nextStep).toBe("Đề xuất bước hành động cụ thể tiếp theo cho Học AI.");
  });

  it("deterministic: cùng input luôn cho cùng output", () => {
    const goal = createGoal({ id: "hoc-ai", title: "Học AI", description: "d", category: "hoc-ai", confidence: 0.75 });
    const input = { goal, missingInformation: ["A", "B"] };
    expect(buildGoalPlan(input)).toEqual(buildGoalPlan(input));
  });

  it("không mutate goal truyền vào", () => {
    const goal = createGoal({ id: "hoc-ai", title: "Học AI", description: "d", category: "hoc-ai", confidence: 0.75 });
    const snapshot = { ...goal };
    buildGoalPlan({ goal, missingInformation: ["A"] });
    expect(goal).toEqual(snapshot);
  });
});
