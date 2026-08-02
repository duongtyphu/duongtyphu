/**
 * SPRINT A03 — Goal Detection & Clarification: rule-based implementation
 * của `GoalDetector` (interface đã định nghĩa ở `goal-detector.ts`,
 * EPIC-A02). Deterministic 100% — chỉ so khớp chuỗi (string matching),
 * KHÔNG gọi AI/LLM/Provider, KHÔNG đọc Database/localStorage. Cùng input
 * luôn cho ra cùng output.
 *
 * KHÔNG tạo nguồn Goal thứ hai — kết quả ở đây chỉ là `GoalCandidate[]`
 * (trạng thái phân tích của phiên chat), không tự ghi vào đâu, không
 * đọc/ghi Goal Runtime (`/portal/goals`), không đọc CKOS/Premium/Memory.
 */

import { GOAL_CATEGORIES, GOAL_CATEGORY_LABEL, clampConfidence, type GoalCategory } from "./goal";
import type { Conversation, GoalCandidate, GoalDetector } from "./goal-detector";

/** Cụm từ thể hiện Ý ĐỊNH (khác việc chỉ nhắc tới chủ đề) — dùng chung cho
    mọi category, kể cả fallback "khac". */
const INTENT_MARKERS: readonly string[] = [
  "muốn",
  "cần",
  "giúp mình",
  "giúp tôi",
  "hướng dẫn",
  "làm sao để",
  "làm thế nào",
];

/** Trình độ hiện tại — 1 trong 3 nhóm "thông tin còn thiếu" phổ quát. */
const LEVEL_MARKERS: readonly string[] = [
  "mới bắt đầu",
  "chưa biết gì",
  "trình độ cơ bản",
  "đã biết",
  "thành thạo",
  "người mới",
  "trình độ nâng cao",
];

/** Mục đích/kết quả mong muốn — nhóm "thông tin còn thiếu" thứ 2, ưu tiên
    cao nhất khi chọn câu hỏi làm rõ (ảnh hưởng trực tiếp bước tiếp theo). */
const OUTCOME_MARKERS: readonly string[] = [
  "áp dụng vào công việc",
  "cho công việc",
  "phục vụ công việc",
  "cho dự án",
  "để kiếm thêm thu nhập",
  "để phát triển sự nghiệp",
  "nhằm mục đích",
];

/** Mốc thời gian mong muốn — nhóm "thông tin còn thiếu" thứ 3. */
const TIMEFRAME_MARKERS: readonly string[] = [
  "trong tháng này",
  "trong tuần này",
  "sớm nhất có thể",
  "trong 1 tháng",
  "trong 3 tháng",
  "trước khi",
];

/** Từ khoá chủ đề cho từng category đã khoá ở EPIC-A02 (trừ "khac" —
    "khac" là fallback khi có ý định nhưng không khớp category nào).
    KHÔNG thêm category mới — đúng taxonomy A02. */
const CATEGORY_TOPIC_KEYWORDS: Record<Exclude<GoalCategory, "khac">, readonly string[]> = {
  "hoc-ai": ["học ai", "học về ai", "trí tuệ nhân tạo", "kiến thức ai", "làm quen với ai"],
  "hoc-prompt": ["học prompt", "viết prompt", "prompt engineering", "kỹ năng prompt"],
  "hoc-cong-cu-ai": [
    "công cụ ai",
    "dùng chatgpt",
    "sử dụng chatgpt",
    "dùng midjourney",
    "sử dụng claude",
    "công cụ trí tuệ nhân tạo",
  ],
  premium: [
    "gói premium",
    "mua khoá học",
    "đăng ký premium",
    "nâng cấp tài khoản premium",
    "vdai solo",
    "vdai scale",
  ],
  "xay-thuong-hieu-ca-nhan": ["thương hiệu cá nhân", "xây dựng thương hiệu", "personal brand", "xây kênh cá nhân"],
  "affiliate-marketing": ["affiliate", "tiếp thị liên kết", "hoa hồng giới thiệu", "làm affiliate"],
  "tao-noi-dung": ["tạo nội dung", "viết content", "sáng tạo nội dung", "làm content"],
  "xay-dung-he-thong": ["xây hệ thống", "tự động hoá quy trình", "xây dựng quy trình", "automation"],
  "du-an-co-hoi": ["dự án kinh doanh", "cơ hội kinh doanh", "hợp tác đầu tư", "tìm dự án"],
};

