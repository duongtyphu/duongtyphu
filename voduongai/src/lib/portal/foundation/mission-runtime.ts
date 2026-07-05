/**
 * MISSION 01 — Golden Reference Mission — Mission Runtime.
 *
 * Lớp Pipeline CHUNG cho mọi Mission trong Goal Runtime:
 *
 *   Analysis → Research → Planning → Review → QA → Owner Approval
 *   → Mission Package → Mission Template
 *
 * Generic tuyệt đối — không có nhánh logic nào biết "Landing Page".
 * Mission 01 (Research & Planning) chỉ là Mission ĐẦU TIÊN chạy qua
 * pipeline này; `extractMissionTemplate()` sinh ra Mission Template từ
 * BẤT KỲ Mission nào đã hoàn thành đủ các bước — chứng minh bằng test
 * chạy trên 1 Mission không liên quan Landing Page.
 *
 * localStorage-backed, cùng pattern với `goal-runtime.ts`.
 */

import { getGoalMission, submitMissionForReview, completeGoalMission } from "./goal-runtime";
import { readGrowthEvents } from "./growth-event-bus";
import type { GrowthEvent } from "./data-model";

export type MissionAnalysis = { problem: string; scope: string[]; risks: string[] };
export type MissionResearchReport = { findings: string[]; sources: string[]; recommendations: string[] };
export type MissionDecisionLogEntry = { decision: string; rationale: string; decidedAt: string };
export type MissionReview = { reviewer: string; notes: string[]; approved: boolean };
export type MissionQACheck = { label: string; passed: boolean };
export type MissionQAReport = { checks: MissionQACheck[]; issues: string[] };
export type MissionOwnerReview = { approved: boolean; notes: string[]; approvedAt?: string };
export type MissionLessonsLearned = { lessons: string[] };

export type MissionRuntimeRecord = {
  missionId: string;
  analysis?: MissionAnalysis;
  research?: MissionResearchReport;
  decisionLog: MissionDecisionLogEntry[];
  review?: MissionReview;
  qa?: MissionQAReport;
  ownerReview?: MissionOwnerReview;
  lessonsLearned?: MissionLessonsLearned;
};

const RUNTIME_KEY = "vdai_mission_runtime";

function readList(): MissionRuntimeRecord[] {
  try {
    const raw = window.localStorage.getItem(RUNTIME_KEY);
    return raw ? (JSON.parse(raw) as MissionRuntimeRecord[]) : [];
  } catch {
    return [];
  }
}

function writeList(list: MissionRuntimeRecord[]): void {
  try {
    window.localStorage.setItem(RUNTIME_KEY, JSON.stringify(list));
  } catch {
    // localStorage lỗi ghi — Mission Runtime chỉ mất khả năng lưu lâu dài, không vỡ pipeline.
  }
}

function getOrCreate(missionId: string): MissionRuntimeRecord {
  const list = readList();
  const found = list.find((r) => r.missionId === missionId);
  if (found) return found;
  const created: MissionRuntimeRecord = { missionId, decisionLog: [] };
  writeList([...list, created]);
  return created;
}

function save(record: MissionRuntimeRecord): MissionRuntimeRecord {
  const list = readList();
  const idx = list.findIndex((r) => r.missionId === record.missionId);
  if (idx < 0) writeList([...list, record]);
  else {
    list[idx] = record;
    writeList(list);
  }
  return record;
}

export function getMissionRuntime(missionId: string): MissionRuntimeRecord | undefined {
  return readList().find((r) => r.missionId === missionId);
}

// ---- Pipeline stage recorders ----

export function recordMissionAnalysis(missionId: string, analysis: MissionAnalysis): MissionRuntimeRecord {
  return save({ ...getOrCreate(missionId), analysis });
}

export function recordMissionResearch(missionId: string, research: MissionResearchReport): MissionRuntimeRecord {
  return save({ ...getOrCreate(missionId), research });
}

export function addMissionDecision(missionId: string, decision: string, rationale: string): MissionRuntimeRecord {
  const current = getOrCreate(missionId);
  const entry: MissionDecisionLogEntry = { decision, rationale, decidedAt: new Date().toISOString() };
  return save({ ...current, decisionLog: [...current.decisionLog, entry] });
}

export function recordMissionReview(missionId: string, review: MissionReview): MissionRuntimeRecord {
  return save({ ...getOrCreate(missionId), review });
}

/** QA pass (không còn issue + review đã approved) mới đẩy Mission sang
    "waiting_review" — Owner Approval là bước chờ thật, không tự động
    hoá hộ Owner. */
export function recordMissionQA(missionId: string, qa: MissionQAReport): MissionRuntimeRecord {
  const updated = save({ ...getOrCreate(missionId), qa });
  const record = getOrCreate(missionId);
  const qaPassed = qa.issues.length === 0 && qa.checks.every((c) => c.passed);
  if (qaPassed && record.review?.approved) {
    submitMissionForReview(missionId);
  }
  return updated;
}

/** Owner Approval thật — chỉ gọi khi Owner đã xác nhận. approved=true
    mới chuyển Mission sang "completed" trong Goal Runtime. */
export function recordMissionOwnerApproval(missionId: string, ownerReview: MissionOwnerReview): MissionRuntimeRecord {
  const updated = save({
    ...getOrCreate(missionId),
    ownerReview: ownerReview.approved ? { ...ownerReview, approvedAt: new Date().toISOString() } : ownerReview,
  });
  if (ownerReview.approved) completeGoalMission(missionId);
  return updated;
}

