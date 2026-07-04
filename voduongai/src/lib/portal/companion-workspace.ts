/**
 * EPIC 02 — Sprint 01: AI Workspace Foundation.
 *
 * Hành động dùng chung cho MỌI nút "Thực hành cùng Companion" / "Giao việc
 * cho Companion" / "Bắt đầu Workspace" / "Dùng Prompt này" / "Thực hành
 * quy trình này" / "Dùng cùng Companion" trên trang Không gian AI (và sau
 * này là các trang khác nếu cần) — không mỗi nút một logic riêng.
 *
 * Sprint này CHƯA gọi AI thật, CHƯA có Agent thật — chỉ lưu context tạm
 * (sessionStorage) + một Growth Event tạm (localStorage), rồi điều hướng
 * sang `/portal/workspace` (MVP route hiển thị lại context, chưa xử lý gì).
 */

export type WorkspaceItemType =
  | "work_need"
  | "workspace"
  | "workflow"
  | "prompt"
  | "tool"
  | "learning_path"
  | "resource";

export type WorkspaceContext = {
  module: "ai-space";
  source: string;
  title?: string;
  userGoal?: string;
  itemId?: string;
  itemType?: WorkspaceItemType;
  expectedOutput?: string;
  routeFrom: string;
  timestamp: string;
};

export type WorkspaceStartedEvent = {
  type: "WORKSPACE_STARTED";
  sourceModule: "ai-space";
  title: string;
  timestamp: string;
};

const CONTEXT_KEY = "vdai_workspace_context";
const GROWTH_EVENTS_KEY = "vdai_growth_events";

/** Lưu context tạm cho `/portal/workspace` đọc lại — sessionStorage vì chỉ
    cần sống trong một phiên điều hướng, không phải dữ liệu lâu dài. */
function saveWorkspaceContext(context: WorkspaceContext) {
  try {
    window.sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
  } catch {
    // sessionStorage có thể không khả dụng (Safari private mode...) — bỏ qua,
    // Workspace vẫn đọc được context tối thiểu từ query params.
  }
}

export function readWorkspaceContext(): WorkspaceContext | null {
  try {
    const raw = window.sessionStorage.getItem(CONTEXT_KEY);
    return raw ? (JSON.parse(raw) as WorkspaceContext) : null;
  } catch {
    return null;
  }
}

/** Growth Event tạm — WORKSPACE_STARTED. Về sau Nhật ký học tập/Hành trình
    của tôi/Khu vườn của bạn sẽ đọc danh sách này (chưa làm trong sprint này). */
function pushGrowthEvent(event: WorkspaceStartedEvent) {
  try {
    const raw = window.localStorage.getItem(GROWTH_EVENTS_KEY);
    const list: WorkspaceStartedEvent[] = raw ? JSON.parse(raw) : [];
    list.push(event);
    window.localStorage.setItem(GROWTH_EVENTS_KEY, JSON.stringify(list.slice(-200)));
  } catch {
    // localStorage đầy/không khả dụng — Growth Event chỉ là tạm thời, bỏ qua an toàn.
  }
}

function buildWorkspaceUrl(context: WorkspaceContext): string {
  const params = new URLSearchParams();
  params.set("source", context.source);
  if (context.title) params.set("title", context.title);
  if (context.userGoal) params.set("goal", context.userGoal);
  if (context.itemId) params.set("itemId", context.itemId);
  if (context.itemType) params.set("itemType", context.itemType);
  if (context.expectedOutput) params.set("expectedOutput", context.expectedOutput);
  params.set("routeFrom", context.routeFrom);
  params.set("ts", context.timestamp);
  return `/portal/workspace?${params.toString()}`;
}

/**
 * `startCompanionWorkspace(context)` — điểm gọi DUY NHẤT cho mọi hành động
 * "thực hành cùng Companion" trên trang Không gian AI. Nhận context tối
 * thiểu (thiếu `module`/`routeFrom`/`timestamp` sẽ tự điền), lưu lại rồi
 * trả về URL để điều hướng — component gọi `router.push(url)`.
 */
export function startCompanionWorkspace(
  input: Omit<WorkspaceContext, "module" | "routeFrom" | "timestamp"> & { routeFrom?: string }
): string {
  const timestamp = new Date().toISOString();
  const routeFrom = input.routeFrom ?? (typeof window !== "undefined" ? window.location.pathname : "/portal/khong-gian-ai");
  const context: WorkspaceContext = {
    module: "ai-space",
    source: input.source,
    title: input.title,
    userGoal: input.userGoal,
    itemId: input.itemId,
    itemType: input.itemType,
    expectedOutput: input.expectedOutput,
    routeFrom,
    timestamp,
  };

  saveWorkspaceContext(context);
  pushGrowthEvent({
    type: "WORKSPACE_STARTED",
    sourceModule: "ai-space",
    title: context.title ?? context.userGoal ?? context.source,
    timestamp,
  });

  return buildWorkspaceUrl(context);
}
