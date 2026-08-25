/**
 * SPRINT R01-FIX — Runtime Boundary & Public Response.
 *
 * `buildPublicChatResponse()` là RANH GIỚI DUY NHẤT giữa dữ liệu nội bộ
 * server (`RuntimeContext`/`RuntimeResponse` — xem `runtime-context.ts`/
 * `runtime-response.ts`) và JSON response `/api/companion/chat` trả về
 * trình duyệt. Cố ý KHÔNG nhận `RuntimeContext`/`RuntimeResponse` làm
 * tham số — không field nào của Companion Brain (`goal`/`strategy`/
 * `learningPlan`/`knowledgeRouting`/`memory`/`reflection`/`prompt`) có
 * đường nào "rò rỉ" ra ngoài qua hàm này, kể cả vô ý, vì chữ ký hàm không
 * hề có quyền truy cập chúng.
 *
 * Giữ ĐÚNG 4 field hợp đồng public đã có từ trước khi R01 bắt đầu —
 * KHÔNG thêm field mới trừ khi UI thật sự cần và đã có dữ liệu thật (R01
 * chưa có UI nào cần thêm).
 *
 * PORTAL 2.0, GIAI ĐOẠN 2, mục 2a — ĐÚNG trường hợp ngoại lệ ở trên đã xảy
 * ra: UI cần 1 tín hiệu thật để hỏi "Lưu khoảnh khắc này?" (ghi nhớ tự
 * động phát hiện + xác nhận 1 chạm). Thêm ĐÚNG 1 field mới
 * `memorySuggestion` — KHÔNG mở lại toàn bộ `RuntimeContext.memory`
 * (`MemoryDecision` đầy đủ có `reason`/nội bộ khác không cần lộ ra), chỉ 1
 * projection hẹp `{content, type}` lấy từ `MemoryCandidate` khi
 * `decision.status === "keep"` — route.ts tự tính, hàm này vẫn KHÔNG nhận
 * `RuntimeContext`/`MemoryDecision` làm tham số (giữ đúng nguyên tắc "chữ
 * ký hàm không có quyền truy cập" ở trên, chỉ nới đúng 1 field cụ thể).
 * `content` ở đây là nguyên văn tin nhắn user VỪA GÕ (không phải dữ liệu
 * ẩn/suy luận) — an toàn hiển thị lại cho chính người đó xác nhận.
 */

export type CompanionMessageRow = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

/** Portal 2.0, Giai đoạn 2 — projection hẹp của `MemoryCandidate`
    (`content`/`type`), `null` khi lượt này không có gì đáng gợi ý lưu. */
export type CompanionMemorySuggestion = {
  content: string;
  type: string;
};

export type PublicChatResponse = {
  conversationId: string;
  userMessage: CompanionMessageRow;
  assistantMessage: CompanionMessageRow;
  isMock: boolean;
  memorySuggestion: CompanionMemorySuggestion | null;
};

export function buildPublicChatResponse(input: {
  conversationId: string;
  userMessage: CompanionMessageRow;
  assistantMessage: CompanionMessageRow;
  isMock: boolean;
  memorySuggestion: CompanionMemorySuggestion | null;
}): PublicChatResponse {
  return {
    conversationId: input.conversationId,
    userMessage: input.userMessage,
    assistantMessage: input.assistantMessage,
    isMock: input.isMock,
    memorySuggestion: input.memorySuggestion,
  };
}
