/**
 * Companion Orchestration System™ — Orchestration Rules (Product Amendment 02).
 * Rule-based hoàn toàn, chưa gọi AI thật. Mỗi rule khớp theo module +
 * userGoal/context, chọn ra đúng tập Agent cần mời và câu Companion sẽ nói —
 * đúng tinh thần "Companion quyết định, người dùng không tự chọn Agent".
 */

import type { PortalModule } from "./agent.types";
import { getAgentsByModule } from "./agent-registry";

export type OrchestratorInput = {
  currentRoute: string;
  userGoal?: string;
  currentModule?: PortalModule;
  currentContext?: string;
};

export type OrchestrationRule = {
  id: string;
  module: PortalModule;
  /** So khớp theo userGoal/currentContext (không phân biệt hoa thường, khớp một phần). */
  matchKeywords: string[];
  agentIds: string[];
  companionMessage: string;
};

function textOf(input: OrchestratorInput): string {
  return `${input.userGoal ?? ""} ${input.currentContext ?? ""}`.toLowerCase();
}

export const ORCHESTRATION_RULES: OrchestrationRule[] = [
  {
    id: "academy-mission-landing-page",
    module: "academy",
    matchKeywords: ["landing page"],
    agentIds: ["mission-planner", "ckos-writer", "ckos-summary", "ckos-reviewer"],
    companionMessage:
      "Mình sẽ cùng bạn làm việc này. Để hoàn thành, mình sẽ mời Writer, Designer và SEO hỗ trợ chúng ta.",
  },
  {
    id: "opportunities-risk-check",
    module: "opportunities",
    matchKeywords: ["rủi ro", "risk"],
    agentIds: ["risk-analyst", "project-analyst", "action-planner"],
    companionMessage:
      "Trước khi bạn quyết định, mình mời AI Risk Analyst cùng nhìn kỹ những rủi ro có thể gặp.",
  },
  {
    id: "learning-journal-write",
    module: "learning-journal",
    matchKeywords: [],
    agentIds: ["reflection-helper"],
    companionMessage: "Hôm nay bạn muốn ghi lại điều gì đã học được? Mình giúp bạn bắt đầu.",
  },
];

/**
 * Rule khớp theo module + từ khoá trong userGoal/currentContext. Nếu không
 * có rule cụ thể nào khớp, Companion Orchestrator sẽ dùng đội mặc định của
 * module (xem `companion-orchestrator.ts`).
 */
export function findMatchingRule(input: OrchestratorInput, portalModule: PortalModule): OrchestrationRule | null {
  const text = textOf(input);
  const candidates = ORCHESTRATION_RULES.filter((rule) => rule.module === portalModule);
  const specific = candidates.find(
    (rule) => rule.matchKeywords.length > 0 && rule.matchKeywords.some((keyword) => text.includes(keyword))
  );
  if (specific) return specific;
  return candidates.find((rule) => rule.matchKeywords.length === 0) ?? null;
}

/** Đội Agent mặc định của một module khi chưa có rule cụ thể nào khớp — Nhật ký học tập luôn im lặng về Agent (Product Rule). */
export function defaultAgentIdsForModule(module: PortalModule): string[] {
  if (module === "learning-journal") return [];
  return getAgentsByModule(module)
    .slice(0, 2)
    .map((agent) => agent.id);
}
