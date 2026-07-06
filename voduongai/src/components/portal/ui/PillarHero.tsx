import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/portal/ui/Button";

// Portal 3.0 — Product Transformation Wave 1.
//
// Shared hero band used across the 6 redesigned pillar pages (Dashboard,
// CKOS, Academy, Projects & Opportunities, Premium — Companion keeps its
// own bespoke Sanctuary hero, already distinct). One component = one shared
// design language; the `tone` gradient + copy give each page its own visual
// identity, per the brief's "Visual Identity riêng, cùng Design Language."
export type PillarTone = "brand" | "knowledge" | "learning" | "opportunity" | "value";

const TONE_GRADIENT: Record<PillarTone, string> = {
  brand: "linear-gradient(135deg, #2563EB 0%, #5B8CFF 45%, #7C3AED 100%)",
  knowledge: "linear-gradient(135deg, #4338CA 0%, #7C3AED 50%, #22D3EE 100%)",
  learning: "linear-gradient(135deg, #2563EB 0%, #0891B2 55%, #10B981 100%)",
  opportunity: "linear-gradient(135deg, #059669 0%, #0D9488 45%, #F59E0B 100%)",
  value: "linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #FBBF24 100%)",
};

export type PillarQuickAction = { label: string; href: string };

export function PillarHero({
  icon: Icon,
  tone,
  eyebrow,
  title,
  subtitle,
  quickActions,
}: {
  icon: LucideIcon;
  tone: PillarTone;
  eyebrow: string;
  title: string;
  subtitle: string;
  quickActions?: PillarQuickAction[];
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-7 text-white shadow-token-lg sm:p-10"
      style={{ backgroundImage: TONE_GRADIENT[tone] }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
      />
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.25em] text-white/70">{eyebrow}</p>
      <h1 className="relative mt-2 max-w-2xl text-2xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
      <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{subtitle}</p>
      {quickActions && quickActions.length > 0 ? (
        <div className="relative mt-6 flex flex-wrap gap-3">
          {quickActions.map((a, i) => (
            <Button key={a.href} href={a.href} variant={i === 0 ? "inverse" : "inverse-ghost"}>
              {a.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
