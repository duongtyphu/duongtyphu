import { getSupabaseServer } from "@/lib/supabase-server";

export const metadata = { title: "Tin tức nội bộ" };

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
};

async function getPosts(): Promise<Post[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Tin tức nội bộ</h1>
        <p className="mt-2 text-white">Cập nhật mới nhất từ đội ngũ VDAI Academy — dành riêng cho học viên.</p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white">
          Chưa có tin tức nào được đăng.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <div key={p.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              {p.cover_url && <img src={p.cover_url} alt={p.title} className="mb-3 h-36 w-full rounded-lg object-cover" />}
              <h3 className="text-sm font-bold text-white">{p.title}</h3>
              {p.excerpt && <p className="mt-2 text-sm text-white/70">{p.excerpt}</p>}
              {p.published_at && (
                <p className="mt-2 text-xs text-white/40">{new Date(p.published_at).toLocaleDateString("vi-VN")}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
