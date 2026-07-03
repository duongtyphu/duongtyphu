/**
 * EPIC 02 — Sprint 05: Unlock Engine (pure, testable — no localStorage here).
 * Xem `docs/UNLOCK_RULE_STANDARD.md` cho thiết kế gốc (TriggerSpec/UnlockRule).
 * Sprint 05 implement đúng 1 trigger: `mission-evidence-and-reflection`.
 */

import type { UnlockableAsset, UnlockAssetStatus } from "./unlock.types";

export type MissionProgress = {
  evidenceLogged: boolean;
  reflectionWritten: boolean;
};

export type AssetRuntimeRecord = {
  status: UnlockAssetStatus;
  unlockedAt?: number;
  viewedAt?: number;
  usedAt?: number;
};

export const EMPTY_MISSION_PROGRESS: MissionProgress = {
  evidenceLogged: false,
  reflectionWritten: false,
};

export function isMissionConditionMet(progress: MissionProgress): boolean {
  return progress.evidenceLogged && progress.reflectionWritten;
}

/**
 * Chuyển trạng thái 1 asset — KHÔNG BAO GIỜ downgrade (locked chỉ có thể đi
 * lên, không quay lại locked sau khi available/unlocked/completed). Nếu
 * chưa có record, khởi tạo theo điều kiện đã đạt hay chưa.
 */
export function nextAssetRuntimeStatus(
  current: AssetRuntimeRecord | undefined,
  conditionMet: boolean,
  now: number
): AssetRuntimeRecord {
  if (!current) {
    return conditionMet ? { status: "available", unlockedAt: now } : { status: "locked" };
  }
  if (current.status === "locked" && conditionMet) {
    return { ...current, status: "available", unlockedAt: now };
  }
  return current;
}

export function markViewed(current: AssetRuntimeRecord | undefined, now: number): AssetRuntimeRecord {
  const base = current ?? { status: "locked" as UnlockAssetStatus };
  if (base.status !== "available") return base;
  return { ...base, status: "unlocked", viewedAt: now };
}

export function markUsed(current: AssetRuntimeRecord | undefined, now: number): AssetRuntimeRecord {
  const base = current ?? { status: "locked" as UnlockAssetStatus };
  if (base.status !== "unlocked") return base;
  return { ...base, status: "completed", usedAt: now };
}

export type AssetWithRuntimeStatus = UnlockableAsset & { runtimeStatus: UnlockAssetStatus };

/**
 * Trộn định nghĩa asset (tĩnh) với trạng thái thật của người dùng (runtime)
 * — asset.status (field tĩnh trong data) chỉ là giá trị khởi tạo mặc định,
 * `runtimeStatus` mới là trạng thái hiển thị thật.
 */
export function withRuntimeStatus(
  assets: UnlockableAsset[],
  records: Record<string, AssetRuntimeRecord>,
  missionProgress: Record<string, MissionProgress>
): AssetWithRuntimeStatus[] {
  return assets.map((asset) => {
    const progress = missionProgress[asset.relatedMissionId] ?? EMPTY_MISSION_PROGRESS;
    const conditionMet = isMissionConditionMet(progress);
    const record = nextAssetRuntimeStatus(records[asset.id], conditionMet, Date.now());
    return { ...asset, runtimeStatus: record.status };
  });
}
