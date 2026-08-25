import { describe, it, expect, vi } from "vitest";

/** `companion-runtime-engine` import "server-only" — cần mock dưới Vitest,
    cùng kỹ thuật đã dùng ở `provider-layer.test.ts`. */
vi.mock("server-only", () => ({}));

import type { RuntimeConversation } from "../runtime-context";
import { runCompanionRuntimeEngine } from "../companion-runtime-engine";
import { buildCompanionPrompt } from "../companion-prompt-builder";
import { createCatalogEntry, type KnowledgeCatalog } from "../../catalog/knowledge-catalog";

function convo(...userMessages: string[]): RuntimeConversation {
  return { turns: userMessages.map((content) => ({ role: "user" as const, content })) };
}

/**
 * SPRINT R02 — Integration test bắt buộc theo Verify: Goal → KnowledgeNeed
 * → Resolver → KnowledgePackage → Prompt (→ Provider, xem ghi chú cuối
 * file). Chạy trọn pipeline thật (không mock từng bước) qua 1 Catalog giả
 * lập đủ 3 tình huống Permission: public (được lấy), premium chưa có
 * quyền (bị ẩn, có cảnh báo), internal (không bao giờ lộ dù có quyền gì).
 */
describe("SPRINT R02 — Integration: Goal → KnowledgeNeed → Resolver → KnowledgePackage → Prompt", () => {
  const CLEAR_MESSAGE =
    "Tôi muốn học prompt để áp dụng vào công việc, hiện tôi mới bắt đầu, muốn xong trong tháng này.";

  const catalog: KnowledgeCatalog = [
    createCatalogEntry({
      id: "ckos-prompt-public",
      title: "Prompt viết email chuyên nghiệp",
      workspace: "ckos",
      visibility: "public",
      published: true,
      knowledgeType: "prompt",
      goalCategories: ["hoc-prompt"],
      url: "/portal/prompts/ckos-prompt-public",
    }),
    createCatalogEntry({
      id: "academy-lesson-premium",
      title: "Bài học nâng cao — Premium",
      workspace: "hoc-vien-ai",
      visibility: "premium",
      published: true,
      knowledgeType: "lesson",
      goalCategories: ["hoc-prompt"],
      url: "/portal/premium/academy-lesson-premium",
    }),
    createCatalogEntry({
      id: "ckos-internal-note",
      title: "Ghi chú nội bộ — chưa duyệt xuất bản công khai",
      workspace: "ckos",
      visibility: "internal",
      published: true,
      knowledgeType: "prompt",
      goalCategories: ["hoc-prompt"],
      url: "/admin/ckos/internal-note",
    }),
    createCatalogEntry({
      id: "ckos-draft-prompt",
      title: "Prompt còn đang soạn — chưa Publish",
      workspace: "ckos",
      visibility: "public",
      published: false,
      knowledgeType: "prompt",
      goalCategories: ["hoc-prompt"],
      url: "/portal/prompts/ckos-draft-prompt",
    }),
  ];

  it("1) Goal Detection nhận đúng category từ tin nhắn", () => {
    const { context } = runCompanionRuntimeEngine({ conversationId: "int-1", conversation: convo(CLEAR_MESSAGE) });
    expect(context.goal?.category).toBe("hoc-prompt");
  });

  it("2) KnowledgeNeed đã có sẵn trong knowledgeRouting (A05), đúng knowledgeTypes cho 'hoc-prompt'", () => {
    const { context } = runCompanionRuntimeEngine({ conversationId: "int-2", conversation: convo(CLEAR_MESSAGE) });
    expect(context.knowledgeRouting?.knowledgeNeed.knowledgeTypes).toEqual(
      expect.arrayContaining(["prompt", "lesson"])
    );
  });

  it("3-4) Resolver → KnowledgePackage: chỉ mục Published + đúng quyền lọt qua, Draft/Internal/Premium-chưa-quyền bị chặn", () => {
    const { mentorContext } = runCompanionRuntimeEngine({
      conversationId: "int-3",
      conversation: convo(CLEAR_MESSAGE),
      catalog,
      hasPremiumAccess: false,
    });

    const allReferenceIds = [
      ...mentorContext.suggestedPrompts,
      ...mentorContext.suggestedLearning,
      ...mentorContext.references,
      ...mentorContext.suggestedTools,
      ...mentorContext.suggestedWorkflow,
      ...mentorContext.suggestedProjects,
    ].map((r) => r.id);

    expect(allReferenceIds).toContain("ckos-prompt-public");
    expect(allReferenceIds).not.toContain("academy-lesson-premium"); // chưa có quyền Premium
    expect(allReferenceIds).not.toContain("ckos-internal-note"); // Internal — không bao giờ lộ
    expect(allReferenceIds).not.toContain("ckos-draft-prompt"); // published=false
    expect(mentorContext.warnings.some((w) => w.includes("Premium"))).toBe(true);
  });

  it("5) Prompt: chứa đúng tham chiếu Published/có quyền, KHÔNG BAO GIỜ chứa tiêu đề nội dung Internal/Premium bị chặn", () => {
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "int-4",
      conversation: convo(CLEAR_MESSAGE),
      catalog,
      hasPremiumAccess: false,
    });
    const { prompt } = buildCompanionPrompt(context, mentorContext, [], CLEAR_MESSAGE);

    expect(prompt).toContain("Prompt viết email chuyên nghiệp");
    expect(prompt).not.toContain("Bài học nâng cao — Premium");
    expect(prompt).not.toContain("Ghi chú nội bộ");
    expect(prompt).not.toContain("Prompt còn đang soạn");
  });

  it("có quyền Premium → Prompt giờ chứa cả nội dung Premium, Internal vẫn không bao giờ lộ", () => {
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "int-5",
      conversation: convo(CLEAR_MESSAGE),
      catalog,
      hasPremiumAccess: true,
    });
    const { prompt } = buildCompanionPrompt(context, mentorContext, [], CLEAR_MESSAGE);

    expect(prompt).toContain("Bài học nâng cao — Premium");
    expect(prompt).not.toContain("Ghi chú nội bộ");
  });

  it("Không regression: response public (xem public-chat-response.ts) vẫn không thể chứa bất kỳ field Catalog/KnowledgePackage nào", async () => {
    const { buildPublicChatResponse } = await import("../public-chat-response");
    const response = buildPublicChatResponse({
      conversationId: "int-6",
      userMessage: { id: "u1", role: "user", content: "hi", created_at: "2026-01-01T00:00:00.000Z" },
      assistantMessage: { id: "a1", role: "assistant", content: "hello", created_at: "2026-01-01T00:00:00.000Z" },
      isMock: true,
      memorySuggestion: null,
    });
    expect(Object.keys(response).sort()).toEqual(
      ["assistantMessage", "conversationId", "isMock", "memorySuggestion", "userMessage"].sort()
    );
  });
});

/**
 * "→ Provider" (bước cuối của Verify): `route.ts` gọi
 * `providerManager.execute({ ..., input: { prompt } })` với đúng chuỗi
 * `prompt` đã build ở trên — KHÔNG đổi gì ở tầng Provider (R02 cấm sửa
 * Provider). Không mock/gọi lại `providerManager` ở đây (đã có bộ test
 * riêng `provider-layer.test.ts`) — phần này chỉ xác nhận `prompt` cuối
 * cùng (input của Provider) phản ánh đúng toàn bộ pipeline R02 phía trên.
 */
