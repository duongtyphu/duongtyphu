import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { IcoBox } from "./IcoBox";

export type KpiItem = {
  id: string;
  value: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  delta?: string;
  trend?: "up" | "down";
};

/** `.kpi-grid` — hàng ô số liệu ở đầu hầu hết trang Admin. 4 cột trên desktop. */
export function KpiGrid({ items, columns = 4 }: { items: KpiItem[]; columns?: 4 | 5 }) {
  return (
    <div
      className={[
        "grid grid-cols-2 gap-[14px]",
        columns === 5 ? "min-[1180px]:grid-cols-5" : "min-[1180px]:grid-cols-4",
      ].join(" ")}
    >
      {items.map((item) => {
        const TrendIcon = item.trend === "down" ? TrendingDown : TrendingUp;
        return (
          <div
            key={item.id}
            className="rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[18px]"
          >
            <div className="mb-[14px] flex items-start justify-between">
              <IcoBox icon={item.icon} size="md" background={item.gradient} color="#fff" />
              {item.delta ? (
                <span
                  className={[
                    "flex items-center gap-1 text-[11px] font-extrabold",
                    item.trend === "down" ? "text-[var(--v2-red)]" : "text-[var(--v2-green)]",
                  ].join(" ")}
                >
                  <TrendIcon className="h-3 w-3" aria-hidden="true" />
                  {item.delta}
                </span>
              ) : null}
            </div>
            <div className="text-[23px] font-extrabold">{item.value}</div>
            <div className="mt-[3px] text-[12px] text-[var(--v2-muted)]">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
