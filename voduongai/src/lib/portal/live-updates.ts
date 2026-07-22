import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Việc 8 — /portal/congdongai, khối "Community News" (id="tin-tuc"). Thay
 * mảng tĩnh `NEWS` (`congdongai/page.tsx`, giữ lại @deprecated tham khảo/
 * rollback — nội dung thật đã "di dời nguyên vẹn từ /portal/updates",
 * giờ đọc trực tiếp bảng `updates` thay vì mảng tĩnh copy lại nội dung
 * đó). Cùng pattern `live-tools.ts` — `getSupabasePublic()` + `cache()`.
 */
export type LiveUpdate = { id: string; date: string; title: string; type: string };

export const getLiveUpdates = cache(async (): Promise<LiveUpdate[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("updates")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      date: String(d.publishedAt ?? ""),
      title: String(d.title ?? ""),
      type: String(d.type ?? ""),
    };
  });
});
