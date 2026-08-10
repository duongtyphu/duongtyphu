import { Clock, Eye, LogOut, Users } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { GrowthChart } from "@/components/v2/admin/GrowthChart";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { listGrowthSeries, listSectionUsage } from "@/lib/v2/data/dashboard";

export const metadata = { title: "Báo cáo & Analytics — Admin" };

const TOP_PAGES = [
  { id: "p1", path: "Trang chủ Portal", views: 84210, avgTime: "3m 12s", bounce: "28,4%" },
  { id: "p2", path: "Học viện AI", views: 62480, avgTime: "8m 46s", bounce: "21,7%" },
  { id: "p3", path: "Companion AI", views: 48920, avgTime: "12m 04s", bounce: "16,2%" },
  { id: "p4", path: "Hệ tri thức (CKOS)", views: 37610, avgTime: "6m 31s", bounce: "32,8%" },
  { id: "p5", path: "AI Workspace", views: 29840, avgTime: "9m 18s", bounce: "24,1%" },
  { id: "p6", path: "Premium", views: 21470, avgTime: "2m 48s", bounce: "44,6%" },
  { id: "p7", path: "Cộng đồng AI", views: 18320, avgTime: "5m 22s", bounce: "35,9%" },
];

const SOURCES = [
  { id: "s1", name: "Truy cập trực tiếp", percent: 38, visits: 108150 },
  { id: "s2", name: "Tìm kiếm tự nhiên", percent: 27, visits: 76840 },
  { id: "s3", name: "Mạng xã hội", percent: 19, visits: 54080 },
  { id: "s4", name: "Giới thiệu (Affiliate)", percent: 11, visits: 31300 },
  { id: "s5", name: "Email", percent: 5, visits: 14240 },
];

export default async function AdminBaoCaoPage() {
  const [growth, usage] = await Promise.all([listGrowthSeries(), listSectionUsage()]);

  const pageRows: TableRow[] = TOP_PAGES.map((page) => ({
    id: page.id,
    cells: [
      { t: "strong", v: page.path },
      { t: "text", v: page.views.toLocaleString("vi-VN") },
      { t: "muted", v: page.avgTime },
      { t: "muted", v: page.bounce },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Tổng quan › Báo cáo & Analytics"
        title="Báo cáo & Analytics chuyên sâu"
        description="Phân tích lưu lượng, funnel chuyển đổi, giữ chân người dùng và hiệu quả nội dung."
      />

      <KpiGrid
        items={[
          { id: "visits", value: "284.610", label: "Lượt truy cập (30 ngày)", icon: Eye, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "11,4%", trend: "up" },
          { id: "active", value: "42.180", label: "Người dùng hoạt động", icon: Users, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "7,8%", trend: "up" },
          { id: "bounce", value: "38,4%", label: "Tỷ lệ thoát", icon: LogOut, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)", delta: "1,9%", trend: "down" },
          { id: "time", value: "6m 42s", label: "Thời gian TB / phiên", icon: Clock, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "22s", trend: "up" },
        ]}
      />

      <Card padding="admin">
        <CardHead title="Lưu lượng theo thời gian" />
        <GrowthChart data={growth} />
      </Card>

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-2">
        <Card padding="admin">
          <CardHead title="Nguồn truy cập" />
          {SOURCES.map((source) => (
            <div key={source.id} className="mb-[14px] flex items-center gap-3 last:mb-0">
              <span className="w-[150px] shrink-0 text-[12.5px] font-semibold">{source.name}</span>
              <span className="h-[10px] flex-1 overflow-hidden rounded-md bg-[var(--v2-bg)]">
                <span
                  className="block h-full rounded-md bg-[var(--v2-violet)]"
                  style={{ width: `${source.percent}%` }}
                />
              </span>
              <span className="w-20 shrink-0 text-right text-[12.5px] font-extrabold">
                {source.visits.toLocaleString("vi-VN")}
              </span>
            </div>
          ))}
        </Card>

        <Card padding="admin">
          <CardHead title="Phân bổ người dùng theo mục" />
          {usage.map((row) => (
            <div key={row.id} className="mb-[14px] flex items-center gap-3 last:mb-0">
              <span className="w-[150px] shrink-0 text-[12.5px] font-semibold">{row.label}</span>
              <span className="h-[10px] flex-1 overflow-hidden rounded-md bg-[var(--v2-bg)]">
                <span
                  className="block h-full rounded-md"
                  style={{ width: `${row.percent}%`, background: row.color }}
                />
              </span>
              <span className="w-14 shrink-0 text-right text-[12.5px] font-extrabold">
                {row.value.toLocaleString("vi-VN")}
              </span>
            </div>
          ))}
        </Card>
      </div>

      <DataTable
        title="Trang / Nội dung hiệu quả nhất"
        headers={["Trang / Nội dung", "Lượt xem", "Thời gian TB", "Tỷ lệ thoát"]}
        rows={pageRows}
        totalLabel="trang"
        searchPlaceholder="Tìm trang..."
      />
    </div>
  );
}
