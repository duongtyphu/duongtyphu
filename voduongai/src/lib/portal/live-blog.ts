import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import { fromAdminPost, type AdminBlogPostLike, type BlogPost } from "@/data/blog";

/**
 * Việc 7 (Nhóm B) — nguồn thật cho phần "Blog AI" trong AI Workspace
 * (/portal/aiworkspace, [slug], bai-viet/[slug]) — bảng Supabase `blog`,
 * cùng bảng mà /blogai đọc (qua getSupabaseServer() riêng ở đó — file này
 * dùng getSupabasePublic() thay vì getSupabaseServer() vì cần an toàn gọi
 * trong generateStaticParams()/Client Component, đúng lý do đã áp dụng
 * cho live-tools.ts).
 *
 * Trả về BlogPost đầy đủ qua fromAdminPost() (cùng adapter /blogai dùng)
 * — dùng chung 1 shape cho mọi nơi hiển thị, không tạo type song song.
 *
 * QUYẾT ĐỊNH FOUNDER (Việc 7): AI_ARTICLES cũ có relatedToolSlugs/
 * relatedNeedSlugs để lọc bài liên quan theo Tool/Need cụ thể — 2 field
 * này KHÔNG tồn tại trong bảng `blog` thật. Founder chọn bỏ hẳn tính năng
 * lọc này — nơi từng lọc theo Tool/Need giờ hiển thị bài mới nhất/nổi bật
 * thay thế (không cố map lại quan hệ không có thật).
 */
export const getLiveBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blog")
    .select("id, data")
    .eq("status", "Published")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => fromAdminPost({ ...(row.data as AdminBlogPostLike), id: row.id }));
});

/** Tra 1 bài Admin-authored theo slug — dùng cho trang chi tiết bài viết
 * (bai-viet/[slug]/page.tsx), mirror đúng pattern getAnyBlogPost() đã có ở
 * /blogai/[slug]/page.tsx (ở đó dùng getSupabaseServer() riêng — hàm này
 * dùng chung getLiveBlogPosts() ở trên để cache() dedupe trong 1 request). */
export const getLiveBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const posts = await getLiveBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
});
