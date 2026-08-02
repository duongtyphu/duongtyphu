/**
 * SPRINT A06 — Memory & Reflection Engine: Reflection.
 *
 * `buildReflection()` CHỈ tổng hợp lại (rule-based) từ `MemoryEntry[]`
 * đã có sẵn — KHÔNG sinh nội dung mới, KHÔNG AI. Mọi câu trong
 * `achievements`/`difficulties`/`lessons` LUÔN lấy nguyên `summary` của
 * entry, không viết lại.
 */

import type { MemoryEntry } from "./memory-model";

export type ReflectionResult = {
  achievements: string[];
  difficulties: string[];
  lessons: string[];
  suggestedImprovement: string;
  nextLearningStep: string;
};

const DIFFICULTY_MARKERS: readonly string[] = ["khó khăn", "gặp khó", "chưa hiểu", "bị kẹt", "không làm được"];
const ACHIEVEMENT_MARKERS: readonly string[] = ["hoàn thành", "đã đạt", "làm được", "thành công"];
const LESSON_MARKERS: readonly string[] = ["rút ra được", "bài học", "nhận ra rằng", "hiểu ra"];

function matchesAny(text: string, markers: readonly string[]): boolean {
  return markers.some((m) => text.includes(m));
}

type Bucket = "achievements" | "difficulties" | "lessons" | null;

/**
 * Phân loại 1 `MemoryEntry` vào ĐÚNG 1 trong 3 nhóm (hoặc không nhóm nào
 * — trung thực, không ép). Ưu tiên: khó khăn > thành tựu > bài học, rồi
 * tới `type==="reflection"` mặc định vào bài học nếu không khớp marker
 * nào khác.
 */
function bucketOf(entry: MemoryEntry): Bucket {
  const text = entry.summary.toLowerCase();
  if (matchesAny(text, DIFFICULTY_MARKERS)) return "difficulties";
  if (matchesAny(text, ACHIEVEMENT_MARKERS)) return "achievements";
  if (matchesAny(text, LESSON_MARKERS)) return "lessons";
  if (entry.type === "reflection") return "lessons";
  return null;
}

/**
 * Helper thuần — dựng `ReflectionResult` từ `entries` đã có. Không mutate
 * `entries`, không gọi AI, không tự bịa câu — `suggestedImprovement`/
 * `nextLearningStep` là 1 trong vài TEMPLATE cố định, chọn theo dữ liệu
 * đã tổng hợp (không nội suy tự do).
 */
export function buildReflection(entries: MemoryEntry[]): ReflectionResult {
  const achievements: string[] = [];
  const difficulties: string[] = [];
  const lessons: string[] = [];

  for (const entry of entries) {
    const bucket = bucketOf(entry);
    if (bucket === "achievements") achievements.push(entry.summary);
    else if (bucket === "difficulties") difficulties.push(entry.summary);
    else if (bucket === "lessons") lessons.push(entry.summary);
  }

  const suggestedImprovement =
    difficulties.length > 0 ? `Nên tập trung khắc phục: ${difficulties[0]}` : "Tiếp tục duy trì nhịp học tập hiện tại.";

  const nextLearningStep =
    lessons.length > 0
      ? "Áp dụng bài học gần nhất vào bước tiếp theo."
      : achievements.length > 0
        ? "Tiếp tục nâng cao dựa trên những gì đã đạt được."
        : "Chưa đủ dữ liệu để đề xuất bước học tiếp theo cụ thể.";

  return { achievements, difficulties, lessons, suggestedImprovement, nextLearningStep };
}
