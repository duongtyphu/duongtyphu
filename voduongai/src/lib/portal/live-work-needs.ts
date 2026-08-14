import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { AiNeedCategory } from "@/data/khong-gian-ai";

/**
 * Việc 2 (lệnh "Xử lý 3 xác nhận") — thay `NEED_CATEGORIES` tĩnh
 * (`src/data/khong-gian-ai/index.ts`, đã đánh dấu lệch dữ liệu với
 * `work_needs` ở Bước 0) bằng bảng `work_needs` Supabase — nguồn duy nhất
 * sau khi Phase 32 đã gộp field NEED_CATEGORIES vào `work_needs` + chuẩn
 * hoá 3 slug lệch + thêm `dich-thuat`.
 *
 * Tái dùng type `AiNeedCategory` (không tạo type song song) — shape khớp
 * 100% những gì `NeedCategoryPage` (`/portal/aiworkspace/[slug]/page.tsx`)
 * cần đọc, chỉ đổi nguồn dữ liệu đứng sau.
 *
 * MAPPING field (data jsonb -> AiNeedCategory), xem lý do từng field trong
 * supabase-phase32-needs-occupations.sql:
 *   description (Hero, đoạn dài ở trang chi tiết) = data.longDescription,
 *     fallback data.description cho 4 nhu cầu không có bản NEED_CATEGORIES
 *     gốc (ban-hang/hoc-tap/van-phong/dau-tu-du-an) — tránh Hero trống.
 *   emoji = data.icon
 *   Còn lại giữ nguyên tên field.
 */
export const getLiveWorkNeeds = cache(async (): Promise<AiNeedCategory[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("work_needs")
    .select("id, data, status")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    const asStringArray = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
    return {
      slug: row.id as string,
      title: String(d.title ?? ""),
      description: String(d.longDescription || d.description || ""),
      emoji: String(d.icon ?? ""),
      color: String(d.color ?? ""),
      subtasks: asStringArray(d.subtasks),
      recommendedToolSlugs: asStringArray(d.recommendedToolSlugs),
      relatedArticleSlugs: asStringArray(d.relatedArticleSlugs),
      ctaLabel: String(d.ctaLabel ?? ""),
      ctaHref: String(d.ctaHref ?? ""),
    };
  });
});
