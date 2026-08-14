"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

// Schema v2, Bước 5 — 6 bảng AI Workspace (typed, không qua
// /api/admin/collections/[table]). Toàn bộ 6 bảng là dữ liệu SỞ HỮU BỞI
// USER (phiên làm việc Companion workspace của từng thành viên: dự án,
// bước, output, phiên bản, phản tư, lịch sử) — CHỈ ĐỌC trong admin, đúng
// nguyên tắc "transactions CHỈ ĐỌC trong admin" đã áp dụng cho các bảng
// per-user khác trong dự án. Không có create/update/delete — Admin không
// có nghiệp vụ chỉnh sửa nội dung phiên làm việc của member.

export type WorkspaceProjectRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  workflow_id: string | null;
  progress_percent: number;
  is_sample: boolean;
  started_at: string;
  finished_at: string | null;
  updated_at: string;
};

export async function listWorkspaceProjects(): Promise<{ rows: WorkspaceProjectRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data } = await supabase
    .from("workspace_projects")
    .select("id, user_id, title, description, status, workflow_id, progress_percent, is_sample, started_at, finished_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(200);
  return { rows: data ?? [], configured: true };
}

export type WorkspaceProjectStepRow = {
  id: string;
  project_id: string;
  step_number: number;
  step_id: string;
  step_name: string;
  status: string;
  completed_at: string | null;
};

export async function listWorkspaceProjectSteps(projectId: string): Promise<{ rows: WorkspaceProjectStepRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data } = await supabase
    .from("workspace_project_steps")
    .select("id, project_id, step_number, step_id, step_name, status, completed_at")
    .eq("project_id", projectId)
    .order("step_number", { ascending: true });
  return { rows: data ?? [], configured: true };
}

export type WorkspaceProjectOutputRow = {
  id: string;
  project_id: string;
  type: string;
  review_status: string;
  reflection_status: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
};

export async function listWorkspaceProjectOutputs(projectId: string): Promise<{ rows: WorkspaceProjectOutputRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data } = await supabase
    .from("workspace_project_outputs")
    .select("id, project_id, type, review_status, reflection_status, approval_status, created_at, updated_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  return { rows: data ?? [], configured: true };
}

export type WorkspaceOutputVersionRow = { id: string; output_id: string; version_number: number; content: string; created_at: string };

export async function listWorkspaceOutputVersions(outputId: string): Promise<{ rows: WorkspaceOutputVersionRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data } = await supabase
    .from("workspace_output_versions")
    .select("id, output_id, version_number, content, created_at")
    .eq("output_id", outputId)
    .order("version_number", { ascending: true });
  return { rows: data ?? [], configured: true };
}

export type WorkspaceOutputReflectionRow = { id: string; output_id: string; question: string; answer: string; submitted_at: string };

export async function listWorkspaceOutputReflections(outputId: string): Promise<{ rows: WorkspaceOutputReflectionRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data } = await supabase
    .from("workspace_output_reflections")
    .select("id, output_id, question, answer, submitted_at")
    .eq("output_id", outputId)
    .order("submitted_at", { ascending: true });
  return { rows: data ?? [], configured: true };
}

export type WorkspaceProjectHistoryRow = { id: string; project_id: string; label: string; occurred_at: string };

export async function listWorkspaceProjectHistory(projectId: string): Promise<{ rows: WorkspaceProjectHistoryRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data } = await supabase
    .from("workspace_project_history")
    .select("id, project_id, label, occurred_at")
    .eq("project_id", projectId)
    .order("occurred_at", { ascending: true });
  return { rows: data ?? [], configured: true };
}
