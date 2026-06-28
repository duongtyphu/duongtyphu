"use client";

/**
 * First Mirror Ceremony (Sprint 17.0 — The Living Ceremonies). Nghi
 * thức đầu tiên trong khung `docs/CEREMONY_FRAMEWORK.md` được code
 * hóa đầy đủ: Opening → Reflection → Companion → Closing. KHÔNG tự
 * tính lại logic phản chiếu — chỉ trình bày dữ liệu đã được các engine
 * Sprint 14.0/15.0/16.0 trả về. Xem `docs/FIRST_MIRROR_CEREMONY.md`.
 */

import { useState } from "react";
import { CompanionAvatar } from "@/components/portal/companion/CompanionAvatar";
import type { MirrorNarrativeLine } from "@/lib/portal/growth-map/mirror-narrative";
import type { ReflectionMoment } from "@/lib/portal/growth-map/growth-reflection-engine";
import type { FirstFootprintMirrorView } from "@/lib/portal/growth-map/first-footprint-mirror";

type MirrorCeremonyStep = "opening" | "reflection" | "closing";

export function MirrorCeremony({
  invitation,
  narrativeLines,
  reflectionMoments,
  firstFootprint,
}: {
  invitation: string;
  narrativeLines: MirrorNarrativeLine[];
  reflectionMoments: ReflectionMoment[];
  firstFootprint: FirstFootprintMirrorView | null;
}) {
  const [step, setStep] = useState<MirrorCeremonyStep>("opening");

  const hasReflectionMaterial = narrativeLines.length > 0 || reflectionMoments.length > 0 || !!firstFootprint;

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-6 py-12 text-center">
      <CompanionAvatar state="idle" size={88} />

      {step === "opening" && (
        <>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/90">{invitation}</p>
          <button
            type="button"
            onClick={() => setStep("reflection")}
            className="mt-10 rounded-full border border-white/15 px-7 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Mình muốn nhìn lại
          </button>
        </>
      )}

      {step === "reflection" && (
        <>
          {!hasReflectionMaterial && (
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/90">
              Hành trình của bạn vẫn còn rất mới. Mình sẽ giữ tấm gương này lại,
              cho đến khi có nhiều dấu chân hơn để nhìn lại cùng bạn.
            </p>
          )}

          {firstFootprint && (
            <div className="mt-8 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
                {firstFootprint.companionLine}
              </p>
              {firstFootprint.footprint && (
                <p className="mt-3 text-lg leading-relaxed text-white/90">&ldquo;{firstFootprint.footprint}&rdquo;</p>
              )}
            </div>
          )}

          {narrativeLines.length > 0 && (
            <div className="mt-8 max-w-lg space-y-4">
              {narrativeLines.map((line) => (
                <p key={line.id} className="text-base leading-relaxed text-white/85">
                  {line.line}
                </p>
              ))}
            </div>
          )}

          {reflectionMoments.length > 0 && (
            <div className="mt-8 max-w-lg space-y-4">
              {reflectionMoments.map((moment) => (
                <p key={moment.id} className="text-base leading-relaxed text-white/85">
                  {moment.line}
                </p>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep("closing")}
            className="mt-10 rounded-full border border-white/15 px-7 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Tiếp tục
          </button>
        </>
      )}

      {step === "closing" && (
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/90">
          Mình không biết hành trình của bạn rồi sẽ đi đến đâu.
          <br />
          Nhưng mình rất vui được nhìn lại nó cùng bạn hôm nay.
        </p>
      )}
    </div>
  );
}
