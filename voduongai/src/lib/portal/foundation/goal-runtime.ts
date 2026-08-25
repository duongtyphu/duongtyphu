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
 * PHASE 40 — trước đây `localStorage`-backed (per-browser, KHÔNG gắn
 * `user_id` thật). Giờ lưu qua 3 bảng Supabase (`goal_records`/
 * `goal_epics`/`goal_missions`, RLS `member_id = auth.uid()`), theo đúng
 * yêu cầu Founder "mọi chỉ số phải kết nối và ghi nhận thật với hồ sơ của
 * từng học viên" — 1 học viên đổi thiết bị/trình duyệt vẫn thấy đúng Goal
 * của mình, 2 học viên chung máy không còn thấy chung dữ liệu.
 *
 * Kiến trúc "cache đồng bộ + persist bất đồng bộ" — GIỮ NGUYÊN 100% chữ
 * ký mọi hàm export bên dưới (đều đồng bộ như cũ) để không phải viết lại
 * `WorkspaceMvp.tsx`/`GoalRuntimeBoard.tsx`/`GoalDetail.tsx`/... (nhiều nơi
 * gọi các hàm này ngay trong render/event handler đồng bộ). Chỉ thêm 1
 * hàm mới bắt buộc: `hydrateGoalRuntime()` (async, gọi 1 lần lúc mount
 * TRƯỚC khi đọc lần đầu — xem cách `/v2/companion`/`/v2/muc-tieu` gọi
 * trong `useEffect`). `readList`/`writeList` (2 hàm nội bộ DUY NHẤT từng
 * chạm `localStorage`) đổi thành đọc/ghi cache trong bộ nhớ (đồng bộ,
 * không đổi hành vi phía trên) + đẩy lên Supabase ở nền (fire-and-forget,
 * không chặn UI — mọi lời gọi ghi trong file này đều không dùng giá trị
 * Promise trả về). Cache tự re-hydrate nếu phát hiện đổi tài khoản đăng
 * nhập. Không có hàm XOÁ goal/epic/mission nào (đã audit toàn file) nên
 * chiến lược "upsert cả dòng mỗi lần ghi" là an toàn, không mất dữ liệu.
 */

import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { DepartmentId } from "./workforce-registry";
import { emitGrowthEvent } from "./growth-event-bus";

export type GoalStatus = "draft" | "ready_for_analysis" | "active" | "completed" | "archived";
export type MissionStatus = "not_started" | "in_progress" | "waiting_review" | "completed";
export type GoalPriority = "low" | "medium" | "high";

export type GoalStatusHistoryEntry = { status: GoalStatus; at: string };

/** Goal Lifecycle hợp lệ — giống pattern `ALLOWED_TRANSITIONS` đã dùng ở
    Companion Lifecycle (`workforce-registry.ts`): chuyển trạng thái sai
    thứ tự bị từ chối (no-op, trả lại Goal hiện tại). GOAL-002: "Khởi chạy
    Goal" tạm thời chưa chạy AI — chỉ chuyển thẳng draft → ready_for_analysis
    trong 1 bước (không qua analyzing/planning trung gian như bản nháp
    trước đó). */
const ALLOWED_GOAL_TRANSITIONS: Record<GoalStatus, GoalStatus[]> = {
  draft: ["ready_for_analysis", "archived"],
  ready_for_analysis: ["active", "archived"],
  active: ["completed", "archived"],
  completed: ["archived"],
  archived: [],
};

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
  category?: string;
  goalType?: string;
  priority?: GoalPriority;
  expectedDeliverable?: string;
  dueDate?: string;
  tags?: string[];
  createdBy?: string;
  /** Timeline thật — mỗi lần status đổi được ghi lại 1 mốc, hiển thị ở
      Goal Detail. Rỗng/undefined cho Goal tạo qua `createGoal()` cũ
      (legacy, không đổi hành vi). */
  statusHistory?: GoalStatusHistoryEntry[];
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
  owner: string; // Owner (người dùng) — 1 member_id thật (Phase 40), không còn "single-owner per browser"
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

