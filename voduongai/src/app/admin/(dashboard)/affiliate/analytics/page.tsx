"use client";

import { useCollection } from "@/lib/admin/store";
import { affiliateProductsSeed, affiliateLinksSeed } from "@/data/admin/affiliate";
import { trafficSeed } from "@/data/admin/settings";
import { MiniBarChart } from "@/components/admin/ui/MiniBarChart";

export default function AffiliateAnalyticsPage() {
  const { items: products } = useCollection("affiliate-products", affiliateProductsSeed);
  const { items: links } = useCollection("affiliate-links", affiliateLinksSeed);

  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const totalConversions = links.reduce((s, l) => s + l.conversions, 0);
  const ctr = totalClicks ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0";
  const revenue = totalConversions * 250000;
  const topLinks = [...links].sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Báo cáo Affiliate</h1>
        <p className="mt-1 text-sm text-white/50">
          Dữ liệu mock — cấu trúc sẵn sàng kết nối tracking thật.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Tổng click", value: totalClicks },
          { label: "Conversion (mock)", value: totalConversions },
          { label: "CTR (mock)", value: `${ctr}%` },
          { label: "Doanh thu (mock)", value: `${revenue.toLocaleString("vi-VN")}đ` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{s.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-sm font-bold text-white">Click theo ngày (7 ngày)</h2>
        <div className="mt-4">
          <MiniBarChart data={trafficSeed} dataKey="clicks" color="#FF7A00" />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-sm font-bold text-white">Top sản phẩm Affiliate theo click</h2>
        <div className="mt-4 space-y-2">
          {topLinks.map((l) => (
            <div key={l.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="font-semibold text-white">{l.name}</span>
              <span className="text-white/50">{l.clicks} click · {l.conversions} conversion</span>
            </div>
          ))}
          {products.length === 0 && <p className="text-sm text-white/40">Chưa có sản phẩm Affiliate.</p>}
        </div>
      </div>
    </div>
  );
}
