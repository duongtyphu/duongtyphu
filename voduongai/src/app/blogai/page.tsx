import {
  blogPosts,
  fromAdminPost,
  fromDigitalAssetArticle,
  type AdminBlogPostLike,
  type BlogPost,
  type DigitalAssetArticleLike,
} from "@/data/blog";
import { digitalAssetCategories } from "@/data/digitalAssets";
import { getSupabaseServer } from "@/lib/supabase-server";
import { BlogList } from "./BlogList";

const title = "Blog AI";
const description = "Blog VO DUONG AI chia sẻ kiến thức ứng dụng AI, Affiliate Marketing và tự động hóa cho cá nhân và đội nhóm.";

export const metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

async function getAdminPosts(): Promise<BlogPost[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from("blog").select("id, data").eq("data->>status", "Published");
    if (error || !data) return [];
    return data.map((row) => fromAdminPost({ ...(row.data as AdminBlogPostLike), id: row.id }));
  } catch {
    return [];
  }
}

// Bài viết / Phân tích của Đầu tư cùng tôi cũng phải xuất hiện ở Blog AI —
// admin thêm bài mới ở /admin/digital-assets/articles thì tự động lên đây,
// không cần thao tác thêm nào khác.
async function getDigitalAssetArticlePosts(): Promise<BlogPost[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
      .from("digital_asset_articles")
      .select("id, data")
      .eq("data->>status", "Published");
    if (error || !data) return [];
    return data.map((row) => {
      const article = { ...(row.data as DigitalAssetArticleLike), id: row.id };
      const categoryName = digitalAssetCategories.find((c) => c.key === article.category)?.name;
      return fromDigitalAssetArticle({ ...article, categoryName });
    });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const [adminPosts, digitalAssetPosts] = await Promise.all([getAdminPosts(), getDigitalAssetArticlePosts()]);
  const adminSlugs = new Set(adminPosts.map((p) => p.slug));
  const posts = [
    ...adminPosts,
    ...digitalAssetPosts.filter((p) => !adminSlugs.has(p.slug)),
    ...blogPosts.filter((p) => !adminSlugs.has(p.slug) && !digitalAssetPosts.some((d) => d.slug === p.slug)),
  ];

  return (
    <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
      <h1 className="text-3xl font-extrabold text-white">Blog AI</h1>
      <p className="mt-4 text-white">
        Kiến thức thực chiến về ứng dụng AI trong Affiliate Marketing, tự động
        hoá quy trình và xây dựng hệ thống kinh doanh số.
      </p>
      <BlogList posts={posts} />
    </section>
  );
}
