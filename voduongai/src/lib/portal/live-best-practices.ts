import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Nguồn thật cho /portal/ckos/best-practices + /portal/ckos/best-practices/[id]
 * (bảng Supabase `best_practices`, quản lý qua /admin/ckos/best-practices).
 *
 * Dùng getSupabasePublic() (không cookies()) — an toàn gọi cả ở Server và
 * (nếu cần sau này) Client Component, đúng lý do đã áp dụng cho
 * live-tools.ts/live-knowledge.ts.
 */
export type LiveBestPractice = {
  id: string;
  title: string;
  description: string;
  principle: string;
};

export const getLiveBestPractices = cache(async (): Promise<LiveBestPractice[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("best_practices")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      title: String(d.title ?? ""),
      description: String(d.description ?? ""),
      principle: String(d.principle ?? ""),
    };
  });
});
