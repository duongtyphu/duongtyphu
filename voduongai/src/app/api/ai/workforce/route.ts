import { NextResponse } from "next/server";
import { runWriterAgent, type WriterAgentInput } from "@/ai/agents/writer-agent";
import { runReviewerAgent, type ReviewerAgentInput } from "@/ai/agents/reviewer-agent";

/**
 * AI Agent Integration MVP — API duy nhất cho 2 Agent (Writer/Reviewer)
 * kết nối vào Workspace. Chạy trên server — API key (đọc qua
 * `companion.agent.ts` → biến môi trường) không bao giờ lộ ra client.
 * Chỉ 2 `agentRole` được chấp nhận — không thêm Agent khác trong MVP này.
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

    return NextResponse.json({ ok: false, error: "agentRole không hợp lệ — chỉ nhận 'writer' hoặc 'reviewer'." }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Lỗi không xác định." }, { status: 500 });
  }
}
