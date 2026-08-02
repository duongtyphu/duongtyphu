/**
 * SPRINT A06 — Memory & Reflection Engine: Memory Candidate.
 *
 * `MemoryCandidate` là ứng viên trí nhớ rút ra TRỰC TIẾP từ 1 lượt hội
 * thoại — rule-based, deterministic (chỉ so khớp chuỗi), KHÔNG AI/LLM.
 * Không phải mọi câu nói đều đáng nhớ — `shouldRemember` phản ánh đúng
 * điều đó (vd. `"Xin chào"` → `false`).
 */

import type { MemoryType } from "./memory-model";

/** Shape hội thoại ĐỘC LẬP, không import từ Chat Runtime/`ai/mentor` —
    cùng nguyên tắc cô lập namespace đã áp dụng ở A02/A03. */
export type ConversationTurn = { role: "user" | "assistant"; content: string };
export type Conversation = { turns: ConversationTurn[] };

export type MemoryCandidate = {
  content: string;
  type: MemoryType;
  /** 0-1 — độ tự tin của việc rút trích này. */
  confidence: number;
  shouldRemember: boolean;
  reason: string;
};

const LEARNING_MARKERS: readonly string[] = [
  "bắt đầu học",
  "đã học được",
  "vừa học xong",
  "học được rằng",
  "tôi đã học",
  "hôm nay tôi học",
];

const PREFERENCE_MARKERS: readonly string[] = ["tôi thích", "tôi hay", "tôi ưu tiên", "tôi không thích", "tôi ghét"];

const GOAL_MARKERS: readonly string[] = [
  "mục tiêu của tôi",
  "tôi muốn đạt được",
  "tôi đang hướng tới",
  "tôi cần đạt",
];

const REFLECTION_MARKERS: readonly string[] = ["tôi cảm thấy", "tôi nhận ra", "nhìn lại thì", "tôi rút ra được"];

const GREETING_MARKERS: readonly string[] = ["xin chào", "chào bạn", "chào companion", "hello", "hế lô"];

function matchesAny(text: string, markers: readonly string[]): boolean {
  return markers.some((m) => text.includes(m));
}

type Classification = { type: MemoryType; confidence: number; shouldRemember: boolean; reason: string };

/**
 * Phân loại + tính confidence cho 1 lượt nói — thứ tự ưu tiên khi nhiều
 * marker cùng khớp: learning > goal > preference > reflection >
 * greeting > mặc định (learning/goal là tín hiệu hành động cụ thể nhất,
 * ưu tiên cao nhất).
 */
function classifyTurn(lowerText: string): Classification {
  if (matchesAny(lowerText, LEARNING_MARKERS)) {
    return { type: "learning", confidence: 0.8, shouldRemember: true, reason: "Có tín hiệu học tập cụ thể." };
  }
  if (matchesAny(lowerText, GOAL_MARKERS)) {
    return { type: "goal", confidence: 0.8, shouldRemember: true, reason: "Có tín hiệu mục tiêu cụ thể." };
  }
  if (matchesAny(lowerText, PREFERENCE_MARKERS)) {
    return { type: "preference", confidence: 0.75, shouldRemember: true, reason: "Có tín hiệu sở thích cá nhân." };
  }
  if (matchesAny(lowerText, REFLECTION_MARKERS)) {
    return { type: "reflection", confidence: 0.7, shouldRemember: true, reason: "Có tín hiệu phản tư." };
  }
  if (matchesAny(lowerText, GREETING_MARKERS)) {
    return {
      type: "session",
      confidence: 0.1,
      shouldRemember: false,
      reason: "Chỉ là lời chào — không có thông tin đáng nhớ.",
    };
  }
  return {
    type: "session",
    confidence: 0.2,
    shouldRemember: false,
    reason: "Không khớp tín hiệu đáng ghi nhớ nào — mặc định coi là trò chuyện phiên.",
  };
}

/**
 * Rút `MemoryCandidate[]` từ TOÀN BỘ lượt `role: "user"` trong hội thoại
 * — mỗi lượt user → đúng 1 candidate (kể cả khi `shouldRemember=false`,
 * để nơi gọi vẫn thấy đầy đủ input đã xét qua, không âm thầm bỏ). Chỉ
 * ĐỌC `conversation` — không mutate.
 */
export function extractMemoryCandidates(conversation: Conversation): MemoryCandidate[] {
  return conversation.turns
    .filter((t) => t.role === "user")
    .map((t) => ({ content: t.content, ...classifyTurn(t.content.toLowerCase()) }));
}

/** Chọn candidate ĐẠI DIỆN (confidence cao nhất, tie-break ổn định giữ
    thứ tự xuất hiện gốc) — cùng kỹ thuật `pickPrimaryCandidate()` đã
    dùng ở A03 (`goal-detector.rules.ts`). */
export function pickPrimaryMemoryCandidate(candidates: MemoryCandidate[]): MemoryCandidate | null {
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => b.confidence - a.confidence)[0];
}