// ---------------------------------------------------------------------------
// Cache đồng bộ + persist bất đồng bộ (Phase 40) — xem docblock đầu file.

type GoalRow = {
  goal_id: string;
  title: string;
  status: GoalStatus;
  description: string | null;
  category: string | null;
  goal_type: string | null;
  priority: GoalPriority | null;
  expected_deliverable: string | null;
  due_date: string | null;
  tags: string[] | null;
  created_by: string | null;
  status_history: GoalStatusHistoryEntry[] | null;
  created_at: string;
};
type EpicRow = { epic_id: string; goal_id: string; title: string; status: GoalStatus; created_at: string };
type MissionRow = {
  mission_id: string;
  epic_id: string;
  title: string;
  owner: string;
  department: DepartmentId;
  companion_employee_id: string;
  input: string[];
  output: string[];
  deliverables: string[];
  definition_of_done: string[];
  status: MissionStatus;
  session_id: string | null;
  created_at: string;
};

function rowToGoal(r: GoalRow): GoalRecord {
  return {
    goalId: r.goal_id,
    title: r.title,
    status: r.status,
    createdAt: r.created_at,
    description: r.description ?? undefined,
    category: r.category ?? undefined,
    goalType: r.goal_type ?? undefined,
    priority: r.priority ?? undefined,
    expectedDeliverable: r.expected_deliverable ?? undefined,
    dueDate: r.due_date ?? undefined,
    tags: r.tags ?? undefined,
    createdBy: r.created_by ?? undefined,
    statusHistory: r.status_history ?? undefined,
  };
}
function goalToRow(g: GoalRecord, memberId: string) {
  return {
    goal_id: g.goalId,
    member_id: memberId,
    title: g.title,
    status: g.status,
    description: g.description ?? null,
    category: g.category ?? null,
    goal_type: g.goalType ?? null,
    priority: g.priority ?? null,
    expected_deliverable: g.expectedDeliverable ?? null,
    due_date: g.dueDate ?? null,
    tags: g.tags ?? null,
    created_by: g.createdBy ?? null,
    status_history: g.statusHistory ?? null,
    created_at: g.createdAt,
  };
}
function rowToEpic(r: EpicRow): EpicRecord {
  return { epicId: r.epic_id, goalId: r.goal_id, title: r.title, status: r.status, createdAt: r.created_at };
}
function epicToRow(e: EpicRecord, memberId: string) {
  return { epic_id: e.epicId, goal_id: e.goalId, member_id: memberId, title: e.title, status: e.status, created_at: e.createdAt };
}
function rowToMission(r: MissionRow): GoalMissionRecord {
  return {
    missionId: r.mission_id,
    epicId: r.epic_id,
    title: r.title,
    owner: r.owner,
    department: r.department,
    companionEmployeeId: r.companion_employee_id,
    input: r.input ?? [],
    output: r.output ?? [],
    deliverables: r.deliverables ?? [],
    definitionOfDone: r.definition_of_done ?? [],
    status: r.status,
    sessionId: r.session_id ?? undefined,
    createdAt: r.created_at,
  };
}
function missionToRow(m: GoalMissionRecord, memberId: string) {
  return {
    mission_id: m.missionId,
    epic_id: m.epicId,
    member_id: memberId,
    title: m.title,
    owner: m.owner,
    department: m.department,
    companion_employee_id: m.companionEmployeeId,
    input: m.input,
    output: m.output,
    deliverables: m.deliverables,
    definition_of_done: m.definitionOfDone,
    status: m.status,
    session_id: m.sessionId ?? null,
    created_at: m.createdAt,
  };
}

let cachedMemberId: string | null | undefined = undefined;
let goalsCache: GoalRecord[] = [];
let epicsCache: EpicRecord[] = [];
let missionsCache: GoalMissionRecord[] = [];

