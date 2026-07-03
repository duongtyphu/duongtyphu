/**
 * Companion Studio™ — Base Agent
 * Lớp gọi model dùng chung cho toàn bộ agent con. Chạy CHỈ ở server
 * (route handler) — không import file này vào component client.
 *
 * Hỗ trợ Anthropic hoặc OpenAI tuỳ biến môi trường nào có key. Nếu chưa
 * cấu hình key nào, `isAiConfigured()` trả về false — caller phải tự xử
 * lý fallback/mock, KHÔNG throw để tránh vỡ Admin.
 */

import "server-only";

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
}

/**
 * Gọi model với 1 prompt, trả về text thô. Caller tự parse JSON nếu cần.
 * Throw nếu chưa cấu hình key — luôn kiểm tra `isAiConfigured()` trước.
 */
export async function callCompanionModel(prompt: string): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API lỗi: ${res.status}`);
    const json = await res.json();
    return json.content?.[0]?.text ?? "";
  }

  if (process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API lỗi: ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? "";
  }

  throw new Error("Chưa cấu hình ANTHROPIC_API_KEY hoặc OPENAI_API_KEY.");
}

/** Trích JSON từ response model — model đôi khi bọc thêm ```json ... ```. */
export function extractJson<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
  return JSON.parse(cleaned) as T;
}
