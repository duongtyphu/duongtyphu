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
 */

export type CompanionMessageRow = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

export type PublicChatResponse = {
  conversationId: string;
  userMessage: CompanionMessageRow;
  assistantMessage: CompanionMessageRow;
  isMock: boolean;
};

export function buildPublicChatResponse(input: {
  conversationId: string;
  userMessage: CompanionMessageRow;
  assistantMessage: CompanionMessageRow;
  isMock: boolean;
}): PublicChatResponse {
  return {
    conversationId: input.conversationId,
    userMessage: input.userMessage,
    assistantMessage: input.assistantMessage,
    isMock: input.isMock,
  };
}
