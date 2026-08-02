/**
 * SPRINT A03 — Goal Detection & Clarification: Clarification.
 *
 * `ClarificationResult` tổng kết CÓ cần hỏi làm rõ hay không cho ĐÚNG 1
 * candidate (thường là candidate chính — xem `pickPrimaryCandidate()` ở
 * `goal-detector.rules.ts`). CHỈ 1 câu hỏi — không biến thành form, không
 * hỏi lại thông tin đã có trong hội thoại (nhờ tính `missingInformation`
 * ở `goal-detector.rules.ts` đã loại bỏ mục nào người dùng từng nhắc),
 * không hỏi dữ liệu cá nhân không cần thiết (chỉ 3 câu hỏi cố định về
 * mục đích/trình độ/mốc thời gian — không câu nào hỏi tên/tuổi/liên hệ).
 */

import type { GoalCandidate } from "./goal-detector";

export type ClarificationResult = {
  needsClarification: boolean;
  reason: string;
  missingInformation: string[];
  /** ĐÚNG 1 câu hỏi (hoặc `null` nếu không cần hỏi) — KHÔNG bao giờ là
      mảng, đúng yêu cầu "chỉ một câu hỏi làm rõ". */
  suggestedQuestion: string | null;
};

/** 3 câu hỏi cố định, khớp thứ tự ưu tiên của `buildMissingInformation()`
    (mục đích → trình độ → mốc thời gian) — mỗi câu chỉ hỏi ĐÚNG 1 điều,
    không phải dữ liệu cá nhân. */
const OUTCOME_QUESTION = "Bạn muốn đạt được kết quả cụ thể gì từ việc này?";
const LEVEL_QUESTION = "Hiện tại bạn đang ở trình độ nào với việc này?";
const TIMEFRAME_QUESTION = "Bạn muốn đạt được điều này trong khoảng thời gian nào?";
/** Trường hợp hiếm: đủ chi tiết (trình độ/mục đích/mốc thời gian) nhưng
    chưa có tín hiệu Ý ĐỊNH rõ ràng (không "muốn"/"cần"...) nên confidence
    vẫn dưới 0.70 — hỏi xác nhận thay vì hỏi lại thông tin đã có. */
const FALLBACK_QUESTION = "Bạn có đang thực sự muốn theo đuổi mục tiêu này không?";

function pickSuggestedQuestion(missingInformation: string[]): string {
  // Thứ tự khớp CHÍNH XÁC thứ tự `buildMissingInformation()` trả về —
  // phần tử đầu tiên trong mảng luôn là mục ưu tiên cao nhất còn thiếu.
  const [firstMissing] = missingInformation;
  if (!firstMissing) return FALLBACK_QUESTION;
  if (firstMissing.includes("mục đích")) return OUTCOME_QUESTION;
  if (firstMissing.includes("trình độ")) return LEVEL_QUESTION;
  return TIMEFRAME_QUESTION;
}

/**
 * Dựng `ClarificationResult` từ 1 candidate (hoặc `null` nếu chưa phát
 * hiện được candidate nào — khi đó KHÔNG có gì để làm rõ, trả về
 * `needsClarification: false` thay vì ép hỏi 1 câu chung chung).
 *
 * Chính sách (đúng dải confidence đã khoá ở `goal-detector.rules.ts`):
 * - confidence ≥ 0.70 ("đủ rõ ở mức phiên chat") → không cần hỏi thêm.
 * - confidence < 0.70 → cần hỏi, chọn ĐÚNG 1 câu theo mục còn thiếu ưu
 *   tiên cao nhất; nếu không còn mục nào thiếu (trường hợp hiếm — đủ chi
 *   tiết nhưng chưa có tín hiệu ý định rõ ràng) → hỏi câu xác nhận chung.
 */
export function buildClarification(candidate: GoalCandidate | null): ClarificationResult {
  if (!candidate) {
    return {
      needsClarification: false,
      reason: "Chưa phát hiện được mục tiêu nào để làm rõ.",
      missingInformation: [],
      suggestedQuestion: null,
    };
  }

  if (candidate.confidence >= 0.7) {
    return {
      needsClarification: false,
      reason: "Mục tiêu đã đủ rõ ở mức phiên chat.",
      missingInformation: candidate.missingInformation,
      suggestedQuestion: null,
    };
  }

  const reason =
    candidate.confidence < 0.4
      ? "Chưa đủ dữ liệu để xác định mục tiêu rõ ràng."
      : "Mục tiêu tiềm năng nhưng cần làm rõ thêm.";

  return {
    needsClarification: true,
    reason,
    missingInformation: candidate.missingInformation,
    suggestedQuestion: pickSuggestedQuestion(candidate.missingInformation),
  };
}