/**
 * CHÍNH SÁCH CONFIDENCE (mục 3 phạm vi Sprint A03) — 3 dải:
 * 0.00–0.39 chưa đủ để xác định · 0.40–0.69 tiềm năng, cần hỏi thêm ·
 * 0.70–1.00 đủ rõ ở mức phiên chat. Dải cao nhất vẫn chỉ là "đủ rõ ở mức
 * phiên chat" — KHÔNG bao giờ tự động chuyển thành Goal dài hạn.
 */
export type ConfidenceBand = "unclear" | "potential" | "clear";

export function classifyConfidenceBand(confidence: number): ConfidenceBand {
  const c = clampConfidence(confidence);
  if (c >= 0.7) return "clear";
  if (c >= 0.4) return "potential";
  return "unclear";
}

/**
 * Công thức deterministic: có chủ đề mới có điểm (`hasTopic=false` → 0).
 * Base 0.3 nếu chỉ có chủ đề, 0.55 nếu thêm tín hiệu Ý ĐỊNH rõ ràng.
 * Cộng thêm 0.1 cho mỗi loại "thông tin còn thiếu" (trình độ/mục đích/
 * mốc thời gian) đã được người dùng cung cấp (tối đa 3 loại → +0.3).
 * KHÔNG có yếu tố ngẫu nhiên/thời gian hệ thống nào.
 */
function scoreConfidence(hasTopic: boolean, hasIntent: boolean, satisfiedSpecificityCount: number): number {
  if (!hasTopic) return 0;
  const base = hasIntent ? 0.55 : 0.3;
  const bonus = satisfiedSpecificityCount * 0.1;
  return clampConfidence(base + bonus);
}

/**
 * "Thông tin còn thiếu" — 3 tiêu chí PHỔ QUÁT, dùng chung cho mọi
 * category (không tách riêng theo từng category — giữ luật đơn giản, dễ
 * kiểm chứng, đúng tinh thần "rule-based, deterministic"). Thứ tự trả về
 * = thứ tự ưu tiên khi chọn câu hỏi làm rõ (mục đích trước tiên — ảnh
 * hưởng trực tiếp bước tiếp theo — rồi tới trình độ, cuối cùng mốc thời
 * gian) — xem `goal-clarification.ts`'s `pickSuggestedQuestion()`.
 */
function buildMissingInformation(levelKnown: boolean, outcomeKnown: boolean, timeframeKnown: boolean): string[] {
  const missing: string[] = [];
  if (!outcomeKnown) missing.push("Chưa rõ mục đích/kết quả mong muốn cụ thể.");
  if (!levelKnown) missing.push("Chưa rõ trình độ hiện tại của người dùng.");
  if (!timeframeKnown) missing.push("Chưa rõ mốc thời gian mong muốn hoàn thành.");
  return missing;
}

function findEvidenceByKeyword(conversation: Conversation, keyword: string): string | undefined {
  const turn = conversation.turns.find((t) => t.role === "user" && t.content.toLowerCase().includes(keyword));
  return turn?.content.trim();
}

function findEvidenceByAnyMarker(conversation: Conversation, markers: readonly string[]): string | undefined {
  const turn = conversation.turns.find(
    (t) => t.role === "user" && markers.some((m) => t.content.toLowerCase().includes(m))
  );
  return turn?.content.trim();
}

