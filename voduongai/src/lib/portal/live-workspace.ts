import { cache } from "react";

import { getSupabasePublic } from "@/lib/supabase";
import { getSupabaseServer } from "@/lib/supabase-server";
import type { PremiumStatus } from "@/lib/v2/premium-access";

/**
 * Nguồn dữ liệu THẬT cho AI Workspace 2.0 — `/v2/ai-workspace` (Bước E.3).
 *
 * Bảng: `tools` (25 công cụ, 6 danh mục — nội dung mới ghi đè ở migration
 * `phase37_ai_workspace_content_e3`, xem CLAUDE.md), `ai_workflow_sections`
 * (4 workflow mẫu, cùng migration), `workspace_projects` (dự án thật của
 * user đang đăng nhập + 2 dự án mẫu `is_sample=true`),
 * `workspace_project_history` (hoạt động gần đây — bảng THẬT, hiện 0 dòng vì
 * hệ thống mới, không phải thiếu hạ tầng).
 *
 * ---------------------------------------------------------------------------
 * RLS `workspace_projects` cho phép ĐỌC theo 2 policy permissive (OR với
 * nhau): "own" (`auth.uid() = user_id`) và "public read sample projects"
 * (`is_sample = true`) — nên 1 câu SELECT qua session client
 * (`getSupabaseServer()`) tự động trả về ĐÚNG tập cần cho trang này (dự án
 * thật của chính user + 2 dự án mẫu), không cần 2 lần gọi/2 client khác nhau.
 *
 * Riêng phần TÍNH GIỚI HẠN Free (Bước D) dùng 1 câu query RIÊNG, lọc tường
 * minh `eq("user_id", userId).eq("is_sample", false)` — KHÔNG dựa vào "mọi
 * dòng không phải sample mà session này đọc được", vì admin
 * (`workspace_projects_admin`, policy ALL không lọc theo chủ sở hữu) đọc
 * được TOÀN BỘ dự án thật của MỌI người dùng, không riêng của chính mình —
 * dựa vào tập đó để tính giới hạn cá nhân sẽ sai (đếm nhầm dự án của người
 * khác vào hạn mức của admin).
 * ---------------------------------------------------------------------------
 * BƯỚC D — GIỚI HẠN FREE: "1 workflow mở/tháng, tối đa 3 dự án cùng lúc"
 *
 * Trang này (bản thiết kế `AI Workspace.html`) KHÔNG có hành động "mở
 * workflow"/"tạo dự án" thật nào được nối (mọi nút liên quan vẫn `href="#"`/
 * không có backend tạo dự án) — nên phần thực thi giới hạn ở đây dừng ở tầng
 * HIỂN THỊ (badge/khoá UI đúng token màu đã có), không phải chặn 1 API ghi
 * cụ thể (không có API ghi nào tồn tại để chặn). Khi module sau này thêm
 * hành động tạo dự án/mở workflow thật, phải gọi lại `getWorkspaceLimits()`
 * ở tầng server action đó để chặn thật, không chỉ tin vào UI.
 *
 *   • "1 workflow mở/tháng" = số WORKFLOW KHÁC NHAU (`workflow_id`) mà user
 *     đã tạo dự án thật (không tính mẫu) trong THÁNG hiện tại (theo
 *     `created_at`) — đạt 1 thì hết lượt mở workflow MỚI trong tháng đó.
 *   • "Tối đa 3 dự án cùng lúc" = số dự án thật có `status='in_progress'`.
 * ---------------------------------------------------------------------------
 */

export type WorkspaceToolGroup = {
  category: string;
  count: number;
};

/** Tất cả công cụ Published, dùng chung cho nhóm + danh sách yêu thích. */
const getPublishedTools = cache(async () => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data } = await supabase
    .from("tools")
    .select("id, data, order")
    .eq("status", "Published")
    .order("order");

  return (data ?? []) as { id: string; data: Record<string, unknown>; order: number }[];
});

/** 6 nhóm công cụ, thứ tự = thứ tự xuất hiện đầu tiên trong `tools` (theo `order`) — không hardcode danh sách. */
export const getWorkspaceToolGroups = cache(async (): Promise<WorkspaceToolGroup[]> => {
  const tools = await getPublishedTools();

  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const tool of tools) {
    const category = tool.data?.category as string | undefined;
    if (!category) continue;
    if (!counts.has(category)) order.push(category);
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return order.map((category) => ({ category, count: counts.get(category) ?? 0 }));
});

export type WorkspaceFavoriteTool = {
  id: string;
  name: string;
  tagline: string;
  category: string;
};

/**
 * "Công cụ yêu thích" — bản thiết kế không có bảng lưu lượt yêu thích thật
 * (nút star chỉ toggle client-side, không lưu — giữ nguyên hành vi đó, xem
 * `AiWorkspaceClient.tsx`). 5 id dưới đây khớp ĐÚNG 5 công cụ bản thiết kế
 * minh hoạ (ChatGPT/Claude/Midjourney/Notion AI/Perplexity) — cũng là 5 dòng
 * thật đã có trong bảng `tools` sau migration, nên đây là 5 công cụ THẬT,
 * không phải danh sách bịa — chỉ là lựa chọn hiển thị cố định thay vì đọc từ
 * 1 bảng "yêu thích" (không tồn tại).
 */
