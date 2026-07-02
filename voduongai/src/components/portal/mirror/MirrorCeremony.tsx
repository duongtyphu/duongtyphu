"use client";

/**
 * First Mirror Ceremony (Sprint 17.0 — The Living Ceremonies). Nghi
 * thức đầu tiên trong khung `docs/CEREMONY_FRAMEWORK.md` được code
 * hóa đầy đủ: Opening → Reflection → Companion → Closing. KHÔNG tự
 * tính lại logic phản chiếu — chỉ trình bày dữ liệu đã được các engine
 * Sprint 14.0/15.0/16.0 trả về. Xem `docs/FIRST_MIRROR_CEREMONY.md`.
 */

import { useState } from "react";
import { LivingCore } from "@/components/LivingCore";
import { OriginLineWhisper } from "@/components/portal/companion/OriginLineWhisper";
import type { MirrorNarrativeLine } from "@/lib/portal/growth-map/mirror-narrative";
import type { ReflectionMoment } from "@/lib/portal/growth-map/growth-reflection-engine";
import type { FirstFootprintMirrorView } from "@/lib/portal/growth-map/first-footprint-mirror";

type MirrorCeremonyStep = "opening" | "reflection" | "closing";

export function MirrorCeremony({
  invitation,
  narrativeLines,
  reflectionMoments,
  firstFootprint,
  quietSeasonLine = null,
  originLine = null,
}: {
  invitation: string;
  narrativeLines: MirrorNarrativeLine[];
  reflectionMoments: ReflectionMoment[];
  firstFootprint: FirstFootprintMirrorView | null;
  quietSeasonLine?: string | null;
  /**
   * Sprint 18.10 — Ceremony Context Adapter (NHIỆM VỤ 4). Origin Line đã
   * được gate ở server qua `getOriginLineFromCoreMemory("ceremony", ...)` —
   * component này chỉ quyết định CÓ NÊN thì thầm lại hay không (Frequency
   * Guard), và CHỈ khi mùa phản chiếu trống (`!hasReflectionMaterial`) —
   * không bao giờ thay thế nội dung phản chiếu thật của người dùng.
   */
  originLine?: string | null;
}) {
  const [step, setStep] = useState<MirrorCeremonyStep>("opening");

  const hasReflectionMaterial =
    narrativeLines.length > 0 || reflectionMoments.length > 0 || !!firstFootprint || !!quietSeasonLine;

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-6 py-12 text-center">
      <LivingCore size={128} state="idle" />

      {step === "opening" && (
        <>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-gray-800">{invitation}</p>
          <button
            type="button"
            onClick={() => setStep("reflection")}
            className="mt-10 rounded-full border border-white/15 px-7 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-white/30 hover:text-gray-900"
          >
            Mình muốn nhìn lại
          </button>
        </>
      )}

      {step === "reflection" && (
        <>
          {!hasReflectionMaterial && (
            <>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-gray-800">
                Hành trình của bạn vẫn còn rất mới. Mình sẽ giữ tấm gương này lại,
                cho đến khi có nhiều dấu chân hơn để nhìn lại cùng bạn.
              </p>
              <OriginLineWhisper context="mirror_of_growth" line={originLine} />
            </>
          )}

          {firstFootprint && (
            <div className="mt-8 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                {firstFootprint.companionLine}
              </p>
              {firstFootprint.footprint && (
                <p className="mt-3 text-lg leading-relaxed text-gray-800">&ldquo;{firstFootprint.footprint}&rdquo;</p>
              )}
            </div>
          )}

          {narrativeLines.length > 0 && (
            <div className="mt-8 max-w-lg space-y-4">
              {narrativeLines.map((line) => (
                <p key={line.id} className="text-base leading-relaxed text-gray-900/85">
                  {line.line}
                </p>
              ))}
            </div>
          )}

          {reflectionMoments.length > 0 && (
            <div className="mt-8 max-w-lg space-y-4">
              {reflectionMoments.map((moment) => (
                <p key={moment.id} className="text-base leading-relaxed text-gray-900/85">
                  {moment.line}
                </p>
              ))}
            </div>
          )}

          {quietSeasonLine && (
            <p className="mt-8 max-w-lg text-base italic leading-relaxed text-gray-600">{quietSeasonLine}</p>
          )}

          <button
            type="button"
            onClick={() => setStep("closing")}
            className="mt-10 rounded-full border border-white/15 px-7 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-white/30 hover:text-gray-900"
          >
            Tiếp tục
          </button>
        </>
      )}

      {step === "closing" && (
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-gray-800">
          Mình không biết hành trình của bạn rồi sẽ đi đến đâu.
          <br />
          Nhưng mình rất vui được nhìn lại nó cùng bạn hôm nay.
        </p>
      )}
    </div>
  );
}
