/**
 * GOAL 001 — Goal Runtime.
 *
 * Lớp Runtime CHUNG cho mọi Goal Owner giao cho VO DUONG AI (Landing
 * Page Production là Goal ĐẦU TIÊN, không phải Goal duy nhất — hàm
 * `seedLandingPageProductionGoal()` chỉ là 1 lần gieo dữ liệu bằng cấu
 * trúc chung, không có logic nào trong file này biết/hard-code "Landing
 * Page").
 *
 * Phân cấp: Goal → Epic → Mission. Mỗi Mission khi Owner bắt đầu làm sẽ
 * tạo/link vào đúng 1 `WorkspaceSessionRecord` đã có (Kernel Sprint B2,
 * không đổi) — Task/Output/Review/Approval/Portfolio tái dùng NGUYÊN
 * VẸN Runtime đã xây ở Sprint 003, không xây lại. `WorkspaceContext.missionId`
 * (field đã có sẵn) mang chính `missionId` của Goal Runtime này — không
 * cần field mới trong Kernel.
 *
 * localStorage-backed, cùng pattern static+overlay đã dùng ở
 * `workforce-registry.ts`/`portfolio-store.ts`.
 */

import type { DepartmentId } from "./workforce-registry";
import { emitGrowthEvent } from "./growth-event-bus";

export type GoalStatus = "draft" | "active" | "completed" | "archived";
export type MissionStatus = "not_started" | "in_progress" | "waiting_review" | "completed";
export type GoalPriority = "low" | "medium" | "high";

/** Tiến độ Mission theo giai đoạn thô (không phải % Task chi tiết —
    Sprint này chưa theo dõi từng Task riêng lẻ trong 1 Mission, chỉ
    theo trạng thái tổng). */
const MISSION_STATUS_PROGRESS: Record<MissionStatus, number> = {
  not_started: 0,
  in_progress: 25,
  waiting_review: 75,
  completed: 100,
};

export type GoalRecord = {
  goalId: string;
  title: string;
  status: GoalStatus;
  createdAt: string;
  /** P0 Goal Creation — do User tự nhập khi tạo Goal mới (`createGoalDraft`),
      rỗng/undefined cho Goal gieo sẵn qua `seedLandingPageProductionGoal()`. */
  description?: string;
  goalType?: string;
  priority?: GoalPriority;
  expectedDeliverable?: string;
  dueDate?: string;
};

export type EpicRecord = {
  epicId: string;
  goalId: string;
  title: string;
  status: GoalStatus;
  createdAt: string;
};

export type GoalMissionRecord = {
  missionId: string;
  epicId: string;
  title: string;
  owner: string; // Owner (người dùng) — hệ thống hiện là single-owner per browser, chưa có multi-user backend thật
  department: DepartmentId;
  companionEmployeeId: string;
  input: string[];
  output: string[];
  deliverables: string[];
  definitionOfDone: string[];
  status: MissionStatus;
  sessionId?: string; // link tới WorkspaceSessionRecord khi Owner bắt đầu làm Mission này
  createdAt: string;
};

const GOALS_KEY = "vdai_goal_runtime_goals";
const EPICS_KEY = "vdai_goal_runtime_epics";
const MISSIONS_KEY = "vdai_goal_runtime_missions";

function readList<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // localStorage đầy/không khả dụng — Goal Runtime chỉ mất khả năng lưu lâu dài, không vỡ Runtime.
  }
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---- Goal ----

export function createGoal(title: string): GoalRecord {
  const goal: GoalRecord = { goalId: newId("goal"), title, status: "active", createdAt: new Date().toISOString() };
  writeList(GOALS_KEY, [...readList<GoalRecord>(GOALS_KEY), goal]);
  return goal;
}

export function listGoals(): GoalRecord[] {
  return readList<GoalRecord>(GOALS_KEY);
}

export function getGoal(goalId: string): GoalRecord | undefined {
  return listGoals().find((g) => g.goalId === goalId);
}

function updateGoalStatus(goalId: string, status: GoalStatus): GoalRecord | null {
  const goals = readList<GoalRecord>(GOALS_KEY);
  const idx = goals.findIndex((g) => g.goalId === goalId);
  if (idx < 0) return null;
  const updated = { ...goals[idx], status };
  goals[idx] = updated;
  writeList(GOALS_KEY, goals);
  return updated;
}

