import { NextResponse } from "next/server";
import {
  generateContent,
  generateKnowledgeSeed,
  improveContent,
} from "@/ai/services/companion-ai.service";
import type { CompanionAgentKind, CompanionQuickAction } from "@/ai/types/ai.types";

/**
 * Companion Studio™ — API duy nhất cho toàn bộ nút "✨ Companion viết giúp"
 * và Quick Actions trong Admin. Chạy trên server — API key không bao giờ
 * lộ ra client.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  const { mode } = body as { mode?: string };

  if (mode === "refine") {
    const { kind, action, content } = body as {
      kind?: CompanionAgentKind;
      action?: CompanionQuickAction;
      content?: string;
    };
    if (!kind || !action || typeof content !== "string") {
      return NextResponse.json({ ok: false, error: "Thiếu kind/action/content." }, { status: 400 });
    }
    const result = await improveContent(kind, action, content);
    return NextResponse.json(result);
  }

  const { kind, title, brief } = body as { kind?: CompanionAgentKind; title?: string; brief?: string };
  if (!kind || !title?.trim()) {
    return NextResponse.json({ ok: false, error: "Thiếu kind/title." }, { status: 400 });
  }

  const result =
    kind === "knowledge" ? await generateKnowledgeSeed(title, brief) : await generateContent(kind, title, brief);

  return NextResponse.json(result);
}
