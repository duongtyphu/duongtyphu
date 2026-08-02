import { describe, it, expect, beforeEach, vi } from "vitest";

/** `server-only` throw có chủ đích khi import từ bundle client — dưới
    Vitest cần mock, cùng kỹ thuật đã dùng ở `provider-layer.test.ts`. */
vi.mock("server-only", () => ({}));

import type { RuntimeConversation } from "../runtime-context";
import { runCompanionRuntimeEngine } from "../companion-runtime-engine";
import { __resetRuntimeExecutionLogForTest, listRuntimeExecutions } from "../runtime-execution-log";
import { createCatalogEntry, type KnowledgeCatalog } from "../../catalog/knowledge-catalog";

function convo(...userMessages: string[]): RuntimeConversation {
  return { turns: userMessages.map((content) => ({ role: "user" as const, content })) };
}

describe("SPRINT R01 — CompanionRuntimeEngine: 'Xin chào' → chưa có goal", () => {
  beforeEach(() => __resetRuntimeExecutionLogForTest());

  it("goal/learningPlan/knowledgeRouting đều null, strategy='clarify'", () => {
    const { context } = runCompanionRuntimeEngine({
      conversationId: "c1",
      conversation: convo("Xin chào"),
    });
    expect(context.goal).toBeNull();
    expect(context.learningPlan).toBeNull();
    expect(context.knowledgeRouting).toBeNull();
    expect(context.strategy.kind).toBe("clarify");
    expect(context.platformContext.currentArea).toBeNull();
    expect(context.memory.decision.status).toBe("discard");
    expect(context.reflection.achievements).toEqual([]);
  });

  it("ghi đúng 1 dòng Runtime Execution Log, không có field prompt/nội dung hội thoại", () => {
    runCompanionRuntimeEngine({ conversationId: "c1", conversation: convo("Xin chào") });
    const logs = listRuntimeExecutions("c1");
    expect(logs).toHaveLength(1);
    expect(logs[0].goalCategory).toBeNull();
    expect(logs[0].strategyKind).toBe("clarify");
    expect(logs[0].knowledgeRouted).toBe(false);
    expect(Object.keys(logs[0])).not.toContain("prompt");
    expect(logs[0].latencyMs.total).toBeGreaterThanOrEqual(0);
  });
});

describe("SPRINT R01 — CompanionRuntimeEngine: goal rõ ràng → đủ pipeline chạy trọn", () => {
  beforeEach(() => __resetRuntimeExecutionLogForTest());

  const CLEAR_MESSAGE =
    "Tôi muốn học prompt để áp dụng vào công việc, hiện tôi mới bắt đầu, muốn xong trong tháng này.";

  it("goal/learningPlan/knowledgeRouting đều có giá trị, strategy='recommend'", () => {
    const { context } = runCompanionRuntimeEngine({
      conversationId: "c2",
      conversation: convo(CLEAR_MESSAGE),
    });
    expect(context.goal?.category).toBe("hoc-prompt");
    expect(context.strategy.kind).toBe("recommend");
    expect(context.learningPlan?.knowledgeGap).toEqual([]);
    expect(context.knowledgeRouting?.primaryRoute?.platformAreaId).toBe("ckos");
    expect(context.knowledgeRouting?.alternativeRoutes.map((r) => r.platformAreaId)).toEqual(["hoc-vien-ai"]);
  });

  it("activeGoals/completedGoals mặc định 0 khi không truyền — không tự đọc Goal Runtime", () => {
    const { context } = runCompanionRuntimeEngine({
      conversationId: "c3",
      conversation: convo(CLEAR_MESSAGE),
    });
    expect(context.memory.progress.activeGoals).toBe(0);
    expect(context.memory.progress.completedGoals).toBe(0);
  });

  it("Runtime Execution Log ghi đúng category/strategy/routing/latency", () => {
    runCompanionRuntimeEngine({ conversationId: "c4", conversation: convo(CLEAR_MESSAGE) });
    const [log] = listRuntimeExecutions("c4");
    expect(log.goalCategory).toBe("hoc-prompt");
    expect(log.strategyKind).toBe("recommend");
    expect(log.knowledgeRouted).toBe(true);
    expect(log.primaryPlatformAreaId).toBe("ckos");
    expect(typeof log.latencyMs.mentor).toBe("number");
    expect(typeof log.latencyMs.platform).toBe("number");
    expect(typeof log.latencyMs.knowledge).toBe("number");
    expect(typeof log.latencyMs.memory).toBe("number");
  });
});

