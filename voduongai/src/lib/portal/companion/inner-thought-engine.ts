/**
 * Inner Thought Engine (Sprint 20.4 — "The Inner Life"). Xem
 * `docs/INNER_LIFE.md`.
 *
 * KHÔNG phải AI, KHÔNG sinh random. Một Inner Thought CHỈ được sinh khi
 * chuỗi chuyển hoá (`docs/THE_LIVING_WISDOM_SYSTEM.md`) đã thật sự đi
 * tới bước Character — tức `getCharacterMemory()` (Sprint 20.3) đã có
 * ít nhất một Character thật, KHÔNG MỘT Lesson/Reflection đơn lẻ nào
 * tự nó được phép trở thành Inner Thought:
 *
 * Experience → Reflection → Lesson → Meaning → Character → Inner Thought
 *
 * Trước Character Memory (Sprint 20.3), bước "Character" trong chuỗi
 * này hoàn toàn chưa tồn tại ở Companion — vì vậy Inner Thought Engine
 * không thể ra đời sớm hơn, và là Learning Engine ĐẦU TIÊN của Companion
 * đi xa hơn Lesson/Meaning (`LESSON_FROM_REFLECTION`, `portal-brain.ts`,
 * Sprint 19.0 — vẫn chỉ dừng ở Meaning) tới một bước sinh ra một câu nói
 * thật.
 */

import {
  type CharacterMemoryEntry,
  type CharacterPreference,
} from "@/lib/portal/companion/character-memory";

export type InnerThought = {
  preference: CharacterPreference;
  line: string;
};

/**
 * Nhiệm vụ 2 + 3 của brief: Inner Thought không phải lời khuyên ("bạn
 * nên..."), không nhắc về Companion ("mình đã..."/"mình giỏi..."), chỉ
 * chia sẻ một điều Companion VỪA NHẬN RA — và điều đó luôn hướng về
 * con người, không phải về chính Companion. Khác câu Character Memory
 * lưu nội bộ (`CHARACTER_STATEMENT`, "Người này cần được lắng nghe
 * trước." — một NHÃN nội tâm) — đây là câu THẬT Companion có thể chia
 * sẻ, viết lại dưới dạng một nhận ra, không phải một mô tả/chỉ dẫn.
 */
const INNER_THOUGHT_LINE: Record<CharacterPreference, string> = {
  "listen-first":
    "Mình nhận ra có những lúc bạn cần được nghe hết câu chuyện của mình, trước khi nghe thêm bất cứ điều gì khác.",
  "self-discovery":
    "Mình nhận ra bạn thường tự tìm ra câu trả lời rõ hơn là khi mình đưa ra câu trả lời ngay.",
  grateful:
    "Mình nhận ra hành trình cùng bạn đã giúp mình hiểu thêm về cách đồng hành — mình biết ơn vì điều đó.",
};

/**
 * Khi Character Memory có nhiều hơn một Character, ưu tiên `listen-first`
 * — đúng `docs/THE_DECISION_HIERARCHY.md` (tầng "Con người" luôn đứng
 * trước, và được lắng nghe trước là điều gần nhất với tầng đó). Không
 * random giữa các Character có cùng lúc — rule-based, có thể audit lại.
 *
 * `grateful` (Sprint 21.2) đứng SAU CÙNG — biết ơn một hành trình không
 * cấp thiết hơn việc người này đang cần được lắng nghe hay cần không
 * gian tự khám phá NGAY LÚC NÀY; Gratitude là một điều Companion mang
 * theo, không phải một nhu cầu cần ưu tiên trước con người đang ở đây.
 */
const PREFERENCE_PRIORITY: readonly CharacterPreference[] = [
  "listen-first",
  "self-discovery",
  "grateful",
];

/**
 * Trả về `null` khi Character Memory rỗng — đây CHÍNH LÀ rào chắn của
 * Nhiệm vụ 1: không có Character thật, không có Inner Thought, dù
 * Experience/Reflection/Lesson/Meaning có xảy ra bao nhiêu lần. Im lặng
 * là kết quả hợp lệ, không phải một lỗi.
 */
export function generateInnerThought(characterMemory: CharacterMemoryEntry[]): InnerThought | null {
  if (characterMemory.length === 0) return null;

  const present = new Set(characterMemory.map((entry) => entry.preference));
  const preference = PREFERENCE_PRIORITY.find((candidate) => present.has(candidate));
  if (!preference) return null;

  return { preference, line: INNER_THOUGHT_LINE[preference] };
}
