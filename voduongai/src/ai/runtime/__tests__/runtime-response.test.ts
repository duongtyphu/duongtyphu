import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import type { RuntimeConversation } from "../runtime-context";
import { runCompanionRuntimeEngine } from "../companion-runtime-engine";
import { buildRuntimeResponse } from "../runtime-response";

function convo(...userMessages: string[]): RuntimeConversation {
  return { turns: userMessages.map((content) => ({ role: "user" as const, content })) };
}

describe("SPRINT R01 — RuntimeResponse: lắp đúng 6 field từ RuntimeContext + assistantMessage", () => {
  it("đúng shape, không tính lại business logic", () => {
    const { context } = runCompanionRuntimeEngine({
      conversationId: "r1",
      conversation: convo("Tôi muốn học prompt để áp dụng vào công việc, hiện tôi mới bắt đầu, muốn xong trong tháng này."),
    });
    const response = buildRuntimeResponse(context, "Đây là câu trả lời của Companion.");

    expect(response.assistantMessage).toBe("Đây là câu trả lời của Companion.");
    expect(response.goal).toBe(context.goal);
    expect(response.strategy).toBe(context.strategy);
    expect(response.learningPlan).toBe(context.learningPlan);
    expect(response.knowledgeRouting).toBe(context.knowledgeRouting);
    expect(response.nextAction).toBe(context.memory.nextAction);
    expect(Object.keys(response).sort()).toEqual(
      ["assistantMessage", "goal", "knowledgeRouting", "learningPlan", "nextAction", "strategy"].sort()
    );
  });

  it("goal=null → learningPlan/knowledgeRouting cũng null, nextAction vẫn có giá trị", () => {
    const { context } = runCompanionRuntimeEngine({ conversationId: "r2", conversation: convo("Xin chào") });
    const response = buildRuntimeResponse(context, "Chào bạn!");
    expect(response.goal).toBeNull();
    expect(response.learningPlan).toBeNull();
    expect(response.knowledgeRouting).toBeNull();
    expect(response.nextAction.actionType).toBe("clarify-goal");
  });
});
