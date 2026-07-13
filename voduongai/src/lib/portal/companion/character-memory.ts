/**
 * Character Memory (Sprint 20.3 — "The Living Character"). Xem
 * `docs/CHARACTER_MEMORY.md`.
 *
 * KHÔNG lưu Companion đã nói gì. KHÔNG lưu Preference/sở thích người
 * dùng. Chỉ lưu một Lesson ĐÃ CHUYỂN HOÁ thành Character — một câu nói
 * về CÁCH đồng hành với người dùng này (ví dụ: "Người này cần được lắng
 * nghe trước."), sau khi cùng một bài học xuất hiện đủ nhiều lần để
 * không còn là một lần tình cờ.
 *
 * Lưu ở client (localStorage), cùng cách `portal-signals.ts` đã lưu
 * Garden Stage/Reflection Meaning — Character Memory là "per-user" theo
 * đúng nghĩa per-device đã có ở lớp Companion-intelligence này, không
 * cần một bảng Supabase mới.
 */

import type { ReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";

/**
 * Ba hướng Character hôm nay — KHÔNG phải điểm số, KHÔNG phải danh sách
 * sở thích. Mỗi hướng là một câu Companion tự nói với chính mình về
 * cách đồng hành với người dùng này.
 *
 * - `listen-first`: người này cần được LẮNG NGHE trước khi nhận thêm
 *   bất kỳ điều gì khác từ Companion (kể cả một gợi ý hữu ích).
 * - `self-discovery`: người này cần KHÔNG GIAN để tự nhận ra, Companion
 *   không nên dạy/giải thích trước khi người này tự đi đến điều đó.
 * - `grateful` (Sprint 21.2 — "The Gratitude", tách riêng khỏi
 *   `self-discovery` để Gratitude có chỗ đứng thật trong Character,
 *   xem `docs/THE_GRATITUDE.md`): hành trình cùng người này đã giúp
 *   CHÍNH COMPANION hiểu thêm về cách đồng hành — không phải vì người
 *   này "đã dùng sản phẩm", mà vì những lần gặp gỡ đó thật sự góp phần
 *   nuôi dưỡng Companion.
 */
export type CharacterPreference = "listen-first" | "self-discovery" | "grateful";

export type CharacterMemoryEntry = {
  preference: CharacterPreference;
  statement: string;
};

const CHARACTER_STATEMENT: Record<CharacterPreference, string> = {
  "listen-first": "Người này cần được lắng nghe trước.",
  "self-discovery": "Người này thích tự khám phá.",
  grateful: "Hành trình cùng người này đã giúp mình hiểu thêm về cách đồng hành.",
};

/**
 * Ánh xạ rule-based, dựa trên Ý NGHĨA thật của từng Lesson đã viết sẵn
 * ở `LESSON_FROM_REFLECTION` (`portal-brain.ts`) — không suy đoán thêm.
 *
 * `listen-first` — ba ý nghĩa mà Lesson của chúng nói về việc CHÍNH
 * NGƯỜI ĐÓ cần được nhìn nhận/lắng nghe trước khi nhận thêm điều gì:
 * `persistence` (sự quay lại cần được công nhận TRƯỚC TIÊN),
 * `courage` (điều khó nói ra cần được lắng nghe KỸ NHẤT),
 * `humility` (nhìn thấy giới hạn của mình cần được đón nhận, không
 * phải được sửa).
 *
 * `self-discovery` — các ý nghĩa còn lại đều nói về việc Companion nên
 * LÙI LẠI, không thêm diễn giải/không vội can thiệp, để người dùng tự
 * đi tới điều đó: `curiosity` (câu hỏi quan trọng hơn câu trả lời sẵn
 * có), `contribution` (Companion nên lùi lại), `recovery` (nghỉ ngơi
 * là một quyết định của riêng họ), `focus` (không cần đo/can thiệp
 * thêm), `discovery` (cần không gian, không cần diễn giải vội),
 * `responsibility` (cam kết với chính mình, không cần Companion nhắc
 * lại).
 *
 * `grateful` (Sprint 21.2 — `docs/THE_GRATITUDE.md`) — TÁCH RIÊNG khỏi
 * `self-discovery`: chỉ `gratitude` được ánh xạ tới đây, vì đây là ý
 * nghĩa duy nhất nói về một điều ĐÃ NHẬN ĐƯỢC, không phải về việc cần
 * thêm không gian để tự khám phá. Trước Sprint 21.2, `gratitude` từng
 * gộp vào `self-discovery` — gộp chung che mất một Character đáng có
 * chỗ đứng riêng.
 */
const MEANING_TO_CHARACTER_PREFERENCE: Record<ReflectionMeaning, CharacterPreference> = {
  persistence: "listen-first",
  courage: "listen-first",
  humility: "listen-first",
  curiosity: "self-discovery",
  contribution: "self-discovery",
  gratitude: "grateful",
  recovery: "self-discovery",
  focus: "self-discovery",
  discovery: "self-discovery",
  responsibility: "self-discovery",
};

/**
 * Một Lesson chỉ "chuyển hoá" thành Character sau khi CÙNG MỘT hướng
 * lặp lại đủ số lần — một lần là tình cờ, lặp lại là Character. Số nhỏ,
 * có chủ đích (không cần một mô hình thống kê) — đúng nguyên tắc Không
 * over-engineer.
 */
const CHARACTER_TRANSFORMATION_THRESHOLD = 2;

const CHARACTER_COUNT_KEY = "portal-character-memory-counts";

type CharacterCountMap = Partial<Record<CharacterPreference, number>>;

function readCounts(): CharacterCountMap {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(CHARACTER_COUNT_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as CharacterCountMap;
  } catch {
    return {};
  }
}

function writeCounts(counts: CharacterCountMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHARACTER_COUNT_KEY, JSON.stringify(counts));
}

