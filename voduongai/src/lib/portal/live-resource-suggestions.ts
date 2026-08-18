import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nguồn dữ liệu THẬT cho khối "Gợi ý dành cho bạn" ở `/v2/trang-chu` — thay
 * 5 thẻ prompt/template/workflow/ebook/tool bịa hoàn toàn (tiêu đề + "X lượt
 * tải" giả) của bản thiết kế gốc.
 *
 * 5 bảng nguồn (schema generic `id/data jsonb/status/order`, cùng nhóm CKOS
 * "Intelligence" đã Full ở `/portal/*` 1.0 — xem CLAUDE.md mục "CKOS
 * Coverage"): `prompts`(title)/`templates`/`sop`(workflow)/`ebooks`/`tools`
 * (4 bảng còn lại dùng field `name`). Đã xác nhận field thật qua Supabase
 * MCP trước khi viết, không suy đoán tên field.
 *
 * Không có bảng nào theo dõi "lượt tải" thật cho 5 loại nội dung này — thay
 * vì bịa số, dùng `category` (field thật, mọi bảng đều có) làm dòng phụ.
 */

export type ResourceSuggestionType = "prompt" | "template" | "workflow" | "ebook" | "tool";

export type ResourceSuggestion = {
  type: ResourceSuggestionType;
  title: string;
  category: string;
};

const SOURCES: { type: ResourceSuggestionType; table: string; titleField: "title" | "name" }[] = [
  { type: "prompt", table: "prompts", titleField: "title" },
  { type: "template", table: "templates", titleField: "name" },
  { type: "workflow", table: "sop", titleField: "name" },
  { type: "ebook", table: "ebooks", titleField: "name" },
  { type: "tool", table: "tools", titleField: "name" },
];

/** 1 mục mới nhất (theo `order`) của mỗi loại, bỏ qua loại nào chưa có dòng Published nào. */
export const getResourceSuggestions = cache(async (): Promise<ResourceSuggestion[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const results = await Promise.all(
    SOURCES.map(async ({ type, table, titleField }): Promise<ResourceSuggestion | null> => {
      const { data } = await supabase
        .from(table)
        .select("data")
        .eq("status", "Published")
        .order("order", { ascending: true })
        .limit(1);
      const row = data?.[0] as { data: Record<string, unknown> } | undefined;
      if (!row) return null;
      const d = row.data ?? {};
      const title = String(d[titleField] ?? "").trim();
      if (!title) return null;
      return { type, title, category: String(d.category ?? "").trim() };
    }),
  );

  return results.filter((r): r is ResourceSuggestion => r !== null);
});
