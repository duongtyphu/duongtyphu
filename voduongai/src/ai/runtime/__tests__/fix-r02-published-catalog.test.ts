import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

/** `companion-runtime-engine` import "server-only" — cần mock dưới Vitest,
    cùng kỹ thuật đã dùng ở `provider-layer.test.ts`. */
vi.mock("server-only", () => ({}));

import type { RuntimeConversation } from "../runtime-context";
import { runCompanionRuntimeEngine } from "../companion-runtime-engine";
import { publishedCatalogProvider } from "../../catalog/catalog-provider";

const ENGINE_SOURCE_PATH = path.resolve(__dirname, "../companion-runtime-engine.ts");
const ROUTE_SOURCE_PATH = path.resolve(__dirname, "../../../app/api/companion/chat/route.ts");

function convo(...userMessages: string[]): RuntimeConversation {
  return { turns: userMessages.map((content) => ({ role: "user" as const, content })) };
}

describe("SPRINT FIX-R02 — Không query Supabase trong Runtime Engine (chỉ Adapter mới có I/O)", () => {
  it("companion-runtime-engine.ts không import supabase/Published-Live layer nào — chỉ nhận catalog qua tham số", () => {
    const source = fs.readFileSync(ENGINE_SOURCE_PATH, "utf8");
    const importLines = source
      .split("\n")
      .filter((line) => /^\s*import\s/.test(line));

    for (const line of importLines) {
      expect(line.toLowerCase()).not.toMatch(/supabase|live-|published-catalog-adapter/);
    }
  });
});

describe("SPRINT FIX-R02 — Runtime dùng Published Catalog thay vì [] (route.ts gọi CatalogProvider trước khi invoke Engine)", () => {
  it("route.ts import publishedCatalogProvider và gọi getCatalog() trước khi truyền vào runCompanionRuntimeEngine", () => {
    const source = fs.readFileSync(ROUTE_SOURCE_PATH, "utf8");
    expect(source).toContain('import { publishedCatalogProvider } from "@/ai/catalog/catalog-provider"');
    expect(source).toContain("publishedCatalogProvider.getCatalog()");

    const callStart = source.indexOf("runCompanionRuntimeEngine({");
    expect(callStart).toBeGreaterThan(0);
    const callBlock = source.slice(callStart, source.indexOf("});", callStart));
    expect(callBlock).toContain("catalog");

    // publishedCatalogProvider.getCatalog() phải được gọi TRƯỚC khi invoke Engine.
    const providerCallIdx = source.indexOf("publishedCatalogProvider.getCatalog()");
    expect(providerCallIdx).toBeLessThan(callStart);
  });

  it("CompanionRuntimeEngine vẫn nhận catalog?: KnowledgeCatalog như 1 mảng thuần đồng bộ (kiến trúc Engine không đổi)", () => {
    const { mentorContext } = runCompanionRuntimeEngine({
      conversationId: "fixr02-1",
      conversation: convo("Xin chào"),
      catalog: [],
    });
    expect(mentorContext.references).toEqual([]);
  });

  it("publishedCatalogProvider.getCatalog() trả về Catalog dùng được thẳng cho Engine (thay cho mặc định [] cũ)", async () => {
    const catalog = await publishedCatalogProvider.getCatalog();
    const { mentorContext } = runCompanionRuntimeEngine({
      conversationId: "fixr02-2",
      conversation: convo("Xin chào"),
      catalog,
    });
    expect(mentorContext.warnings).toEqual(["Chưa xác định được mục tiêu — chưa có nhu cầu tri thức cụ thể để tra cứu Catalog."]);
  });
});

describe("SPRINT FIX-R02 — Không regression: pipeline R01/R02 vẫn chạy đúng với MentorContext", () => {
  const CLEAR_MESSAGE =
    "Tôi muốn học prompt để áp dụng vào công việc, hiện tôi mới bắt đầu, muốn xong trong tháng này.";

  it("goal rõ ràng → mentorContext.confidence = knowledgeNeed.confidence, sourceCount đúng số nguồn khớp", () => {
    const { context, mentorContext } = runCompanionRuntimeEngine({
      conversationId: "fixr02-3",
      conversation: convo(CLEAR_MESSAGE),
    });
    expect(mentorContext.confidence).toBe(context.knowledgeRouting?.knowledgeNeed.confidence ?? 0);
    expect(mentorContext.sourceCount).toBe(0); // catalog rỗng (không truyền) → 0 nguồn khớp
  });
});
