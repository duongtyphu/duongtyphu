"use client";

/**
 * Nhật ký học tập — Knowledge Architecture: Article Object
 * Vai trò: kho bài viết AI / Affiliate / Marketing / Kinh doanh / Tư duy / Hướng dẫn
 * Cập nhật thường xuyên.
 * Layout: Hero → Category Filter → Article Grid
 */

import Link from "next/link";
import { useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { blogPostsSeed, type AdminBlogPost } from "@/data/admin/content";
import { Notebook, Clock, Tag } from "lucide-react";

const CATEGORIES = ["Tất cả", "AI", "Affiliate", "Marketing", "Kinh doanh", "Tư duy", "Hướng dẫn"];

export default function NhatKyHocTapPage() {
  const { items, ready } = useCollection<AdminBlogPost>("blog", blogPostsSeed);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const published = items.filter((p) => p.status === "Published");
  const featured = published.filter((p) => p.featured);
  const filtered =
    activeCategory === "Tất cả"
      ? published
      : published.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
            <Notebook className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Nhật ký học tập</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Bài viết & Kiến thức</h1>
        <p className="text-white/60">
          Những gì tôi đã học, đã ứng dụng và muốn chia sẻ — AI, Affiliate, Marketing, Tư duy và nhiều hơn nữa.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeCategory === cat
                ? "bg-brand-blue text-white"
                : "border border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured */}
      {activeCategory === "Tất cả" && featured.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">Nổi bật</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.slice(0, 2).map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* All articles */}
      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center text-sm text-white/40">
          Chưa có bài viết trong danh mục này.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ post }: { post: AdminBlogPost }) {
  const href = `/blog/${post.slug}`;
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/50">
          <Tag className="h-3 w-3" />
          {post.category}
        </span>
        {post.publishedAt && (
          <span className="flex items-center gap-1 text-[10px] text-white/30">
            <Clock className="h-3 w-3" />
            {new Date(post.publishedAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        )}
      </div>
      <h3 className="mb-2 text-sm font-bold leading-snug text-white group-hover:text-brand-blue">
        {post.title}
      </h3>
      <p className="line-clamp-2 text-xs leading-relaxed text-white/50">{post.excerpt}</p>
    </Link>
  );
}
