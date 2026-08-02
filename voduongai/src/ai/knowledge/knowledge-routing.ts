/**
 * SPRINT A05 — Platform Intelligence & Knowledge Routing: Knowledge
 * Routing.
 *
 * `routeKnowledge()` nối `PlatformContext` (`ai/platform`) +
 * `KnowledgeNeed` thành 1 `KnowledgeRoutingResult` — CHỈ dùng
 * `PlatformNode`/`KnowledgeSource` đã định nghĩa sẵn, KHÔNG tạo route
 * URL, KHÔNG bịa khoá học/Prompt/Workflow/dự án nào. Nếu confidence thấp
 * hoặc thiếu thông tin quan trọng, KHÔNG chọn route chắc chắn — trả về
 * `unresolvedQuestions` thay vì đoán.
 */

import type { Goal } from "../mentor/goal";
import { GOAL_CATEGORY_LABEL } from "../mentor/goal";
import type { ConversationStrategy } from "../mentor/conversation-strategy";
import { buildPlatformContext, findPlatformNode, type PlatformContext } from "../platform/platform-context";
import { inferKnowledgeNeed, type KnowledgeNeed } from "./knowledge-need";
import { type KnowledgeSource, sortSourcesByPriority } from "./knowledge-source";
import type { KnowledgeType } from "./knowledge-types";

export type KnowledgeRoute = {
  platformAreaId: string;
  knowledgeTypes: KnowledgeType[];
  sources: KnowledgeSource[];
  reason: string;
  priority: number;
};

export type KnowledgeRoutingResult = {
  goal: Goal;
  platformContext: PlatformContext;
  knowledgeNeed: KnowledgeNeed;
  primaryRoute: KnowledgeRoute | null;
  alternativeRoutes: KnowledgeRoute[];
  sourcePriority: KnowledgeSource[];
  confidence: number;
  reason: string;
  unresolvedQuestions: string[];
};

/** Ngưỡng tối thiểu để dám chọn 1 route chắc chắn — khớp đúng ranh giới
    dải "unclear" đã khoá ở A03 (`goal-detector.rules.ts`'s
    `classifyConfidenceBand()`), không tự đặt ngưỡng riêng. */
const CONFIDENT_ROUTING_THRESHOLD = 0.4;

/**
 * Dựng 1 `KnowledgeRoute` cho `areaId` — CHỈ giữ lại những `knowledgeType`
 * mà khu vực đó thật sự "hỗ trợ" (`PlatformNode.supportedKnowledgeTypes`,
 * đã gán ở `platform-tree.ts`), tránh gán 1 khu vực vào loại tri thức nó
 * không có. Không tìm thấy giao nào → khu vực đó KHÔNG đủ căn cứ để lên
 * route (trả `null`, nơi gọi tự lọc bỏ).
 */
function buildRouteForArea(areaId: string, knowledgeNeed: KnowledgeNeed, priority: number): KnowledgeRoute | null {
  const node = findPlatformNode(areaId);
  if (!node) return null;

  const knowledgeTypes = knowledgeNeed.knowledgeTypes.filter((type) => node.supportedKnowledgeTypes.includes(type));
  if (knowledgeTypes.length === 0) return null;

  return {
    platformAreaId: node.id,
    knowledgeTypes,
    sources: [...knowledgeNeed.preferredSources],
    reason: `${node.name} hỗ trợ đúng loại tri thức cần cho mục tiêu "${GOAL_CATEGORY_LABEL[knowledgeNeed.goal.category]}".`,
    priority,
  };
}

/**
 * Helper thuần — orchestration đúng pipeline đã chốt: Goal → Mentor
 * Strategy → Platform Area → Knowledge Need → Knowledge Source → Routing
 * Result. Không mutate `input`, deterministic — cùng input luôn cho cùng
 * output.
 */
export function routeKnowledge(input: {
  goal: Goal;
  strategy: ConversationStrategy;
  currentAreaId?: string | null;
}): KnowledgeRoutingResult {
  const platformContext = buildPlatformContext(input.currentAreaId ?? null);
  const knowledgeNeed = inferKnowledgeNeed(input.goal, input.strategy);
  const sourcePriority = sortSourcesByPriority(knowledgeNeed.preferredSources);

  const routes = knowledgeNeed.requiredPlatformAreas
    .map((areaId, index) => buildRouteForArea(areaId, knowledgeNeed, index + 1))
    .filter((route): route is KnowledgeRoute => route !== null);

  const hasEnoughConfidence = knowledgeNeed.confidence >= CONFIDENT_ROUTING_THRESHOLD;
  const needsClarificationFirst = input.strategy.kind === "clarify" || !hasEnoughConfidence;

  if (needsClarificationFirst || routes.length === 0) {
    return {
      goal: input.goal,
      platformContext,
      knowledgeNeed,
      primaryRoute: null,
      alternativeRoutes: [],
      sourcePriority,
      confidence: knowledgeNeed.confidence,
      reason: needsClarificationFirst
        ? "Mục tiêu chưa đủ rõ để chọn 1 khu vực tri thức cụ thể — cần làm rõ trước."
        : "Không tìm được khu vực nào khớp đúng loại tri thức cần cho mục tiêu này.",
      unresolvedQuestions:
        knowledgeNeed.missingInformation.length > 0
          ? [...knowledgeNeed.missingInformation]
          : ["Bạn đang cần loại hỗ trợ nào cụ thể hơn?"],
    };
  }

  const [primaryRoute, ...alternativeRoutes] = routes;

  return {
    goal: input.goal,
    platformContext,
    knowledgeNeed,
    primaryRoute,
    alternativeRoutes,
    sourcePriority,
    confidence: knowledgeNeed.confidence,
    reason: `Mục tiêu thuộc nhóm "${GOAL_CATEGORY_LABEL[input.goal.category]}" — ưu tiên khu vực ${
      findPlatformNode(primaryRoute.platformAreaId)?.name ?? primaryRoute.platformAreaId
    }.`,
    unresolvedQuestions: [],
  };
}
