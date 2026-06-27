export type GemBadgeTone = "free" | "premium" | "locked";

const toneClass: Record<GemBadgeTone, string> = {
  free: "gemos-badge-free",
  premium: "gemos-badge-premium",
  locked: "gemos-badge-locked",
};

const toneLabel: Record<GemBadgeTone, string> = {
  free: "Free",
  premium: "Premium",
  locked: "Khoá",
};

export function GemBadge({
  tone,
  children,
}: {
  tone: GemBadgeTone;
  children?: React.ReactNode;
}) {
  return <span className={`gemos-badge ${toneClass[tone]}`}>{children ?? toneLabel[tone]}</span>;
}
