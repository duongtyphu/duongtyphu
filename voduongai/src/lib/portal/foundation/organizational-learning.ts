/**
 * SPRINT F2 — Organizational Learning Engine (PHASE 3 Finalization, EPIC 05).
 *
 * F1 (Workforce Evolution Loop) làm cho TỪNG Companion tự đánh giá và
 * tiến bộ. F2 làm cho TOÀN BỘ tổ chức học — tổng hợp bài học từ nhiều
 * Mission/Companion/Department thành tri thức dùng chung, không riêng
 * của 1 Companion.
 *
 * Không đổi Kernel/Blueprint đã khóa: `GOLDEN_MISSIONS` (mission-catalog.ts)
 * KHÔNG bị sửa trực tiếp — Blueprint Improvement chỉ là 1 lớp đề xuất
 * (proposal) THÊM VÀO bên cạnh, chờ Owner duyệt riêng, đúng nguyên tắc
 * "không thay đổi kiến trúc/Blueprint đã khóa" của GOAL 001.
 *
 * 5 thành phần:
 *  - Best Practice Engine      → promoteBestPractice() / listBestPractices()
 *  - Blueprint Improvement     → suggestBlueprintImprovement() / listBlueprintImprovements()
 *  - Knowledge Evolution       → summarizeKnowledgeEvolution()
 *  - Cross Department Learning → shareCrossDepartmentLearning() / listCrossDepartmentShares()
 *  - Organizational Memory     → getOrganizationalMemoryTimeline()
 */

import type { DepartmentId } from "./workforce-registry";
import type { GoldenMissionId } from "./mission-catalog";
import { listMemoryEntries } from "./memory-store";

// ---- Best Practice Engine ----

export type BestPracticeRecord = {
  practiceId: string;
  practice: string;
  evidenceMissionIds: string[]; // Mission thật đã chứng minh best practice này đúng (Mission Package accepted=true)
  department?: DepartmentId;
  createdAt: string;
};

const BEST_PRACTICE_KEY = "vdai_org_best_practices";

function readBestPractices(): BestPracticeRecord[] {
  try {
    const raw = window.localStorage.getItem(BEST_PRACTICE_KEY);
    return raw ? (JSON.parse(raw) as BestPracticeRecord[]) : [];
  } catch {
    return [];
  }
}

function writeBestPractices(list: BestPracticeRecord[]): void {
  try {
    window.localStorage.setItem(BEST_PRACTICE_KEY, JSON.stringify(list));
  } catch {
    // không chặn nếu ghi lỗi
  }
}

/** Đưa 1 bài học đã CHỨNG MINH được (từ Mission Package thật đã accepted)
    thành Best Practice dùng chung cho tổ chức — luôn phải gắn với ít
    nhất 1 Mission làm bằng chứng, không được suy diễn không căn cứ. */
export function promoteBestPractice(practice: string, evidenceMissionIds: string[], department?: DepartmentId): BestPracticeRecord {
  if (evidenceMissionIds.length === 0) {
    throw new Error("Best Practice phải có ít nhất 1 Nhiệm vụ làm bằng chứng — không được suy diễn không căn cứ.");
  }
  const record: BestPracticeRecord = {
    practiceId: `bp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    practice,
    evidenceMissionIds,
    department,
    createdAt: new Date().toISOString(),
  };
  writeBestPractices([...readBestPractices(), record]);
  return record;
}

export function listBestPractices(department?: DepartmentId): BestPracticeRecord[] {
  const list = readBestPractices();
  return department ? list.filter((p) => p.department === department) : list;
}

// ---- Blueprint Improvement ----

export type BlueprintImprovementSuggestion = {
  suggestionId: string;
  blueprintMissionId: GoldenMissionId;
  suggestion: string;
  basedOnMissionId: string; // Mission Runtime thật đã phát hiện ra đề xuất này (Lessons Learned/QA Report)
  status: "proposed" | "accepted" | "rejected";
  createdAt: string;
  decidedAt?: string;
};

const BLUEPRINT_IMPROVEMENT_KEY = "vdai_org_blueprint_improvements";

function readBlueprintImprovements(): BlueprintImprovementSuggestion[] {
  try {
    const raw = window.localStorage.getItem(BLUEPRINT_IMPROVEMENT_KEY);
    return raw ? (JSON.parse(raw) as BlueprintImprovementSuggestion[]) : [];
  } catch {
    return [];
  }
}

function writeBlueprintImprovements(list: BlueprintImprovementSuggestion[]): void {
  try {
    window.localStorage.setItem(BLUEPRINT_IMPROVEMENT_KEY, JSON.stringify(list));
  } catch {
    // không chặn nếu ghi lỗi
  }
}

/** Đề xuất cải thiện 1 Golden Blueprint đã khóa — KHÔNG sửa
    `GOLDEN_MISSIONS` trực tiếp, chỉ ghi đề xuất chờ Owner duyệt riêng
    (`decideBlueprintImprovement`). */
export function suggestBlueprintImprovement(blueprintMissionId: GoldenMissionId, suggestion: string, basedOnMissionId: string): BlueprintImprovementSuggestion {
  const record: BlueprintImprovementSuggestion = {
    suggestionId: `bpi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    blueprintMissionId,
    suggestion,
    basedOnMissionId,
    status: "proposed",
    createdAt: new Date().toISOString(),
  };
  writeBlueprintImprovements([...readBlueprintImprovements(), record]);
  return record;
}

