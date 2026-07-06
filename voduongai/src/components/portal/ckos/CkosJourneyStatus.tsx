"use client";

import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import { getJourneyProgress } from "@/lib/portal/foundation/growth-view";

// Continue Learning — reuses the same real, read-only engine as Companion
// Experience (P.3): `getJourneyProgress()` reads actual WorkspaceSession
// data, returns [] when the user has none. No new state, no fake numbers.
export function CkosJourneyStatus() {
  const journeys = getJourneyProgress();
  const active = journeys.find((j) => !j.isCompleted);

  return (
    <GemCard>
      <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">
        Continue Learning
      </p>
      {active ? (
        <>
          <p className="mt-2 text-sm font-semibold text-gray-900">{active.missionGoal}</p>
          <p className="mt-1 text-xs text-gray-500">Đã tạo {active.outputCount} kết quả trong hành trình này.</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-gray-500">
          Bạn chưa có hành trình học nào đang dang dở trong CKOS — bắt đầu từ Học viện AI.
        </p>
      )}
      <Button href="/portal/hocvienai" variant="secondary" className="mt-3">
        Tiếp tục học
      </Button>
    </GemCard>
  );
}
