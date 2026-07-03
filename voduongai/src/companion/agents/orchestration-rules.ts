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
  /** Câu tĩnh, hoặc hàm dựng câu từ chính input thật (để nhắc missionTitle/seedTitle/projectName...). */
  companionMessage: string | ((input: OrchestratorInput) => string);
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
    id: "academy-mission-start",
    module: "academy",
    matchKeywords: [],
    agentIds: ["mission-planner", "practice-coach", "reflection-partner"],
    companionMessage: (input) =>
      input.userGoal
        ? `Mình sẽ cùng bạn làm "${input.userGoal}". Đầu tiên mình chia nhỏ việc này, rồi mời đúng người hỗ trợ từng bước.`
        : "Mình sẽ cùng bạn bắt đầu Mission này, từng bước một.",
  },
  {
    id: "ckos-practice",
    module: "ckos",
    matchKeywords: ["thực hành", "luyện tập", "practice"],
    agentIds: ["ckos-prompt-agent", "ckos-reviewer"],
    companionMessage: (input) =>
      input.userGoal
        ? `Để luyện tập "${input.userGoal}", mình mời AI Prompt Agent gợi ý cách thử, và AI Reviewer Agent xem lại kết quả giúp bạn.`
        : "Mình mời AI Prompt Agent và AI Reviewer Agent cùng bạn luyện tập.",
  },
  {
    id: "ckos-next-action",
    module: "ckos",
    matchKeywords: ["bước tiếp theo", "next action"],
    agentIds: ["ckos-summary", "research"],
    companionMessage: (input) =>
      input.currentContext
        ? `Bước tiếp theo mình gợi ý: ${input.currentContext}. Mình mời AI Summary Agent tóm tắt lại để bạn dễ bắt đầu.`
        : "Mình mời AI Summary Agent tóm tắt lại để bạn dễ bắt đầu bước tiếp theo.",
  },
  {
    id: "opportunities-project-analysis",
    module: "opportunities",
    matchKeywords: ["phân tích dự án", "phân tích"],
    agentIds: ["project-analyst", "risk-analyst"],
    companionMessage: (input) =>
      input.userGoal
        ? `Mình mời AI Project Analyst cùng phân tích "${input.userGoal}", và AI Risk Analyst xem xét rủi ro trước khi bạn quyết định.`
        : "Mình mời AI Project Analyst và AI Risk Analyst cùng phân tích dự án này.",
  },
  {
    id: "opportunities-action-plan",
    module: "opportunities",
    matchKeywords: ["lập kế hoạch", "kế hoạch áp dụng", "action plan"],
    agentIds: ["strategy-agent", "action-planner"],
    companionMessage: (input) =>
      input.userGoal
        ? `Để áp dụng "${input.userGoal}", mình mời AI Strategy Agent gợi ý hướng đi và AI Action Planner chia thành các bước cụ thể.`
        : "Mình mời AI Strategy Agent và AI Action Planner giúp bạn lập kế hoạch áp dụng.",
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
