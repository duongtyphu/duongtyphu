import "server-only";

import { getLiveTools } from "@/lib/portal/live-tools";
import { publishedCatalogProvider } from "@/ai/catalog/catalog-provider";
import { runCompanionRuntimeEngine } from "@/ai/runtime/companion-runtime-engine";
import type { RuntimeConversation } from "@/ai/runtime/runtime-context";
import type { CompanionMessageRow } from "@/app/portal/companion/actions";

/**
 * "Công cụ yêu thích" ở `/v2/companion` — Portal 2.0, Giai đoạn 2, mục 2c.
 *
 * Trước đây (`TOOL_ICONS` trong `CompanionClient.tsx`) là 1 mảng SVG tĩnh
 * hoàn toàn, không đọc bảng `tools` nào — chỉ 5 icon trang trí, 2 cặp trùng
 * tiêu đề ("Trợ lý AI" x2, "Nghiên cứu & Phân tích" x2). Founder yêu cầu
 * đổi thành ĐỘNG, tái dùng `MentorContext.suggestedTools` đã có sẵn (Sprint
 * R02) thay vì xây cơ chế gợi ý mới.
 *
 * `suggestedTools` là kết quả PER-TURN của pipeline Companion Brain (đọc
 * nội dung hội thoại để suy nhu cầu tri thức) — không phải 1 bảng
 * "yêu thích" lưu sẵn. Gọi lại ĐÚNG pipeline đó (`runCompanionRuntimeEngine`,
 * read-only, không lưu gì mới — chỉ ghi 1 dòng vào runtime execution log
 * process-local, cùng cách mọi lượt chat thật đã làm) trên CUỘC TRÒ CHUYỆN
 * GẦN NHẤT của user (đã tải sẵn cho khung chat) để suy ra công cụ phù hợp —
 * không phải cơ chế mới, không phải dữ liệu bịa.
 *
 * Honest fallback khi CHƯA cá nhân hoá được (chưa có cuộc trò chuyện nào,
 * hoặc cuộc trò chuyện chưa khớp công cụ nào trong Catalog): hiện 5 công cụ
 * Published đầu tiên theo `order` — vẫn là dữ liệu THẬT từ bảng `tools`,
 * chỉ khác là chưa cá nhân hoá theo hội thoại. `personalized: false` để
 * component hiển thị biết đang ở nhánh nào (không bắt buộc phải khác giao
 * diện, chỉ để tránh nhầm "đã cá nhân hoá" khi thực ra chưa).
 */

export type CompanionFavoriteTool = {
  id: string;
  name: string;
  category: string;
};

export type CompanionFavoriteToolsResult = {
  tools: CompanionFavoriteTool[];
  personalized: boolean;
};

const FAVORITE_TOOL_COUNT = 5;

export async function getCompanionFavoriteTools(
  conversationId: string | null,
  messages: CompanionMessageRow[]
): Promise<CompanionFavoriteToolsResult> {
  const allTools = await getLiveTools();
  const bySlug = new Map(allTools.map((t) => [t.slug, t]));

  const turns = messages.filter(
    (m): m is CompanionMessageRow & { role: "user" | "assistant" } => m.role === "user" || m.role === "assistant"
  );

  if (conversationId && turns.length > 0) {
    const conversation: RuntimeConversation = {
      turns: turns.map((m) => ({ role: m.role, content: m.content })),
    };
    const catalog = await publishedCatalogProvider.getCatalog();
    const { mentorContext } = runCompanionRuntimeEngine({ conversationId, conversation, catalog });

    const matched = mentorContext.suggestedTools
      .map((ref) => bySlug.get(ref.id.replace(/^tool-/, "")))
      .filter((t): t is NonNullable<typeof t> => Boolean(t))
      .slice(0, FAVORITE_TOOL_COUNT);

    if (matched.length > 0) {
      return {
        tools: matched.map((t) => ({ id: t.slug, name: t.name, category: t.category })),
        personalized: true,
      };
    }
  }

  return {
    tools: allTools.slice(0, FAVORITE_TOOL_COUNT).map((t) => ({ id: t.slug, name: t.name, category: t.category })),
    personalized: false,
  };
}