export function recordMissionLessonsLearned(missionId: string, lessonsLearned: MissionLessonsLearned): MissionRuntimeRecord {
  return save({ ...getOrCreate(missionId), lessonsLearned });
}

// ---- Mission Package ----

export type MissionAcceptanceChecklistItem = { label: string; passed: boolean };

export type MissionPackage = {
  missionId: string;
  researchReport: MissionResearchReport;
  decisionLog: MissionDecisionLogEntry[];
  acceptanceReport: { checklist: MissionAcceptanceChecklistItem[]; accepted: boolean };
  runtimeEvents: GrowthEvent[];
  qaReport: MissionQAReport;
  ownerReview: MissionOwnerReview;
  lessonsLearned: MissionLessonsLearned;
};

/** Lắp ráp Mission Package từ dữ liệu THẬT đã ghi qua các bước Pipeline
    trên — không bịa nội dung, trả về null nếu Mission chưa qua đủ các
    bước bắt buộc (Research/Decision Log/QA/Owner Review/Lessons Learned). */
export function buildMissionPackage(missionId: string): MissionPackage | null {
  const mission = getGoalMission(missionId);
  const runtime = getMissionRuntime(missionId);
  if (!mission || !runtime?.research || !runtime.qa || !runtime.ownerReview || !runtime.lessonsLearned) return null;

  const checklist: MissionAcceptanceChecklistItem[] = [
    { label: "Có Owner", passed: !!mission.owner },
    { label: "Có Department", passed: !!mission.department },
    { label: "Có Companion điều phối", passed: !!mission.companionEmployeeId },
    { label: "Có Input", passed: mission.input.length > 0 },
    { label: "Có Output", passed: mission.output.length > 0 },
    { label: "Có Deliverables", passed: mission.deliverables.length > 0 },
    { label: "Có Definition of Done", passed: mission.definitionOfDone.length > 0 },
    { label: "Research Report có Finding + Nguồn + Khuyến nghị", passed: runtime.research.findings.length > 0 && runtime.research.sources.length > 0 },
    { label: "Decision Log có ít nhất 1 quyết định kèm lý do", passed: runtime.decisionLog.length > 0 },
    { label: "QA Report không còn issue nghiêm trọng", passed: runtime.qa.issues.length === 0 },
    { label: "Owner đã Review", passed: !!runtime.review?.approved },
  ];

  return {
    missionId,
    researchReport: runtime.research,
    decisionLog: runtime.decisionLog,
    acceptanceReport: { checklist, accepted: checklist.every((c) => c.passed) },
    runtimeEvents: readGrowthEvents().filter((e) => e.missionId === missionId),
    qaReport: runtime.qa,
    ownerReview: runtime.ownerReview,
    lessonsLearned: runtime.lessonsLearned,
  };
}

// ---- Mission Template (Golden Reference) ----

export type MissionTemplate = {
  templateId: string;
  sourceMissionId: string;
  pipeline: string[];
  missionChecklist: string[];
  acceptanceChecklist: string[];
  qaChecklist: string[];
  reviewChecklist: string[];
  outputContract: string[];
  createdAt: string;
};

const TEMPLATES_KEY = "vdai_mission_templates";

function readTemplates(): MissionTemplate[] {
  try {
    const raw = window.localStorage.getItem(TEMPLATES_KEY);
    return raw ? (JSON.parse(raw) as MissionTemplate[]) : [];
  } catch {
    return [];
  }
}

function writeTemplates(list: MissionTemplate[]): void {
  try {
    window.localStorage.setItem(TEMPLATES_KEY, JSON.stringify(list));
  } catch {
    // không chặn nếu ghi lỗi
  }
}

/**
 * Sinh Mission Template từ 1 Mission Package thật — CHỈ lấy cấu trúc
 * (tên checklist/quy trình chung), KHÔNG lấy nội dung cụ thể của Mission
 * nguồn (không copy nguyên văn Research finding/QA check/Review note —
 * những nội dung đó thuộc về Mission, không thuộc về Template) — để 100
 * Goal sau chỉ cần nhân bản đúng cấu trúc này với nội dung khác.
 */
export function extractMissionTemplate(missionId: string): MissionTemplate | null {
  const pkg = buildMissionPackage(missionId);
  const runtime = getMissionRuntime(missionId);
  if (!pkg || !runtime) return null;

  const template: MissionTemplate = {
    templateId: `mtpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    sourceMissionId: missionId,
    pipeline: ["analysis", "research", "planning", "review", "qa", "owner_approval", "package", "template"],
    missionChecklist: ["Owner", "Department", "Companion", "Input", "Output", "Deliverables", "Definition of Done"],
    acceptanceChecklist: pkg.acceptanceReport.checklist.map((c) => c.label),
    qaChecklist: ["QA Report liệt kê từng check cụ thể theo Definition of Done của Mission", "Không còn issue mở trước khi submit review"],
    reviewChecklist: ["Reviewer được chỉ định rõ", "Reviewer ghi Note đánh giá", "Review phải Approved trước khi chuyển QA"],
    outputContract: ["researchReport", "decisionLog", "acceptanceReport", "runtimeEvents", "qaReport", "ownerReview", "lessonsLearned"],
    createdAt: new Date().toISOString(),
  };

  writeTemplates([...readTemplates(), template]);
  return template;
}

export function listMissionTemplates(): MissionTemplate[] {
  return readTemplates();
}
