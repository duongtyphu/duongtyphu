import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { IcoBox } from "./IcoBox";

const TONES = {
  violet: "bg-[var(--v2-violet-light)] text-[var(--v2-violet)]",
  gold: "bg-[#fef3c7] text-[#92720a]",
  green: "bg-[#e6f7ed] text-[var(--v2-green)]",
  red: "bg-[#fdeaec] text-[var(--v2-red)]",
  neutral: "bg-[var(--v2-bg)] text-[var(--v2-muted)]",
} as const;

export type BadgeTone = keyof typeof TONES;

/** Nhãn trạng thái nhỏ (`.learn-tag`, `.sugg-type`, `.premium-pill`). */
export function Badge({
  children,
  tone = "violet",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-block rounded-md px-[9px] py-[3px] text-[10.5px] font-extrabold tracking-[0.03em] ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

/** Ô số liệu ở Dashboard admin — nhãn, giá trị lớn, biến động so với kỳ trước. */
export function StatTileCard({
  label,
  value,
  delta,
  trend,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: LucideIcon;
}) {
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp;
  const trendClass =
    trend === "down"
      ? "text-[var(--v2-red)]"
      : trend === "up"
        ? "text-[var(--v2-green)]"
        : "text-[var(--v2-muted)]";

  return (
    <div className="rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[18px]">
      <div className="mb-3 flex items-start justify-between">
        <span className="text-[12px] font-bold text-[var(--v2-muted)]">{label}</span>
        <IcoBox icon={icon} size="sm" />
      </div>
      <div className="text-[24px] font-extrabold">{value}</div>
      {trend === "flat" ? (
        <div className={`mt-1 text-[11.5px] font-bold ${trendClass}`}>{delta}</div>
      ) : (
        <div className={`mt-1 flex items-center gap-1 text-[11.5px] font-bold ${trendClass}`}>
          <TrendIcon className="h-[13px] w-[13px]" aria-hidden="true" />
          {delta}
        </div>
      )}
    </div>
  );
}

/** Thanh tiến độ (`.learn-progress-track` / `.xp-track`). */
export function ProgressBar({
  value,
  trackClassName = "bg-[var(--v2-bg)]",
  fillStyle,
  height = 7,
  label,
}: {
  /** 0–100 */
  value: number;
  trackClassName?: string;
  fillStyle?: string;
  height?: number;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`overflow-hidden rounded-[5px] ${trackClassName}`}
      style={{ height }}
    >
      <div
        className="h-full rounded-[5px]"
        style={{
          width: `${clamped}%`,
          background: fillStyle ?? "linear-gradient(90deg,var(--v2-violet),#9b7bff)",
        }}
      />
    </div>
  );
}
