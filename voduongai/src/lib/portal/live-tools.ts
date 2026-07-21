import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { AiTool } from "@/data/khong-gian-ai";

/**
 * Nguồn thật cho /portal/aiworkspace + /portal/aiworkspace/[slug] (bảng
 * Supabase `tools`, quản lý qua /admin/tools). Thay cho mảng tĩnh AI_TOOLS
 * (xem @deprecated ở src/data/khong-gian-ai/index.ts).
 *
 * Dùng getSupabasePublic() (không cookies()) — /portal/aiworkspace/[slug]
 * có generateStaticParams() chạy lúc build, ngoài mọi request context, gọi
 * cookies() ở đó sẽ crash build (đúng lỗi đã gặp và sửa ở
 * /portal/resources/[id]). getSupabasePublic() chỉ dùng NEXT_PUBLIC_* +
 * createClient() thuần nên an toàn gọi cả ở Server Component lẫn Client
 * Component (không phụ thuộc next/headers).
 *
 * Bọc cache() để dedupe khi Server Component gọi nhiều lần trong cùng 1
 * request/build (generateStaticParams + page).
 */
export const getLiveTools = cache(async (): Promise<AiTool[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tools")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      slug: String(d.slug ?? row.id),
      name: String(d.name ?? ""),
      tagline: String(d.tagline ?? ""),
      companionSummary: String(d.companionSummary ?? ""),
      website: String(d.link ?? ""),
      pricing: (d.pricing as AiTool["pricing"]) ?? "Freemium",
      pricingNote: String(d.pricingNote ?? ""),
      category: (d.category as AiTool["category"]) ?? "AI Chat",
      bestFor: Array.isArray(d.bestFor) ? (d.bestFor as string[]) : [],
      notGoodFor: Array.isArray(d.notGoodFor) ? (d.notGoodFor as string[]) : [],
      featured: Boolean(d.featured),
      badge: (d.badge as AiTool["badge"]) ?? null,
      relatedArticleSlugs: Array.isArray(d.relatedArticleSlugs) ? (d.relatedArticleSlugs as string[]) : [],
      relatedNeedSlugs: Array.isArray(d.relatedNeedSlugs) ? (d.relatedNeedSlugs as string[]) : [],
    };
  });
});