export function decideBlueprintImprovement(suggestionId: string, decision: "accepted" | "rejected"): BlueprintImprovementSuggestion | null {
  const list = readBlueprintImprovements();
  const idx = list.findIndex((s) => s.suggestionId === suggestionId);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], status: decision, decidedAt: new Date().toISOString() };
  writeBlueprintImprovements(list);
  return list[idx];
}

export function listBlueprintImprovements(blueprintMissionId?: GoldenMissionId): BlueprintImprovementSuggestion[] {
  const list = readBlueprintImprovements();
  return blueprintMissionId ? list.filter((s) => s.blueprintMissionId === blueprintMissionId) : list;
}

// ---- Knowledge Evolution ----

export type KnowledgeEvolutionSummary = {
  totalMemoryEntries: number;
  totalBestPractices: number;
  totalBlueprintImprovements: { proposed: number; accepted: number; rejected: number };
  latestUpdateAt: string | null;
};

/** Đọc lại 3 nguồn tri thức thật (Memory Store/Best Practice/Blueprint
    Improvement) để trả lời: tổ chức đã tích luỹ được bao nhiêu tri thức
    — không đếm trùng, không suy diễn. */
export function summarizeKnowledgeEvolution(): KnowledgeEvolutionSummary {
  const memory = listMemoryEntries();
  const bestPractices = readBestPractices();
  const improvements = readBlueprintImprovements();

  const timestamps = [
    ...memory.map((m) => m.createdAt),
    ...bestPractices.map((b) => b.createdAt),
    ...improvements.map((i) => i.createdAt),
  ].sort();

  return {
    totalMemoryEntries: memory.length,
    totalBestPractices: bestPractices.length,
    totalBlueprintImprovements: {
      proposed: improvements.filter((i) => i.status === "proposed").length,
      accepted: improvements.filter((i) => i.status === "accepted").length,
      rejected: improvements.filter((i) => i.status === "rejected").length,
    },
    latestUpdateAt: timestamps.length ? timestamps[timestamps.length - 1] : null,
  };
}

// ---- Cross Department Learning ----

export type CrossDepartmentShare = {
  shareId: string;
  practiceId: string; // tham chiếu BestPracticeRecord thật, không copy nội dung
  fromDepartment: DepartmentId;
  toDepartments: DepartmentId[];
  sharedAt: string;
};

const CROSS_DEPT_KEY = "vdai_org_cross_department_shares";

function readCrossDepartmentShares(): CrossDepartmentShare[] {
  try {
    const raw = window.localStorage.getItem(CROSS_DEPT_KEY);
    return raw ? (JSON.parse(raw) as CrossDepartmentShare[]) : [];
  } catch {
    return [];
  }
}

function writeCrossDepartmentShares(list: CrossDepartmentShare[]): void {
  try {
    window.localStorage.setItem(CROSS_DEPT_KEY, JSON.stringify(list));
  } catch {
    // không chặn nếu ghi lỗi
  }
}

/** Chia sẻ 1 Best Practice thật (đã có bằng chứng Mission) sang các
    Department khác — tham chiếu bằng `practiceId`, không copy nội dung
    (Single Source of Truth, giống nguyên tắc Memory/Portfolio). */
export function shareCrossDepartmentLearning(practiceId: string, fromDepartment: DepartmentId, toDepartments: DepartmentId[]): CrossDepartmentShare {
  const practice = readBestPractices().find((p) => p.practiceId === practiceId);
  if (!practice) throw new Error(`Không tìm thấy Best Practice "${practiceId}" — phải chia sẻ Best Practice đã có thật.`);
  const record: CrossDepartmentShare = {
    shareId: `xds_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    practiceId,
    fromDepartment,
    toDepartments,
    sharedAt: new Date().toISOString(),
  };
  writeCrossDepartmentShares([...readCrossDepartmentShares(), record]);
  return record;
}

export function listCrossDepartmentShares(department?: DepartmentId): CrossDepartmentShare[] {
  const list = readCrossDepartmentShares();
  return department ? list.filter((s) => s.fromDepartment === department || s.toDepartments.includes(department)) : list;
}

// ---- Organizational Memory (Timeline hợp nhất) ----

export type OrganizationalMemoryEvent = {
  kind: "memory" | "best_practice" | "blueprint_improvement" | "cross_department_share";
  summary: string;
  at: string;
};

/** Gộp Memory Store + Best Practice + Blueprint Improvement + Cross
    Department Share thành 1 timeline tri thức tổ chức duy nhất, theo
    đúng thời gian thật — không tạo bảng lưu trữ song song, chỉ đọc lại
    4 nguồn đã có. */
export function getOrganizationalMemoryTimeline(): OrganizationalMemoryEvent[] {
  const events: OrganizationalMemoryEvent[] = [
    ...listMemoryEntries().map((m): OrganizationalMemoryEvent => ({
      kind: "memory",
      summary: `Memory: ${m.knowledge}`,
      at: m.createdAt,
    })),
    ...readBestPractices().map((b): OrganizationalMemoryEvent => ({
      kind: "best_practice",
      summary: `Best Practice: ${b.practice}`,
      at: b.createdAt,
    })),
    ...readBlueprintImprovements().map((i): OrganizationalMemoryEvent => ({
      kind: "blueprint_improvement",
      summary: `Đề xuất cải thiện Quy trình AI (${i.status}): ${i.suggestion}`,
      at: i.createdAt,
    })),
    ...readCrossDepartmentShares().map((s): OrganizationalMemoryEvent => ({
      kind: "cross_department_share",
      summary: `Chia sẻ Best Practice từ ${s.fromDepartment} sang ${s.toDepartments.join(", ")}`,
      at: s.sharedAt,
    })),
  ];
  return events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}
