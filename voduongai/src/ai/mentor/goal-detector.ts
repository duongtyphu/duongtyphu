/**
 * EPIC-A02 — Goal Engine Foundation: Goal Detection.
 *
 * CHỈ INTERFACE — không cài đặt. Sprint này định nghĩa hợp đồng đầu vào/
 * đầu ra (`Conversation` → `GoalCandidate[]`) để Runtime/AI thật (ngoài
 * phạm vi EPIC-A02, không Prompt/không LLM ở đây) implement sau.
 */

import type { Goal, GoalCategory } from "./goal";
import { createGoal } from "./goal";

/**
 * 1 lượt nói trong hội thoại — shape tối thiểu, ĐỘC LẬP với `ChatMessage`/
 * Conversation Logic thật của Runtime (không import chéo) để giữ Goal
 * Engine tách biệt hoàn toàn khỏi Chat Runtime hiện có.
 */
export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

/** Toàn bộ ngữ cảnh hội thoại đưa vào Goal Detection. */
export type Conversation = {
  turns: ConversationTurn[];
};

/**
 * 1 khả năng Goal được nhận diện từ hội thoại — CHƯA chắc chắn là Goal đã
 * chốt (đó là lý do có `confidence`, khác `Goal` đã "chốt" trong `goal.ts`).
 */
export type GoalCandidate = {
  title: string;
  description: string;
  category: GoalCategory;
  /** 0-1 — độ tự tin của Goal Detection với ứng viên này. */
  confidence: number;
  /** Đoạn hội thoại (nếu có) làm căn cứ nhận diện — phục vụ giải thích/
      debug, không bắt buộc. */
  evidence?: string;
  /** SPRINT A03 — thông tin còn thiếu để hiểu đầy đủ mục tiêu này (mỗi
      phần tử 1 ý ngắn, dùng chung cho `ClarificationResult`). Mảng rỗng
      nghĩa là không còn thiếu thông tin phổ quát nào (không đồng nghĩa
      "đã đủ confidence" — 2 khái niệm độc lập). */
  missingInformation: string[];
};

/**
 * Hợp đồng Goal Detection: `Conversation → GoalCandidate[]`. CHỈ INTERFACE
 * — namespace này không chứa cài đặt AI/Prompt/LLM nào. Runtime tương lai
 * sẽ viết 1 implementation khớp chữ ký này (có thể đồng bộ hoặc bất đồng
 * bộ, tuỳ cách detect được chọn sau này).
 */
export interface GoalDetector {
  detect(conversation: Conversation): GoalCandidate[] | Promise<GoalCandidate[]>;
}

/**
 * Helper thuần — chuyển 1 `GoalCandidate` thành `Goal` đã "chốt" (status
 * mặc định `"candidate"`, có thể override). KHÔNG tự quyết định candidate
 * nào nên được chốt — đó là việc của nơi gọi/Runtime tương lai, không
 * phải business logic thuộc namespace này.
 *
 * FIX EPIC-A02 — `id` giờ BẮT BUỘC truyền vào (khớp `createGoal()` không
 * còn tự sinh id) — nơi gọi tự quyết định chiến lược đặt id.
 */
export function goalCandidateToGoal(
  candidate: GoalCandidate,
  id: string,
  overrides?: { priority?: Goal["priority"]; status?: Goal["status"] }
): Goal {
  return createGoal({
    id,
    title: candidate.title,
    description: candidate.description,
    category: candidate.category,
    confidence: candidate.confidence,
    priority: overrides?.priority,
    status: overrides?.status,
  });
}
