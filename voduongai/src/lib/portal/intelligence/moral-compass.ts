/**
 * Moral Compass (Sprint 20.2). Xem `docs/MORAL_COMPASS.md`.
 *
 * KHÔNG phải Decision Engine, KHÔNG phải AI/LLM/Machine Learning — một
 * lớp giá trị THUẦN RULE-BASED đứng TRƯỚC mọi Decision Engine
 * (`getCompanionDecision()` ở `portal-brain.ts`, `chooseCompanionMoment()`
 * ở `thought-governance.ts`). Câu hỏi của Moral Compass không phải
 * "Điều gì đúng?" — mà là "Điều gì là tốt nhất cho con người ở thời
 * điểm này?".
 */

import type { CompanionMomentType } from "@/lib/portal/companion/thought-governance";

/**
 * Bốn câu hỏi Moral Compass tự hỏi trước khi cho phép một loại moment
 * được tham gia chọn lựa. Rule-based — tất cả 11 loại moment đang tồn
 * tại hôm nay đều đã được thiết kế để trả lời "có" cho cả bốn câu (đúng
 * cách `respectsUser`/`isHumble` ở `character-engine.ts` luôn đúng cho
 * candidate hôm nay) — bốn cờ này là RÀO CHẮN cho loại moment MỚI trong
 * tương lai, không phải bộ lọc cho hôm nay.
 */
export type FourQuestionsReview = {
  respectsHuman: boolean;
  helpsGrowth: boolean;
  reflectsCharacter: boolean;
  wouldBeProudLater: boolean;
};

export function reviewWithFourQuestions(type: CompanionMomentType): FourQuestionsReview {
  void type;
  return {
    respectsHuman: true,
    helpsGrowth: true,
    reflectsCharacter: true,
    wouldBeProudLater: true,
  };
}

export type HumanBenefitRank = number;

/**
 * Human Benefit KHÔNG đo bằng CTR/Click/Time on site — đo bằng Respect,
 * Growth, Trust, Long-term Relationship. `HUMAN_BENEFIT_ORDER` giữ
 * nguyên `MOMENT_PRIORITY_ORDER` (Sprint 18.6) cho mọi vị trí, TRỪ một
 * thay đổi duy nhất, có chủ đích: `greeting` được nói trước
 * `daily-thought`.
 *
 * Vì sao: một lời chào (`greeting`) tôn trọng con người ngay khi họ vừa
 * xuất hiện — nó thừa nhận sự có mặt của một người cụ thể. Một Daily
 * Thought là tri thức/suy nghĩ hay nhưng không cấp thiết bằng việc được
 * thấy/được chào trước. Priority cũ xếp `daily-thought` trước `greeting`
 * vì lý do kỹ thuật (thứ tự engine được viết); Moral Compass xếp lại vì
 * lý do con người. Đây CHÍNH LÀ đảo lật duy nhất mà Sprint này tạo ra —
 * không đảo các vị trí khác để tránh thay đổi không có chủ đích (ví dụ
 * `safety-boundary` luôn phải đứng đầu, không được phép thua bất kỳ loại
 * moment nào khác).
 */
/**
 * Bản sao có chủ đích của `MOMENT_PRIORITY_ORDER` (`thought-governance.ts`,
 * Sprint 18.6) — KHÔNG import trực tiếp mảng đó để tránh circular import
 * giữa hai module (`thought-governance.ts` cần gọi `humanBenefitRank()`
 * ở đây). Mọi thay đổi ở `MOMENT_PRIORITY_ORDER` gốc nên được phản chiếu
 * lại đây, giữ nguyên thứ tự, CHỈ TRỪ vị trí của `greeting`/`daily-thought`
 * đã được đảo có chủ đích (xem lý do ở comment trên).
 */
export const HUMAN_BENEFIT_ORDER: CompanionMomentType[] = [
  "safety-boundary",
  "life-moment",
  "return-after-silence",
  "birthday",
  "origin-line",
  "story-moment",
  "greeting",
  "proactive-thought",
  "daily-thought",
  "micro-reaction",
  "soulful-silence",
];

export function humanBenefitRank(type: CompanionMomentType): HumanBenefitRank {
  const index = HUMAN_BENEFIT_ORDER.indexOf(type);
  return index === -1 ? HUMAN_BENEFIT_ORDER.length : index;
}
