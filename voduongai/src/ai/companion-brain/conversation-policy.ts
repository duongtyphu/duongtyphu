/**
 * EPIC-A01 — Companion Brain Foundation — A03: Conversation Intelligence
 * Foundation.
 *
 * THUẦN KIẾN TRÚC — 6 Policy đúng đề bài (Greeting/Clarification/
 * Reasoning/Guidance/Reflection/Closing), mỗi Policy có Name/Description/
 * Status/Version. KHÔNG tích hợp Runtime, KHÔNG sửa/tạo Prompt —
 * `companion-chat.system.prompt.ts` (`COMPANION_CHAT_SYSTEM_PROMPT_V1`)
 * giữ nguyên 100%, không import file này, không bị import.
 *
 * `description` của mỗi Policy chỉ mô tả CẤU TRÚC/MỤC ĐÍCH của giai đoạn
 * hội thoại đó (khái niệm phổ quát của 1 mentor conversation flow) —
 * KHÔNG phải quy tắc hành vi/giọng văn cụ thể của Companion (đó là nội
 * dung Prompt thật, ngoài phạm vi Sprint này, và là quyết định của
 * Founder/PMO). `status: "draft"` cho cả 6 — chưa Published.
 */

export type PolicyStatus = "draft" | "published";

export type ConversationPolicyName = "greeting" | "clarification" | "reasoning" | "guidance" | "reflection" | "closing";

export type ConversationPolicy = {
  name: ConversationPolicyName;
  label: string;
  description: string;
  status: PolicyStatus;
  version: number;
};

export const COMPANION_CONVERSATION_POLICIES: ConversationPolicy[] = [
  {
    name: "greeting",
    label: "Greeting",
    description: "Giai đoạn mở đầu hội thoại — cách Companion chào người dùng, xác lập không khí trước khi vào nội dung.",
    status: "draft",
    version: 1,
  },
  {
    name: "clarification",
    label: "Clarification",
    description: "Giai đoạn làm rõ mục tiêu khi câu hỏi/yêu cầu của người dùng còn mơ hồ, trước khi đưa giải pháp.",
    status: "draft",
    version: 1,
  },
  {
    name: "reasoning",
    label: "Reasoning",
    description: "Giai đoạn suy luận/phân tích nội bộ — xác định hướng tiếp cận phù hợp trước khi phản hồi.",
    status: "draft",
    version: 1,
  },
  {
    name: "guidance",
    label: "Guidance",
    description: "Giai đoạn hướng dẫn — đưa bước hành động cụ thể, dễ làm theo cho người dùng.",
    status: "draft",
    version: 1,
  },
  {
    name: "reflection",
    label: "Reflection",
    description: "Giai đoạn phản tư — giúp người dùng tự nhìn lại tiến trình học/thực hành của chính họ.",
    status: "draft",
    version: 1,
  },
  {
    name: "closing",
    label: "Closing",
    description: "Giai đoạn kết thúc hội thoại — tóm tắt ngắn gọn, gợi ý bước tiếp theo.",
    status: "draft",
    version: 1,
  },
];

export function listConversationPolicies(): ConversationPolicy[] {
  return COMPANION_CONVERSATION_POLICIES;
}