describe("SPRINT R01 — CompanionRuntimeEngine: không mutate conversation truyền vào", () => {
  it("giữ nguyên object đầu vào sau khi chạy", () => {
    const conversation = convo("Tôi muốn học prompt.");
    const snapshot = JSON.parse(JSON.stringify(conversation));
    runCompanionRuntimeEngine({ conversationId: "c5", conversation });
    expect(conversation).toEqual(snapshot);
  });
});

describe("SPRINT R02 — CompanionRuntimeEngine: Knowledge Catalog/Resolver mặc định + có Catalog", () => {
  beforeEach(() => __resetRuntimeExecutionLogForTest());

  const CLEAR_MESSAGE =
    "Tôi muốn học prompt để áp dụng vào công việc, hiện tôi mới bắt đầu, muốn xong trong tháng này.";

  it("không truyền catalog → mentorContext rỗng, warnings nêu trung thực 'không tìm thấy' (Engine không tự đọc Supabase/DB)", () => {
    const { mentorContext } = runCompanionRuntimeEngine({
      conversationId: "r2-1",
      conversation: convo(CLEAR_MESSAGE),
    });
    expect(mentorContext.suggestedPrompts).toEqual([]);
    expect(mentorContext.references).toEqual([]);
    expect(mentorContext.warnings).toEqual([
      "Không tìm thấy tri thức đã Publish nào khớp trong Catalog cho nhu cầu này.",
    ]);
  });

  it("'Xin chào' (chưa có goal) → mentorContext rỗng tuyệt đối, warnings nêu chưa có mục tiêu", () => {
    const { mentorContext } = runCompanionRuntimeEngine({
      conversationId: "r2-1b",
      conversation: convo("Xin chào"),
    });
    expect(mentorContext.suggestedPrompts).toEqual([]);
    expect(mentorContext.warnings).toEqual([
      "Chưa xác định được mục tiêu — chưa có nhu cầu tri thức cụ thể để tra cứu Catalog.",
    ]);
  });

  it("có catalog khớp goal 'hoc-prompt' → mentorContext.suggestedPrompts có đúng mục Published", () => {
    const catalog: KnowledgeCatalog = [
      createCatalogEntry({
        id: "prompt-1",
        title: "Prompt viết email",
        workspace: "ckos",
        visibility: "public",
        published: true,
        knowledgeType: "prompt",
        goalCategories: ["hoc-prompt"],
        url: "/portal/prompts/prompt-1",
      }),
      createCatalogEntry({
        id: "internal-1",
        title: "Ghi chú nội bộ Admin",
        workspace: "ckos",
        visibility: "internal",
        published: true,
        knowledgeType: "prompt",
        goalCategories: ["hoc-prompt"],
        url: "/admin/internal-1",
      }),
    ];
    const { mentorContext } = runCompanionRuntimeEngine({
      conversationId: "r2-2",
      conversation: convo(CLEAR_MESSAGE),
      catalog,
    });
    expect(mentorContext.suggestedPrompts.map((r) => r.id)).toEqual(["prompt-1"]);
  });

  it("mặc định hasPremiumAccess=false → nội dung Premium bị loại, có cảnh báo trong warnings", () => {
    const catalog: KnowledgeCatalog = [
      createCatalogEntry({
        id: "premium-1",
        title: "Bài học Premium",
        workspace: "hoc-vien-ai",
        visibility: "premium",
        published: true,
        knowledgeType: "lesson",
        goalCategories: ["hoc-prompt"],
        url: "/portal/premium/premium-1",
      }),
    ];
    const { mentorContext } = runCompanionRuntimeEngine({
      conversationId: "r2-3",
      conversation: convo(CLEAR_MESSAGE),
      catalog,
    });
    expect(mentorContext.suggestedLearning).toEqual([]);
    expect(mentorContext.warnings.some((w) => w.includes("Premium"))).toBe(true);
  });
});
