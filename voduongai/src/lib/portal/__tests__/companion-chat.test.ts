import { describe, it, expect } from "vitest";
import {
  buildConversationTitle,
  trimHistoryForContext,
  buildCompanionChatPrompt,
  COMPANION_CONTEXT_MAX_MESSAGES,
} from "@/lib/portal/companion-chat";

describe("buildConversationTitle", () => {
  it("giữ nguyên chuỗi ngắn", () => {
    expect(buildConversationTitle("Xin chào Companion")).toBe("Xin chào Companion");
  });

  it("cắt gọn chuỗi dài, không vượt quá giới hạn + dấu …", () => {
    const long = "a".repeat(200);
    const title = buildConversationTitle(long);
    expect(title.length).toBeLessThanOrEqual(61);
    expect(title.endsWith("…")).toBe(true);
  });

  it("loại bỏ xuống dòng", () => {
    expect(buildConversationTitle("Dòng một\nDòng hai")).toBe("Dòng một Dòng hai");
  });

  it("chuỗi rỗng trả về tiêu đề mặc định", () => {
    expect(buildConversationTitle("   ")).toBe("Cuộc trò chuyện mới");
  });
});

describe("trimHistoryForContext", () => {
  it("chỉ giữ tối đa COMPANION_CONTEXT_MAX_MESSAGES message gần nhất", () => {
    const history = Array.from({ length: 30 }, (_, i) => ({
      role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
      content: `msg ${i}`,
    }));
    const trimmed = trimHistoryForContext(history);
    expect(trimmed.length).toBeLessThanOrEqual(COMPANION_CONTEXT_MAX_MESSAGES);
    expect(trimmed[trimmed.length - 1].content).toBe("msg 29");
  });

  it("cắt bớt theo ngân sách ký tự khi 1 message rất dài", () => {
    const history = [
      { role: "user" as const, content: "a".repeat(7000) },
      { role: "assistant" as const, content: "câu trả lời ngắn" },
    ];
    const trimmed = trimHistoryForContext(history);
    // luôn giữ ít nhất message mới nhất, dù vượt ngân sách
    expect(trimmed.length).toBe(1);
    expect(trimmed[0].content).toBe("câu trả lời ngắn");
  });
});

describe("buildCompanionChatPrompt", () => {
  it("ghép system prompt + lịch sử + message mới thành 1 chuỗi", () => {
    const prompt = buildCompanionChatPrompt({
      systemPrompt: "SYSTEM",
      history: [{ role: "user", content: "Chào" }],
      userMessage: "Mục tiêu của tôi là học AI",
    });
    expect(prompt).toContain("SYSTEM");
    expect(prompt).toContain("Người dùng: Chào");
    expect(prompt).toContain("Mục tiêu của tôi là học AI");
  });
});
