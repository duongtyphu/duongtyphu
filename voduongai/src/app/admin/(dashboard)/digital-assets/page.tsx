"use client";

import Link from "next/link";
import { useCollection } from "@/lib/admin/store";
import {
  digitalAssetCategories,
  digitalAssetProjects,
  digitalAssetLinks,
  digitalAssetArticles,
  digitalAssetSettingsSeed,
} from "@/data/digitalAssets";
import { useAdminToast } from "@/lib/admin/toast";
import { useState, useEffect } from "react";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

export default function DigitalAssetsAdminDashboardPage() {
  const { items: categories } = useCollection("digital-asset-categories", digitalAssetCategories);
  const { items: projects } = useCollection("digital-asset-projects", digitalAssetProjects);
  const { items: links } = useCollection("digital-asset-links", digitalAssetLinks);
  const { items: articles } = useCollection("digital-asset-articles", digitalAssetArticles);
  const { items: settings, update: updateSettings, ready: settingsReady } = useCollection(
    "digital-asset-settings",
    digitalAssetSettingsSeed
  );
  const { push } = useAdminToast();

  const [disclaimer, setDisclaimer] = useState("");
  useEffect(() => {
    // Syncs local edit buffer once the async collection load resolves; no
    // pure render-time source for this value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (settingsReady && settings[0]) setDisclaimer(settings[0].disclaimer);
  }, [settingsReady, settings]);

  const affiliateLinks = links.filter((l) => l.isAffiliate);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 5);
  const newestProjects = [...projects]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 5);
  const topLink = [...links].sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0))[0];
  const categoryProjectCounts = categories
    .map((c) => ({ ...c, count: projects.filter((p) => p.category === c.key).length }))
    .sort((a, b) => b.count - a.count);
  const topCategory = categoryProjectCounts[0];

  function saveDisclaimer() {
    if (!settings[0]) return;
    updateSettings(settings[0].id, { disclaimer });
    push("Đã lưu disclaimer.");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">ĐẦU TƯ CÙNG TÔI — Tổng quan</h1>
          <p className="mt-1 text-sm text-white/50">
            Quản lý toàn bộ danh mục, dự án, link và bài viết của mục ĐẦU TƯ CÙNG TÔI trên Portal.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/digital-assets/projects" className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90">
            + Thêm dự án mới
          </Link>
          <Link href="/admin/digital-assets/links" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            + Thêm link affiliate
          </Link>
          <Link href="/admin/digital-assets/articles" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            + Thêm bài viết
          </Link>
          <Link href="/admin/digital-assets/categories" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            Quản lý danh mục
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Danh mục" value={categories.length} />
        <StatCard label="Dự án" value={projects.length} />
        <StatCard label="Tổng số link" value={links.length} />
        <StatCard label="Affiliate links" value={affiliateLinks.length} />
        <StatCard label="Bài viết" value={articles.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Dự án nổi bật</h2>
          <ul className="mt-3 space-y-2">
            {featuredProjects.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                <span className="text-white/80">{p.logo} {p.name}</span>
                <span className="text-xs text-white/40">{p.badge}</span>
              </li>
            ))}
            {featuredProjects.length === 0 && <p className="text-sm text-white/40">Chưa có dự án nổi bật.</p>}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Dự án mới thêm</h2>
          <ul className="mt-3 space-y-2">
            {newestProjects.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                <span className="text-white/80">{p.logo} {p.name}</span>
                <span className="text-xs text-white/40">{p.createdAt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Link được click nhiều nhất (mock)</h2>
          {topLink ? (
            <div className="mt-3 rounded-lg bg-white/5 px-3 py-3 text-sm">
              <p className="font-semibold text-white">{topLink.title}</p>
              <p className="mt-1 text-xs text-white/40">{topLink.clickCount} lượt click — {topLink.type}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/40">Chưa có dữ liệu.</p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Danh mục có nhiều dự án nhất</h2>
          {topCategory ? (
            <div className="mt-3 rounded-lg bg-white/5 px-3 py-3 text-sm">
              <p className="font-semibold text-white">{topCategory.icon} {topCategory.name}</p>
              <p className="mt-1 text-xs text-white/40">{topCategory.count} dự án</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/40">Chưa có dữ liệu.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-sm font-bold text-white">Disclaimer mặc định (ĐẦU TƯ CÙNG TÔI)</h2>
        <p className="mt-1 text-xs text-white/40">Hiển thị ở mọi trang ĐẦU TƯ CÙNG TÔI trên Portal, có thể override riêng theo từng dự án.</p>
        <textarea
          value={disclaimer}
          onChange={(e) => setDisclaimer(e.target.value)}
          rows={3}
          className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        />
        <button
          onClick={saveDisclaimer}
          className="mt-3 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          Lưu disclaimer
        </button>
      </div>
    </div>
  );
}
