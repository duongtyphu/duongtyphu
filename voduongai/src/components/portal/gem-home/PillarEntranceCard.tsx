"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Brain,
  GraduationCap,
  Cpu,
  LineChart,
  Crown,
  Compass,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { getModuleActivitySummary, getGardenSummary, getRecentActivity } from "@/lib/portal/foundation/growth-view";

export type PillarAccent = "violet" | "blue" | "slate" | "emerald" | "amber" | "teal" | "rose";

export type PillarIconKey = "brain" | "graduation-cap" | "cpu" | "line-chart" | "crown" | "compass" | "heart-handshake";

/**
 * Next.js RSC boundary: component/function references (như một icon
 * component) không thể truyền từ Server Component sang Client Component
 * qua props — chỉ dữ liệu tuần tự hoá được mới truyền được. Vì
 * PillarEntranceCard là "use client", Home (server) chỉ truyền một
 * string key; icon thật được import và resolve ngay trong file client
 * này, không bao giờ đi qua ranh giới server/client.
 */
const ICONS: Record<PillarIconKey, LucideIcon> = {
  brain: Brain,
  "graduation-cap": GraduationCap,
  cpu: Cpu,
  "line-chart": LineChart,
  crown: Crown,
  compass: Compass,
  "heart-handshake": HeartHandshake,
};

const ACCENT: Record<PillarAccent, { chip: string; icon: string; ring: string }> = {
  violet: { chip: "bg-violet-50", icon: "text-violet-600", ring: "hover:border-violet-200" },
  blue: { chip: "bg-blue-50", icon: "text-blue-600", ring: "hover:border-blue-200" },
  slate: { chip: "bg-slate-100", icon: "text-slate-600", ring: "hover:border-slate-300" },
  emerald: { chip: "bg-emerald-50", icon: "text-emerald-600", ring: "hover:border-emerald-200" },
  amber: { chip: "bg-amber-50", icon: "text-amber-600", ring: "hover:border-amber-200" },
  teal: { chip: "bg-teal-50", icon: "text-teal-600", ring: "hover:border-teal-200" },
  rose: { chip: "bg-rose-50", icon: "text-rose-600", ring: "hover:border-rose-200" },
};

/**
 * Portal 4.0 Home Reconstruction — Pillar Entrance Card. Mỗi pillar là một
 * "điểm đến sống", không phải mục menu hay dashboard widget: what is this /
 * why enter / what have I done / Companion gợi ý gì / dẫn tới đâu — tất cả
 * trong một thẻ nhỏ, thở được, không phải banner quảng cáo.
 *
 * "Đã bắt đầu" đọc thật từ WorkspaceSession theo `module` (growth-view.ts,
 * cùng nguồn dữ liệu duy nhất toàn Portal) — nếu chưa có phiên nào, hiển
 * thị đúng sự thật đó, không suy diễn hay bịa số.
 */
export function PillarEntranceCard({
  icon,
  accent,
  title,
  what,
  href,
  startedMode,
  module,
  startedOverride,
  companionLine,
  ctaLabel,
}: {
  icon: PillarIconKey;
  accent: PillarAccent;
  title: string;
  what: string;
  href: string;
  /** "module": đếm session/output thật theo module (cần `module`). "aggregate": tổng trưởng thành thật toàn Portal (Khu vườn/Garden). "recent": hoạt động thật gần nhất. Bỏ qua nếu pillar không có khái niệm "đã làm gì" (vd. dùng startedOverride cho Premium). */
  startedMode?: "module" | "aggregate" | "recent";
  module?: string;
  /** Dùng khi "đã làm gì" đến từ nguồn thật khác (vd. Premium đọc số sản phẩm đã sở hữu từ Supabase, tính sẵn ở server) — ưu tiên hơn mọi client lookup. */
  startedOverride?: string;
  companionLine: string;
  ctaLabel: string;
}) {
  const [startedLine, setStartedLine] = useState<string | null>(startedOverride ?? null);
  const tone = ACCENT[accent];
  const Icon = ICONS[icon];

  useEffect(() => {
    if (startedOverride) return;
    let line: string | null = null;
    if (startedMode === "module" && module) {
      const summary = getModuleActivitySummary(module);
      line =
        summary.sessionCount === 0
          ? "Bạn chưa bắt đầu gì ở đây."
          : summary.outputCount > 0
            ? `Bạn đã có ${summary.outputCount} kết quả thật từ ${summary.sessionCount} phiên làm việc ở đây.`
            : `Bạn đã bắt đầu ${summary.sessionCount} phiên ở đây, chưa có kết quả nào hoàn tất.`;
    } else if (startedMode === "aggregate") {
      const garden = getGardenSummary();
      line =
        garden.totalOutputs === 0
          ? "Khu vườn của bạn còn trống — chưa có gì để nhìn lại."
          : `Bạn đã tạo ${garden.totalOutputs} kết quả thật, chạm tới ${garden.journeysTouched} hành trình.`;
    } else if (startedMode === "recent") {
      const [latest] = getRecentActivity(1);
      line = latest ? `Lần gần nhất, bạn đã ${latest.label.toLowerCase()}.` : "Chưa có gì để nhớ — điều đó sẽ bắt đầu từ lần đầu tiên bạn làm việc trong Workspace.";
    }
    if (line) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only localStorage, no SSR equivalent
      setStartedLine(line);
    }
  }, [module, startedMode, startedOverride]);

  return (
    <div className={`group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition ${tone.ring}`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.chip}`}>
        <Icon className={`h-5 w-5 ${tone.icon}`} />
      </div>
      <h3 className="gemos-card-title mt-4 text-base font-bold text-gray-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{what}</p>

      {(startedMode || startedOverride) && (
        <p className="mt-3 text-xs text-gray-400">{startedLine ?? " "}</p>
      )}

      <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-gray-500">
        <Sparkles className={`mt-0.5 h-3 w-3 shrink-0 ${tone.icon}`} />
        <span className="italic">{companionLine}</span>
      </p>

      <Link
        href={href}
        className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${tone.icon} hover:underline`}
      >
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
