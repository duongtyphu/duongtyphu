"use client";

import { digitalAssetStats } from "@/data/digitalAssets";
import { MiniBarChart } from "@/components/admin/ui/MiniBarChart";

function TopList({ title, items }: { title: string; items: { label: string; value: string | number }[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.map((it, i) => (
          <div key={`${it.label}_${i}`} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
            <span className="text-white/80">{it.label}</span>
            <span className="font-semibold text-white">{it.value}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-white/40">Chưa có dữ liệu.</p>}
      </div>
    </div>
  );
}

export default function DigitalAssetAnalyticsPage() {
  const stats = digitalAssetStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Báo cáo Tài sản số</h1>
        <p className="mt-1 text-sm text-white/50">
          Phân tích tương tác (mock) trên các dự án, link và bài viết trong mục Tài sản số.
        </p>
      </div>

      {stats ? (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-sm font-bold text-white">Tổng click theo danh mục</h2>
            <div className="mt-4">
              <MiniBarChart
                data={stats.clicksByCategory.map((c) => ({ day: c.categoryName, clicks: c.clicks }))}
                dataKey="clicks"
                labelKey="day"
                color="#2563EB"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TopList
              title="Top dự án được xem nhiều"
              items={stats.topProjectsViewed.map((p) => ({ label: p.projectName, value: p.views }))}
            />
            <TopList
              title="Top link Affiliate được click nhiều"
              items={stats.topAffiliateLinksClicked.map((l) => ({
                label: `${l.linkTitle} — ${l.projectName}`,
                value: l.clicks,
              }))}
            />
            <TopList
              title="Top bài viết được xem nhiều"
              items={stats.topArticleViews.map((a) => ({ label: a.articleTitle, value: a.views }))}
            />
            <TopList
              title="Click theo danh mục"
              items={stats.clicksByCategory.map((c) => ({ label: c.categoryName, value: c.clicks }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Danh mục có tương tác cao nhất</p>
              <p className="mt-2 text-lg font-extrabold text-white">{stats.mostActiveCategory.categoryName}</p>
              <p className="mt-1 text-xs text-white/40">Engagement score: {stats.mostActiveCategory.engagementScore}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Dự án có nhiều link nhất</p>
              <p className="mt-2 text-lg font-extrabold text-white">{stats.mostLinkedProject.projectName}</p>
              <p className="mt-1 text-xs text-white/40">{stats.mostLinkedProject.linkCount} link</p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-white/40">Chưa có dữ liệu thống kê.</p>
      )}
    </div>
  );
}
