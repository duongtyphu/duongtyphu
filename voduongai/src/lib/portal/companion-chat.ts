/**
 * Companion Chat MVP — helper thuần (không gọi mạng/DB), dùng chung giữa
 * API route và Server Actions của `/portal/companion`.
 */

export const COMPANION_MESSAGE_MAX_LENGTH = 4000;
/** Số message gần nhất (cả user lẫn assistant) đưa vào ngữ cảnh gửi model. */
export const COMPANION_CONTEXT_MAX_MESSAGES = 12;
/** Giới hạn tổng ký tự của phần lịch sử trong ngữ cảnh — tránh 1 vài
    message rất dài vẫn nuốt hết ngân sách token dù mới lấy vài dòng. */
export const COMPANION_CONTEXT_MAX_CHARS = 6000;
export const COMPANION_TITLE_MAX_LENGTH = 60;

export type CompanionChatRole = "user" | "assistant";

export type CompanionHistoryItem = {
  role: CompanionChatRole;
  content: string;
};

/** Tiêu đề conversation cắt gọn từ tin nhắn đầu tiên — không gọi AI. */
export function buildConversationTitle(firstMessage: string): string {
  const flat = firstMessage.replace(/\s+/g, " ").trim();
  if (flat.length <= COMPANION_TITLE_MAX_LENGTH) return flat || "Cuộc trò chuyện mới";
  return `${flat.slice(0, COMPANION_TITLE_MAX_LENGTH).trimEnd()}…`;
}

/** Lấy tối đa N message gần nhất, rồi cắt tiếp theo ngân sách ký tự tổng
    (giữ các message MỚI NHẤT, bỏ bớt từ đầu nếu vượt ngân sách) — tránh
    gửi lịch sử vô hạn cho model. */
export function trimHistoryForContext(history: CompanionHistoryItem[]): CompanionHistoryItem[] {
  const recent = history.slice(-COMPANION_CONTEXT_MAX_MESSAGES);
  let total = 0;
  const kept: CompanionHistoryItem[] = [];
  for (let i = recent.length - 1; i >= 0; i--) {
    const item = recent[i];
    total += item.content.length;
    if (total > COMPANION_CONTEXT_MAX_CHARS && kept.length > 0) break;
    kept.unshift(item);
  }
  return kept;
}

/** Ghép system prompt + lịch sử đã cắt gọn + message mới thành 1 prompt
    duy nhất — đúng quy ước `input.prompt` của Provider Layer hiện có
    (chỉ nhận 1 chuỗi, không có API multi-turn message array). */
export function buildCompanionChatPrompt(params: {
  systemPrompt: string;
  history: CompanionHistoryItem[];
  userMessage: string;
}): string {
  const { systemPrompt, history, userMessage } = params;
  const historyText = trimHistoryForContext(history)
    .map((m) => `${m.role === "user" ? "Người dùng" : "Companion"}: ${m.content}`)
    .join("\n");

  return [
    systemPrompt,
    historyText ? `\nLịch sử hội thoại gần đây:\n${historyText}` : "",
    `\nNgười dùng vừa nói: "${userMessage}"`,
    `\nHãy trả lời trực tiếp bằng tiếng Việt, không lặp lại nhãn "Companion:" ở đầu câu trả lời.`,
  ]
    .filter(Boolean)
    .join("\n");
}
