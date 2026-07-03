"use client";

/**
 * EPIC 02 — Sprint 05: hook client cho Unlockable Assets — bọc quanh
 * `unlock-state.ts` (localStorage MVP, thiết kế để chuyển DB sau).
 */

import { useMemo, useState } from "react";
import { getAssetsForMission } from "./unlock-assets";
import {
  evaluateMissionUnlocks,
  getAssetRecordsSnapshot,
  getMissionProgressSnapshot,
  markAssetUsed,
  markAssetViewed,
  markEvidenceLogged,
  markReflectionWritten,
  readMissionProgress,
} from "./unlock-state";
import { withRuntimeStatus, type AssetWithRuntimeStatus } from "./unlock-engine";

export function useUnlockableAssets(missionId: string) {
  const [tick, setTick] = useState(0);
  const [justUnlockedIds, setJustUnlockedIds] = useState<string[]>([]);

  const assets: AssetWithRuntimeStatus[] = useMemo(() => {
    const records = getAssetRecordsSnapshot();
    const progress = getMissionProgressSnapshot();
    return withRuntimeStatus(getAssetsForMission(missionId), records, progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId, tick]);

  const progress = useMemo(
    () => readMissionProgress(missionId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [missionId, tick]
  );

  function refresh() {
    setTick((t) => t + 1);
  }

  function confirmEvidence() {
    markEvidenceLogged(missionId);
    const unlocked = evaluateMissionUnlocks(missionId);
    if (unlocked.length > 0) setJustUnlockedIds(unlocked);
    refresh();
  }

  function submitReflection() {
    markReflectionWritten(missionId);
    const unlocked = evaluateMissionUnlocks(missionId);
    if (unlocked.length > 0) setJustUnlockedIds(unlocked);
    refresh();
  }

  function viewAsset(assetId: string) {
    markAssetViewed(assetId);
    refresh();
  }

  function consumeAsset(assetId: string) {
    markAssetUsed(assetId);
    refresh();
  }

  function dismissJustUnlocked() {
    setJustUnlockedIds([]);
  }

  return {
    assets,
    progress,
    justUnlockedIds,
    confirmEvidence,
    submitReflection,
    viewAsset,
    consumeAsset,
    dismissJustUnlocked,
  };
}
