"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

/**
 * STABILIZATION-SPR-1101 Task 2 — Course Module/Lesson CRUD. Ownership
 * theo Task 2.3 brief: Academy sở hữu course structure (Module/Lesson),
 * Premium giữ nguyên pricing/checkout/order/entitlement (course-pricing/actions.ts,
 * không đụng). Dùng chung `courses` table (Premium sở hữu) chỉ để chọn Course
 * cha — không ghi/sửa giá hay trạng thái mở bán ở đây.
 */

export type CourseOption = { id: number; name: string };

export type CourseModule = {
  id: number;
  course_id: number;
  title: string;
  sort_order: number;
  visible: boolean;
};

export type CourseLesson = {
  id: number;
  module_id: number;
  title: string;
  video_url: string | null;
  pdf_url: string | null;
  document_url: string | null;
  download_url: string | null;
  prompt_ref: string | null;
  template_ref: string | null;
  exercise_note: string | null;
  bonus_note: string | null;
  sort_order: number;
  visible: boolean;
  status: "Draft" | "Published";
};

export async function listCourseOptions(): Promise<CourseOption[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase.from("courses").select("id, name").order("name", { ascending: true });
  return data ?? [];
}

export async function listModules(courseId: number): Promise<CourseModule[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("course_modules")
    .select("id, course_id, title, sort_order, visible")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function listLessons(moduleId: number): Promise<CourseLesson[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("course_lessons")
    .select("id, module_id, title, video_url, pdf_url, document_url, download_url, prompt_ref, template_ref, exercise_note, bonus_note, sort_order, visible, status")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function createModule(courseId: number, title: string, sortOrder: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!title.trim()) return { error: "Vui lòng nhập tên chủ đề/chương." };

  const { error } = await supabase.from("course_modules").insert({ course_id: courseId, title: title.trim(), sort_order: sortOrder });
  if (error) return { error: "Không thể thêm chủ đề/chương." };
  revalidatePath("/admin/academy/courses");
  return { error: null };
}

export async function updateModule(id: number, patch: Partial<Pick<CourseModule, "title" | "sort_order" | "visible">>) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("course_modules").update(patch).eq("id", id);
  if (error) return { error: "Không thể cập nhật." };
  revalidatePath("/admin/academy/courses");
  return { error: null };
}

export async function deleteModule(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("course_modules").delete().eq("id", id);
  if (error) return { error: "Không thể xóa." };
  revalidatePath("/admin/academy/courses");
  return { error: null };
}

export async function createLesson(moduleId: number, title: string, sortOrder: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!title.trim()) return { error: "Vui lòng nhập tên bài học." };

  const { error } = await supabase.from("course_lessons").insert({ module_id: moduleId, title: title.trim(), sort_order: sortOrder });
  if (error) return { error: "Không thể thêm bài học." };
  revalidatePath("/admin/academy/courses");
  return { error: null };
}

export async function updateLesson(
  id: number,
  patch: Partial<Omit<CourseLesson, "id" | "module_id">>
) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("course_lessons").update(patch).eq("id", id);
  if (error) return { error: "Không thể cập nhật bài học." };
  revalidatePath("/admin/academy/courses");
  revalidatePath("/portal/my-products");
  revalidatePath("/portal/account");
  return { error: null };
}

export async function deleteLesson(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("course_lessons").delete().eq("id", id);
  if (error) return { error: "Không thể xóa bài học." };
  revalidatePath("/admin/academy/courses");
  return { error: null };
}
