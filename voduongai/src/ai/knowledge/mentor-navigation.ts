/**
 * SPRINT A05 — Platform Intelligence & Knowledge Routing: Mentor
 * Navigation.
 *
 * `MentorNavigationResult` nối `KnowledgeRoutingResult` + chiến lược hội
 * thoại (A04) thành 1 gợi ý điều hướng ở mức NHẬN THỨC — CHỈ schema +
 * helper thuần, KHÔNG tạo URL, KHÔNG gọi search/Runtime thật.
 */

import { findPlatformNode } from "../platform/platform-context";
import type { PlatformNode } from "../platform/platform-model";
import type { Goal } from "../mentor/goal";
import type { ConversationStrategy, ConversationStrategyKind } from "../mentor/conversation-strategy";
import { routeKnowledge, type KnowledgeRoutingResult } from "./knowledge-routing";

export type MentorNextActionType =
  | "clarify"
  | "explore-platform"
  | "search-knowledge"
  | "open-learning-content"
  | "review-progress"
  | "reflect"
  | "no-safe-route";

export type MentorNavigationResult = {
  currentArea: PlatformNode | null;
  recommendedArea: PlatformNode | null;
  knowledgeRoute: KnowledgeRoutingResult;
  nextActionType: MentorNextActionType;
  explanation: string;
};

/** Khu vực cố định dùng cho 2 hành động phản ánh — không phụ thuộc
    `KnowledgeRoutingResult` vì bản chất "nhìn lại"/"xem tiến độ" không
    phải tra cứu tri thức mới. */
const REVIEW_PROGRESS_AREA_ID = "nhat-ky-hoc-tap";
const REFLECT_AREA_ID = "hanh-trinh-cua-toi";

/**
 * 6 kind của `ConversationStrategy` (A04) → 1 trong 7
 * `MentorNextActionType` — `"no-safe-route"` ưu tiên trên mọi kind khác
 * ngoại trừ `"clarify"`/`"reflect"` (2 kind này có ý nghĩa hành động rõ
 * ràng ngay cả khi chưa/không cần route tri thức nào).
 */
function resolveNextActionType(strategyKind: ConversationStrategyKind, hasRoute: boolean): MentorNextActionType {
  if (strategyKind === "clarify") return "clarify";
  if (strategyKind === "reflect") return "reflect";
  if (!hasRoute) return "no-safe-route";
  if (strategyKind === "teach") return "search-knowledge";
  if (strategyKind === "coach") return "explore-platform";
  if (strategyKind === "recommend") return "open-learning-content";
  return "review-progress"; // encourage
}

function buildExplanation(
  nextActionType: MentorNextActionType,
  knowledgeRoute: KnowledgeRoutingResult,
  recommendedArea: PlatformNode | null
): string {
  switch (nextActionType) {
    case "clarify":
      return "Cần hỏi làm rõ mục tiêu trước khi gợi ý khu vực cụ thể.";
    case "no-safe-route":
      return knowledgeRoute.reason;
    case "reflect":
      return `Nên cùng nhìn lại tại ${recommendedArea?.name ?? "Hành trình của tôi"}.`;
    case "review-progress":
      return `Nên xem lại tiến độ tại ${recommendedArea?.name ?? "Nhật ký học tập"} trước khi tiếp tục.`;
    default:
      return knowledgeRoute.reason;
  }
}

/**
 * Helper thuần — dựng `MentorNavigationResult`. Chỉ orchestration +
 * string templating, không mutate input, deterministic.
 */
export function buildMentorNavigation(input: {
  goal: Goal;
  strategy: ConversationStrategy;
  currentAreaId?: string | null;
}): MentorNavigationResult {
  const knowledgeRoute = routeKnowledge(input);
  const nextActionType = resolveNextActionType(input.strategy.kind, knowledgeRoute.primaryRoute !== null);

  const recommendedAreaId =
    nextActionType === "reflect"
      ? REFLECT_AREA_ID
      : nextActionType === "review-progress"
        ? REVIEW_PROGRESS_AREA_ID
        : (knowledgeRoute.primaryRoute?.platformAreaId ?? null);

  const recommendedArea = recommendedAreaId ? findPlatformNode(recommendedAreaId) : null;

  return {
    currentArea: knowledgeRoute.platformContext.currentArea,
    recommendedArea,
    knowledgeRoute,
    nextActionType,
    explanation: buildExplanation(nextActionType, knowledgeRoute, recommendedArea),
  };
}
