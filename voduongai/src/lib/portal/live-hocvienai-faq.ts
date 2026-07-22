import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Việc 10 — /portal/hocvienai, khối "Câu hỏi thường gặp". Thay mảng tĩnh
 * `FAQ` (khai báo inline trong `page.tsx`) bằng bảng `hocvienai_faq`
 * (quản qua /admin/hocvienai/faq). Cùng pattern `live-tools.ts` —
 * `getSupabasePublic()` + `cache()`, an toàn cả Server Component.
 */
export type HocvienaiFaqItem = { id: string; q: string; a: string };

export const getLiveHocvienaiFaq = cache(async (): Promise<HocvienaiFaqItem[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("hocvienai_faq")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return { id: row.id as string, q: String(d.q ?? ""), a: String(d.a ?? "") };
  });
});
