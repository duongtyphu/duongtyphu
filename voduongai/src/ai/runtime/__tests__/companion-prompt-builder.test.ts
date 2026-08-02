import { describe, it, expect, vi } from "vitest";

/** `companion-runtime-engine` import "server-only" — cần mock dưới Vitest,
    cùng kỹ thuật đã dùng ở `provider-layer.test.ts`. */
vi.mock("server-only", () => ({}));

import type { RuntimeConversation } from "../runtime-context";
import { runCompanionRuntimeEngine } from "../companion-runtime-engine";
import { buildCompanionPrompt } from "../companion-prompt-builder";
import { COMPANION_CHAT_SYSTEM_PROMPT_V1 } from "@/ai/prompts/companion-chat.system.prompt";
import type { CompanionHistoryItem } from "@/lib/portal/companion-chat";
import type { KnowledgeCatalog } from "../../catalog/knowledge-catalog";
import { createCatalogEntry } from "../../catalog/knowledge-catalog";

function convo(...userMessages: string[]): RuntimeConversation {
  return { turns: userMessages.map((content) => ({ role: "user" as const, content })) };
}

const CLEAR_MESSAGE =
  "Tôi muốn học prompt để áp dụng vào công việc, hiện tôi mới bắt đầu, muốn xong trong tháng này.";

describe("SPRINT R01 — CompanionPromptBuilder: không đổi Persona/Constitution", () => {
  it("systemPrompt giữ nguyên 100% COMPANION_CHAT_SYSTEM_PROMPT_V1", () => {
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "p1",
      conversation: convo("Xin chào"),
    });
    const result = buildCompanionPrompt(context, mentorContext, [], "Xin chào");
    expect(result.systemPrompt).toBe(COMPANION_CHAT_SYSTEM_PROMPT_V1);
    expect(result.prompt.startsWith(COMPANION_CHAT_SYSTEM_PROMPT_V1)).toBe(true);
  });
});

describe("SPRINT R01 — CompanionPromptBuilder: User Context phản ánh đúng RuntimeContext", () => {
  it("có goal → userContext nhắc đúng category, không nhắc khi chưa có goal", () => {
    const { context: withGoal, mentorContext: pkg1 } = runCompanionRuntimeEngine({
      conversationId: "p2",
      conversation: convo(CLEAR_MESSAGE),
    });
    const withGoalResult = buildCompanionPrompt(withGoal, pkg1, [], CLEAR_MESSAGE);
    expect(withGoalResult.userContext).toContain("Học Prompt");
    expect(withGoalResult.userContext).toContain("recommend");

    const { context: noGoal, mentorContext: pkg2 } = runCompanionRuntimeEngine({
      conversationId: "p3",
      conversation: convo("Xin chào"),
    });
    const noGoalResult = buildCompanionPrompt(noGoal, pkg2, [], "Xin chào");
    expect(noGoalResult.userContext).toContain("Chưa xác định được mục tiêu");
  });
});

describe("SPRINT R01 — CompanionPromptBuilder: Conversation Context tái dùng trimHistoryForContext", () => {
  it("chèn đúng lịch sử + tin nhắn mới nhất, không lặp nhãn Companion ở đầu", () => {
    const history: CompanionHistoryItem[] = [
      { role: "user", content: "Chào Companion" },
      { role: "assistant", content: "Chào bạn!" },
    ];
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "p4",
      conversation: convo("Xin chào"),
    });
    const result = buildCompanionPrompt(context, mentorContext, history, "Tôi muốn học AI.");
    expect(result.conversationContext).toContain("Người dùng: Chào Companion");
    expect(result.conversationContext).toContain("Companion: Chào bạn!");
    expect(result.conversationContext).toContain('Người dùng vừa nói: "Tôi muốn học AI."');
  });

  it("lịch sử rỗng vẫn dựng được conversationContext hợp lệ", () => {
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "p5",
      conversation: convo("Xin chào"),
    });
    const result = buildCompanionPrompt(context, mentorContext, [], "Xin chào");
    expect(result.conversationContext).toContain('Người dùng vừa nói: "Xin chào"');
  });
});

