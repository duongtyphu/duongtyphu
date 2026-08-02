import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  recordRuntimeExecution,
  listRuntimeExecutions,
  __resetRuntimeExecutionLogForTest,
  type RuntimeExecutionLogEntry,
} from "../runtime-execution-log";

function entryOf(overrides: Partial<RuntimeExecutionLogEntry> = {}): RuntimeExecutionLogEntry {
  return {
    conversationId: "conv-1",
    goalCategory: "hoc-prompt",
    goalConfidence: 0.8,
    strategyKind: "recommend",
    knowledgeRouted: true,
    primaryPlatformAreaId: "ckos",
    memoryDecisionStatus: "keep",
    nextActionType: "practice",
    latencyMs: { mentor: 1, platform: 1, knowledge: 1, memory: 1, total: 4 },
    at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("SPRINT R01 — RuntimeExecutionLog: ghi + lọc theo conversationId", () => {
  beforeEach(() => __resetRuntimeExecutionLogForTest());

  it("recordRuntimeExecution rồi listRuntimeExecutions trả đúng dòng đã ghi", () => {
    recordRuntimeExecution(entryOf({ conversationId: "a" }));
    recordRuntimeExecution(entryOf({ conversationId: "b" }));
    expect(listRuntimeExecutions()).toHaveLength(2);
    expect(listRuntimeExecutions("a")).toHaveLength(1);
    expect(listRuntimeExecutions("a")[0].conversationId).toBe("a");
  });

  it("không log prompt/nội dung hội thoại — chỉ đúng các field cấu trúc đã khai báo", () => {
    recordRuntimeExecution(entryOf());
    const [entry] = listRuntimeExecutions();
    expect(Object.keys(entry).sort()).toEqual(
      [
        "at",
        "conversationId",
        "goalCategory",
        "goalConfidence",
        "knowledgeRouted",
        "latencyMs",
        "memoryDecisionStatus",
        "nextActionType",
        "primaryPlatformAreaId",
        "strategyKind",
      ].sort()
    );
  });

  it("giới hạn tối đa 1000 dòng, giữ lại các dòng MỚI NHẤT", () => {
    for (let i = 0; i < 1005; i++) recordRuntimeExecution(entryOf({ conversationId: `c-${i}` }));
    const all = listRuntimeExecutions();
    expect(all).toHaveLength(1000);
    expect(all[0].conversationId).toBe("c-5");
    expect(all[all.length - 1].conversationId).toBe("c-1004");
  });
});