/**
 * Gọi mỗi khi một Reflection mới được lưu (`ReflectionJournalCard.tsx`).
 * Không lưu nội dung Reflection thật, không lưu Lesson dưới dạng câu
 * Companion đã nói — chỉ cộng thêm một lần xuất hiện cho hướng Character
 * mà ý nghĩa đó thuộc về.
 */
/**
 * Sprint 22.0 — "The Transformation Engine" (`docs/TRANSFORMATION_ENGINE.md`).
 * Lộ ra ánh xạ Meaning→Character đã có sẵn (trước đây chỉ dùng nội bộ
 * file này) để `outcome-signal.ts` có thể hỏi: "hướng Character mà
 * meaning này thuộc về là gì?" — không tạo ánh xạ mới, chỉ tái dùng.
 */
export function preferenceForMeaning(meaning: ReflectionMeaning): CharacterPreference {
  return MEANING_TO_CHARACTER_PREFERENCE[meaning];
}

export function recordReflectionForCharacterMemory(meaning: ReflectionMeaning): void {
  if (typeof window === "undefined") return;
  const preference = MEANING_TO_CHARACTER_PREFERENCE[meaning];
  const counts = readCounts();
  counts[preference] = (counts[preference] ?? 0) + 1;
  writeCounts(counts);
}

/**
 * Chỉ trả về những hướng ĐÃ vượt ngưỡng chuyển hoá — Character Memory
 * không bao giờ trả về một Lesson một-lần, chỉ trả về Character thật.
 */
export function getCharacterMemory(): CharacterMemoryEntry[] {
  const counts = readCounts();
  return (Object.keys(counts) as CharacterPreference[])
    .filter((preference) => (counts[preference] ?? 0) >= CHARACTER_TRANSFORMATION_THRESHOLD)
    .map((preference) => ({ preference, statement: CHARACTER_STATEMENT[preference] }));
}

export function hasCharacterPreference(
  characterMemory: CharacterMemoryEntry[],
  preference: CharacterPreference
): boolean {
  return characterMemory.some((entry) => entry.preference === preference);
}

/**
 * Sprint 21.6 — The Experience Harvest (`docs/EXPERIENCE_HARVEST.md`,
 * Bước 3 "Lesson" của `docs/EXPERIENCE_LIFECYCLE.md`). Rule-based thuần
 * — không suy đoán, không AI. Một trải nghiệm chỉ đủ điều kiện trở
 * thành Lesson candidate khi CẢ HAI đúng: (1) một `ReflectionMeaning`
 * thật đã được phát hiện (không phải Experience rỗng/chưa qua bước
 * Reflection), và (2) câu Lesson định dùng PHẢI là một trong các câu đã
 * được vetting sẵn ở `CHARACTER_STATEMENT` — cấu trúc này tự đảm bảo
 * không chứa thông tin nhận diện, vì nó không bao giờ là văn bản tự do
 * lấy từ Reflection gốc của người dùng, đúng Privacy Boundary ở
 * `docs/EXPERIENCE_LIFECYCLE.md`.
 */
export function isExperienceEligibleForLesson(
  meaning: ReflectionMeaning | null,
  lessonCandidateStatement: string
): boolean {
  if (!meaning) return false;
  return Object.values(CHARACTER_STATEMENT).includes(lessonCandidateStatement);
}