describe("SPRINT R02 — CompanionPromptBuilder: Knowledge Package (Phần 6)", () => {
  it("chưa có goal ('Xin chào') → knowledgePackageContext chỉ có 1 dòng Lưu ý trung thực, không có mục nào khác", () => {
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "p6",
      conversation: convo("Xin chào"),
    });
    const result = buildCompanionPrompt(context, mentorContext, [], "Xin chào");
    expect(result.knowledgePackageContext).toBe(
      "Lưu ý: Chưa xác định được mục tiêu — chưa có nhu cầu tri thức cụ thể để tra cứu Catalog."
    );
    expect(result.prompt).toContain("Tri thức tham khảo");
  });

  it("có goal nhưng Catalog rỗng → prompt nêu trung thực 'không tìm thấy', không bịa tham chiếu nào", () => {
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "p6b",
      conversation: convo(CLEAR_MESSAGE),
    });
    const result = buildCompanionPrompt(context, mentorContext, [], CLEAR_MESSAGE);
    expect(result.knowledgePackageContext).toBe(
      "Lưu ý: Không tìm thấy tri thức đã Publish nào khớp trong Catalog cho nhu cầu này."
    );
  });

  it("có Catalog khớp → prompt chứa đúng thứ tự System → Runtime Context → Knowledge Package → Conversation, chỉ title/url (không raw content)", () => {
    const catalog: KnowledgeCatalog = [
      createCatalogEntry({
        id: "prompt-1",
        title: "Prompt viết email chuyên nghiệp",
        workspace: "ckos",
        visibility: "public",
        published: true,
        knowledgeType: "prompt",
        goalCategories: ["hoc-prompt"],
        url: "/portal/prompts/prompt-1",
      }),
    ];
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "p7",
      conversation: convo(CLEAR_MESSAGE),
      catalog,
    });
    const result = buildCompanionPrompt(context, mentorContext, [], CLEAR_MESSAGE);

    expect(result.knowledgePackageContext).toContain("Prompt viết email chuyên nghiệp");
    expect(result.knowledgePackageContext).toContain("/portal/prompts/prompt-1");

    const systemIdx = result.prompt.indexOf(COMPANION_CHAT_SYSTEM_PROMPT_V1);
    const runtimeIdx = result.prompt.indexOf("Bối cảnh người học");
    const packageIdx = result.prompt.indexOf("Tri thức tham khảo");
    const conversationIdx = result.prompt.indexOf("Người dùng vừa nói");
    expect(systemIdx).toBeGreaterThanOrEqual(0);
    expect(systemIdx).toBeLessThan(runtimeIdx);
    expect(runtimeIdx).toBeLessThan(packageIdx);
    expect(packageIdx).toBeLessThan(conversationIdx);
  });

  it("Premium chưa có quyền → cảnh báo minh bạch trong prompt, KHÔNG lộ tiêu đề nội dung Premium", () => {
    const catalog: KnowledgeCatalog = [
      createCatalogEntry({
        id: "premium-secret",
        title: "Bài học Premium tuyệt mật",
        workspace: "hoc-vien-ai",
        visibility: "premium",
        published: true,
        knowledgeType: "lesson",
        goalCategories: ["hoc-prompt"],
        url: "/portal/premium/premium-secret",
      }),
    ];
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "p8",
      conversation: convo(CLEAR_MESSAGE),
      catalog,
      hasPremiumAccess: false,
    });
    const result = buildCompanionPrompt(context, mentorContext, [], CLEAR_MESSAGE);
    expect(result.prompt).not.toContain("Bài học Premium tuyệt mật");
    expect(result.prompt).toContain("1 nội dung Premium liên quan nhưng bạn chưa có quyền truy cập");
  });
});
