"use client";

import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import { getJourneyProgress } from "@/lib/portal/foundation/growth-view";

// Shared "Continue Learning / Progress" card — reuses the real read-only
// engine (`getJourneyProgress()`, reads actual WorkspaceSession data, no
// fabricated numbers). Used by both CKOS and Academy pages with different
// copy/CTA, per Product Transformation Wave 1's "Learning/Progress" and
// "Empty State chuyên nghiệp" requirement on every pillar page.
export function JourneyStatusCard({
  eyebrow,
  emptyMessage,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  emptyMessage: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  const journeys = getJourneyProgress();
  const active = journeys.find((j) => !j.isCompleted);

  return (
    <GemCard variant="progress">
      <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">{eyebrow}</p>
      {active ? (
        <>
          <p className="mt-2 text-sm font-semibold text-gray-900">{active.missionGoal}</p>
          <p className="mt-1 text-xs text-gray-500">Đã tạo {active.outputCount} kết quả trong hành trình này.</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
      )}
      <Button href={ctaHref} variant="secondary" className="mt-3">
        {ctaLabel}
      </Button>
    </GemCard>
  );
}
