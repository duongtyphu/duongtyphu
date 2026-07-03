"use client";

/**
 * EPIC 02 — Sprint 05: Unlockable Assets Implementation™.
 * "Đang chờ mở khóa" — khu vực trong Mission page hiển thị Prompt Pack/
 * Checklist/Template thật, locked cho tới khi người dùng nộp Evidence VÀ
 * viết Reflection cho đúng Mission này. Trạng thái lưu qua localStorage
 * (MVP — xem `unlock-state.ts` để biết cách chuyển DB sau này).
 */

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useUnlockableAssets } from "@/companion/unlock/use-unlockable-assets";
import { readyToReceiveMessage } from "@/companion/unlock/companion-unlock-language";
import { AssetLockedCard } from "./AssetLockedCard";
import { AssetUnlockedCard } from "./AssetUnlockedCard";

export function MissionUnlockSection({ missionId }: { missionId: string }) {
  const {
    assets,
    progress,
    justUnlockedIds,
    confirmEvidence,
    submitReflection,
    viewAsset,
    consumeAsset,
    dismissJustUnlocked,
  } = useUnlockableAssets(missionId);
  const [reflectionDraft, setReflectionDraft] = useState("");

  if (assets.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Đang chờ mở khóa</p>

      {justUnlockedIds.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-700">{readyToReceiveMessage()}</p>
          <button
            type="button"
            onClick={dismissJustUnlocked}
            className="mt-2 text-xs font-medium text-emerald-600 underline-offset-2 hover:underline"
          >
            Đã xem
          </button>
        </div>
      )}

      {/* Evidence + Reflection — điều kiện mở khóa cho Mission này */}
      <div className="rounded-2xl border border-gray-100 bg-white/70 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          {progress.evidenceLogged ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          ) : (
            <Circle className="h-4 w-4 shrink-0 text-gray-300" />
          )}
          <span className={progress.evidenceLogged ? "text-gray-700" : "text-gray-500"}>Nộp Evidence</span>
          {!progress.evidenceLogged && (
            <button
              type="button"
              onClick={confirmEvidence}
              className="ml-auto rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
            >
              Mình đã thử rồi
            </button>
          )}
        </div>

        <div className="flex items-start gap-2 text-sm">
          {progress.reflectionWritten ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          ) : (
            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
          )}
          <div className="min-w-0 flex-1">
            <span className={progress.reflectionWritten ? "text-gray-700" : "text-gray-500"}>
              Viết Reflection
            </span>
            {!progress.reflectionWritten && (
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={reflectionDraft}
                  onChange={(e) => setReflectionDraft(e.target.value)}
                  placeholder="Điều gì bạn nhận ra sau khi thử Mission này?"
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  disabled={!reflectionDraft.trim()}
                  onClick={() => {
                    submitReflection();
                    setReflectionDraft("");
                  }}
                  className="shrink-0 rounded-lg gradient-surface px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Gửi Reflection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) =>
          asset.runtimeStatus === "locked" ? (
            <AssetLockedCard key={asset.id} asset={asset} />
          ) : (
            <AssetUnlockedCard
              key={asset.id}
              asset={asset}
              onView={() => viewAsset(asset.id)}
              onUse={() => consumeAsset(asset.id)}
            />
          )
        )}
      </div>
    </div>
  );
}
