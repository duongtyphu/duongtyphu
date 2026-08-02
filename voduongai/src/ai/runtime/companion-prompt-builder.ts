/**
 * SPRINT R01 — Companion Runtime Integration: Companion Prompt Builder.
 *
 * Input: `RuntimeContext`. Output: System Prompt / User Context /
 * Conversation Context (+ 1 chuỗi `prompt` đã ghép sẵn, đúng quy ước
 * `input.prompt` hiện có của `ProviderManager.execute()` — Provider Layer
 * chưa có API multi-turn message array, xem `companion-chat.ts`).
 *
 * KHÔNG đổi Persona/Constitution — `COMPANION_CHAT_SYSTEM_PROMPT_V1` giữ
 * nguyên 100% nội dung, chỉ đổi CÁCH ghép: chèn thêm 1 khối "User Context"
 * (mục tiêu/chiến lược/kế hoạch/khu vực tri thức — suy từ `RuntimeContext`,
 * route.ts trước đây KHÔNG có khối này) giữa System Prompt và lịch sử hội
 * thoại. Phần cắt gọn lịch sử TÁI DÙNG NGUYÊN `trimHistoryForContext()`
 * (`lib/portal/companion-chat.ts`) — không viết lại logic cắt lịch sử.
 *
 * SPRINT R02 — Phần 6: thêm khối "Knowledge Package" giữa Runtime Context
 * và Conversation Context, đúng thứ tự đã chốt "System → Runtime Context →
 * Knowledge Package → Conversation". Builder CHỈ đọc `MentorContext`
 * (`ai/catalog/mentor-context.ts`) — KHÔNG tự đọc CKOS/Catalog/Supabase/
 * Published Layer nào khác, KHÔNG đưa raw article/markdown vào prompt
 * (chỉ title/url đã có sẵn trong `KnowledgeReference`).
 *
 * SPRINT FIX-R02 — Phần 5: đổi tên tham số/field `knowledgePackage` →
 * `mentorContext` (đúng rename Phần 3), hành vi đọc/ghép prompt giữ
 * nguyên 100%.
 */
import { COMPANION_CHAT_SYSTEM_PROMPT_V1 } from "@/ai/prompts/companion-chat.system.prompt";
import { trimHistoryForContext, type CompanionHistoryItem } from "@/lib/portal/companion-chat";
import { GOAL_CATEGORY_LABEL } from "../mentor/goal";
import type { MentorContext, KnowledgeReference } from "../catalog/mentor-context";
import type { RuntimeContext } from "./runtime-context";

export type CompanionPromptResult = {
  systemPrompt: string;
  userContext: string;
  knowledgePackageContext: string;
  conversationContext: string;
  /** Ghép sẵn theo đúng thứ tự System Prompt → User Context → Knowledge
      Package → Conversation Context — dùng thẳng cho
      `providerManager.execute()`. */
  prompt: string;
};

/** Khối "User Context" — mục tiêu/chiến lược/kế hoạch/khu vực tri thức
    liên quan, suy TRỰC TIẾP từ các field đã có sẵn trong `RuntimeContext`
    (không tự tính lại/không thêm business logic mới). */
function buildUserContext(context: RuntimeContext): string {
  const lines: string[] = [];

  lines.push(
    context.goal
      ? `Mục tiêu hiện tại của người dùng: "${context.goal.title}" (nhóm: ${GOAL_CATEGORY_LABEL[context.goal.category]}).`
      : "Chưa xác định được mục tiêu cụ thể nào từ hội thoại hiện tại."
  );

  lines.push(`Chiến lược hội thoại nên dùng: ${context.strategy.kind} — ${context.strategy.reason}`);

  if (context.learningPlan) {
    lines.push(`Kết quả mong muốn: ${context.learningPlan.desiredOutcome}`);
    if (context.learningPlan.knowledgeGap.length > 0) {
      lines.push(`Thông tin còn thiếu cần làm rõ: ${context.learningPlan.knowledgeGap.join("; ")}`);
    }
  }

  if (context.knowledgeRouting?.primaryRoute) {
    lines.push(`Khu vực tri thức phù hợp nhất: ${context.knowledgeRouting.primaryRoute.reason}`);
  }

  if (context.memory.decision.status === "keep" && context.memory.decision.candidate) {
    lines.push(`Ghi nhận đáng nhớ từ lượt này: ${context.memory.decision.candidate.type}.`);
  }

  return lines.join("\n");
}

/** Khối "Knowledge Package" (Phần 6) — CHỈ metadata nhẹ (title/url) từ
    `KnowledgePackage`, KHÔNG raw article/markdown. Rỗng (chuỗi "") khi
    Package không có gì để gợi ý — Prompt Builder không tự bịa nội dung. */
function buildKnowledgePackageContext(mentorContext: MentorContext): string {
  const lines: string[] = [];

  const addBucket = (label: string, refs: KnowledgeReference[]) => {
    if (refs.length === 0) return;
    lines.push(`${label}: ${refs.map((r) => `${r.title} (${r.url})`).join("; ")}`);
  };

  addBucket("Bài học/khoá học liên quan", mentorContext.suggestedLearning);
  addBucket("Công cụ liên quan", mentorContext.suggestedTools);
  addBucket("Prompt mẫu liên quan", mentorContext.suggestedPrompts);
  addBucket("Quy trình liên quan", mentorContext.suggestedWorkflow);
  addBucket("Dự án liên quan", mentorContext.suggestedProjects);
  addBucket("Tài liệu tham khảo khác", mentorContext.references);

  if (mentorContext.warnings.length > 0) lines.push(`Lưu ý: ${mentorContext.warnings.join(" ")}`);

  return lines.join("\n");
}

/** Khối "Conversation Context" — lịch sử đã cắt gọn (tái dùng
    `trimHistoryForContext()`) + tin nhắn mới nhất. */
function buildConversationContext(history: CompanionHistoryItem[], userMessage: string): string {
  const historyText = trimHistoryForContext(history)
    .map((m) => `${m.role === "user" ? "Người dùng" : "Companion"}: ${m.content}`)
    .join("\n");

  return [historyText ? `Lịch sử hội thoại gần đây:\n${historyText}` : "", `Người dùng vừa nói: "${userMessage}"`]
    .filter(Boolean)
    .join("\n");
}

export function buildCompanionPrompt(
  context: RuntimeContext,
  mentorContext: MentorContext,
  history: CompanionHistoryItem[],
  userMessage: string
): CompanionPromptResult {
  const systemPrompt = COMPANION_CHAT_SYSTEM_PROMPT_V1;
  const userContext = buildUserContext(context);
  const knowledgePackageContext = buildKnowledgePackageContext(mentorContext);
  const conversationContext = buildConversationContext(history, userMessage);

  // Đúng thứ tự Phần 6: System → Runtime Context → Knowledge Package →
  // Conversation.
  const prompt = [
    systemPrompt,
    `\nBối cảnh người học:\n${userContext}`,
    knowledgePackageContext
      ? `\nTri thức tham khảo (đã Publish, đã kiểm tra quyền truy cập):\n${knowledgePackageContext}`
      : "",
    `\n${conversationContext}`,
    `\nHãy trả lời trực tiếp bằng tiếng Việt, không lặp lại nhãn "Companion:" ở đầu câu trả lời.`,
  ]
    .filter((section) => section.length > 0)
    .join("\n");

  return { systemPrompt, userContext, knowledgePackageContext, conversationContext, prompt };
}

export const CompanionPromptBuilder = { build: buildCompanionPrompt };
