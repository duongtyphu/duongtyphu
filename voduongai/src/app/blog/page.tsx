import Link from "next/link";
import { blogPosts } from "@/data/blog";

const title = "Blog AI";
const description = "Blog VO DUONG AI chia sẻ kiến thức ứng dụng AI, Affiliate Marketing và tự động hóa cho cá nhân và đội nhóm.";

export const metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
      <h1 className="text-3xl font-extrabold text-white">Blog AI</h1>
      <p className="mt-4 text-white">
        Kiến thức thực chiến về ứng dụng AI trong Affiliate Marketing, tự động
        hoá quy trình và xây dựng hệ thống kinh doanh số.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand-violet"
          >
            <div className="flex items-center justify-between text-2xl">
              <span>{post.emoji}</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white">
                {post.tag}
              </span>
            </div>
            <div className="mt-4 text-xs text-white">
              {post.category} · {post.readTime}
            </div>
            <h3 className="mt-2 text-base font-bold text-white">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-white">{post.excerpt}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-violet">
              Đọc bài viết →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