export type CreateGoalDraftInput = {
  title: string;
  description?: string;
  goalType?: string;
  priority?: GoalPriority;
  expectedDeliverable?: string;
  dueDate?: string;
};

/** P0 Goal Creation — User tự tạo Goal của riêng họ (khác
    `seedLandingPageProductionGoal()`, chỉ gieo 1 Goal mẫu). Goal mới
    luôn bắt đầu ở `status: "draft"` — chưa có Epic/Mission nào cho tới
    khi Owner bấm "Khởi chạy Goal" (`launchGoal`). */
export function createGoalDraft(input: CreateGoalDraftInput): GoalRecord {
  const goal: GoalRecord = {
    goalId: newId("goal"),
    title: input.title,
    status: "draft",
    createdAt: new Date().toISOString(),
    description: input.description,
    goalType: input.goalType,
    priority: input.priority,
    expectedDeliverable: input.expectedDeliverable,
    dueDate: input.dueDate,
  };
  writeList(GOALS_KEY, [...readList<GoalRecord>(GOALS_KEY), goal]);
  return goal;
}

// ---- Epic ----

export function createEpic(goalId: string, title: string): EpicRecord {
  const epic: EpicRecord = { epicId: newId("epic"), goalId, title, status: "active", createdAt: new Date().toISOString() };
  writeList(EPICS_KEY, [...readList<EpicRecord>(EPICS_KEY), epic]);
  return epic;
}

export function listEpics(goalId?: string): EpicRecord[] {
  const epics = readList<EpicRecord>(EPICS_KEY);
  return goalId ? epics.filter((e) => e.goalId === goalId) : epics;
}

// ---- Mission ----

export type CreateGoalMissionInput = Omit<GoalMissionRecord, "missionId" | "status" | "createdAt" | "sessionId">;

export function createGoalMission(input: CreateGoalMissionInput): GoalMissionRecord {
  const mission: GoalMissionRecord = { ...input, missionId: newId("gmission"), status: "not_started", createdAt: new Date().toISOString() };
  writeList(MISSIONS_KEY, [...readList<GoalMissionRecord>(MISSIONS_KEY), mission]);
  return mission;
}

export function listGoalMissions(epicId?: string): GoalMissionRecord[] {
  const missions = readList<GoalMissionRecord>(MISSIONS_KEY);
  return epicId ? missions.filter((m) => m.epicId === epicId) : missions;
}

export function getGoalMission(missionId: string): GoalMissionRecord | undefined {
  return listGoalMissions().find((m) => m.missionId === missionId);
}

function updateMission(missionId: string, patch: Partial<GoalMissionRecord>): GoalMissionRecord | null {
  const missions = readList<GoalMissionRecord>(MISSIONS_KEY);
  const idx = missions.findIndex((m) => m.missionId === missionId);
  if (idx < 0) return null;
  const updated = { ...missions[idx], ...patch };
  missions[idx] = updated;
  writeList(MISSIONS_KEY, missions);
  return updated;
}

/** Owner bắt đầu làm 1 Mission — link vào đúng 1 WorkspaceSession (đã có
    hoặc mới tạo qua `startCompanionWorkspace`, gọi từ tầng UI). Idempotent
    — không tự chuyển trạng thái nếu Mission đã qua "in_progress". */
export function linkMissionToSession(missionId: string, sessionId: string): GoalMissionRecord | null {
  const mission = getGoalMission(missionId);
  if (!mission) return null;
  const wasNotStarted = mission.status === "not_started";
  const patch: Partial<GoalMissionRecord> = { sessionId };
  if (wasNotStarted) patch.status = "in_progress";
  const updated = updateMission(missionId, patch);
  if (updated && wasNotStarted) {
    emitGrowthEvent({ eventType: "MISSION_STARTED", workspaceSessionId: sessionId, missionId: updated.missionId });
  }
  return updated;
}

/** Mission đã xong phần thực thi, chuyển sang chờ Owner duyệt (dùng bởi
    Mission Runtime — QA pass mới được submit review). Idempotent — chỉ
    chuyển tiếp từ "in_progress", không lùi trạng thái đã completed. */
