/**
 * AI Agent Integration MVP — Writer Agent.
 *
 * "server-only" — chạy trong API Route (`src/app/api/ai/workforce/route.ts`),
 * KHÔNG import vào component client.
 *
 * PHASE 4 EPIC 01: Writer Agent KHÔNG gọi vendor AI (Anthropic/OpenAI/
 * Gemini) trực tiếp — mọi lời gọi model thật đi qua
 * `providerManager.execute()` (`src/ai/providers/provider-manager.ts`),
 * Provider Manager tự chọn Provider qua ModelRouter. `extractJson` vẫn
 * tái dùng từ `companion.agent.ts` (thuần tiện ích parse JSON, không
 * phải lời gọi vendor). Không hard-code API key.
 */

import "server-only";
import { extractJson } from "./companion.agent";
import { providerManager } from "@/ai/providers/provider-manager";

export type WriterAgentInput = {
  goal: string;
  blueprintName: string;
  taskName: string;
  context?: string;
  userInput?: string;
  outputFormat: string;
};

export type WriterAgentResult = {
  draftOutput: string;
  summary: string;
  suggestedTitle: string;
  notes: string;
  isMock: boolean;
};

function buildPrompt(input: WriterAgentInput): string {
  return [
    `Bạn là Writer Agent trong AI Companion Team của VO DUONG AI.`,
    `Mission: ${input.goal}`,
    `Blueprint: ${input.blueprintName}`,
    `Task: ${input.taskName}`,
    input.context ? `Context: ${input.context}` : "",
    input.userInput ? `Yêu cầu cụ thể từ người dùng: ${input.userInput}` : "",
    `Định dạng Output mong đợi: ${input.outputFormat}`,
    ``,
    `Hãy tạo bản nháp Output thật, dùng được ngay — không phải ví dụ minh họa.`,
    `Trả về ĐÚNG định dạng JSON sau, không thêm chữ nào khác ngoài JSON:`,
    `{"draftOutput": "...", "summary": "...", "suggestedTitle": "...", "notes": "..."}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function mockResult(input: WriterAgentInput): WriterAgentResult {
  return {
    draftOutput: `[MOCK — chưa cấu hình ANTHROPIC_API_KEY/OPENAI_API_KEY]\n\nBản nháp cho Task "${input.taskName}" (${input.blueprintName}).\nMục tiêu: ${input.goal}\n\nĐây là placeholder rõ ràng — không phải Output AI thật. Cấu hình API key để Writer Agent chạy thật.`,
    summary: "MOCK — chưa có API key thật.",
    suggestedTitle: input.taskName,
    notes: "Kết quả này là mock, không tính là Evidence thật (xem AI_AGENT_INTEGRATION_MVP.md mục Known Limitations).",
    isMock: true,
  };
}

export async function runWriterAgent(input: WriterAgentInput): Promise<WriterAgentResult> {
  if (!providerManager.hasAvailableRealProvider()) return mockResult(input);

  const result = await providerManager.execute({
    capability: "writing.draft",
    taskType: "writer",
    input: { prompt: buildPrompt(input) },
  });
  const parsed = extractJson<{ draftOutput: string; summary: string; suggestedTitle: string; notes: string }>(result.raw);
  return { ...parsed, isMock: result.isMock };
}