/**
 * DETECTION RULES (mục 1-2 phạm vi Sprint A03) — chỉ đọc lượt hội thoại
 * `role: "user"` (lời Companion không tính là "thông tin người dùng đã
 * cung cấp"). Chỉ ĐỌC `conversation`/`turns` — không mutate.
 *
 * Với mỗi category (trừ "khac"): có candidate khi tìm thấy ÍT NHẤT 1 từ
 * khoá chủ đề trong toàn bộ lượt user (Nhiều mục tiêu trong 1 câu → nhiều
 * candidate cùng lúc). Nếu KHÔNG category nào khớp nhưng có tín hiệu Ý
 * ĐỊNH (`INTENT_MARKERS`) → 1 candidate fallback `category: "khac"`. Nếu
 * không có chủ đề lẫn ý định → mảng rỗng (KHÔNG khẳng định mục tiêu khi
 * dữ liệu chưa đủ).
 */
export function detectGoalCandidates(conversation: Conversation): GoalCandidate[] {
  const userTurns = conversation.turns.filter((t) => t.role === "user");
  const fullUserText = userTurns.map((t) => t.content.toLowerCase()).join(" \n ");

  const hasIntent = INTENT_MARKERS.some((m) => fullUserText.includes(m));
  const levelKnown = LEVEL_MARKERS.some((m) => fullUserText.includes(m));
  const outcomeKnown = OUTCOME_MARKERS.some((m) => fullUserText.includes(m));
  const timeframeKnown = TIMEFRAME_MARKERS.some((m) => fullUserText.includes(m));
  const specificityCount = [levelKnown, outcomeKnown, timeframeKnown].filter(Boolean).length;
  const missingInformation = buildMissingInformation(levelKnown, outcomeKnown, timeframeKnown);

  const candidates: GoalCandidate[] = [];
  let anyTopicMatched = false;

  for (const category of GOAL_CATEGORIES) {
    if (category === "khac") continue;
    const keywords = CATEGORY_TOPIC_KEYWORDS[category];
    const matchedKeyword = keywords.find((k) => fullUserText.includes(k));
    if (!matchedKeyword) continue;
    anyTopicMatched = true;
    const label = GOAL_CATEGORY_LABEL[category];
    candidates.push({
      title: label,
      description: `Người dùng nhắc tới "${matchedKeyword}" — có thể liên quan tới mục tiêu ${label}.`,
      category,
      confidence: scoreConfidence(true, hasIntent, specificityCount),
      evidence: findEvidenceByKeyword(conversation, matchedKeyword),
      missingInformation,
    });
  }

  if (!anyTopicMatched && hasIntent) {
    candidates.push({
      title: "Mục tiêu chưa xác định rõ nhóm",
      description: "Người dùng thể hiện mong muốn nhưng chưa rõ nhóm mục tiêu cụ thể.",
      category: "khac",
      confidence: scoreConfidence(true, hasIntent, specificityCount),
      evidence: findEvidenceByAnyMarker(conversation, INTENT_MARKERS),
      missingInformation,
    });
  }

  return candidates;
}

/**
 * Chọn candidate ĐẠI DIỆN (confidence cao nhất) — tie-break ổn định (giữ
 * thứ tự xuất hiện gốc, nhờ `Array.prototype.sort` stable theo spec
 * ES2019+). Dùng chung cho cả `goal-clarification.ts` lẫn Session
 * integration (`goal-session.ts`'s `updateGoalSessionFromCandidates()`)
 * — 1 nguồn duy nhất cho câu hỏi "candidate nào là chính".
 */
export function pickPrimaryCandidate(candidates: GoalCandidate[]): GoalCandidate | null {
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => b.confidence - a.confidence)[0];
}

/** Implementation thật của `GoalDetector` (interface EPIC-A02) — rule-based,
    đồng bộ, deterministic. */
export const ruleBasedGoalDetector: GoalDetector = {
  detect: detectGoalCandidates,
};