export function submitMissionForReview(missionId: string): GoalMissionRecord | null {
  const mission = getGoalMission(missionId);
  if (!mission || mission.status !== "in_progress") return mission ?? null;
  return updateMission(missionId, { status: "waiting_review" });
}

/** Mission hoàn thành — gọi khi Output của Session liên kết đã vào
    Portfolio thật (đúng đúng "Complete" trong Runtime Flow đã khóa ở
    Sprint 003). */
export function completeGoalMission(missionId: string): GoalMissionRecord | null {
  const result = updateMission(missionId, { status: "completed" });
  if (result) emitGrowthEvent({ eventType: "MISSION_COMPLETED", missionId: result.missionId });
  return result;
}

// ---- Progress (tính từ trạng thái Mission thật, không cảm tính) ----

export function getMissionProgress(mission: GoalMissionRecord): number {
  return MISSION_STATUS_PROGRESS[mission.status];
}

export function getEpicProgress(epicId: string): number {
  const missions = listGoalMissions(epicId);
  if (missions.length === 0) return 0;
  return Math.round(missions.reduce((sum, m) => sum + getMissionProgress(m), 0) / missions.length);
}

export function getGoalProgress(goalId: string): number {
  const epics = listEpics(goalId);
  if (epics.length === 0) return 0;
  return Math.round(epics.reduce((sum, e) => sum + getEpicProgress(e.epicId), 0) / epics.length);
}

/**
 * P0 Goal Creation — "Khởi chạy Goal": Goal `draft` → `active`, tự tạo 1
 * Epic + 1 Mission "Phân tích & Lập kế hoạch" đầu tiên (Companion bắt
 * đầu Analysis → Mission Planning → Workforce Assignment) — dùng lại
 * đúng `createEpic`/`createGoalMission` chung, Input/Output/Deliverables
 * lấy từ chính dữ liệu Goal do Owner nhập, KHÔNG hard-code nội dung Goal
 * cụ thể nào. Idempotent — gọi lại trên Goal đã launch trả về đúng
 * Epic/Mission đã có, không tạo trùng.
 */
export function launchGoal(goalId: string): { goal: GoalRecord; epic: EpicRecord; mission: GoalMissionRecord } | null {
  const goal = getGoal(goalId);
  if (!goal) return null;

  if (goal.status !== "draft") {
    const epic = listEpics(goal.goalId)[0];
    const mission = epic ? listGoalMissions(epic.epicId)[0] : undefined;
    return epic && mission ? { goal, epic, mission } : null;
  }

  const launched = updateGoalStatus(goalId, "active")!;
  const epic = createEpic(goalId, "Thực thi Goal");
  const mission = createGoalMission({
    epicId: epic.epicId,
    title: "Phân tích & Lập kế hoạch",
    owner: "Owner",
    department: "research-knowledge",
    companionEmployeeId: "EMP-R001", // Market Research Companion — luôn là bước Analysis đầu tiên cho mọi Goal
    input: [launched.description || `Goal: ${launched.title}`],
    output: ["Research Report", "Kế hoạch triển khai sơ bộ"],
    deliverables: [launched.expectedDeliverable || "Kế hoạch triển khai"],
    definitionOfDone: ["Xác định rõ phạm vi công việc cho Goal", "Có kế hoạch Mission tiếp theo"],
  });

  return { goal: launched, epic, mission };
}

// ---- Seed: Landing Page Production — Goal ĐẦU TIÊN, không phải duy nhất ----

const SEEDED_KEY = "vdai_goal_runtime_seeded_landing_page";

/**
 * Gieo Goal đầu tiên của hệ thống bằng đúng cấu trúc chung (Goal → Epic
 * → 6 Mission) — không có nhánh logic nào ở đây khác với việc Owner tự
 * tạo 1 Goal mới qua `createGoal`/`createEpic`/`createGoalMission`.
 * Idempotent — gọi nhiều lần chỉ gieo đúng 1 lần.
 */
