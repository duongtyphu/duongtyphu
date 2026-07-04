/**
 * AI Agent Integration MVP — Reviewer Agent.
 *
 * "server-only". Reviewer KHÔNG approve thay User — chỉ trả về nhận xét +
 * gợi ý (`approvalRecommendation` là GỢI Ý, không phải quyết định cuối).
 * Quyết định Approve cuối cùng luôn do User bấm (xem
 * `workspace-session-store.ts` → `approveOutput`).
 */

import "server-only";
import { callCompanionModel, extractJson, isAiConfigured } from "./companion.agent";

export type ReviewerAgentInput = {
  draftOutput: string;
  qaChecklist: string[];
  goal: string;
  expectedOutput?: string;
};

export type ReviewerAgentResult = {
  strengths: string[];
  issues: string[];
  suggestedImprovements: string[];
  approvalRecommendation: "approve" | "revise";
  versionSuggestion: string;
  isMock: boolean;
};

function buildPrompt(input: ReviewerAgentInput): string {
  return [
    `Bạn là Reviewer Agent trong AI Companion Team của VO DUONG AI.`,
    `Bạn KHÔNG được tự phê duyệt — chỉ đưa ra nhận xét và GỢI Ý cho User quyết định.`,
    `Mục tiêu gốc: ${input.goal}`,
    input.expectedOutput ? `Kết quả mong đợi: ${input.expectedOutput}` : "",
    `QA Checklist cần đối chiếu: ${input.qaChecklist.join("; ")}`,
    ``,
    `Bản nháp cần review:`,
    input.draftOutput,
    ``,
    `Trả về ĐÚNG định dạng JSON sau, không thêm chữ nào khác ngoài JSON:`,
    `{"strengths": ["..."], "issues": ["..."], "suggestedImprovements": ["..."], "approvalRecommendation": "approve" | "revise", "versionSuggestion": "..."}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function mockResult(): ReviewerAgentResult {
  return {
    strengths: ["[MOCK] Chưa có API key thật — không có nhận xét thật."],
    issues: ["[MOCK] Cần cấu hình ANTHROPIC_API_KEY/OPENAI_API_KEY để Reviewer Agent chạy thật."],
    suggestedImprovements: [],
    approvalRecommendation: "revise",
    versionSuggestion: "Không tính là Evidence thật — xem AI_AGENT_INTEGRATION_MVP.md mục Known Limitations.",
    isMock: true,
  };
}

export async function runReviewerAgent(input: ReviewerAgentInput): Promise<ReviewerAgentResult> {
  if (!isAiConfigured()) return mockResult();

  const raw = await callCompanionModel(buildPrompt(input));
  const parsed = extractJson<Omit<ReviewerAgentResult, "isMock">>(raw);
  return { ...parsed, isMock: false };
}