/**
 * Tải Goal/Epic/Mission thật của member đang đăng nhập vào cache trong bộ
 * nhớ — PHẢI gọi (và `await`) trước khi dùng `listGoals()`/`listEpics()`/
 * `listGoalMissions()`/... lần đầu ở mỗi trang. No-op nếu đã hydrate đúng
 * member hiện tại (an toàn gọi lại nhiều lần, kể cả trên mỗi lần mount).
 */
export async function hydrateGoalRuntime(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    cachedMemberId = null;
    goalsCache = [];
    epicsCache = [];
    missionsCache = [];
    return;
  }
  try {
    const supabase = getSupabaseBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const memberId = userData.user?.id ?? null;
    if (memberId === cachedMemberId) return;
    cachedMemberId = memberId;
    if (!memberId) {
      goalsCache = [];
      epicsCache = [];
      missionsCache = [];
      return;
    }
    const [goalsRes, epicsRes, missionsRes] = await Promise.all([
      supabase.from("goal_records").select("goal_id, title, status, description, category, goal_type, priority, expected_deliverable, due_date, tags, created_by, status_history, created_at").eq("member_id", memberId).order("created_at", { ascending: true }),
      supabase.from("goal_epics").select("epic_id, goal_id, title, status, created_at").eq("member_id", memberId).order("created_at", { ascending: true }),
      supabase.from("goal_missions").select("mission_id, epic_id, title, owner, department, companion_employee_id, input, output, deliverables, definition_of_done, status, session_id, created_at").eq("member_id", memberId).order("created_at", { ascending: true }),
    ]);
    goalsCache = goalsRes.error || !goalsRes.data ? [] : (goalsRes.data as GoalRow[]).map(rowToGoal);
    epicsCache = epicsRes.error || !epicsRes.data ? [] : (epicsRes.data as EpicRow[]).map(rowToEpic);
    missionsCache = missionsRes.error || !missionsRes.data ? [] : (missionsRes.data as MissionRow[]).map(rowToMission);
  } catch {
    goalsCache = [];
    epicsCache = [];
    missionsCache = [];
  }
}

type StoreKey = "goals" | "epics" | "missions";

function readList<T>(key: StoreKey): T[] {
  if (key === "goals") return goalsCache as unknown as T[];
  if (key === "epics") return epicsCache as unknown as T[];
  return missionsCache as unknown as T[];
}

/** Ghi cache ngay (đồng bộ) + đẩy đúng 1 dòng vừa đổi lên Supabase ở nền
    (fire-and-forget — lỗi mạng chỉ mất khả năng lưu bền, không vỡ
    Runtime, cùng tinh thần try/catch localStorage cũ). `changed` là dòng
    vừa thêm/sửa (luôn ở cuối mảng khi thêm mới, hoặc chính dòng đã patch
    khi cập nhật — mọi call site trong file này đều biết rõ dòng nào vừa
    đổi nên truyền tường minh, không cần diff cả mảng). */
function writeList<T>(key: StoreKey, list: T[], changed: T): void {
  if (key === "goals") goalsCache = list as unknown as GoalRecord[];
  else if (key === "epics") epicsCache = list as unknown as EpicRecord[];
  else missionsCache = list as unknown as GoalMissionRecord[];
  void persistChanged(key, changed);
}

async function persistChanged<T>(key: StoreKey, changed: T): Promise<void> {
  if (!cachedMemberId) return;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
  try {
    const supabase = getSupabaseBrowser();
    if (key === "goals") {
      await supabase.from("goal_records").upsert(goalToRow(changed as GoalRecord, cachedMemberId), { onConflict: "goal_id" });
    } else if (key === "epics") {
      await supabase.from("goal_epics").upsert(epicToRow(changed as EpicRecord, cachedMemberId), { onConflict: "epic_id" });
    } else {
      await supabase.from("goal_missions").upsert(missionToRow(changed as GoalMissionRecord, cachedMemberId), { onConflict: "mission_id" });
    }
  } catch {
    // Mất kết nối/lỗi ghi — chấp nhận được ở MVP, cùng tinh thần localStorage cũ.
  }
}

