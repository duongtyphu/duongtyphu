import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";

import { V2_ADMIN_BASE } from "@/components/v2/nav/nav-config";
import { GrowthChart } from "@/components/v2/admin/GrowthChart";
import { Card, CardHead } from "@/components/v2/ui/Card";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { PageHead } from "@/components/v2/ui/PageHead";
import {
  listGrowthSeries,
  listKpis,
  listRecentActivity,
  listSectionUsage,
  listSystemStatus,
} from "@/lib/v2/data/dashboard";

export const metadata = { title: "Dashboard — Admin" };

const STATUS_STYLE: Record<string, { dot: string; background: string; color: string }> = {
  ok: { dot: "var(--v2-green)", background: "#e6f7ed", color: "#189a52" },
  syncing: { dot: "var(--v2-gold)", background: "#fdf1e0", color: "#a9822c" },
  down: { dot: "var(--v2-red)", background: "#fdeef0", color: "var(--v2-red)" },
};

const RANGES = ["7 ngày", "30 ngày", "90 ngày", "Năm"];

export default async function AdminDashboardPage() {
  const [kpis, statuses, usage, activity, growth] = await Promise.all([
    listKpis(),
    listSystemStatus(),
    listSectionUsage(),
    listRecentActivity(),
    listGrowthSeries(),
  ]);

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Dashboard"
        title="Tổng quan hệ thống"
        description="Theo dõi số liệu vận hành và hoạt động toàn bộ hệ sinh thái VO DUONG AI."
        action={
          <div className="flex shrink-0 gap-[6px] rounded-xl border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[6px]">
            {RANGES.map((range) => (
              <span
                key={range}
                className={[
                  "rounded-[9px] px-3 py-2 text-[12.5px] font-bold whitespace-nowrap",
                  range === "30 ngày"
                    ? "bg-[var(--v2-violet)] text-white"
                    : "text-[var(--v2-muted)]",
                ].join(" ")}
              >
                {range}
              </span>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-[14px] min-[1180px]:grid-cols-5">
        {kpis.map((kpi) => {
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div
              key={kpi.id}
              className="rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[18px]"
            >
              <div className="mb-3 flex items-start justify-between">
                <IcoBox icon={kpi.icon} size="md" background={kpi.gradient} color="#fff" />
                <span
                  className={[
                    "flex items-center gap-1 text-[11.5px] font-extrabold",
                    kpi.trend === "up" ? "text-[var(--v2-green)]" : "text-[var(--v2-red)]",
                  ].join(" ")}
                >
                  <TrendIcon className="h-[13px] w-[13px]" aria-hidden="true" />
                  {kpi.delta}
                </span>
              </div>
              <div className="text-[22px] font-extrabold">{kpi.value}</div>
              <div className="mt-1 text-[12px] text-[var(--v2-muted)]">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-[1.6fr_1fr]">
        <Card padding="admin">
          <CardHead title="Tăng trưởng người dùng & doanh thu" />
          <GrowthChart data={growth} />
        </Card>

        <Card padding="admin">
          <CardHead title="Trạng thái hệ thống" />
          {statuses.map((status) => {
            const style = STATUS_STYLE[status.state];
            return (
              <div
                key={status.id}
                className="flex items-center justify-between border-b border-[var(--v2-line)] py-[9px] text-[12.8px] last:border-b-0"
              >
                <span className="flex items-center gap-[9px] font-semibold">
                  <i
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ background: style.dot }}
                  />
                  {status.name}
                </span>
                <span
                  className="rounded-md px-[9px] py-[2px] text-[11px] font-extrabold"
                  style={{ background: style.background, color: style.color }}
                >
                  {status.label}
                </span>
              </div>
            );
          })}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-2">
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

        <Card padding="admin">
          <CardHead
            title="Hoạt động gần đây"
            action={
              <Link href={`${V2_ADMIN_BASE}/bao-cao`} className="text-[12.5px] font-bold">
                Xem tất cả →
              </Link>
            }
          />
          {activity.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-[11px] border-b border-[var(--v2-line)] py-[10px] last:border-b-0"
              >
                <span
                  className="v2-ico flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg"
                  style={{ background: item.background, color: item.color }}
                >
                  <Icon className="h-[14px] w-[14px]" aria-hidden="true" />
                </span>
                <span className="flex-1 text-[12.5px] leading-[1.4]">
                  {item.emphasis ? <b className="font-bold">{item.emphasis}</b> : null}
                  {item.emphasis ? " " : ""}
                  {item.text}
                </span>
                <span className="shrink-0 text-[10.5px] text-[var(--v2-muted)]">{item.time}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