export function seedLandingPageProductionGoal(): { goal: GoalRecord; epic: EpicRecord; missions: GoalMissionRecord[] } | null {
  if (window.localStorage.getItem(SEEDED_KEY)) {
    const goal = listGoals().find((g) => g.title === "Landing Page Production");
    if (!goal) return null;
    const epic = listEpics(goal.goalId)[0];
    return epic ? { goal, epic, missions: listGoalMissions(epic.epicId) } : null;
  }

  const goal = createGoal("Landing Page Production");
  const epic = createEpic(goal.goalId, "Landing Page");

  const missions = [
    createGoalMission({
      epicId: epic.epicId,
      title: "Research & Planning",
      owner: "Owner",
      department: "research-knowledge",
      companionEmployeeId: "EMP-R001", // Market Research Companion
      input: ["Mục tiêu kinh doanh của Landing Page", "Đối thủ tham khảo (nếu có)"],
      output: ["Research Report", "Đối tượng khách hàng mục tiêu"],
      deliverables: ["Research Report", "Customer Persona sơ bộ"],
      definitionOfDone: ["Có Research Report với nguồn trích dẫn", "Xác định rõ đối tượng mục tiêu của Landing Page"],
    }),
    createGoalMission({
      epicId: epic.epicId,
      title: "Content Blueprint",
      owner: "Owner",
      department: "content-communication",
      companionEmployeeId: "EMP-C001", // Writer Companion
      input: ["Research Report từ Mission 01", "Thông điệp chính muốn truyền tải"],
      output: ["Cấu trúc nội dung Landing Page (Headline/Body/CTA)", "Bản nháp copy"],
      deliverables: ["Content Blueprint Document"],
      definitionOfDone: ["Có đủ Headline/Body/CTA cho từng section", "Owner đã Approve bản nháp"],
    }),
    createGoalMission({
      epicId: epic.epicId,
      title: "UI/UX Design",
      owner: "Owner",
      department: "creative-design",
      companionEmployeeId: "EMP-D001", // Designer Companion
      input: ["Content Blueprint từ Mission 02", "Brand Kit hiện có (nếu có)"],
      output: ["Design Spec/Banner Spec cho Landing Page"],
      deliverables: ["Design Spec Document"],
      definitionOfDone: ["Design Spec khớp nội dung đã duyệt", "Nhất quán với Brand Kit hiện có (nếu có)"],
    }),
    createGoalMission({
      epicId: epic.epicId,
      title: "Development",
      owner: "Owner",
      department: "technology-automation",
      companionEmployeeId: "EMP-T001", // Coding Companion
      input: ["Design Spec từ Mission 03", "Yêu cầu kỹ thuật (hosting, domain, tracking...)"],
      output: ["Code Landing Page"],
      deliverables: ["Script/Source Code", "Hướng dẫn triển khai"],
      definitionOfDone: ["Code chạy đúng theo Design Spec", "Có cảnh báo rủi ro rõ ràng nếu có thao tác không thể hoàn tác"],
    }),
    createGoalMission({
      epicId: epic.epicId,
      title: "QA",
      owner: "Owner",
      department: "technology-automation",
      companionEmployeeId: "EMP-T002", // QA Companion
      input: ["Code từ Mission 04"],
      output: ["QA Report"],
      deliverables: ["QA Report", "Danh sách lỗi cần sửa (nếu có)"],
      definitionOfDone: ["Mỗi lỗi nêu ra có ví dụ cụ thể tái hiện được", "Không còn lỗi nghiêm trọng chưa xử lý"],
    }),
    createGoalMission({
      epicId: epic.epicId,
      title: "Production Review",
      owner: "Owner",
      department: "creative-design",
      companionEmployeeId: "EMP-D004", // Brand Companion
      input: ["Toàn bộ Output từ Mission 01-05"],
      output: ["Brand Consistency Note", "Khuyến nghị Go/No-Go"],
      deliverables: ["Production Review Note"],
      definitionOfDone: ["Đã rà soát nhất quán thương hiệu", "Owner xác nhận sẵn sàng ra mắt (Approve cuối cùng)"],
    }),
  ];

  try {
    window.localStorage.setItem(SEEDED_KEY, "1");
  } catch {
    // không chặn seed nếu localStorage lỗi ghi cờ — lần sau có thể seed lại, chấp nhận được ở MVP
  }

  return { goal, epic, missions };
}
