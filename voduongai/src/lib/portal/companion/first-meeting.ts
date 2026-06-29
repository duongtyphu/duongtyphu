/**
 * The First Meeting Engine (Sprint 22.1 — "The First Meeting"). Xem
 * `docs/THE_FIRST_MEETING.md`.
 *
 * KHÔNG phải một engine sinh chat greeting ngẫu nhiên. Đây là phần xác
 * định Companion đang ở GIAI ĐOẠN QUAN HỆ nào với một người — vì một
 * người bạn không chào giống nhau ở lần gặp đầu tiên và lần gặp thứ một
 * trăm. Module này CHỈ quyết định: (1) giai đoạn quan hệ hiện tại, dựa
 * trên dữ liệu cục bộ rule-based (không AI, không suy luận tâm lý), và
 * (2) khoảng lặng/timing phù hợp với giai đoạn đó trước khi Companion
 * chủ động lên tiếng — KHÔNG quyết định nội dung copy (copy của First
 * Meeting cụ thể nằm ở nơi gọi, để người viết có thể chỉnh câu chữ mà
 * không phải sửa logic).
 */

export type RelationshipStage =
  | "first_meeting"
  | "welcome_back"
  | "return_after_silence"
  | "long_time_companion"
  | "old_friend";

/** Sau khoảng này không ghé lại, một lượt quay lại được tính là "im lặng lâu". */
const SILENCE_GAP_MS = 1000 * 60 * 60 * 24 * 2; // 2 ngày
/** Từ lượt ghé thứ bao nhiêu, một người được Companion coi là "đã đồng hành lâu". */
const LONG_TIME_COMPANION_VISIT_THRESHOLD = 20;
/** Từ lượt ghé thứ bao nhiêu, một người được Companion coi là "người bạn cũ". */
const OLD_FRIEND_VISIT_THRESHOLD = 60;

export function getRelationshipStage(params: {
  hasVisitedBefore: boolean;
  visitCount: number;
  gapSinceLastVisitMs: number | null;
}): RelationshipStage {
  const { hasVisitedBefore, visitCount, gapSinceLastVisitMs } = params;

  if (!hasVisitedBefore) return "first_meeting";

  if (gapSinceLastVisitMs !== null && gapSinceLastVisitMs >= SILENCE_GAP_MS) {
    return "return_after_silence";
  }

  if (visitCount >= OLD_FRIEND_VISIT_THRESHOLD) return "old_friend";
  if (visitCount >= LONG_TIME_COMPANION_VISIT_THRESHOLD) return "long_time_companion";

  return "welcome_back";
}

/**
 * NV6 — Silence Design. First Meeting cần một khoảng lặng dài hơn bình
 * thường để cảm giác như một cuộc gặp gỡ thật (Companion "nhìn thấy"
 * người dùng trước, rồi mới chủ động chào) — không lao vào nói ngay khi
 * trang vừa mở. Các giai đoạn khác đã quen nhau, khoảng lặng ngắn hơn
 * vẫn tự nhiên. Lời nói ở First Meeting cũng dài hơn (tự giới thiệu),
 * nên cần thời gian đọc lâu hơn trước khi tự ẩn.
 */
export function getSilenceTimingForStage(stage: RelationshipStage): {
  showDelayMs: number;
  autoHideMs: number;
} {
  switch (stage) {
    case "first_meeting":
      return { showDelayMs: 2200, autoHideMs: 9000 };
    case "return_after_silence":
      return { showDelayMs: 1800, autoHideMs: 6000 };
    default:
      return { showDelayMs: 1500, autoHideMs: 5000 };
  }
}
