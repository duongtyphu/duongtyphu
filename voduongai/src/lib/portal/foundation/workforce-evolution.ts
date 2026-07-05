/**
 * SPRINT F1 — Workforce Evolution Loop (PHASE 3 Finalization, EPIC 05).
 *
 * AI Workforce tự đánh giá và tiến bộ sau mỗi Goal — dựa trên dữ liệu
 * THẬT (Mission Package/QA Report của `mission-runtime.ts`), không phải
 * số liệu cảm tính. Không đổi Kernel/Runtime đã khóa — chỉ dùng lại
 * `setPerformanceScore()`/`setWorkingStatus()` đã có ở `workforce-registry.ts`
 * (retraining tận dụng state "maintenance" có sẵn trong Lifecycle đã
 * khóa từ Sprint 002 — không thêm state mới).
 *
 * 5 thành phần:
 *  - Reflection Engine     → recordCompanionReflection()
 *  - Improvement Engine    → computeImprovementPlan()
 *  - Retraining Engine     → triggerRetraining() / completeRetraining()
 *  - Performance History   → recordPerformanceSnapshot() / getPerformanceHistory()
 *  - Evolution Timeline    → getWorkforceEvolutionTimeline()
 */

import { getCompanion, setPerformanceScore, setWorkingStatus } from "./workforce-registry";

// ---- Performance History ----

export type PerformanceSnapshot = {
  employeeId: string;
  missionId: string;
  previousScore: number;
  delta: number;
  newScore: number;
  recordedAt: string;
};

const PERFORMANCE_KEY = "vdai_workforce_performance_history";

function readPerformanceHistory(): PerformanceSnapshot[] {
  try {
    const raw = window.localStorage.getItem(PERFORMANCE_KEY);
    return raw ? (JSON.parse(raw) as PerformanceSnapshot[]) : [];
  } catch {
    return [];
  }
}

function writePerformanceHistory(list: PerformanceSnapshot[]): void {
  try {
    window.localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(list));
  } catch {
    // không chặn nếu ghi lỗi
  }
}

/** Ghi 1 mốc Performance thật từ kết quả Mission (QA pass/fail + số issue
    còn mở) — accepted=true cộng điểm, ngược lại trừ điểm; luôn cập nhật
    thẳng vào `performanceScore` của Companion trong Registry. */
export function recordPerformanceSnapshot(
  employeeId: string,
  missionId: string,
  outcome: { accepted: boolean; qaIssueCount: number }
): PerformanceSnapshot {
  const companion = getCompanion(employeeId);
  if (!companion) throw new Error(`Không tìm thấy Companion "${employeeId}" trong Workforce Registry.`);

  const previousScore = companion.performanceScore;
  const delta = outcome.accepted ? Math.max(1, 5 - outcome.qaIssueCount) : -Math.max(3, 3 + outcome.qaIssueCount);
  const newScore = Math.max(0, Math.min(100, previousScore + delta));
  setPerformanceScore(employeeId, newScore);

  const snapshot: PerformanceSnapshot = { employeeId, missionId, previousScore, delta, newScore, recordedAt: new Date().toISOString() };
  writePerformanceHistory([...readPerformanceHistory(), snapshot]);
  return snapshot;
}

export function getPerformanceHistory(employeeId?: string): PerformanceSnapshot[] {
  const list = readPerformanceHistory();
  return employeeId ? list.filter((s) => s.employeeId === employeeId) : list;
}

// ---- Reflection Engine ----

export type CompanionReflection = {
  employeeId: string;
  missionId: string;
  strengths: string[];
  improvementAreas: string[];
  recordedAt: string;
};

const REFLECTION_KEY = "vdai_workforce_reflections";

function readReflections(): CompanionReflection[] {
  try {
    const raw = window.localStorage.getItem(REFLECTION_KEY);
    return raw ? (JSON.parse(raw) as CompanionReflection[]) : [];
  } catch {
    return [];
  }
}

function writeReflections(list: CompanionReflection[]): void {
  try {
    window.localStorage.setItem(REFLECTION_KEY, JSON.stringify(list));
  } catch {
    // không chặn nếu ghi lỗi
  }
}

/** Companion tự phản ánh sau 1 Mission — điểm mạnh/điểm cần cải thiện,
    lấy từ Mission Package thật (QA Report/Lessons Learned), không bịa. */
export function recordCompanionReflection(
  employeeId: string,
  missionId: string,
  reflection: { strengths: string[]; improvementAreas: string[] }
): CompanionReflection {
  const entry: CompanionReflection = { employeeId, missionId, ...reflection, recordedAt: new Date().toISOString() };
  writeReflections([...readReflections(), entry]);
  return entry;
}

export function getCompanionReflections(employeeId?: string): CompanionReflection[] {
  const list = readReflections();
  return employeeId ? list.filter((r) => r.employeeId === employeeId) : list;
}

// ---- Improvement Engine ----

export type ImprovementPlan = {
  employeeId: string;
  actions: string[]; // improvementArea nào lặp lại nhiều nhất, xếp trước
  basedOnReflections: number;
};

/** Tổng hợp mọi Reflection thật của 1 Companion thành kế hoạch cải thiện
    cụ thể — improvementArea lặp lại càng nhiều càng được ưu tiên trước,
    không có logic nào biết trước nội dung cụ thể (generic hoàn toàn). */
