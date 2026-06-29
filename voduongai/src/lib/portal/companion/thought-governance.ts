/**
 * Companion Thought Governance (Sprint 18.6). Xem
 * `docs/COMPANION_THOUGHT_GOVERNANCE.md`.
 *
 * KHÔNG phải một engine nói mới — mỗi engine hiện có (Proactive Thought
 * Engine, Daily Thought, Story Matching Engine, Life Moments, Micro
 * Reactions, Greeting) vẫn tự quyết định NỘI DUNG của moment nó tạo ra.
 * File này chỉ quyết định: trong số các moment đang đủ điều kiện hiện
 * cùng lúc, moment nào THẬT SỰ được nói, moment nào im lặng — và liệu
 * Companion đã nói đủ nhiều rồi (Speech Budget) hay chưa.
 *
 * Pure data/logic — phần đọc/ghi sessionStorage/localStorage (Speech
 * Budget) nằm ở đây vì nó không phải dữ liệu Supabase, đúng pattern đã
 * dùng ở `proactive-thought-engine.ts`.
 *
 * Sprint 20.2 — Moral Compass: `chooseCompanionMoment()` không còn sắp
 * xếp theo `momentPriority()` (NV02 thuần) — nó sắp xếp theo
 * `humanBenefitRank()` (`moral-compass.ts`), Human Benefit thắng
 * Priority khi hai candidate cùng đủ điều kiện/đủ Speech Budget. Xem
 * `docs/MORAL_COMPASS.md`.
 */

import { humanBenefitRank } from "@/lib/portal/intelligence/moral-compass";

/**
 * 9 loại moment Companion hiện có + "soulful-silence" — không phải một
 * registry mở để mở rộng tuỳ ý; thêm loại mới nghĩa là một engine mới
 * thật sự đã tồn tại trong code, không phải suy đoán trước.
 */
export type CompanionMomentType =
  | "safety-boundary"
  | "life-moment"
  | "return-after-silence"
  | "birthday"
  | "origin-line"
  | "story-moment"
  | "daily-thought"
  | "proactive-thought"
  | "greeting"
  | "micro-reaction"
  | "soulful-silence";

export type CompanionMomentPriority = number;

/**
 * Thứ tự ưu tiên (NV02) — chỉ số càng nhỏ càng được ưu tiên nói trước.
 * Đây là ranh giới duy nhất quyết định ai được nói khi nhiều moment cùng
 * đủ điều kiện — không có ma trận xung đột riêng (xem
 * `docs/COMPANION_THOUGHT_GOVERNANCE.md#conflict-rules`).
 */
export const MOMENT_PRIORITY_ORDER: CompanionMomentType[] = [
  "safety-boundary",
  "life-moment",
  "return-after-silence",
  "birthday",
  "origin-line",
  "story-moment",
  "daily-thought",
  "proactive-thought",
  "greeting",
  "micro-reaction",
  "soulful-silence",
];

export function momentPriority(type: CompanionMomentType): CompanionMomentPriority {
  const index = MOMENT_PRIORITY_ORDER.indexOf(type);
  return index === -1 ? MOMENT_PRIORITY_ORDER.length : index;
}

export type CompanionMomentCandidate = {
  type: CompanionMomentType;
  /** Moment này có nội dung thật để hiển thị ngay bây giờ hay không. */
  isEligible: boolean;
  /**
   * Moment "lớn" (chiếm Speech Budget) — đối lập với Micro Reaction/Greeting,
   * những phản ứng rất nhẹ không tính vào budget nói chuyện của một ngày.
   */
  isMajor?: boolean;
};

export type CompanionMomentDecision = {
  chosen: CompanionMomentType;
  suppressed: CompanionMomentType[];
  reason: string;
};

/** NV04 — Speech Budget: Companion không nói (moment "lớn") quá nhiều trong một session/ngày. */
export type CompanionSpeechBudget = {
  maxMajorMomentsPerSession: number;
  maxMajorMomentsPerDay: number;
};

