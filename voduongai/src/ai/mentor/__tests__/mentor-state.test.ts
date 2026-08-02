import { describe, it, expect } from "vitest";
import { nextMentorState } from "../mentor-state";

describe("SPRINT A04 — Mentor State: nextMentorState", () => {
  it("greeting, chưa có Goal → discover", () => {
    expect(
      nextMentorState({ currentState: "greeting", hasGoal: false, needsClarification: false, strategy: "clarify" })
    ).toBe("discover");
  });

  it("greeting, có Goal nhưng cần làm rõ → clarify", () => {
    expect(
      nextMentorState({ currentState: "greeting", hasGoal: true, needsClarification: true, strategy: "clarify" })
    ).toBe("clarify");
  });

  it("greeting, có Goal và đã đủ rõ ngay từ lượt đầu → plan (không bắt buộc qua discover)", () => {
    expect(
      nextMentorState({ currentState: "greeting", hasGoal: true, needsClarification: false, strategy: "teach" })
    ).toBe("plan");
  });

  it("discover, chưa có Goal → vẫn discover", () => {
    expect(
      nextMentorState({ currentState: "discover", hasGoal: false, needsClarification: false, strategy: "clarify" })
    ).toBe("discover");
  });

  it("discover, có Goal và đủ rõ → plan", () => {
    expect(
      nextMentorState({ currentState: "discover", hasGoal: true, needsClarification: false, strategy: "recommend" })
    ).toBe("plan");
  });

  it("clarify, vẫn còn cần làm rõ → giữ nguyên clarify", () => {
    expect(
      nextMentorState({ currentState: "clarify", hasGoal: true, needsClarification: true, strategy: "clarify" })
    ).toBe("clarify");
  });

  it("clarify, đã đủ rõ → chuyển sang plan", () => {
    expect(
      nextMentorState({ currentState: "clarify", hasGoal: true, needsClarification: false, strategy: "teach" })
    ).toBe("plan");
  });

  it("plan, strategy='reflect' → reflect", () => {
    expect(
      nextMentorState({ currentState: "plan", hasGoal: true, needsClarification: false, strategy: "reflect" })
    ).toBe("reflect");
  });

  it("plan, strategy khác 'reflect' → guide", () => {
    for (const strategy of ["teach", "coach", "recommend", "encourage"] as const) {
      expect(nextMentorState({ currentState: "plan", hasGoal: true, needsClarification: false, strategy })).toBe(
        "guide"
      );
    }
  });

  it("guide, strategy='reflect' → reflect", () => {
    expect(
      nextMentorState({ currentState: "guide", hasGoal: true, needsClarification: false, strategy: "reflect" })
    ).toBe("reflect");
  });

  it("guide, strategy khác → giữ nguyên guide", () => {
    expect(
      nextMentorState({ currentState: "guide", hasGoal: true, needsClarification: false, strategy: "coach" })
    ).toBe("guide");
  });

  it("reflect → summarize", () => {
    expect(
      nextMentorState({ currentState: "reflect", hasGoal: true, needsClarification: false, strategy: "reflect" })
    ).toBe("summarize");
  });

  it("summarize → giữ nguyên summarize", () => {
    expect(
      nextMentorState({ currentState: "summarize", hasGoal: true, needsClarification: false, strategy: "reflect" })
    ).toBe("summarize");
  });

  it("deterministic: cùng input luôn cho cùng output", () => {
    const input = { currentState: "plan", hasGoal: true, needsClarification: false, strategy: "teach" } as const;
    expect(nextMentorState(input)).toEqual(nextMentorState(input));
  });
});
