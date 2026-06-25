"use client";

import { useState } from "react";
import Link from "next/link";
import { blogCategories, type BlogPost } from "@/data/blog";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory ? posts.filter((p) => p.category === activeCategory) : posts;

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            activeCategory === null
              ? "border-brand-violet bg-brand-violet/15 text-white"
              : "border-white/15 bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          Tất cả
        </button>
        {blogCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              activeCategory === cat
                ? "border-brand-violet bg-brand-violet/15 text-white"
                : "border-white/15 bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-white/50">Chưa có bài viết nào trong danh mục này.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {filtered.map((post) => (
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
              <h3 className="mt-2 text-base font-bold text-white">{post.title}</h3>
              <p className="mt-2 text-sm text-white">{post.excerpt}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-violet">
                Đọc bài viết →
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
