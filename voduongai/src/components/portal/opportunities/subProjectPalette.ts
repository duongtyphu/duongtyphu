/**
 * Distinct color palette for sub-project cards (Type A ecosystems: DigiU,
 * SolarGroup) — its own new palette, cycling by `colorIndex`, not a copy of
 * the parent ecosystem's single `ECOSYSTEM_SURFACE` color from the Hub page.
 */
export const SUB_PROJECT_PALETTE: { card: string; chip: string; badge: string }[] = [
  {
    card: "border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white hover:border-blue-400",
    chip: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    card: "border-rose-200 bg-gradient-to-br from-rose-50 via-pink-50/40 to-white hover:border-rose-400",
    chip: "bg-gradient-to-br from-rose-500 to-pink-500 text-white",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/40 to-white hover:border-amber-400",
    chip: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
    badge: "bg-amber-100 text-amber-800",
  },
  {
    card: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50/40 to-white hover:border-emerald-400",
    chip: "bg-gradient-to-br from-emerald-600 to-green-600 text-white",
    badge: "bg-emerald-100 text-emerald-800",
  },
  {
    card: "border-violet-200 bg-gradient-to-br from-violet-50 via-purple-50/40 to-white hover:border-violet-400",
    chip: "bg-gradient-to-br from-violet-600 to-purple-600 text-white",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    card: "border-cyan-200 bg-gradient-to-br from-cyan-50 via-sky-50/40 to-white hover:border-cyan-400",
    chip: "bg-gradient-to-br from-cyan-600 to-sky-600 text-white",
    badge: "bg-cyan-100 text-cyan-700",
  },
  {
    card: "border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 via-pink-50/40 to-white hover:border-fuchsia-400",
    chip: "bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white",
    badge: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    card: "border-slate-300 bg-gradient-to-br from-slate-100 via-slate-50 to-white hover:border-slate-500",
    chip: "bg-gradient-to-br from-slate-700 to-slate-900 text-white",
    badge: "bg-slate-200 text-slate-700",
  },
];

export function getSubProjectSurface(colorIndex: number) {
  return SUB_PROJECT_PALETTE[colorIndex % SUB_PROJECT_PALETTE.length];
}
