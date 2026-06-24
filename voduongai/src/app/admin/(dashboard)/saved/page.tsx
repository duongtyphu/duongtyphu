"use client";

import { topSavedMock } from "@/data/admin/savedStats";
import { MiniBarChart } from "@/components/admin/ui/MiniBarChart";

function StatBlock({ title, data, color }: { title: string; data: { title: string; count: number }[]; color: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <div className="mt-4">
        <MiniBarChart data={data} dataKey="count" labelKey="title" color={color} />
      </div>
      <ul className="mt-4 space-y-1.5">
        {data.map((d) => (
          <li key={d.title} className="flex items-center justify-between text-xs text-white/60">
            <span>{d.title}</span>
            <span className="font-semibold text-white/80">{d.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SavedStatsAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Tài nguyên đã lưu</h1>
        <p className="mt-1 text-sm text-white/50">
          Thống kê những nội dung được người dùng lưu lại nhiều nhất trên Portal (dữ liệu mock — sẽ thay bằng dữ
          liệu thực khi có database).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <StatBlock title="Prompt được lưu nhiều nhất" data={topSavedMock.topPrompts} color="#2563EB" />
        <StatBlock title="Công cụ được lưu nhiều nhất" data={topSavedMock.topTools} color="#F97316" />
        <StatBlock title="Ebook được lưu nhiều nhất" data={topSavedMock.topEbooks} color="#22C55E" />
        <StatBlock title="Bài học được lưu nhiều nhất" data={topSavedMock.topLessons} color="#A855F7" />
        <StatBlock
          title="Sản phẩm Affiliate được lưu nhiều nhất"
          data={topSavedMock.topAffiliateProducts}
          color="#EAB308"
        />
      </div>
    </div>
  );
}
