import { describe, it, expect } from "vitest";
import type { Conversation } from "../goal-detector";
import { runMentorPipeline } from "../mentor-pipeline";

function convo(...userMessages: string[]): Conversation {
  return { turns: userMessages.map((content) => ({ role: "user" as const, content })) };
}

describe("SPRINT A04 — Mentor Pipeline: runMentorPipeline", () => {
  it("hội thoại rõ ràng ngay từ đầu → detect đúng Goal, strategy 'teach', state 'plan'", () => {
    const result = runMentorPipeline(convo("Tôi mới bắt đầu, muốn học AI để áp dụng vào công việc văn phòng."));

    expect(result.detectedGoal).not.toBeNull();
    expect(result.detectedGoal?.category).toBe("hoc-ai");
    expect(result.detectedGoal?.confidence).toBeCloseTo(0.75, 5);
    expect(result.goalPlan?.knowledgeGap).toHaveLength(1);
    expect(result.strategy.kind).toBe("teach");
    expect(result.mentorResponse.clarification).toBeNull();
    expect(result.mentorResponse.recommendation).toBe(result.goalPlan?.firstStep);
    expect(result.state).toBe("plan");
  });

  it("hội thoại mơ hồ (potential) → strategy 'clarify', state 'clarify'", () => {
    const result = runMentorPipeline(convo("Tôi muốn học AI."));

    expect(result.detectedGoal).not.toBeNull();
    expect(result.strategy.kind).toBe("clarify");
    expect(result.mentorResponse.clarification?.needsClarification).toBe(true);
    expect(result.mentorResponse.recommendation).toBeNull();
    expect(result.state).toBe("clarify");
  });

  it("hội thoại không liên quan → không có Goal, strategy 'clarify', state 'discover'", () => {
    const result = runMentorPipeline(convo("Chào Companion, hôm nay thời tiết đẹp quá, bạn khoẻ không?"));

    expect(result.detectedGoal).toBeNull();
    expect(result.goalPlan).toBeNull();
    expect(result.strategy.kind).toBe("clarify");
    expect(result.state).toBe("discover");
  });

  it("truyền currentState khác 'greeting' → state machine áp dụng đúng luật của state đó", () => {
    const result = runMentorPipeline(
      convo("Tôi mới bắt đầu, muốn học AI để áp dụng vào công việc văn phòng."),
      "plan"
    );
    // strategy = teach (khác "reflect") → từ "plan" đi tới "guide".
    expect(result.strategy.kind).toBe("teach");
    expect(result.state).toBe("guide");
  });

  it("deterministic: cùng input luôn cho cùng output", () => {
    const conversation = convo("Tôi mới bắt đầu, muốn học AI để áp dụng vào công việc văn phòng.");
    expect(runMentorPipeline(conversation)).toEqual(runMentorPipeline(conversation));
  });

  it("không mutate conversation truyền vào", () => {
    const conversation = convo("Tôi muốn học AI để áp dụng vào công việc.");
    const snapshot = JSON.parse(JSON.stringify(conversation));
    runMentorPipeline(conversation);
    expect(conversation).toEqual(snapshot);
  });
});