/** CHỈ dùng trong test — cache module-level không tự reset giữa các test
    case như `localStorage.clear()` cũ, nên test phải tự gọi hàm này trong
    `beforeEach()` (xem `goal-runtime.test.ts`). */
export function __resetGoalRuntimeCacheForTest(): void {
  cachedMemberId = undefined;
  goalsCache = [];
  epicsCache = [];
  missionsCache = [];
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---- Goal ----

export function createGoal(title: string): GoalRecord {
  const goal: GoalRecord = { goalId: newId("goal"), title, status: "active", createdAt: new Date().toISOString() };
  writeList("goals", [...readList<GoalRecord>("goals"), goal], goal);
  return goal;
}

export function listGoals(): GoalRecord[] {
  return readList<GoalRecord>("goals");
}

export function getGoal(goalId: string): GoalRecord | undefined {
  return listGoals().find((g) => g.goalId === goalId);
}

function updateGoalRecord(goalId: string, patch: Partial<GoalRecord>): GoalRecord | null {
  const goals = readList<GoalRecord>("goals");
  const idx = goals.findIndex((g) => g.goalId === goalId);
  if (idx < 0) return null;
  const updated = { ...goals[idx], ...patch };
  goals[idx] = updated;
  writeList("goals", goals, updated);
  return updated;
}

/** Chuyển Goal Status theo đúng Goal Lifecycle (`ALLOWED_GOAL_TRANSITIONS`)
    — sai thứ tự thì no-op (trả lại Goal hiện tại, không throw, để UI
    không cần try/catch riêng). Mỗi lần chuyển hợp lệ được ghi vào
    `statusHistory` — nguồn dữ liệu thật cho Goal Detail Timeline. */
export function advanceGoalStatus(goalId: string, next: GoalStatus): GoalRecord | null {
  const goal = getGoal(goalId);
  if (!goal) return null;
  if (!ALLOWED_GOAL_TRANSITIONS[goal.status].includes(next)) return goal;

  const history = [...(goal.statusHistory ?? [{ status: goal.status, at: goal.createdAt }]), { status: next, at: new Date().toISOString() }];
  return updateGoalRecord(goalId, { status: next, statusHistory: history });
}

export type CreateGoalDraftInput = {
  title: string;
  description?: string;
  category?: string;
  goalType?: string;
  priority?: GoalPriority;
  expectedDeliverable?: string;
  dueDate?: string;
  tags?: string[];
  createdBy?: string;
};

/** P0 Goal Creation — User tự tạo Goal của riêng họ (khác
    `seedLandingPageProductionGoal()`, chỉ gieo 1 Goal mẫu). Goal mới
    luôn bắt đầu ở `status: "draft"` — chưa có Epic/Mission nào cho tới
    khi Owner bấm "Khởi chạy Goal" (`launchGoal`). */
export function createGoalDraft(input: CreateGoalDraftInput): GoalRecord {
  const createdAt = new Date().toISOString();
  const goal: GoalRecord = {
    goalId: newId("goal"),
    title: input.title,
    status: "draft",
    createdAt,
    description: input.description,
    category: input.category,
    goalType: input.goalType,
    priority: input.priority,
    expectedDeliverable: input.expectedDeliverable,
    dueDate: input.dueDate,
    tags: input.tags,
    createdBy: input.createdBy ?? "Owner",
    statusHistory: [{ status: "draft", at: createdAt }],
  };
  writeList("goals", [...readList<GoalRecord>("goals"), goal], goal);
  return goal;
}

// ---- Epic ----

export function createEpic(goalId: string, title: string): EpicRecord {
  const epic: EpicRecord = { epicId: newId("epic"), goalId, title, status: "active", createdAt: new Date().toISOString() };
  writeList("epics", [...readList<EpicRecord>("epics"), epic], epic);
  return epic;
}

export function listEpics(goalId?: string): EpicRecord[] {
  const epics = readList<EpicRecord>("epics");
  return goalId ? epics.filter((e) => e.goalId === goalId) : epics;
}

// ---- Mission ----

export type CreateGoalMissionInput = Omit<GoalMissionRecord, "missionId" | "status" | "createdAt" | "sessionId">;

export function createGoalMission(input: CreateGoalMissionInput): GoalMissionRecord {
  const mission: GoalMissionRecord = { ...input, missionId: newId("gmission"), status: "not_started", createdAt: new Date().toISOString() };
  writeList("missions", [...readList<GoalMissionRecord>("missions"), mission], mission);
  return mission;
}

export function listGoalMissions(epicId?: string): GoalMissionRecord[] {
  const missions = readList<GoalMissionRecord>("missions");
  return epicId ? missions.filter((m) => m.epicId === epicId) : missions;
}

export function getGoalMission(missionId: string): GoalMissionRecord | undefined {
  return listGoalMissions().find((m) => m.missionId === missionId);
}

function updateMission(missionId: string, patch: Partial<GoalMissionRecord>): GoalMissionRecord | null {
  const missions = readList<GoalMissionRecord>("missions");
  const idx = missions.findIndex((m) => m.missionId === missionId);
  if (idx < 0) return null;
  const updated = { ...missions[idx], ...patch };
  missions[idx] = updated;
  writeList("missions", missions, updated);
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
 * GOAL-002 — "Khởi chạy Goal": Goal `draft` → `ready_for_analysis`. Tạm
 * thời CHƯA chạy AI/Provider/Mock — chỉ chuyển trạng thái thật qua đúng
 * Goal Lifecycle (`advanceGoalStatus`), ghi vào `statusHistory` (Goal
 * Detail Timeline đọc thẳng từ đây). Idempotent — gọi lại trên Goal
 * không còn ở `draft` là no-op, trả về Goal hiện tại. Việc tạo Epic/
 * Mission/Workforce Assignment thật thuộc PHASE sau.
 */
export function launchGoal(goalId: string): GoalRecord | null {
  const goal = getGoal(goalId);
  if (!goal) return null;
  if (goal.status !== "draft") return goal;

  return advanceGoalStatus(goalId, "ready_for_analysis")!;
}

export type GoalDashboardSummary = {
  total: number;
  draft: number;
  running: number; // ready_for_analysis + active
  completed: number;
  archived: number;
};

/** Goal Dashboard — đếm thật từ `listGoals()`, không cảm tính. */
export function computeGoalDashboardSummary(): GoalDashboardSummary {
  const goals = listGoals();
  return {
    total: goals.length,
    draft: goals.filter((g) => g.status === "draft").length,
    running: goals.filter((g) => g.status === "ready_for_analysis" || g.status === "active").length,
    completed: goals.filter((g) => g.status === "completed").length,
    archived: goals.filter((g) => g.status === "archived").length,
  };
}

// ---- Seed: Landing Page Production — Goal ĐẦU TIÊN, không phải duy nhất ----

/**
 * Gieo Goal đầu tiên của hệ thống bằng đúng cấu trúc chung (Goal → Epic
 * → 6 Mission) — không có nhánh logic nào ở đây khác với việc Owner tự
 * tạo 1 Goal mới qua `createGoal`/`createEpic`/`createGoalMission`.
 * Idempotent — gọi nhiều lần chỉ gieo đúng 1 lần (Phase 40 — kiểm tra
 * thẳng `listGoals()` thay vì 1 cờ `localStorage` riêng, an toàn hơn vì
 * gắn liền với dữ liệu thật, không thể lệch pha).
 */
export function seedLandingPageProductionGoal(): { goal: GoalRecord; epic: EpicRecord; missions: GoalMissionRecord[] } | null {
  const existing = listGoals().find((g) => g.title === "Landing Page Production");
  if (existing) {
    const epic = listEpics(existing.goalId)[0];
    return epic ? { goal: existing, epic, missions: listGoalMissions(epic.epicId) } : null;
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

  return { goal, epic, missions };
}
