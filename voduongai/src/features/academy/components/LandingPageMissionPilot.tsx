"use client";

/**
 * EPIC 02 — Sprint 05: pilot Mission "Tạo Landing Page đầu tiên" cho
 * Unlockable Assets Implementation™. Đây là Mission độc lập (không chiếu
 * từ CKOS Collection như các Journey khác) — dùng để chứng minh flow
 * Evidence + Reflection → Unlock Prompt Pack/Checklist/Template thật.
 */

import { Sparkles } from "lucide-react";
import { pushCompanionIntent } from "@/lib/portal/companion/orchestrator-intent";
import { MissionUnlockSection } from "@/components/portal/unlock/MissionUnlockSection";
import { LANDING_PAGE_MISSION_ID, LANDING_PAGE_MISSION_TITLE } from "@/companion/unlock/unlock-assets";

export function LandingPageMissionPilot() {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Mission</p>
        <h3 className="mt-1 text-lg font-extrabold text-gray-900">{LANDING_PAGE_MISSION_TITLE}</h3>
        <p className="mt-1 text-sm text-gray-500">
          Tự tay viết một Landing Page hoàn chỉnh — thử thật, sau đó nhận bộ công cụ Companion
          giữ riêng cho Mission này.
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          pushCompanionIntent({
            module: "academy",
            userGoal: LANDING_PAGE_MISSION_TITLE,
            currentContext: "Mission thực hành viết Landing Page đầu tiên.",
          })
        }
        className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Bắt đầu Mission
      </button>

      <MissionUnlockSection missionId={LANDING_PAGE_MISSION_ID} />
    </div>
  );
}
