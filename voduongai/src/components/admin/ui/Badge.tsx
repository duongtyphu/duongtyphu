const tones: Record<string, string> = {
  green: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  orange: "bg-brand-orange/15 text-brand-orange border-brand-orange/30",
  red: "bg-red-500/15 text-red-300 border-red-400/30",
  blue: "bg-brand-blue/15 text-blue-300 border-brand-blue/30",
  violet: "bg-brand-violet/15 text-brand-violet border-brand-violet/30",
  gray: "bg-white/10 text-white/60 border-white/15",
};

export function Badge({ tone = "gray", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export const STATUS_TONE: Record<string, keyof typeof tones> = {
  Published: "green",
  Active: "green",
  Draft: "gray",
  Hidden: "red",
  Inactive: "red",
  New: "blue",
  Contacted: "orange",
  Converted: "green",
  Blocked: "red",
  // CKOS knowledge lifecycle (ADM-SPR-003) — additive only, existing keys unchanged.
  "In Review": "blue",
  "Changes Requested": "orange",
  Approved: "violet",
  Archived: "red",
  // Website Page lifecycle (WEB-SPR-002) — additive only, existing keys unchanged.
  Review: "blue",
};
