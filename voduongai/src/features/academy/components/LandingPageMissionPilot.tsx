"use client";

/**
 * EPIC 02 — Sprint 05: pilot Mission "Tạo Landing Page đầu tiên" cho
 * Unlockable Assets Implementation™. Đây là Mission độc lập (không chiếu
 * từ CKOS Collection như các Journey khác) — dùng để chứng minh flow
 * Evidence + Reflection → Unlock Prompt Pack/Checklist/Template thật.
 */

"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { startCompanionWorkspace } from "@/lib/portal/companion-workspace";
import { MissionUnlockSection } from "@/components/portal/unlock/MissionUnlockSection";
import { LANDING_PAGE_MISSION_ID, LANDING_PAGE_MISSION_TITLE } from "@/companion/unlock/unlock-assets";

export function LandingPageMissionPilot() {
  const router = useRouter();
  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Nhiệm vụ</p>
        <h3 className="mt-1 text-lg font-extrabold text-gray-900">{LANDING_PAGE_MISSION_TITLE}</h3>
        <p className="mt-1 text-sm text-gray-500">
          Tự tay viết một Landing Page hoàn chỉnh — thử thật, sau đó nhận bộ công cụ Companion
          giữ riêng cho Nhiệm vụ này.
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          router.push(
            startCompanionWorkspace({
              module: "academy",
              source: "academy-mission-pilot",
              itemId: LANDING_PAGE_MISSION_ID,
              itemType: "mission",
              title: LANDING_PAGE_MISSION_TITLE,
              userGoal: LANDING_PAGE_MISSION_TITLE,
              expectedOutput: "Nhiệm vụ thực hành viết Landing Page đầu tiên.",
              // Phase 2 (B2 hoàn thiện) — gắn đúng Golden Reference Mission thật
              // (mission-catalog.ts) để Capability/Unlock Runtime đo đúng
              // Competency "AI Writing", không suy ra từ module như trước.
              missionId: "viet-landing-page",
            })
          )
        }
        className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Bắt đầu Nhiệm vụ
      </button>

      <MissionUnlockSection missionId={LANDING_PAGE_MISSION_ID} />
    </div>
  );
}