export const DEFAULT_SPEECH_BUDGET: CompanionSpeechBudget = {
  maxMajorMomentsPerSession: 3,
  maxMajorMomentsPerDay: 6,
};

const SESSION_MAJOR_COUNT_KEY = "companion-governance-session-major-count";
const DAY_MAJOR_COUNT_KEY = "companion-governance-day-major-count";
const DAY_MAJOR_COUNT_DATE_KEY = "companion-governance-day-major-count-date";

function todayKey(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

function readSessionMajorCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.sessionStorage.getItem(SESSION_MAJOR_COUNT_KEY) ?? 0);
  } catch {
    return 0;
  }
}

function readDayMajorCount(now: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const storedDate = window.localStorage.getItem(DAY_MAJOR_COUNT_DATE_KEY);
    if (storedDate !== todayKey(now)) return 0;
    return Number(window.localStorage.getItem(DAY_MAJOR_COUNT_KEY) ?? 0);
  } catch {
    return 0;
  }
}

/**
 * `life-moment` được phép vượt Speech Budget — một sinh nhật hay một lần
 * quay lại sau im lặng quan trọng hơn giới hạn đếm số, và Life Moments
 * Engine đã tự giới hạn `maxOncePerDay` ở chính nó rồi.
 */
function canAffordMajorMoment(type: CompanionMomentType, now: number, budget: CompanionSpeechBudget): boolean {
  if (type === "life-moment" || type === "return-after-silence" || type === "birthday") return true;
  if (readSessionMajorCount() >= budget.maxMajorMomentsPerSession) return false;
  if (readDayMajorCount(now) >= budget.maxMajorMomentsPerDay) return false;
  return true;
}

/** Gọi khi một moment "lớn" thật sự đã được hiển thị — không gọi cho Micro Reaction/Greeting. */
export function recordMajorMomentShown(now: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_MAJOR_COUNT_KEY, String(readSessionMajorCount() + 1));
    const dayCount = readDayMajorCount(now);
    window.localStorage.setItem(DAY_MAJOR_COUNT_DATE_KEY, todayKey(now));
    window.localStorage.setItem(DAY_MAJOR_COUNT_KEY, String(dayCount + 1));
  } catch {
    // bỏ qua nếu storage không khả dụng
  }
}

/**
 * Chọn một moment để Companion nói, hoặc "soulful-silence" nếu không có
 * gì đủ điều kiện hay Speech Budget đã hết (NV02/NV03/NV04). Pure — đọc
 * Speech Budget từ storage nhưng không ghi; caller gọi
 * `recordMajorMomentShown()` riêng sau khi đã thực sự hiển thị.
 */
export function chooseCompanionMoment(
  candidates: CompanionMomentCandidate[],
  now: number,
  budget: CompanionSpeechBudget = DEFAULT_SPEECH_BUDGET
): CompanionMomentDecision {
  const eligible = candidates.filter((c) => c.isEligible);
  const affordable = eligible.filter((c) => !c.isMajor || canAffordMajorMoment(c.type, now, budget));

  if (affordable.length === 0) {
    return {
      chosen: "soulful-silence",
      suppressed: eligible.map((c) => c.type),
      reason:
        eligible.length === 0
          ? "Không có moment nào đủ điều kiện."
          : "Có moment đủ điều kiện nhưng Speech Budget đã hết — Companion chọn im lặng.",
    };
  }

  const sorted = [...affordable].sort((a, b) => humanBenefitRank(a.type) - humanBenefitRank(b.type));
  const chosen = sorted[0];
  const suppressed = candidates.filter((c) => c.type !== chosen.type).map((c) => c.type);

  return {
    chosen: chosen.type,
    suppressed,
    reason: `"${chosen.type}" mang lại Human Benefit cao nhất (Moral Compass) trong số các moment đủ điều kiện và đủ Speech Budget.`,
  };
}