export function computeImprovementPlan(employeeId: string): ImprovementPlan {
  const reflections = getCompanionReflections(employeeId);
  const frequency = new Map<string, number>();
  for (const r of reflections) {
    for (const area of r.improvementAreas) frequency.set(area, (frequency.get(area) ?? 0) + 1);
  }
  const actions = [...frequency.entries()].sort((a, b) => b[1] - a[1]).map(([area]) => area);
  return { employeeId, actions, basedOnReflections: reflections.length };
}

// ---- Retraining Engine ----

export type RetrainingRecord = {
  employeeId: string;
  reason: string;
  status: "in_progress" | "completed";
  triggeredAt: string;
  completedAt?: string;
};

const RETRAINING_KEY = "vdai_workforce_retraining";

function readRetraining(): RetrainingRecord[] {
  try {
    const raw = window.localStorage.getItem(RETRAINING_KEY);
    return raw ? (JSON.parse(raw) as RetrainingRecord[]) : [];
  } catch {
    return [];
  }
}

function writeRetraining(list: RetrainingRecord[]): void {
  try {
    window.localStorage.setItem(RETRAINING_KEY, JSON.stringify(list));
  } catch {
    // không chặn nếu ghi lỗi
  }
}

/** Đưa Companion vào "maintenance" (state đã có sẵn trong Lifecycle
    khóa từ Sprint 002) để tái đào tạo — không thêm state mới. */
export function triggerRetraining(employeeId: string, reason: string): RetrainingRecord {
  setWorkingStatus(employeeId, "maintenance");
  const record: RetrainingRecord = { employeeId, reason, status: "in_progress", triggeredAt: new Date().toISOString() };
  writeRetraining([...readRetraining(), record]);
  return record;
}

/** Hoàn tất tái đào tạo — Companion quay lại "active", điểm Performance
    được cấp lại 1 mức khởi động (không phải reset về 50 tuỳ tiện — cộng
    thêm 1 mốc "recovered" để Performance History phản ánh đúng biến cố). */
export function completeRetraining(employeeId: string): RetrainingRecord | null {
  const list = readRetraining();
  const realIdx = list.map((r) => r.employeeId === employeeId && r.status === "in_progress").lastIndexOf(true);
  if (realIdx < 0) return null;
  const updated: RetrainingRecord = { ...list[realIdx], status: "completed", completedAt: new Date().toISOString() };
  list[realIdx] = updated;
  writeRetraining(list);
  setWorkingStatus(employeeId, "active");
  return updated;
}

export function getRetrainingHistory(employeeId?: string): RetrainingRecord[] {
  const list = readRetraining();
  return employeeId ? list.filter((r) => r.employeeId === employeeId) : list;
}

/** Vòng lặp tự tiến bộ: nếu performanceScore tụt dưới ngưỡng và Companion
    đang ở trạng thái làm việc được (active/busy/idle) — tự kích hoạt tái
    đào tạo, không cần Owner ra lệnh thủ công mỗi lần. */
export function maybeTriggerRetraining(employeeId: string, threshold = 40): RetrainingRecord | null {
  const companion = getCompanion(employeeId);
  if (!companion) return null;
  const retrainableStatuses = ["active", "busy", "idle"] as const;
  if (companion.performanceScore < threshold && (retrainableStatuses as readonly string[]).includes(companion.workingStatus)) {
    return triggerRetraining(employeeId, `performanceScore ${companion.performanceScore} dưới ngưỡng ${threshold}`);
  }
  return null;
}

// ---- Workforce Evolution Timeline ----

export type WorkforceEvolutionEvent = {
  employeeId: string;
  missionId?: string;
  kind: "performance" | "reflection" | "retraining_started" | "retraining_completed";
  summary: string;
  at: string;
};

/** Gộp Performance History + Reflection + Retraining thành 1 timeline
    theo thời gian thật — không suy diễn, chỉ đọc lại 3 nguồn dữ liệu
    trên. Lọc theo 1 Companion nếu truyền employeeId, ngược lại trả về
    toàn bộ Workforce. */
export function getWorkforceEvolutionTimeline(employeeId?: string): WorkforceEvolutionEvent[] {
  const events: WorkforceEvolutionEvent[] = [
    ...getPerformanceHistory(employeeId).map((s): WorkforceEvolutionEvent => ({
      employeeId: s.employeeId,
      missionId: s.missionId,
      kind: "performance",
      summary: `Performance ${s.previousScore} → ${s.newScore} (${s.delta >= 0 ? "+" : ""}${s.delta})`,
      at: s.recordedAt,
    })),
    ...getCompanionReflections(employeeId).map((r): WorkforceEvolutionEvent => ({
      employeeId: r.employeeId,
      missionId: r.missionId,
      kind: "reflection",
      summary: `Reflection: ${r.strengths.length} điểm mạnh, ${r.improvementAreas.length} điểm cần cải thiện`,
      at: r.recordedAt,
    })),
    ...getRetrainingHistory(employeeId).flatMap((r): WorkforceEvolutionEvent[] => {
      const items: WorkforceEvolutionEvent[] = [
        { employeeId: r.employeeId, kind: "retraining_started", summary: `Bắt đầu tái đào tạo: ${r.reason}`, at: r.triggeredAt },
      ];
      if (r.completedAt) items.push({ employeeId: r.employeeId, kind: "retraining_completed", summary: "Hoàn tất tái đào tạo, quay lại active", at: r.completedAt });
      return items;
    }),
  ];
  return events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}
