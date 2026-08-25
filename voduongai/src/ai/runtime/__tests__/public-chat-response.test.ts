import { describe, it, expect } from "vitest";
import { buildPublicChatResponse, type CompanionMessageRow } from "../public-chat-response";

function rowOf(content: string): CompanionMessageRow {
  return { id: "m1", role: "assistant", content, created_at: "2026-01-01T00:00:00.000Z" };
}

const FORBIDDEN_KEYS = ["goal", "strategy", "learningPlan", "knowledgeRouting", "memory", "reflection", "prompt"];

describe("SPRINT R01-FIX — Public Chat Response: ranh giới nội bộ/public", () => {
  it("GIAI ĐOẠN 2 — chỉ trả đúng 5 field hợp đồng (4 cũ + memorySuggestion), không có field Companion Brain nào khác", () => {
    const response = buildPublicChatResponse({
      conversationId: "conv-1",
      userMessage: rowOf("Xin chào"),
      assistantMessage: rowOf("Chào bạn!"),
      isMock: false,
      memorySuggestion: null,
    });

    expect(Object.keys(response).sort()).toEqual(
      ["assistantMessage", "conversationId", "isMock", "memorySuggestion", "userMessage"].sort()
    );
  });

  it("memorySuggestion chỉ có đúng 2 field content/type — không lộ reason/confidence/shouldRemember nội bộ của MemoryCandidate", () => {
    const response = buildPublicChatResponse({
      conversationId: "conv-1b",
      userMessage: rowOf("Tôi vừa học được cách viết prompt."),
      assistantMessage: rowOf("Tuyệt vời!"),
      isMock: false,
      memorySuggestion: { content: "Tôi vừa học được cách viết prompt.", type: "learning" },
    });

    expect(Object.keys(response.memorySuggestion ?? {}).sort()).toEqual(["content", "type"]);
    const json = JSON.stringify(response);
    for (const forbidden of ["reason", "confidence", "shouldRemember"]) {
      expect(json).not.toContain(`"${forbidden}"`);
    }
  });

  it("không chứa bất kỳ key nào trong danh sách cấm (goal/strategy/learningPlan/knowledgeRouting/memory/reflection/prompt)", () => {
    const response = buildPublicChatResponse({
      conversationId: "conv-2",
      userMessage: rowOf("Tôi muốn học prompt."),
      assistantMessage: rowOf("Được, mình sẽ giúp bạn."),
      isMock: true,
      memorySuggestion: null,
    });

    for (const key of FORBIDDEN_KEYS) {
      expect(Object.keys(response)).not.toContain(key);
    }
    // Đảm bảo chuỗi JSON cuối cùng (đúng dạng route.ts gửi qua
    // NextResponse.json()) cũng không chứa các key cấm ở bất kỳ độ sâu nào.
    const json = JSON.stringify(response);
    for (const key of FORBIDDEN_KEYS) {
      expect(json).not.toContain(`"${key}"`);
    }
  });

  it("hàm dựng response public KHÔNG có tham số nhận RuntimeContext/RuntimeResponse — kiểm tra bằng runtime introspection", () => {
    // buildPublicChatResponse chỉ khai báo đúng 1 tham số (object input) —
    // không có cách nào truyền RuntimeContext vào mà không qua đúng 4 field
    // đã định nghĩa (TypeScript chặn ở compile-time; dòng dưới xác nhận
    // thêm ở runtime rằng function arity đúng như thiết kế).
    expect(buildPublicChatResponse.length).toBe(1);
  });
});
