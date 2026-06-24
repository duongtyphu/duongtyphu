"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  digitalAssetCategories,
  digitalAssetProjects,
  digitalAssetArticles,
  type DigitalAssetCategoryKey,
  type DigitalAssetBadge,
} from "@/data/digitalAssets";
import { useCollection } from "@/lib/admin/store";
import { DigitalAssetProjectCard } from "@/components/portal/DigitalAssetProjectCard";
import { DigitalAssetDisclaimer } from "@/components/portal/DigitalAssetDisclaimer";

const BADGES: DigitalAssetBadge[] = ["Đang theo dõi", "Đang tham gia", "Đề xuất", "Mới"];
type SortKey = "featured" | "newest" | "recommended";

export default function DigitalAssetsHubPage() {
  const { items: categories } = useCollection("digital-asset-categories", digitalAssetCategories);
  const { items: projects } = useCollection("digital-asset-projects", digitalAssetProjects);
  const { items: articles } = useCollection("digital-asset-articles", digitalAssetArticles);

  const [activeCategory, setActiveCategory] = useState<DigitalAssetCategoryKey | "all">("all");
  const [search, setSearch] = useState("");
  const [badgeFilter, setBadgeFilter] = useState<DigitalAssetBadge | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const publishedProjects = useMemo(() => projects.filter((p) => p.status === "Published"), [projects]);

  const filtered = useMemo(() => {
    let list = publishedProjects;
    if (activeCategory !== "all") list = list.filter((p) => p.category === activeCategory);
    if (badgeFilter !== "all") list = list.filter((p) => p.badge === badgeFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sort === "featured") sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
    if (sort === "newest") sorted.sort((a, b) => (a.badge === "Mới" ? -1 : 0) - (b.badge === "Mới" ? -1 : 0));
    if (sort === "recommended") sorted.sort((a, b) => (a.badge === "Đề xuất" ? -1 : 0) - (b.badge === "Đề xuất" ? -1 : 0));
    return sorted;
  }, [publishedProjects, activeCategory, badgeFilter, search, sort]);

  const featuredProjects = publishedProjects.filter((p) => p.featured);
  const latestArticles = [...articles]
    .filter((a) => a.status === "Published")
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="card-shine glow-blue rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-8">
        <h1 className="text-2xl font-extrabold text-white">Tài sản số</h1>
        <p className="mt-3 max-w-2xl text-white/80">
          Nơi tôi chia sẻ các lĩnh vực, dự án và cơ hội mà bản thân đang nghiên cứu, theo dõi hoặc tham gia trong kỷ
          nguyên tài sản số.
        </p>
        <a
          href="#categories"
          className="mt-5 inline-flex rounded-full gradient-surface px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Khám phá các lĩnh vực
        </a>
        <div className="mt-5">
          <DigitalAssetDisclaimer compact />
        </div>
      </div>

      {/* Category tabs */}
      <div id="categories" className="space-y-4">
        <h2 className="text-sm font-bold text-white">Lĩnh vực</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeCategory === "all" ? "bg-brand-blue text-white" : "border border-white/10 text-white/70 hover:text-white"
            }`}
          >
            Tất cả
          </button>
          {categories.map((c) => {
            const count = publishedProjects.filter((p) => p.category === c.key).length;
            return (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeCategory === c.key
                    ? "bg-brand-blue text-white"
                    : "border border-white/10 text-white/70 hover:text-white"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Category overview cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.key)}
              className={`card-shine rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 ${
                activeCategory === c.key ? "border-brand-blue/40 bg-brand-blue/5" : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{c.icon}</span>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white/60">
                  {publishedProjects.filter((p) => p.category === c.key).length} dự án
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">{c.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/60">{c.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Search / filter / sort */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm dự án..."
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
        />
        <select
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value as DigitalAssetBadge | "all")}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Tất cả badge</option>
          {BADGES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 focus:border-brand-blue focus:outline-none"
        >
          <option value="featured">Sắp xếp: Nổi bật</option>
          <option value="newest">Sắp xếp: Mới nhất</option>
          <option value="recommended">Sắp xếp: Đề xuất</option>
        </select>
      </div>

      {/* Project list */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white">Dự án ({filtered.length})</h2>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white/60">
            Không tìm thấy dự án phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((p) => (
              <DigitalAssetProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Dự án nổi bật</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {featuredProjects.map((p) => (
              <DigitalAssetProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* Latest articles */}
      {latestArticles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Bài viết mới nhất</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {latestArticles.map((a) => {
              const project = projects.find((p) => p.id === a.projectId);
              return (
                <Link
                  key={a.id}
                  href={project ? `/portal/digital-assets/${project.slug}` : "/portal/digital-assets"}
                  className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-blue">
                    {categories.find((c) => c.key === a.category)?.name}
                  </p>
                  <h3 className="mt-2 text-sm font-bold text-white">{a.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs text-white/60">{a.excerpt}</p>
                  <p className="mt-3 text-[11px] text-white/30">{a.publishedAt}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <DigitalAssetDisclaimer />
    </div>
  );
}
