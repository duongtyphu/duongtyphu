/**
 * Life Moments Engine — Detector (Sprint 18.1). Xem
 * `docs/LIFE_MOMENTS_ENGINE.md`.
 *
 * Hàm thuần (pure function) — nhận dữ liệu đã được tính sẵn (không tự
 * fetch DB/Supabase), trả về một `LifeMoment` duy nhất hoặc `null`.
 * Không đoán dữ liệu thiếu: nếu một input cần thiết không có, detector
 * cho loại Life Moment đó trả về `null` thay vì suy diễn.
 *
 * Khi nhiều Life Moment cùng hợp lệ trong một lần gọi, chỉ một được
 * chọn (ưu tiên theo `LIFE_MOMENT_PRIORITY`) — Companion không bao giờ
 * hiển thị nhiều Life Moment cùng lúc.
 */

import type { LifeMoment, LifeMomentType } from "./life-moments";
import { DEFAULT_LIFE_MOMENT_BOUNDARY } from "./life-moments";

const DAY_MS = 1000 * 60 * 60 * 24;

export type LifeMomentDetectorInput = {
  /** ISO date string khi member được tạo (Supabase `members.created_at`). */
  memberCreatedAt: string;
  /** Ngày sinh người dùng tự điền, nếu có. Không có => Birthday không bao giờ kích hoạt. */
  birthday?: string | null;
  /** Tổng số memory capsule / story đã lưu. */
  savedStoryCount: number;
  /**
   * Ngày milestone "return-after-silence" thật sự xảy ra, lấy từ
   * `growth-milestones.ts` (không tự suy ra khoảng cách ngày ở đây —
   * tránh trùng logic với Growth Map). `null`/`undefined` nếu chưa có.
   */
  returnAfterSilenceOccurredAt?: string | null;
  /** Companion đã bước sang chương mới tại thời điểm này chưa, và khi nào. */
  companionNewChapterAt?: string | null;
  /** Annual Mirror đã sẵn sàng (đủ dữ liệu nhìn lại một năm) chưa. */
  annualMirrorReady?: boolean;
  annualMirrorPeriodLabel?: string;
  /** Thời điểm hiện tại (ISO) — truyền vào để hàm thuần, không gọi `Date.now()` ngầm. */
  now: string;
};

const ANNIVERSARY_TOLERANCE_DAYS = 1;

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / DAY_MS;
}

function isAnniversaryOf(target: Date, now: Date, toleranceDays = ANNIVERSARY_TOLERANCE_DAYS): boolean {
  const sameYearTarget = new Date(now.getFullYear(), target.getMonth(), target.getDate());
  return daysBetween(sameYearTarget, now) <= toleranceDays;
}

function detectFirstPortalDay(input: LifeMomentDetectorInput): LifeMoment | null {
  const created = new Date(input.memberCreatedAt);
  const now = new Date(input.now);
  if (daysBetween(created, now) > 0) return null;
  return {
    type: "first_portal_day",
    trigger: { reason: "member_created_today", occurredAt: input.now },
    tone: "warm",
    boundary: DEFAULT_LIFE_MOMENT_BOUNDARY,
  };
}

function detectBirthday(input: LifeMomentDetectorInput): LifeMoment | null {
  if (!input.birthday) return null;
  const birthday = new Date(input.birthday);
  const now = new Date(input.now);
  if (!isAnniversaryOf(birthday, now)) return null;
  return {
    type: "birthday",
    trigger: { reason: "birthday_anniversary", occurredAt: input.now },
    tone: "celebratory",
    boundary: DEFAULT_LIFE_MOMENT_BOUNDARY,
  };
}

function detectOneYear(input: LifeMomentDetectorInput): LifeMoment | null {
  const created = new Date(input.memberCreatedAt);
  const now = new Date(input.now);
  const oneYearMark = new Date(created);
  oneYearMark.setFullYear(oneYearMark.getFullYear() + 1);
  if (daysBetween(oneYearMark, now) > ANNIVERSARY_TOLERANCE_DAYS) return null;
  return {
    type: "one_year_with_voduongai",
    trigger: { reason: "one_year_anniversary", occurredAt: input.now },
    tone: "celebratory",
    boundary: DEFAULT_LIFE_MOMENT_BOUNDARY,
  };
}

function detectCompanionNewChapter(input: LifeMomentDetectorInput): LifeMoment | null {
  if (!input.companionNewChapterAt) return null;
  const chapterAt = new Date(input.companionNewChapterAt);
  const now = new Date(input.now);
  if (daysBetween(chapterAt, now) > 0) return null;
  return {
    type: "companion_new_chapter",
    trigger: { reason: "companion_new_chapter", occurredAt: input.companionNewChapterAt },
    tone: "reflective",
    boundary: DEFAULT_LIFE_MOMENT_BOUNDARY,
  };
}

function detectHundredthStory(input: LifeMomentDetectorInput): LifeMoment | null {
  if (input.savedStoryCount !== 100) return null;
  return {
    type: "hundredth_story_saved",
    trigger: { reason: "hundredth_story_saved", occurredAt: input.now },
    tone: "celebratory",
    boundary: DEFAULT_LIFE_MOMENT_BOUNDARY,
  };
}

function detectAnnualMirror(input: LifeMomentDetectorInput): LifeMoment | null {
  if (!input.annualMirrorReady) return null;
  return {
    type: "annual_mirror",
    trigger: { reason: input.annualMirrorPeriodLabel ?? "annual_mirror_ready", occurredAt: input.now },
    tone: "reflective",
    boundary: DEFAULT_LIFE_MOMENT_BOUNDARY,
  };
}

function detectReturnAfterSilence(input: LifeMomentDetectorInput): LifeMoment | null {
  if (!input.returnAfterSilenceOccurredAt) return null;
  const occurred = new Date(input.returnAfterSilenceOccurredAt);
  const now = new Date(input.now);
  if (daysBetween(occurred, now) > ANNIVERSARY_TOLERANCE_DAYS) return null;
  return {
    type: "return_after_silence",
    trigger: { reason: "return_after_silence", occurredAt: input.returnAfterSilenceOccurredAt },
    tone: "warm",
    boundary: DEFAULT_LIFE_MOMENT_BOUNDARY,
  };
}

/** Thứ tự ưu tiên khi nhiều Life Moment hợp lệ cùng lúc — số nhỏ hơn ưu tiên hơn. */
const LIFE_MOMENT_PRIORITY: LifeMomentType[] = [
  "birthday",
  "one_year_with_voduongai",
  "hundredth_story_saved",
  "return_after_silence",
  "annual_mirror",
  "companion_new_chapter",
  "first_portal_day",
];

const DETECTORS: Record<LifeMomentType, (input: LifeMomentDetectorInput) => LifeMoment | null> = {
  first_portal_day: detectFirstPortalDay,
  birthday: detectBirthday,
  one_year_with_voduongai: detectOneYear,
  companion_new_chapter: detectCompanionNewChapter,
  hundredth_story_saved: detectHundredthStory,
  annual_mirror: detectAnnualMirror,
  return_after_silence: detectReturnAfterSilence,
};

export function detectLifeMoment(input: LifeMomentDetectorInput): LifeMoment | null {
  for (const type of LIFE_MOMENT_PRIORITY) {
    const moment = DETECTORS[type](input);
    if (moment) return moment;
  }
  return null;
}
