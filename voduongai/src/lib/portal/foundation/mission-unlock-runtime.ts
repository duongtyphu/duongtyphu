/**
 * EPIC 03 — Phase 2 (B4 hoàn thiện): Unlock Runtime.
 *
 * Đánh giá `MissionUnlockCondition` (mission-catalog.ts) dựa trên
 * `WorkspaceSession` đã hoàn thành + `CapabilityProfile` thật
 * (capability-engine.ts) — phát `MISSION_UNLOCKED` khi 1 Mission chuyển
 * từ khoá sang mở, lưu `UnlockRecord` (append-only, không lặp lại).
 *
 * Điều hòa với `unlock-engine.ts` cũ (`src/companion/unlock/`): hệ cũ mở
 * khóa TÀI SẢN (Prompt Pack/Checklist/Template) bên trong 1 Mission Pilot
 * cụ thể (Evidence tự khai + Reflection). Hệ mới ở đây mở khóa MISSION
 * TIẾP THEO trong Mission Catalog, dựa trên Mission đã hoàn thành + năng
 * lực thật. Hai tầng khác nhau, không dẫm chân nhau (đã ghi nhận ranh
 * giới này ở `EPIC03_BLUEPRINT_LOCK.md` mục 4.2) — không sửa
 * `unlock-engine.ts` cũ.
 */

import { listAllSessions } from "./workspace-session-store";
import { computeCapabilityProfiles } from "./capability-engine";
import { GOLDEN_MISSIONS, type GoldenMissionId, type MissionUnlockCondition } from "./mission-catalog";
import { emitGrowthEvent } from "./growth-event-bus";

const UNLOCK_RECORDS_KEY = "vdai_mission_unlock_records";

export type MissionUnlockRecord = {
  missionId: GoldenMissionId;
  unlockedAt: string;
};

function readRecords(): MissionUnlockRecord[] {
  try {
    const raw = window.localStorage.getItem(UNLOCK_RECORDS_KEY);
    return raw ? (JSON.parse(raw) as MissionUnlockRecord[]) : [];
  } catch {
    return [];
  }
}

function writeRecords(records: MissionUnlockRecord[]) {
  try {
    window.localStorage.setItem(UNLOCK_RECORDS_KEY, JSON.stringify(records));
  } catch {
    // localStorage đầy/không khả dụng — Unlock Record chỉ mất khả năng lưu lâu dài.
  }
}

function evaluateCondition(
  condition: MissionUnlockCondition,
  completedMissionIds: Set<string>,
  capabilityLevelByCompetency: Map<string, number>
): boolean {
  switch (condition.type) {
    case "none":
      return true;
    case "requiresMission":
      return condition.missionIds.every((id) => completedMissionIds.has(id));
    case "requiresCapability":
      return (capabilityLevelByCompetency.get(condition.competencyId) ?? 0) >= condition.minLevel;
    case "requiresAny":
      return condition.conditions.some((c) => evaluateCondition(c, completedMissionIds, capabilityLevelByCompetency));
    default:
      return false;
  }
}

export type MissionUnlockStatus = {
  missionId: GoldenMissionId;
  missionName: string;
  isUnlocked: boolean;
};

/** Unlock Runtime — trạng thái mở khóa THẬT của 10 Golden Mission, tính
    từ Session đã hoàn thành + Capability Profile thật, KHÔNG dựa trên
    "đã xem Video" hay bất kỳ dữ liệu tĩnh nào. */
export function getMissionUnlockStatuses(): MissionUnlockStatus[] {
  const sessions = listAllSessions();
  const completedMissionIds = new Set(
    sessions.filter((s) => s.status === "completed" && s.context.missionId).map((s) => s.context.missionId as string)
  );
  const capabilityLevelByCompetency = new Map(computeCapabilityProfiles().map((p) => [p.capabilityId, p.currentLevel]));

  return GOLDEN_MISSIONS.map((mission) => ({
    missionId: mission.missionId,
    missionName: mission.missionName,
    isUnlocked: evaluateCondition(mission.unlockCondition, completedMissionIds, capabilityLevelByCompetency),
  }));
}

/**
 * So sánh trạng thái Unlock hiện tại với `UnlockRecord` đã lưu — Mission
 * nào MỚI chuyển sang mở (chưa từng ghi nhận) thì lưu record + phát
 * `MISSION_UNLOCKED`. Append-only, không lặp lại thông báo cho cùng 1
 * Mission đã mở khóa trước đó.
 */
export function recordNewUnlocks(): MissionUnlockRecord[] {
  const statuses = getMissionUnlockStatuses();
  const existing = readRecords();
  const alreadyUnlocked = new Set(existing.map((r) => r.missionId));
  const now = new Date().toISOString();
  const newlyUnlocked: MissionUnlockRecord[] = [];

  for (const status of statuses) {
    if (status.isUnlocked && !alreadyUnlocked.has(status.missionId)) {
      const record: MissionUnlockRecord = { missionId: status.missionId, unlockedAt: now };
      newlyUnlocked.push(record);
      emitGrowthEvent({ eventType: "MISSION_UNLOCKED", missionId: status.missionId });
    }
  }

  if (newlyUnlocked.length > 0) writeRecords([...existing, ...newlyUnlocked]);
  return newlyUnlocked;
}

export function listUnlockRecords(): MissionUnlockRecord[] {
  return readRecords();
}
