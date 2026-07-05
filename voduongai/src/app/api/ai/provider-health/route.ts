import { NextResponse } from "next/server";
import { providerRegistry } from "@/ai/providers/registry";
import { selectAdapter } from "@/ai/providers/model-router";

/**
 * MISSION KHẨN CẤP — Activate Real AI Provider.
 *
 * Chẩn đoán nhanh: 3 Provider Core (OpenAI/Anthropic/Gemini) đã cấu hình
 * API key thật chưa, và Provider nào ModelRouter thực sự sẽ chọn cho
 * capability "writing.draft" (đúng capability Writer Agent dùng) — không
 * lộ giá trị key, chỉ boolean. `configured`/`available` cùng nguồn
 * (`isAvailable()` chỉ kiểm tra biến môi trường có giá trị, chưa gọi
 * network thật) — tách 2 field để tương lai bổ sung live health check
 * (gọi thử API) mà không đổi shape response.
 */
export async function GET() {
  const ids = ["openai", "anthropic", "gemini"] as const;
  const status: Record<(typeof ids)[number], { configured: boolean; available: boolean }> = {
    openai: { configured: false, available: false },
    anthropic: { configured: false, available: false },
    gemini: { configured: false, available: false },
  };

  for (const id of ids) {
    const adapter = providerRegistry.get(id);
    const available = adapter?.isAvailable() ?? false;
    status[id] = { configured: available, available };
  }

  let activeProvider = "mock";
  try {
    activeProvider = selectAdapter({ capability: "writing.draft" }).providerId;
  } catch {
    activeProvider = "mock";
  }

  return NextResponse.json({ ...status, activeProvider });
}
