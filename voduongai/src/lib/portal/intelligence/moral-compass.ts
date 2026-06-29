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
 * The Decision Hierarchy (xem `docs/THE_DECISION_HIERARCHY.md`). Mọi
 * quyết định của Companion phải BẮT ĐẦU từ con người — không bắt đầu
 * từ dữ liệu, không bắt đầu từ thuật toán, không bắt đầu từ hiệu suất.
 * Khi xung đột, thứ tự ưu tiên cố định, không đổi theo tình huống:
 * Con người → Nhân cách → Niềm tin → Tri thức → Hiệu suất.
 *
 * `DECISION_HIERARCHY` không phải một bộ điểm số (sẽ phạm nguyên tắc
 * chống gamification) — nó là TÊN của 5 tầng, dùng để mọi nơi trong
 * code/doc khi nói "ưu tiên X hơn Y" đều quy về đúng 5 tầng này, không
 * phát sinh tầng mới tuỳ tiện. `"performance"` ở đây CHÍNH LÀ tầng mà
 * `MOMENT_PRIORITY_ORDER` (`thought-governance.ts`, thứ tự kỹ thuật/
 * thuật toán viết sẵn) thuộc về — tầng thấp nhất. `HUMAN_BENEFIT_ORDER`
 * dưới đây là cách `"human"` được áp dụng cụ thể để thắng `"performance"`
 * tại lớp Thought Governance.
 */
export type DecisionHierarchyLevel = "human" | "character" | "trust" | "knowledge" | "performance";

export const DECISION_HIERARCHY: readonly DecisionHierarchyLevel[] = [
  "human",
  "character",
  "trust",
  "knowledge",
  "performance",
];

export function hierarchyRank(level: DecisionHierarchyLevel): number {
  return DECISION_HIERARCHY.indexOf(level);
}

/**
 * Khi hai cấp độ Decision Hierarchy xung đột, cấp độ có rank nhỏ hơn
 * (đứng trước trong `DECISION_HIERARCHY`, gần "human" hơn) luôn thắng —
 * không phụ thuộc tình huống, không có ngoại lệ rule-based nào khác.
 */
export function hierarchyWins(a: DecisionHierarchyLevel, b: DecisionHierarchyLevel): boolean {
  return hierarchyRank(a) < hierarchyRank(b);
}

/**
 * Bốn câu hỏi Moral Compass tự hỏi trước khi cho phép một loại moment
 * được tham gia chọn lựa. Rule-based — ba câu đầu (`respectsHuman`,
 * `helpsGrowth`, `reflectsCharacter`) vẫn là RÀO CHẮN cho loại moment
 * MỚI trong tương lai, không phải bộ lọc thật cho hôm nay (đúng cách
 * `respectsUser`/`isHumble` ở `character-engine.ts`). `wouldBeProudLater`
 * (tầng "trust") KHÔNG còn là rào chắn lý thuyết từ Sprint 21.4 — nó
 * đọc thật `HUMAN_BENEFIT_ORDER`, xem `reviewWithFourQuestions()`.
 */
export type FourQuestionsReview = {
  /** Tầng "human" (`DECISION_HIERARCHY`). */
  respectsHuman: boolean;
  /** Tầng "human" (`DECISION_HIERARCHY`) — trưởng thành của con người, không phải hiệu suất. */
  helpsGrowth: boolean;
  /** Tầng "character" (`DECISION_HIERARCHY`). */
  reflectsCharacter: boolean;
  /** Tầng "trust" (`DECISION_HIERARCHY`) — niềm tin với chính mình theo thời gian. */
  wouldBeProudLater: boolean;
};

/**
 * Sprint 21.4 — The Trust Must Be Real (`docs/THE_TRUST_MUST_BE_REAL.md`).
 * `wouldBeProudLater` không còn hardcode `true` — nó đọc đúng dữ liệu
 * Trust đã tồn tại từ Sprint 20.2: `HUMAN_BENEFIT_ORDER`, danh sách loại
 * moment đã thực sự được xét theo Respect/Growth/Trust/Long-term
 * Relationship (không phải CTR/engagement, xem comment ở
 * `HUMAN_BENEFIT_ORDER` dưới đây). Một loại moment "sẽ tự hào về sau"
 * khi nó đã được đưa vào danh sách này — nghĩa là ai đó đã thật sự cân
 * nhắc moment đó dưới góc nhìn con người, không phải mặc định cho qua.
 * Nếu một `CompanionMomentType` MỚI được thêm vào tương lai mà CHƯA
 * được thêm vào `HUMAN_BENEFIT_ORDER`, cờ này trả về `false` thật —
 * lần đầu tiên có khả năng chặn, không chỉ lý thuyết. Ba câu hỏi còn
 * lại vẫn `true` (chưa thuộc phạm vi Sprint này, xem Education Debt ở
 * `docs/THE_TRUST_MUST_BE_REAL.md`).
 */
export function reviewWithFourQuestions(type: CompanionMomentType): FourQuestionsReview {
  return {
    respectsHuman: true,
    helpsGrowth: true,
    reflectsCharacter: true,
    wouldBeProudLater: HUMAN_BENEFIT_ORDER.includes(type),
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
 *
 * Đây là ví dụ cụ thể của tầng "human" (`DECISION_HIERARCHY`) thắng
 * tầng "performance" (thứ tự kỹ thuật `MOMENT_PRIORITY_ORDER`) — KHÔNG
 * import trực tiếp mảng đó để tránh circular import giữa hai module
 * (`thought-governance.ts` cần gọi `humanBenefitRank()` ở đây). Mọi
 * thay đổi ở `MOMENT_PRIORITY_ORDER` gốc nên được phản chiếu lại đây,
 * giữ nguyên thứ tự, CHỈ TRỪ vị trí của `greeting`/`daily-thought` đã
 * được đảo có chủ đích.
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
