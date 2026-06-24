"use client";

import { useCollection } from "@/lib/admin/store";
import { promptsSeed } from "@/data/admin/prompts";
import { toolsAdminSeed } from "@/data/admin/tools";
import { resourcesSeed } from "@/data/admin/resources";
import { affiliateLinksSeed } from "@/data/admin/affiliate";
import { blogPostsSeed } from "@/data/admin/content";
import { leadsSeed } from "@/data/admin/people";

function TopList({ title, items }: { title: string; items: { label: string; value: string | number }[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
            <span className="text-white/80">{it.label}</span>
            <span className="font-semibold text-white">{it.value}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-white/40">Chưa có dữ liệu.</p>}
      </div>
    </div>
  );
}

const mockKeywords = [
  { label: "prompt content viral", value: 142 },
  { label: "công cụ ai miễn phí", value: 98 },
  { label: "affiliate marketing là gì", value: 76 },
];

export default function ReportsPage() {
  const { items: prompts } = useCollection("prompts", promptsSeed);
  const { items: tools } = useCollection("tools", toolsAdminSeed);
  const { items: resources } = useCollection("resources", resourcesSeed);
  const { items: links } = useCollection("affiliate-links", affiliateLinksSeed);
  const { items: blog } = useCollection("blog", blogPostsSeed);
  const { items: leads } = useCollection("leads", leadsSeed);

  const converted = leads.filter((l) => l.status === "Converted").length;
  const conversionRate = leads.length ? ((converted / leads.length) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Báo cáo & Phân tích</h1>
        <p className="mt-1 text-sm text-white/50">Tối ưu nội dung và doanh thu dựa trên dữ liệu tương tác.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TopList
          title="Top Prompt (lượt copy)"
          items={[...prompts]
            .sort((a, b) => b.copyCount - a.copyCount)
            .slice(0, 5)
            .map((p) => ({ label: p.title, value: p.copyCount }))}
        />
        <TopList
          title="Top Công cụ (rating)"
          items={[...tools]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map((t) => ({ label: t.name, value: t.rating }))}
        />
        <TopList
          title="Top Link Affiliate (click)"
          items={[...links]
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5)
            .map((l) => ({ label: l.name, value: l.clicks }))}
        />
        <TopList
          title="Top Tài nguyên"
          items={resources.slice(0, 5).map((r) => ({ label: r.name, value: r.type }))}
        />
        <TopList
          title="Bài Blog nổi bật"
          items={blog
            .filter((b) => b.featured)
            .map((b) => ({ label: b.title, value: b.publishedAt }))}
        />
        <TopList title="Từ khóa tìm kiếm (mock)" items={mockKeywords} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-sm font-bold text-white">Lead Conversion (mock)</h2>
        <p className="mt-2 text-2xl font-extrabold text-white">{conversionRate}%</p>
        <p className="mt-1 text-xs text-white/40">{converted}/{leads.length} lead đã chuyển đổi.</p>
      </div>
    </div>
  );
}
