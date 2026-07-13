import type { LucideIcon } from "lucide-react";
import { Layers, Building2, Bitcoin, Link2, LineChart } from "lucide-react";

/**
 * PROJECTS-SPR-602 — Admin-editable Icon/Màu cho Ecosystem. Trước sprint này,
 * icon là component `LucideIcon` cứng trong code và màu là 2 bảng tra cứu
 * Tailwind trùng lặp (ECOSYSTEM_SURFACE ở page.tsx + SURFACE ở
 * [ecosystemSlug]/page.tsx, cùng 5 gradient nhưng định nghĩa 2 lần). File
 * này là nguồn màu/icon DUY NHẤT — cả 2 trang Portal cùng đọc từ đây, và
 * Admin chọn qua 2 field "Icon"/"Màu" dạng select (không phải text tự do,
 * vì icon/gradient phải khớp đúng palette Tailwind đã build sẵn).
 */

export type EcosystemIconKey = "layers" | "building" | "bitcoin" | "link" | "chart";

export const ECOSYSTEM_ICONS: Record<EcosystemIconKey, LucideIcon> = {
  layers: Layers,
  building: Building2,
  bitcoin: Bitcoin,
  link: Link2,
  chart: LineChart,
};

export const ECOSYSTEM_ICON_OPTIONS: { key: EcosystemIconKey; label: string }[] = [
  { key: "layers", label: "Layers — Hệ sinh thái / Nền tảng" },
  { key: "building", label: "Building — Doanh nghiệp / Cổ phần" },
  { key: "bitcoin", label: "Bitcoin — Crypto / Blockchain" },
  { key: "link", label: "Link — Affiliate / Tiếp thị liên kết" },
  { key: "chart", label: "Chart — Trading / Sàn giao dịch" },
];

export type EcosystemColorKey = "blue" | "amber" | "slate-emerald" | "violet-blue" | "emerald-green";

export type EcosystemSurface = { card: string; strip: string; chip: string; badge: string };

export const ECOSYSTEM_SURFACE: Record<EcosystemColorKey, EcosystemSurface> = {
  blue: {
    card: "border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white hover:border-blue-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-blue-600 to-indigo-600",
    chip: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
    badge: "bg-blue-100 text-blue-700",
  },
  amber: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white hover:border-amber-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-amber-500 to-orange-500",
    chip: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
    badge: "bg-amber-100 text-amber-800",
  },
  "slate-emerald": {
    card: "border-slate-300 bg-gradient-to-br from-slate-100 via-slate-50 to-white hover:border-emerald-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-slate-800 to-emerald-600",
    chip: "bg-gradient-to-br from-slate-800 to-emerald-600 text-white",
    badge: "bg-slate-200 text-slate-700",
  },
  "violet-blue": {
    card: "border-violet-200 bg-gradient-to-br from-violet-50 via-blue-50/50 to-white hover:border-violet-400 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-violet-600 to-blue-500",
    chip: "bg-gradient-to-br from-violet-600 to-blue-500 text-white",
    badge: "bg-violet-100 text-violet-700",
  },
  "emerald-green": {
    card: "border-emerald-300 bg-gradient-to-br from-emerald-50 via-green-50/50 to-white hover:border-emerald-500 hover:shadow-token-lg hover:-translate-y-1",
    strip: "bg-gradient-to-r from-emerald-700 to-green-600",
    chip: "bg-gradient-to-br from-emerald-700 to-green-600 text-white",
    badge: "bg-emerald-100 text-emerald-800",
  },
};

export const ECOSYSTEM_COLOR_OPTIONS: { key: EcosystemColorKey; label: string }[] = [
  { key: "blue", label: "Xanh dương (Blue / Indigo)" },
  { key: "amber", label: "Vàng cam (Amber / Orange)" },
  { key: "slate-emerald", label: "Xám ngọc (Slate / Emerald)" },
  { key: "violet-blue", label: "Tím xanh (Violet / Blue)" },
  { key: "emerald-green", label: "Xanh lá (Emerald / Green)" },
];

export function getEcosystemSurface(key: string): EcosystemSurface {
  return ECOSYSTEM_SURFACE[key as EcosystemColorKey] ?? ECOSYSTEM_SURFACE.blue;
}
