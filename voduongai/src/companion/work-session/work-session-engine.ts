/**
 * EPIC 02 — Sprint 04: Companion Work Session Engine™.
 * Pure, rule-based, KHÔNG gọi AI — mô phỏng nhịp làm việc của Companion
 * (quan sát → hiểu mục tiêu → lập kế hoạch → mời từng Specialist → chờ →
 * tổng hợp → sẵn sàng) dựa trên kế hoạch đã có từ `companion-orchestrator.ts`.
 *
 * `createWorkSession()` dựng phiên ban đầu; `advanceWorkSession()` là hàm
 * thuần (không side-effect) tiến phiên đi đúng MỘT bước — UI (hook
 * `use-companion-work-session.ts`) chịu trách nhiệm gọi nó theo nhịp thời
 * gian, để trải nghiệm cảm thấy Companion đang thật sự làm việc, không phải
 * hiện kết quả tức thì.
 */

import { orchestrate, type OrchestratorInput } from "@/companion/agents/companion-orchestrator";
import type { CompanionAgent } from "@/companion/agents/agent.types";
import {
  celebratingLine,
  invitingLine,
  observingLine,
  planningLine,
  readyLine,
  synthesizingLine,
  thinkingLine,
  waitingLine,
} from "./companion-work-language";
import type { CompanionMessage, CompanionStatus, CompanionWorkSession, CompanionWorkStep } from "./work-session.types";

function specialistName(agent: CompanionAgent): string {
  return agent.name.replace(/^AI /, "");
}

function withStepStatus(plan: CompanionWorkStep[], stepId: string, status: CompanionWorkStep["status"]): CompanionWorkStep[] {
  return plan.map((step) => (step.id === stepId ? { ...step, status } : step));
}

function activeAgentIndex(session: CompanionWorkSession): number {
  return session.plan.findIndex(
    (step) => step.agentId && step.status === "active"
  ) === -1
    ? -1
    : session.selectedSpecialists.findIndex(
        (agent) => session.plan.find((step) => step.agentId === agent.id)?.status === "active"
      );
}

function appendMessage(session: CompanionWorkSession, text: string, status: CompanionStatus): CompanionMessage[] {
  return [...session.companionMessages, { id: `m${session.companionMessages.length}`, text, status }];
}

/**
 * Dựng phiên làm việc ban đầu từ một hành động thật (route/userGoal/context)
 * — trả về null nếu route không thuộc module Portal nào có Companion điều
 * phối (giống `orchestrate()`).
 */
export function createWorkSession(input: OrchestratorInput): CompanionWorkSession | null {
  const plan = orchestrate(input);
  if (!plan) return null;

  const userGoal = input.userGoal ?? plan.moduleLabel;
  const steps: CompanionWorkStep[] = [
    { id: "understand-goal", label: "Hiểu mục tiêu", status: "active" },
    ...plan.selectedAgents.map((agent) => ({
      id: `invite-${agent.id}`,
      label: `Mời ${specialistName(agent)}`,
      status: "pending" as const,
      agentId: agent.id,
    })),
    { id: "synthesize", label: "Tổng hợp kết quả", status: "pending" },
  ];

  return {
    id: `${plan.module}:${input.currentRoute}:${userGoal}:${Date.now()}`,
    module: plan.module,
    route: input.currentRoute,
    userGoal,
    context: input.currentContext,
    plan: steps,
    selectedSpecialists: plan.selectedAgents,
    currentStatus: "OBSERVING",
    companionMessages: [{ id: "m0", text: observingLine(userGoal), status: "OBSERVING" }],
    nextStep: plan.nextStep,
  };
}

/** Phiên đã tới trạng thái cuối (READY) hoặc đang ăn mừng (CELEBRATING) — không tự tiến thêm nữa. */
export function isWorkSessionSettled(session: CompanionWorkSession): boolean {
  return session.currentStatus === "READY" || session.currentStatus === "CELEBRATING";
}

/**
 * Tiến phiên làm việc đi đúng MỘT bước — hàm thuần, không side-effect. Gọi
 * lặp lại theo nhịp thời gian (xem hook) để mô phỏng Companion đang làm
 * việc, không nhảy thẳng tới kết quả.
 */
export function advanceWorkSession(session: CompanionWorkSession): CompanionWorkSession {
  if (isWorkSessionSettled(session)) return session;

  let plan = session.plan;
  let nextStatus: CompanionStatus = session.currentStatus;
  let message: string | null = null;
  let resultSummary = session.resultSummary;

  switch (session.currentStatus) {
    case "OBSERVING": {
      nextStatus = "THINKING";
      message = thinkingLine();
      break;
    }
    case "THINKING": {
      nextStatus = "PLANNING";
      message = planningLine(session.selectedSpecialists);
      break;
    }
    case "PLANNING": {
      plan = withStepStatus(plan, "understand-goal", "done");
      if (session.selectedSpecialists.length > 0) {
        const first = session.selectedSpecialists[0];
        plan = withStepStatus(plan, `invite-${first.id}`, "active");
        nextStatus = "INVITING_AGENT";
        message = invitingLine(first);
      } else {
        plan = withStepStatus(plan, "synthesize", "active");
        nextStatus = "SYNTHESIZING";
        message = synthesizingLine();
      }
      break;
    }
    case "INVITING_AGENT": {
      const index = activeAgentIndex(session);
      const agent = session.selectedSpecialists[index] ?? session.selectedSpecialists[0];
      nextStatus = "WAITING_AGENT";
      message = waitingLine(agent);
      break;
    }
    case "WAITING_AGENT": {
      const index = activeAgentIndex(session);
      const current = session.selectedSpecialists[index] ?? session.selectedSpecialists[0];
      plan = withStepStatus(plan, `invite-${current.id}`, "done");
      const hasMore = index + 1 < session.selectedSpecialists.length;
      if (hasMore) {
        const next = session.selectedSpecialists[index + 1];
        plan = withStepStatus(plan, `invite-${next.id}`, "active");
        nextStatus = "INVITING_AGENT";
        message = invitingLine(next, current);
      } else {
        plan = withStepStatus(plan, "synthesize", "active");
        nextStatus = "SYNTHESIZING";
        message = synthesizingLine();
      }
      break;
    }
    case "SYNTHESIZING": {
      plan = withStepStatus(plan, "synthesize", "done");
      nextStatus = "READY";
      message = readyLine(session.nextStep);
      resultSummary = buildResultSummary(session);
      break;
    }
    default:
      break;
  }

  return {
    ...session,
    plan,
    currentStatus: nextStatus,
    companionMessages: message ? appendMessage(session, message, nextStatus) : session.companionMessages,
    resultSummary,
  };
}

function buildResultSummary(session: CompanionWorkSession): string {
  if (session.selectedSpecialists.length === 0) {
    return `Mình đã đồng hành cùng bạn qua "${session.userGoal}".`;
  }
  const names = session.selectedSpecialists.map(specialistName).join(", ");
  return `${names} đã hỗ trợ xong phần của mình cho "${session.userGoal}".`;
}

/** Người dùng ghi nhận đã thử/áp dụng — Companion chuyển sang ăn mừng đúng một lần. */
export function celebrateWorkSession(session: CompanionWorkSession): CompanionWorkSession {
  if (session.currentStatus !== "READY") return session;
  const text = celebratingLine(session.userGoal);
  return {
    ...session,
    currentStatus: "CELEBRATING",
    companionMessages: appendMessage(session, text, "CELEBRATING"),
  };
}
