/**
 * Companion Orchestration System™ — Companion Orchestrator (Product
 * Amendment 02). Rule-based, chưa gọi AI thật. Đây là nơi DUY NHẤT quyết
 * định Agent nào được mời cho một tình huống — người dùng không bao giờ tự
 * chọn Agent, chỉ thấy kết quả Companion đã quyết định.
 */

import type { CompanionAgent, PortalModule } from "./agent.types";
import { getAgentById } from "./agent-registry";
import { getModuleForRoute, MODULE_LABELS } from "./module-agent-map";
import {
  defaultAgentIdsForModule,
  findMatchingRule,
  type OrchestratorInput,
} from "./orchestration-rules";

export type { OrchestratorInput } from "./orchestration-rules";

export type PlanStepStatus = "done" | "active" | "pending";

export type PlanStep = {
  id: string;
  label: string;
  status: PlanStepStatus;
};

export type OrchestrationPlan = {
  module: PortalModule;
  moduleLabel: string;
  /** Đội Agent Companion đã chọn — RỖNG với "learning-journal" theo Product Rule (không để Agent xuất hiện ở Nhật ký học tập). */
  selectedAgents: CompanionAgent[];
  actionPlan: PlanStep[];
  companionMessage: string;
  nextStep: string;
};

function buildActionPlan(agents: CompanionAgent[]): PlanStep[] {
  const steps: PlanStep[] = [{ id: "understand-goal", label: "Hiểu mục tiêu", status: "done" }];
  agents.forEach((agent) => {
    steps.push({ id: `invite-${agent.id}`, label: `Mời ${agent.name}`, status: "done" });
  });
  steps.push({ id: "synthesize", label: "Đang tổng hợp kết quả", status: "pending" });
  return steps;
}

function buildNextStep(portalModule: PortalModule): string {
  switch (portalModule) {
    case "academy":
      return "Tiếp tục làm theo từng bước, Companion sẽ tổng hợp khi bạn hoàn thành.";
    case "opportunities":
      return "Xem lại phân tích rồi quyết định bước hành động tiếp theo.";
    case "learning-journal":
      return "Viết điều bạn vừa nhận ra — không cần dài, chỉ cần thật.";
    default:
      return "Tiếp tục khi bạn sẵn sàng, Companion vẫn ở đây.";
  }
}

/**
 * Companion Orchestrator — input: route/goal/context hiện tại; output: đội
 * Agent đã chọn (rỗng ở Nhật ký học tập), kế hoạch làm việc, và câu Companion
 * sẽ nói. Trả về null nếu route không thuộc module Portal nào có Companion
 * điều phối.
 */
export function orchestrate(input: OrchestratorInput): OrchestrationPlan | null {
  const portalModule = input.currentModule ?? getModuleForRoute(input.currentRoute);
  if (!portalModule) return null;

  const rule = findMatchingRule(input, portalModule);
  const agentIds = rule?.agentIds ?? defaultAgentIdsForModule(portalModule);
  const agents = agentIds.map(getAgentById).filter((agent): agent is CompanionAgent => Boolean(agent));

  // Product Rule — Nhật ký học tập: Companion tự giúp Reflection, không để
  // AI Agent xuất hiện trong trải nghiệm người dùng thấy được.
  const visibleAgents = portalModule === "learning-journal" ? [] : agents;

  const companionMessage = rule?.companionMessage ?? buildDefaultMessage(visibleAgents);

  return {
    module: portalModule,
    moduleLabel: MODULE_LABELS[portalModule],
    selectedAgents: visibleAgents,
    actionPlan: buildActionPlan(visibleAgents),
    companionMessage,
    nextStep: buildNextStep(portalModule),
  };
}

function buildDefaultMessage(agents: CompanionAgent[]): string {
  if (agents.length === 0) return "Mình luôn ở đây nếu bạn cần một người đồng hành.";
  const names = agents.map((agent) => agent.name.replace(/^AI /, "")).join(" và ");
  return `Mình sẽ cùng bạn làm việc này. Mình mời ${names} hỗ trợ chúng ta.`;
}
