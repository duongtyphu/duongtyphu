const TONE_CLASS: Record<string, string> = {
  skill: "bg-blue-50 text-blue-600",
  tool: "bg-violet-50 text-violet-600",
  scenario: "bg-amber-50 text-amber-700",
};

/** Pill hiển thị 1 tag chuẩn hoá (Skill/AI Tool/Scenario) — không phải tag tự do. */
export function TagPill({ label, tone }: { label: string; tone: "skill" | "tool" | "scenario" }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASS[tone]}`}>{label}</span>
  );
}