const FAVORITE_TOOL_IDS = ["chatgpt", "claude", "midjourney", "notion-ai", "perplexity"];

export const getWorkspaceFavoriteTools = cache(async (): Promise<WorkspaceFavoriteTool[]> => {
  const tools = await getPublishedTools();
  const byId = new Map(tools.map((t) => [t.id, t]));

  return FAVORITE_TOOL_IDS.map((id) => byId.get(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .map((t) => ({
      id: t.id,
      name: (t.data.name as string) ?? "",
      tagline: (t.data.tagline as string) ?? "",
      category: (t.data.category as string) ?? "",
    }));
});

export type WorkspaceWorkflow = {
  id: string;
  title: string;
  description: string;
  steps: string[];
  suggestedTools: string[];
};

export const getWorkspaceWorkflows = cache(async (): Promise<WorkspaceWorkflow[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data } = await supabase
    .from("ai_workflow_sections")
    .select("id, data, order")
    .eq("status", "Published")
    .order("order");

  return (data ?? []).map((row) => {
    const d = row.data as Record<string, unknown>;
    return {
      id: row.id as string,
      title: (d.title as string) ?? "",
      description: (d.description as string) ?? "",
      steps: Array.isArray(d.steps) ? (d.steps as string[]) : [],
      suggestedTools: Array.isArray(d.suggestedTools) ? (d.suggestedTools as string[]) : [],
    };
  });
});

export type WorkspaceProject = {
  id: string;
  title: string;
  description: string;
  status: "in_progress" | "completed" | "paused";
  workflowId: string | null;
  progressPercent: number;
  updatedAt: string;
  isSample: boolean;
};

/**
 * Dự án hiển thị ở "Dự án của bạn" — dự án THẬT của chính user đang đăng
 * nhập + 2 dự án mẫu (`is_sample=true`), tự động qua RLS OR (xem docblock
 * đầu file). Trả `[]` khi chưa cấu hình Supabase (đúng convention).
 */
export async function getWorkspaceProjects(): Promise<WorkspaceProject[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];

  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("workspace_projects")
    .select("id, title, description, status, workflow_id, progress_percent, is_sample, updated_at")
    .order("updated_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string | null) ?? "",
    status: row.status as WorkspaceProject["status"],
    workflowId: (row.workflow_id as string | null) ?? null,
    progressPercent: (row.progress_percent as number | null) ?? 0,
    updatedAt: row.updated_at as string,
    isSample: Boolean(row.is_sample),
  }));
}

export type WorkspaceActivity = {
  id: string;
  label: string;
  occurredAt: string;
};

/** "Hoạt động gần đây" — chỉ đọc được lịch sử của CHÍNH dự án thật của user (RLS `workspace_project_history_own`), không gồm dự án mẫu. */
export async function getWorkspaceActivity(limit = 5): Promise<WorkspaceActivity[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];

  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("workspace_project_history")
    .select("id, label, occurred_at")
    .order("occurred_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((row) => ({
    id: String(row.id),
    label: row.label as string,
    occurredAt: row.occurred_at as string,
  }));
}

export type WorkspaceLimits = {
  isPremium: boolean;
  signedIn: boolean;
  workflowsOpenedThisMonth: number;
  concurrentProjects: number;
  /** Free: `workflowsOpenedThisMonth < 1`. Premium: luôn `true`. */
  canOpenNewWorkflow: boolean;
  /** Free: `concurrentProjects < 3`. Premium: luôn `true`. */
  canCreateProject: boolean;
};

/** Tính giới hạn Bước D — xem docblock đầu file để biết vì sao KHÔNG tái dùng `getWorkspaceProjects()`. */
export async function getWorkspaceLimits(premium: PremiumStatus): Promise<WorkspaceLimits> {
  if (premium.isPremium) {
    return {
      isPremium: true,
      signedIn: premium.signedIn,
      workflowsOpenedThisMonth: 0,
      concurrentProjects: 0,
      canOpenNewWorkflow: true,
      canCreateProject: true,
    };
  }

  const base: WorkspaceLimits = {
    isPremium: false,
    signedIn: premium.signedIn,
    workflowsOpenedThisMonth: 0,
    concurrentProjects: 0,
    canOpenNewWorkflow: true,
    canCreateProject: true,
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return base;

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return base;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: rows } = await supabase
    .from("workspace_projects")
    .select("workflow_id, status, created_at")
    .eq("user_id", userId)
    .eq("is_sample", false);

  const workflowsThisMonth = new Set<string>();
  let concurrentProjects = 0;
  for (const row of rows ?? []) {
    if (row.status === "in_progress") concurrentProjects += 1;
    const workflowId = row.workflow_id as string | null;
    const createdAt = row.created_at as string | null;
    if (workflowId && createdAt && new Date(createdAt) >= monthStart) {
      workflowsThisMonth.add(workflowId);
    }
  }

  return {
    isPremium: false,
    signedIn: true,
    workflowsOpenedThisMonth: workflowsThisMonth.size,
    concurrentProjects,
    canOpenNewWorkflow: workflowsThisMonth.size < 1,
    canCreateProject: concurrentProjects < 3,
  };
}
