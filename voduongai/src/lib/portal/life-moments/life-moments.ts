/**
 * Life Moments Engine — Model (Sprint 18.1, "Companion học cách tri ân
 * những ngày đáng nhớ của một con người"). Xem `docs/LIFE_MOMENTS_ENGINE.md`.
 *
 * Pure data/logic — không DB, không AI, không gọi mạng. Life Moment
 * không phải notification, không phải achievement (xem boundary trong
 * docs). File này chỉ định nghĩa hình dạng dữ liệu; việc phát hiện nằm ở
 * `life-moment-detector.ts`, lời văn nằm ở `life-moment-lines.ts`.
 */

export type LifeMomentType =
  | "first_portal_day"
  | "birthday"
  | "one_year_with_voduongai"
  | "companion_new_chapter"
  | "hundredth_story_saved"
  | "annual_mirror"
  | "return_after_silence";

/**
 * Vì sao Life Moment này được kích hoạt — dữ liệu thô đứng sau quyết
 * định, để UI/Companion có thể giải thích một cách trung thực nếu cần,
 * không phải để hiển thị như một chỉ số.
 */
export type LifeMomentTrigger = {
  reason: string;
  occurredAt: string;
};

/**
 * Tông giọng Companion nên dùng khi nói về Life Moment này — không phải
 * mức độ "quan trọng" để xếp hạng, chỉ là sắc thái cảm xúc phù hợp.
 */
export type LifeMomentTone = "quiet" | "warm" | "celebratory" | "reflective";

/**
 * Ràng buộc hiển thị — Companion phải tôn trọng những điều này, không
 * phải gợi ý có thể bỏ qua. Xem `docs/LIFE_MOMENTS_ENGINE.md#nguyên-tắc`.
 */
export type LifeMomentBoundary = {
  maxOncePerDay: true;
  dismissible: true;
  noFullPortalTakeover: true;
  noSalesCta: true;
};

export type LifeMoment = {
  type: LifeMomentType;
  trigger: LifeMomentTrigger;
  tone: LifeMomentTone;
  boundary: LifeMomentBoundary;
};

export const DEFAULT_LIFE_MOMENT_BOUNDARY: LifeMomentBoundary = {
  maxOncePerDay: true,
  dismissible: true,
  noFullPortalTakeover: true,
  noSalesCta: true,
};
