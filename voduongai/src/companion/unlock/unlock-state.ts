/**
 * EPIC 02 — Sprint 05: Unlock State (localStorage MVP).
 * Thiết kế để dễ chuyển sang DB sau này — mọi hàm ở đây chỉ là I/O mỏng bọc
 * quanh các hàm THUẦN trong `unlock-engine.ts`. Khi chuyển sang Supabase,
 * chỉ cần thay lớp đọc/ghi này, không đổi engine/UI.
 */

import {
  EMPTY_MISSION_PROGRESS,
  isMissionConditionMet,
  markUsed,
  markViewed,
  nextAssetRuntimeStatus,
  type AssetRuntimeRecord,
  type MissionProgress,
} from "./unlock-engine";
import { getAssetsForMission } from "./unlock-assets";

const MISSION_PROGRESS_KEY = "companion-unlock-mission-progress";
const ASSET_STATE_KEY = "companion-unlock-asset-state";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // bỏ qua nếu localStorage không khả dụng
  }
}

function readAllMissionProgress(): Record<string, MissionProgress> {
  return readJson(MISSION_PROGRESS_KEY, {} as Record<string, MissionProgress>);
}

function readAllAssetRecords(): Record<string, AssetRuntimeRecord> {
  return readJson(ASSET_STATE_KEY, {} as Record<string, AssetRuntimeRecord>);
}

export function readMissionProgress(missionId: string): MissionProgress {
  return readAllMissionProgress()[missionId] ?? EMPTY_MISSION_PROGRESS;
}

export function markEvidenceLogged(missionId: string) {
  const all = readAllMissionProgress();
  all[missionId] = { ...(all[missionId] ?? EMPTY_MISSION_PROGRESS), evidenceLogged: true };
  writeJson(MISSION_PROGRESS_KEY, all);
}

export function markReflectionWritten(missionId: string) {
  const all = readAllMissionProgress();
  all[missionId] = { ...(all[missionId] ?? EMPTY_MISSION_PROGRESS), reflectionWritten: true };
  writeJson(MISSION_PROGRESS_KEY, all);
}

/**
 * Đánh giá lại toàn bộ asset của 1 Mission và LƯU LẠI transition
 * locked→available nếu điều kiện đã đạt — trả về danh sách assetId vừa
 * chuyển trạng thái lần này (để UI biết cần cho Companion thông báo).
 */
export function evaluateMissionUnlocks(missionId: string): string[] {
  const progress = readMissionProgress(missionId);
  const conditionMet = isMissionConditionMet(progress);
  const records = readAllAssetRecords();
  const justUnlocked: string[] = [];

  for (const asset of getAssetsForMission(missionId)) {
    const before = records[asset.id];
    const after = nextAssetRuntimeStatus(before, conditionMet, Date.now());
    if (after !== before) {
      records[asset.id] = after;
      if ((!before || before.status === "locked") && after.status === "available") {
        justUnlocked.push(asset.id);
      }
    }
  }

  writeJson(ASSET_STATE_KEY, records);
  return justUnlocked;
}

export function readAssetRuntimeStatus(assetId: string): AssetRuntimeRecord | undefined {
  return readAllAssetRecords()[assetId];
}

export function markAssetViewed(assetId: string) {
  const records = readAllAssetRecords();
  records[assetId] = markViewed(records[assetId], Date.now());
  writeJson(ASSET_STATE_KEY, records);
}

export function markAssetUsed(assetId: string) {
  const records = readAllAssetRecords();
  records[assetId] = markUsed(records[assetId], Date.now());
  writeJson(ASSET_STATE_KEY, records);
}

export function getAssetRecordsSnapshot(): Record<string, AssetRuntimeRecord> {
  return readAllAssetRecords();
}

export function getMissionProgressSnapshot(): Record<string, MissionProgress> {
  return readAllMissionProgress();
}
