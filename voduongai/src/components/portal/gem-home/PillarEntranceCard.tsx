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

/**
 * Portal 4.0 Home Emotional Experience — mỗi pillar card giờ có "nhịp"
 * riêng, đúng theo PORTAL_DNA.md, thay vì 7 thẻ trắng giống hệt nhau chỉ
 * khác icon/màu: CKOS (tò mò) có lưới chấm nhẹ; Academy (khích lệ) có
 * dải gradient trên đầu; Workspace (tập trung) tối giản tuyệt đối, góc
 * vuông hơn, không hoạ tiết; Projects (khách quan) phẳng, có vạch trái
 * rõ ràng; Premium (tôn trọng) tông ấm, viền vàng nhạt; Journey (chiêm
 * nghiệm) bo góc rộng hơn, nền dịu; Companion (sự sống) viền gradient
 * chuyển động chậm, bo góc rộng nhất — cảm giác "cửa vào một thế giới
 * khác nhau", không phải cùng một khuôn lặp lại 7 lần.
 */
const SURFACE: Record<
  PillarAccent,
  { card: string; iconChip: string; iconColor: string; accentText: string; radius: string }
> = {
  violet: {
    card: "border-violet-100 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.14)_1px,transparent_0)] bg-[length:14px_14px] hover:border-violet-300",
    iconChip: "bg-violet-100",
    iconColor: "text-violet-600",
    accentText: "text-violet-600",
    radius: "rounded-2xl",
  },
  blue: {
    card: "border-blue-100 bg-gradient-to-b from-blue-50/70 to-white hover:border-blue-300",
    iconChip: "bg-blue-100",
    iconColor: "text-blue-600",
    accentText: "text-blue-600",
    radius: "rounded-2xl",
  },
  slate: {
    card: "border-slate-200 bg-white hover:border-slate-400",
    iconChip: "bg-slate-100",
    iconColor: "text-slate-700",
    accentText: "text-slate-700",
    radius: "rounded-lg",
  },
  emerald: {
    card: "border-l-4 border-l-emerald-400 border-y border-r border-gray-100 bg-white hover:border-l-emerald-500",
    iconChip: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentText: "text-emerald-600",
    radius: "rounded-xl",
  },
  amber: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50/60 via-white to-white hover:border-amber-300",
    iconChip: "bg-amber-100",
    iconColor: "text-amber-600",
    accentText: "text-amber-600",
    radius: "rounded-2xl",
  },
  teal: {
    card: "border-teal-100 bg-teal-50/30 hover:border-teal-300",
    iconChip: "bg-teal-100",
    iconColor: "text-teal-600",
    accentText: "text-teal-600",
    radius: "rounded-[1.5rem]",
  },
  rose: {
    card: "border-transparent bg-gradient-to-br from-rose-50/70 via-white to-white bg-clip-padding shadow-[0_0_0_1.5px_rgba(244,114,182,0.35)] hover:shadow-[0_0_0_1.5px_rgba(244,114,182,0.6)]",
    iconChip: "bg-gradient-to-br from-blue-100 via-violet-100 to-rose-100",
    iconColor: "text-violet-600",
    accentText: "text-violet-600",
    radius: "rounded-[1.75rem]",
  },
};

/**
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
  const surface = SURFACE[accent];
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
    <div className={`group flex flex-col border p-6 shadow-sm transition ${surface.card} ${surface.radius}`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${surface.iconChip}`}>
        <Icon className={`h-5 w-5 ${surface.iconColor}`} />
      </div>
      <h3 className="gemos-card-title mt-4 text-base font-bold text-gray-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{what}</p>

      {(startedMode || startedOverride) && (
        <p className="mt-3 text-xs text-gray-400">{startedLine ?? " "}</p>
      )}

      <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-gray-500">
        <Sparkles className={`mt-0.5 h-3 w-3 shrink-0 ${surface.accentText}`} />
        <span className="italic">{companionLine}</span>
      </p>

      <Link
        href={href}
        className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${surface.accentText} hover:underline`}
      >
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
