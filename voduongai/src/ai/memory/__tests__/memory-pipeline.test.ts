import { describe, it, expect } from "vitest";
import type { Conversation } from "../memory-candidate";
import { runMemoryPipeline } from "../memory-pipeline";

function convo(...userMessages: string[]): Conversation {
  return { turns: userMessages.map((content) => ({ role: "user" as const, content })) };
}

describe("SPRINT A06 — Memory Pipeline: 'Xin chào' → discard, clarify-goal (chưa có mục tiêu)", () => {
  it("chạy trọn pipeline không có activeGoals", () => {
    const result = runMemoryPipeline(convo("Xin chào"));
    expect(result.memoryCandidates).toHaveLength(1);
    expect(result.memoryDecision.status).toBe("discard");
    expect(result.reflection.achievements).toEqual([]);
    expect(result.reflection.difficulties).toEqual([]);
    expect(result.progress.activeGoals).toBe(0);
    expect(result.nextAction.actionType).toBe("clarify-goal");
  });
});

describe("SPRINT A06 — Memory Pipeline: học tập + thành tựu, có activeGoals → continue-learning", () => {
  it("candidate 'learning' + reflection achievements + trend improving", () => {
    const result = runMemoryPipeline(
      convo("Tôi đã học được cách viết prompt và đã hoàn thành bài tập đầu tiên."),
      { activeGoals: 1 }
    );
    expect(result.memoryDecision.status).toBe("keep");
    expect(result.memoryDecision.candidate?.type).toBe("learning");
    expect(result.reflection.achievements).toHaveLength(1);
    expect(result.progress.learningTrend).toBe("improving");
    expect(result.nextAction.actionType).toBe("continue-learning");
  });
});

describe("SPRINT A06 — Memory Pipeline: sở thích học tập, có activeGoals → practice", () => {
  it("'Tôi thích học bằng video.'", () => {
    const result = runMemoryPipeline(convo("Tôi thích học bằng video."), { activeGoals: 1 });
    expect(result.memoryDecision.status).toBe("keep");
    expect(result.memoryDecision.candidate?.type).toBe("preference");
    expect(result.nextAction.actionType).toBe("practice");
  });
});

describe("SPRINT A06 — Memory Pipeline: gặp khó khăn, có activeGoals → rest", () => {
  it("'Tôi bắt đầu học AI nhưng gặp khó khăn nhiều chỗ.'", () => {
    const result = runMemoryPipeline(convo("Tôi bắt đầu học AI nhưng gặp khó khăn nhiều chỗ."), { activeGoals: 1 });
    expect(result.reflection.difficulties).toHaveLength(1);
    expect(result.progress.learningTrend).toBe("declining");
    expect(result.nextAction.actionType).toBe("rest");
  });
});

describe("SPRINT A06 — Memory Pipeline: deterministic + không mutate", () => {
  it("cùng input luôn cho cùng output", () => {
    const conversation = convo("Hôm nay tôi bắt đầu học AI.");
    expect(runMemoryPipeline(conversation, { activeGoals: 1 })).toEqual(runMemoryPipeline(conversation, { activeGoals: 1 }));
  });

  it("không mutate conversation truyền vào", () => {
    const conversation = convo("Hôm nay tôi bắt đầu học AI để áp dụng vào công việc.");
    const snapshot = JSON.parse(JSON.stringify(conversation));
    runMemoryPipeline(conversation, { activeGoals: 1 });
    expect(conversation).toEqual(snapshot);
  });
});
