"use client";

import Link from "next/link";
import { useCollection } from "@/lib/admin/store";
import { usersSeed } from "@/data/admin/people";
import { leadsSeed } from "@/data/admin/people";
import { resourcesSeed } from "@/data/admin/resources";
import { promptsSeed } from "@/data/admin/prompts";
import { toolsAdminSeed } from "@/data/admin/tools";
import { blogPostsSeed } from "@/data/admin/content";
import { affiliateProductsSeed, affiliateLinksSeed } from "@/data/admin/affiliate";
import { trafficSeed } from "@/data/admin/settings";
import { MiniBarChart } from "@/components/admin/ui/MiniBarChart";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { items: users } = useCollection("users", usersSeed);
  const { items: leads } = useCollection("leads", leadsSeed);
  const { items: resources } = useCollection("resources", resourcesSeed);
  const { items: prompts } = useCollection("prompts", promptsSeed);
  const { items: tools } = useCollection("tools", toolsAdminSeed);
  const { items: blog } = useCollection("blog", blogPostsSeed);
  const { items: affProducts } = useCollection("affiliate-products", affiliateProductsSeed);
  const { items: affLinks } = useCollection("affiliate-links", affiliateLinksSeed);

  const totalClicks = affLinks.reduce((sum, l) => sum + l.clicks, 0);
  const topPrompt = [...prompts].sort((a, b) => b.copyCount - a.copyCount)[0];
  const topLink = [...affLinks].sort((a, b) => b.clicks - a.clicks)[0];
  const featuredBlog = blog.find((b) => b.featured) ?? blog[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Tổng quan</h1>
        <p className="mt-1 text-sm text-white/50">Trung tâm điều hành hệ sinh thái VO DUONG AI.</p>
      </div>

      <Link
        href="/admin/founder"
        className="flex items-center justify-between gap-3 rounded-2xl border border-brand-blue/30 bg-brand-blue/10 p-4 transition hover:bg-brand-blue/15"
      >
        <div>
          <p className="text-sm font-bold text-white">Khu vực Founder</p>
          <p className="mt-0.5 text-xs text-white/60">
            Tổng quan điều hành, câu hỏi PMO đang mở, và toàn cảnh Portal/các khu vực — điểm vào duy nhất cho Founder.
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-brand-blue">Mở →</span>
      </Link>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Người dùng" value={users.length} />
        <StatCard label="Lead" value={leads.length} />
        <StatCard label="Tài nguyên" value={resources.length} />
        <StatCard label="Prompt" value={prompts.length} />
        <StatCard label="Công cụ AI" value={tools.length} />
        <StatCard label="Bài Blog" value={blog.length} />
        <StatCard label="Sản phẩm Affiliate" value={affProducts.length} />
        <StatCard label="Click Affiliate" value={totalClicks} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Traffic 7 ngày</h2>
          <div className="mt-4">
            <MiniBarChart data={trafficSeed} dataKey="visits" color="#5B8CFF" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Click Affiliate 7 ngày</h2>
          <div className="mt-4">
            <MiniBarChart data={trafficSeed} dataKey="clicks" color="#FF7A00" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Lead mới 7 ngày</h2>
          <div className="mt-4">
            <MiniBarChart data={trafficSeed} dataKey="leads" color="#2563EB" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">Nội dung tương tác nhiều nhất</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              📌 Tài nguyên xem nhiều nhất: <b className="text-white">{resources[0]?.name ?? "—"}</b>
            </li>
            <li>
              ✨ Prompt copy nhiều nhất: <b className="text-white">{topPrompt?.title ?? "—"}</b> ({topPrompt?.copyCount ?? 0} lượt)
            </li>
            <li>
              🛠️ Công cụ click nhiều nhất: <b className="text-white">{tools[0]?.name ?? "—"}</b>
            </li>
            <li>
              📝 Bài viết nổi bật: <b className="text-white">{featuredBlog?.title ?? "—"}</b>
            </li>
            <li>
              🔗 Link affiliate hiệu quả nhất: <b className="text-white">{topLink?.name ?? "—"}</b> ({topLink?.clicks ?? 0} click)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
