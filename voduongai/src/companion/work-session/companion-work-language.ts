/**
 * EPIC 02 — Sprint 04: Companion Work Language™.
 * Thư viện câu nói khi Companion đang làm việc — xem
 * `docs/CompanionWorkLanguage.md` cho quy tắc viết đầy đủ.
 *
 * KHÔNG viết như chatbot/hệ thống loading ("Loading...", "Processing...",
 * "Agent executed successfully.", "Task completed.", "Bạn đã hoàn thành
 * 80%."). Companion luôn nói bằng giọng người đang thật sự làm việc cùng.
 */

import type { CompanionAgent } from "@/companion/agents/agent.types";
import type { CompanionStatus } from "./work-session.types";

function specialistName(agent: CompanionAgent): string {
  return agent.name.replace(/^AI /, "");
}

export function observingLine(userGoal: string): string {
  return `Mình thấy bạn đang muốn làm "${userGoal}".`;
}

export function thinkingLine(): string {
  return "Để mình xem mục tiêu này cần những bước nào.";
}

export function planningLine(specialists: CompanionAgent[]): string {
  if (specialists.length === 0) return "Mình đã hình dung được cách tiếp cận việc này rồi.";
  return `Mình nghĩ nên bắt đầu từ phần ${specialists[0].role.toLowerCase()}.`;
}

export function invitingLine(agent: CompanionAgent, previousAgent?: CompanionAgent): string {
  if (previousAgent) {
    return `${specialistName(previousAgent)} đã xong phần đầu. Bây giờ mình muốn mời ${specialistName(agent)} hỗ trợ chúng ta.`;
  }
  return `Mình sẽ mời ${specialistName(agent)} hỗ trợ chúng ta ở bước này.`;
}

export function waitingLine(agent: CompanionAgent): string {
  return `${specialistName(agent)} đang giúp mình phần này, mình sẽ quay lại ngay khi xong.`;
}

export function synthesizingLine(): string {
  return "Chúng ta gần hoàn thành rồi, để mình tổng hợp lại kết quả.";
}

export function readyLine(nextStep?: string): string {
  return nextStep
    ? `Xong rồi. Bước tiếp theo là ${nextStep.charAt(0).toLowerCase()}${nextStep.slice(1)}`
    : "Xong rồi, mình đã sẵn sàng cho bước tiếp theo cùng bạn.";
}

export function celebratingLine(userGoal: string): string {
  return `Bạn vừa hoàn thành "${userGoal}" — điều đó đáng ghi nhận thật đấy.`;
}

/** Câu Companion nói tương ứng với trạng thái hiện tại — dùng khi dựng lại lịch sử companionMessages. */
export function lineForStatus(
  status: CompanionStatus,
  input: {
    userGoal: string;
    specialists: CompanionAgent[];
    invitedSoFar: CompanionAgent[];
    nextStep?: string;
  }
): string {
  switch (status) {
    case "OBSERVING":
      return observingLine(input.userGoal);
    case "THINKING":
      return thinkingLine();
    case "PLANNING":
      return planningLine(input.specialists);
    case "INVITING_AGENT": {
      const index = input.invitedSoFar.length;
      const agent = input.specialists[index];
      const previous = index > 0 ? input.specialists[index - 1] : undefined;
      return agent ? invitingLine(agent, previous) : synthesizingLine();
    }
    case "WAITING_AGENT": {
      const agent = input.invitedSoFar.at(-1);
      return agent ? waitingLine(agent) : synthesizingLine();
    }
    case "SYNTHESIZING":
      return synthesizingLine();
    case "READY":
      return readyLine(input.nextStep);
    case "CELEBRATING":
      return celebratingLine(input.userGoal);
    default:
      return "Mình vẫn ở đây.";
  }
}
