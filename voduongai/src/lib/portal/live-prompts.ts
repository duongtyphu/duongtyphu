import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nguồn thật cho Prompt (bảng Supabase `prompts`, quản lý qua
 * `/admin/ckos/prompts`) — dùng cho tab "Thư viện tài nguyên" của trang gộp
 * `/v2/hoc-vien-ai` (Giai đoạn 6). Cùng bảng `AdminPromptsSection.tsx`
 * (`/portal/aiworkspace`) đọc qua `useCollection("prompts", ...)` — ở đây
 * đọc trực tiếp qua Supabase (Server Component) thay vì hook client, đúng
 * pattern mọi `live-*.ts` khác trong dự án.
 *
 * KHÔNG có trang chi tiết `/portal/prompts/[id]` cho Prompt Admin-authored —
 * `generateStaticParams()` của route đó chỉ liệt kê Prompt TĨNH
 * (`src/data/prompts.ts`), không phải bảng `prompts` này (đã xác nhận đọc
 * code trước khi quyết định điểm đến link). Vì vậy mọi Prompt đọc qua file
 * này chỉ nên trỏ về `/portal/prompts` (trang danh sách, có sẵn nút Copy),
 * không tạo link chết `/portal/prompts/[id-của-bảng-này]`.
 */
export type LivePrompt = {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
};

export const getLivePrompts = cache(async (): Promise<LivePrompt[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("prompts")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      category: String(d.category ?? ""),
      title: String(d.title ?? ""),
      description: String(d.description ?? ""),
      content: String(d.content ?? ""),
    };
  });
});
