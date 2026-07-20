import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

export type LiveResource = {
  id: string;
  title: string;
  type: string;
  description: string;
  whenToUse: string;
  whenNotToUse: string;
  relatedProjectHref?: string;
};

/**
 * Nguồn thật cho /portal/resources + /portal/resources/[id] (bảng
 * Supabase `resources`, quản lý qua /admin/ckos/resources). Bọc `cache()`
 * vì trang chi tiết gọi hàm này tới 3 lần trong cùng 1 request/build
 * (generateStaticParams + generateMetadata + page) — tránh 3 lượt query.
 *
 * Dùng getSupabasePublic() (không cookies()) chứ không phải
 * getSupabaseServer() — generateStaticParams() chạy lúc build, ngoài mọi
 * request context, gọi cookies() ở đó sẽ crash build (đã xảy ra thật khi
 * deploy, sandbox không phát hiện được vì thiếu env Supabase nên chưa bao
 * giờ chạy tới nhánh code này).
 */
export const getLiveResources = cache(async (): Promise<LiveResource[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("resources")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      title: String(d.name ?? ""),
      type: String(d.type ?? ""),
      description: String(d.description ?? ""),
      whenToUse: String(d.whenToUse ?? ""),
      whenNotToUse: String(d.whenNotToUse ?? ""),
      relatedProjectHref: d.relatedProjectHref ? String(d.relatedProjectHref) : undefined,
    };
  });
});
