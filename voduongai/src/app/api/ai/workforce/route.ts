import { NextResponse } from "next/server";
import { runWriterAgent, type WriterAgentInput } from "@/ai/agents/writer-agent";
import { runReviewerAgent, type ReviewerAgentInput } from "@/ai/agents/reviewer-agent";
import { providerManager } from "@/ai/providers/provider-manager";

/**
 * AI Agent Integration MVP — API duy nhất cho AI Workforce kết nối vào
 * Workspace. Chạy trên server — API key (đọc qua `companion.agent.ts`/
 * `src/ai/providers/*`) không bao giờ lộ ra client.
 *
 * `agentRole`:
 * - "writer"/"reviewer": 2 Agent MVP, giữ nguyên hành vi cũ.
 * - "companion-task" (PHASE 4 EPIC 02): đường Task Assignment CHUNG cho
 *   10 AI Companion Wave 1 (`workforce-registry.ts`/`companion-manager.ts`)
 *   — nhận `{capabilityId, prompt, preferredProvider, fallbackProvider}`,
 *   gọi thẳng `providerManager.execute()` (PHASE 4 EPIC 01), KHÔNG có
 *   logic dựng Prompt/parse JSON riêng cho từng Companion (khác Writer/
 *   Reviewer — 8 Companion còn lại của Wave 1 chưa có Agent chuyên biệt,
 *   dùng chung đường này, trả `raw` text để caller tự xử lý).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  const { agentRole } = body as { agentRole?: string };

  try {
    if (agentRole === "writer") {
      const input = body as WriterAgentInput;
      const result = await runWriterAgent(input);
      return NextResponse.json({ ok: true, result });
    }

    if (agentRole === "reviewer") {
      const input = body as ReviewerAgentInput;
      const result = await runReviewerAgent(input);
      return NextResponse.json({ ok: true, result });
    }

    if (agentRole === "companion-task") {
      const { capabilityId, prompt, preferredProvider, fallbackProvider } = body as {
        capabilityId?: string;
        prompt?: string;
        preferredProvider?: string;
        fallbackProvider?: string;
      };
      if (!capabilityId || !prompt) {
        return NextResponse.json({ ok: false, error: "Thiếu capabilityId hoặc prompt." }, { status: 400 });
      }
      const result = await providerManager.execute({
        capability: capabilityId,
        taskType: capabilityId,
        input: { prompt },
        preferredProvider,
        fallbackProvider,
      });
      return NextResponse.json({ ok: true, result });
    }

    return NextResponse.json(
      { ok: false, error: "agentRole không hợp lệ — chỉ nhận 'writer', 'reviewer' hoặc 'companion-task'." },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Lỗi không xác định." }, { status: 500 });
  }
}
