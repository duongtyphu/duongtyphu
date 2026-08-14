"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Schema v2, Bước 4 — 6 bảng Học viện AI (typed, không qua
// /api/admin/collections/[table]). CHỈ tầng dữ liệu ở đợt này (Bước 8),
// chưa có page.tsx — cùng tiền lệ Course Builder Bước 2.
//
// `user_ckos_progress`/`user_lesson_progress`/`user_badges` là dữ liệu
// SỞ HỮU BỞI USER (tiến độ học/huy hiệu đã nhận) — Admin chỉ liệt kê để
// đối chiếu, KHÔNG có create/update/delete (đúng nguyên tắc "transactions
// CHỈ ĐỌC trong admin" đã áp dụng cho các bảng per-user khác trong dự án).

export type LearningPath = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  stage_order: number;
  href: string | null;
  mission_count: number;
};

export type LearningPathInput = {
  slug: string;
  title: string;
  description: string;
  stage_order: number;
  href: string;
  mission_count: number;
};

export async function listLearningPaths(): Promise<{ paths: LearningPath[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { paths: [], configured: false };
  const { data } = await supabase
    .from("learning_paths")
    .select("id, slug, title, description, stage_order, href, mission_count")
    .order("stage_order", { ascending: true });
  return { paths: data ?? [], configured: true };
}

export async function createLearningPath(input: LearningPathInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.slug.trim() || !input.title.trim()) return { error: "Vui lòng nhập slug và tiêu đề." };

  const { error } = await supabase.from("learning_paths").insert({
    slug: input.slug.trim(),
    title: input.title.trim(),
    description: input.description.trim() || null,
    stage_order: input.stage_order,
    href: input.href.trim() || null,
    mission_count: input.mission_count,
  });
  if (error) return { error: "Không thể tạo lộ trình, vui lòng thử lại." };

  revalidatePath("/admin/hocvienai/academy-data");
  revalidatePath("/portal/hocvienai");
  return { error: null };
}

export async function updateLearningPath(id: string, input: LearningPathInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("learning_paths")
    .update({
      slug: input.slug.trim(),
      title: input.title.trim(),
      description: input.description.trim() || null,
      stage_order: input.stage_order,
      href: input.href.trim() || null,
      mission_count: input.mission_count,
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu lộ trình, vui lòng thử lại." };

  revalidatePath("/admin/hocvienai/academy-data");
  revalidatePath("/portal/hocvienai");
  return { error: null };
}

export async function deleteLearningPath(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("learning_paths").delete().eq("id", id);
  if (error) return { error: "Không thể xoá lộ trình, vui lòng thử lại." };

  revalidatePath("/admin/hocvienai/academy-data");
  revalidatePath("/portal/hocvienai");
  return { error: null };
}

export type LearningPathCourse = { id: string; path_id: string; course_id: string; order: number };
export type LearningPathCourseInput = { path_id: string; course_id: string; order: number };

export async function listLearningPathCourses(pathId?: string): Promise<{ links: LearningPathCourse[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { links: [], configured: false };
  let query = supabase.from("learning_path_courses").select("id, path_id, course_id, order").order("order", { ascending: true });
  if (pathId) query = query.eq("path_id", pathId);
  const { data } = await query;
  return { links: data ?? [], configured: true };
}

export async function addCourseToLearningPath(input: LearningPathCourseInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.path_id || !input.course_id.trim()) return { error: "Vui lòng chọn lộ trình và khoá học." };

  const { error } = await supabase.from("learning_path_courses").insert({
    path_id: input.path_id,
    course_id: input.course_id.trim(),
    order: input.order,
  });
  if (error) return { error: "Không thể thêm khoá học vào lộ trình, vui lòng thử lại." };

  revalidatePath("/admin/hocvienai/academy-data");
  return { error: null };
}

export async function removeCourseFromLearningPath(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("learning_path_courses").delete().eq("id", id);
  if (error) return { error: "Không thể gỡ khoá học khỏi lộ trình, vui lòng thử lại." };

  revalidatePath("/admin/hocvienai/academy-data");
  return { error: null };
}

export type Badge = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  course_id: string | null;
};

export type BadgeInput = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  course_id: string;
};

export async function listBadges(): Promise<{ badges: Badge[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { badges: [], configured: false };
  const { data } = await supabase
    .from("badges")
    .select("id, slug, name, description, icon, course_id")
    .order("name", { ascending: true });
  return { badges: data ?? [], configured: true };
}

export async function createBadge(input: BadgeInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.slug.trim() || !input.name.trim()) return { error: "Vui lòng nhập slug và tên huy hiệu." };

  const { error } = await supabase.from("badges").insert({
    slug: input.slug.trim(),
    name: input.name.trim(),
    description: input.description.trim() || null,
    icon: input.icon.trim() || null,
    course_id: input.course_id.trim() || null,
  });
  if (error) return { error: "Không thể tạo huy hiệu, vui lòng thử lại." };

  revalidatePath("/admin/hocvienai/academy-data");
  return { error: null };
}

export async function updateBadge(id: string, input: BadgeInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("badges")
    .update({
      slug: input.slug.trim(),
      name: input.name.trim(),
      description: input.description.trim() || null,
      icon: input.icon.trim() || null,
      course_id: input.course_id.trim() || null,
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu huy hiệu, vui lòng thử lại." };

  revalidatePath("/admin/hocvienai/academy-data");
  return { error: null };
}

export async function deleteBadge(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("badges").delete().eq("id", id);
  if (error) return { error: "Không thể xoá huy hiệu, vui lòng thử lại." };

  revalidatePath("/admin/hocvienai/academy-data");
  return { error: null };
}

export type UserCkosProgressRow = { id: string; user_id: string; seed_id: string; completed_step_ids: string[]; updated_at: string };

export async function listUserCkosProgress(): Promise<{ rows: UserCkosProgressRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data } = await supabase
    .from("user_ckos_progress")
    .select("id, user_id, seed_id, completed_step_ids, updated_at")
    .order("updated_at", { ascending: false })
    .limit(200);
  return { rows: data ?? [], configured: true };
}

export type UserLessonProgressRow = {
  id: string;
  user_id: string;
  lesson_id: number;
  status: string;
  watched_seconds: number;
  completed_at: string | null;
  updated_at: string;
};

export async function listUserLessonProgress(): Promise<{ rows: UserLessonProgressRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data } = await supabase
    .from("user_lesson_progress")
    .select("id, user_id, lesson_id, status, watched_seconds, completed_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(200);
  return { rows: data ?? [], configured: true };
}

export type UserBadgeRow = { id: string; user_id: string; badge_id: string; earned_at: string };

export async function listUserBadges(): Promise<{ rows: UserBadgeRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { rows: [], configured: false };
  const { data } = await supabase
    .from("user_badges")
    .select("id, user_id, badge_id, earned_at")
    .order("earned_at", { ascending: false })
    .limit(200);
  return { rows: data ?? [], configured: true };
}
