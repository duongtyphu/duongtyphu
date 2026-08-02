/**
 * SPRINT A05 — Platform Intelligence & Knowledge Routing: Knowledge Need.
 *
 * `KnowledgeNeed` suy ra "cần loại tri thức gì, ưu tiên nguồn nào, khu
 * vực nào" từ 1 `Goal` (A02) + `ConversationStrategy` (A04) đã có sẵn —
 * rule-based, deterministic. KHÔNG tự bịa tên nội dung cụ thể (chỉ
 * KIỂU/NGUỒN/KHU VỰC), KHÔNG đọc CKOS/Premium/Portal Catalog thật.
 */

import type { Goal, GoalCategory } from "../mentor/goal";
import type { ConversationStrategy } from "../mentor/conversation-strategy";
import type { KnowledgeType } from "./knowledge-types";
import { type KnowledgeSource, sortSourcesByPriority } from "./knowledge-source";

export type KnowledgeNeed = {
  goal: Goal;
  strategy: ConversationStrategy;
  knowledgeTypes: KnowledgeType[];
  /** Đã sắp theo `KNOWLEDGE_SOURCE_PRIORITY_ORDER`. */
  preferredSources: KnowledgeSource[];
  /** Id các `PlatformNode` liên quan — KHÔNG phải URL, chỉ là id trong
      Platform Tree (`src/ai/platform/platform-tree.ts`). */
  requiredPlatformAreas: string[];
  /** 0-1 — kế thừa trực tiếp `goal.confidence` (A02/A03 đã tính sẵn,
      không suy luận lại). */
  confidence: number;
  missingInformation: string[];
};

type CategoryKnowledgeRule = {
  knowledgeTypes: KnowledgeType[];
  sources: KnowledgeSource[];
  areas: string[];
};

/**
 * Luật CỐ ĐỊNH theo từng `GoalCategory` (taxonomy đã khoá ở A02) — viết
 * tay, đúng 3 ví dụ mẫu Sprint đã cho (`hoc-prompt`/`hoc-cong-cu-ai`/
 * `premium`) và suy rộng có căn cứ cho các category còn lại, dựa trên
 * `supportedGoalCategories`/`supportedKnowledgeTypes` đã gán ở
 * `platform-tree.ts`. KHÔNG có category nào bị thiếu (kể cả `"khac"`).
 */
const CATEGORY_KNOWLEDGE_RULES: Record<GoalCategory, CategoryKnowledgeRule> = {
  "hoc-ai": {
    knowledgeTypes: ["lesson", "course", "best-practice"],
    sources: ["ckos", "academy"],
    areas: ["ckos", "hoc-vien-ai"],
  },
  "hoc-prompt": {
    knowledgeTypes: ["prompt", "lesson", "best-practice"],
    sources: ["ckos", "academy"],
    areas: ["ckos", "hoc-vien-ai"],
  },
  "hoc-cong-cu-ai": {
    knowledgeTypes: ["tool", "workflow", "best-practice"],
    sources: ["ckos"],
    areas: ["ckos", "ai-workspace"],
  },
  premium: {
    knowledgeTypes: ["premium-content", "course"],
    sources: ["premium", "academy"],
    areas: ["premium", "hoc-vien-ai"],
  },
  "xay-thuong-hieu-ca-nhan": {
    knowledgeTypes: ["best-practice", "community-support", "resource"],
    sources: ["ckos", "community"],
    areas: ["ckos", "cong-dong"],
  },
  "affiliate-marketing": {
    knowledgeTypes: ["workflow", "best-practice", "resource"],
    sources: ["ckos", "projects"],
    areas: ["ckos", "du-an-co-hoi"],
  },
  "tao-noi-dung": {
    knowledgeTypes: ["workflow", "prompt", "best-practice"],
    sources: ["ckos", "workspace"],
    areas: ["ckos", "ai-workspace"],
  },
  "xay-dung-he-thong": {
    knowledgeTypes: ["workflow", "tool", "resource"],
    sources: ["ckos", "workspace"],
    areas: ["ckos", "ai-workspace"],
  },
  "du-an-co-hoi": {
    knowledgeTypes: ["project", "case-study", "resource"],
    sources: ["projects", "community"],
    areas: ["du-an-co-hoi", "cong-dong"],
  },
  khac: {
    knowledgeTypes: ["general-guidance"],
    sources: ["general-model-knowledge"],
    areas: [],
  },
};

/**
 * Helper thuần — dựng `KnowledgeNeed` từ `Goal` + `ConversationStrategy`
 * đã có sẵn. Khi `strategy.kind === "clarify"`, KHÔNG tra bảng luật theo
 * category (mục tiêu chưa đủ rõ để gợi ý cụ thể) — trả về nhu cầu chung
 * chung nhất (`general-guidance`/`general-model-knowledge`, không khu
 * vực nào), đúng tinh thần "ưu tiên làm rõ trước" của Phần 6.
 */
export function inferKnowledgeNeed(goal: Goal, strategy: ConversationStrategy): KnowledgeNeed {
  if (strategy.kind === "clarify") {
    return {
      goal,
      strategy,
      knowledgeTypes: ["general-guidance"],
      preferredSources: ["general-model-knowledge"],
      requiredPlatformAreas: [],
      confidence: goal.confidence,
      missingInformation: ["Cần làm rõ mục tiêu trước khi xác định nguồn tri thức cụ thể."],
    };
  }

  const rule = CATEGORY_KNOWLEDGE_RULES[goal.category];
  const missingInformation =
    goal.category === "khac" ? ["Chưa xác định được nhóm mục tiêu cụ thể — chỉ dùng được hướng dẫn chung."] : [];

  return {
    goal,
    strategy,
    knowledgeTypes: [...rule.knowledgeTypes],
    preferredSources: sortSourcesByPriority(rule.sources),
    requiredPlatformAreas: [...rule.areas],
    confidence: goal.confidence,
    missingInformation,
  };
}
