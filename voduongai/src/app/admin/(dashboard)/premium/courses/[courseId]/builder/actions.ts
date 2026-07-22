"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

/**
 * Course Builder (Premium), Bước 2 — `course_sections`/`course_lessons` là
 * bảng TYPED (cột thật: title/video_url/content/duration_minutes/
 * is_free_preview/sort_order/status...), KHÔNG phải schema generic
 * `id/data jsonb/status/order` — nên KHÔNG đăng ký vào SUPABASE_COLLECTIONS
 * và KHÔNG đi qua `/api/admin/collections/[table]`. Route đó
 * `select("id, data, status, order")`/`upsert({ id, data, status, order })`
 * cứng theo tên cột `data`/`order` — 2 bảng này không có cột đó (có
 * `sort_order`, không có `order`; `id` là bigint tự tăng, không phải string
 * client tự đặt). Đây là lý do sâu hơn "chỉ quan hệ lồng 2 cấp route chung
 * không xử lý được" — route chung không dùng được cho CẢ CRUD CƠ BẢN của
 * 2 bảng này, không riêng phần cây/kéo-thả. Mirror đúng pattern
 * `case-studies/actions.ts`/`course-pricing/actions.ts` (typed table →
 * Server Actions riêng).
 *
 * 7 field có sẵn trên `course_lessons` nhưng ngoài phạm vi Course Builder
 * lần này (`pdf_url`/`document_url`/`download_url`/`prompt_ref`/
 * `template_ref`/`exercise_note`/`bonus_note` — xem CLAUDE.md Bước 1) —
 * không select/update ở đây.
 */

export type CourseLesson = {
  id: number;
  section_id: number;
  title: string;
  video_url: string | null;
  content: string | null;
  duration_minutes: number;
  is_free_preview: boolean;
  sort_order: number;
  status: string;
};

export type CourseSection = {
  id: number;
  course_id: string;
  title: string;
  sort_order: number;
  status: string;
  lessons: CourseLesson[];
};

const LESSON_COLUMNS = "id, section_id, title, video_url, content, duration_minutes, is_free_preview, sort_order, status";
const SECTION_COLUMNS = "id, course_id, title, sort_order, status";

function builderPath(courseId: string) {
  return `/admin/premium/courses/${courseId}/builder`;
}

/** Đọc toàn bộ cây Section→Lesson của 1 khoá, đã sort đúng `sort_order` cả 2 cấp. */
export async function getCourseBuilderTree(courseId: string): Promise<{ sections: CourseSection[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { sections: [], configured: false };

  const { data: sectionRows } = await supabase
    .from("course_sections")
    .select(SECTION_COLUMNS)
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  const sections = sectionRows ?? [];
  if (sections.length === 0) return { sections: [], configured: true };

  const { data: lessonRows } = await supabase
    .from("course_lessons")
    .select(LESSON_COLUMNS)
    .in(
      "section_id",
      sections.map((s) => s.id),
    )
    .order("sort_order", { ascending: true });

  const lessonsBySection = new Map<number, CourseLesson[]>();
  for (const lesson of lessonRows ?? []) {
    const list = lessonsBySection.get(lesson.section_id) ?? [];
    list.push(lesson);
    lessonsBySection.set(lesson.section_id, list);
  }

  return {
    sections: sections.map((s) => ({ ...s, lessons: lessonsBySection.get(s.id) ?? [] })),
    configured: true,
  };
}

export async function createSection(courseId: string, title: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!title.trim()) return { error: "Vui lòng nhập tiêu đề section." };

  const { count } = await supabase.from("course_sections").select("id", { count: "exact", head: true }).eq("course_id", courseId);

  const { error } = await supabase.from("course_sections").insert({
    course_id: courseId,
    title: title.trim(),
    sort_order: count ?? 0,
    status: "Draft",
  });
  if (error) return { error: "Không thể tạo section, vui lòng thử lại." };

  revalidatePath(builderPath(courseId));
  return { error: null };
}

export async function updateSection(id: number, courseId: string, input: { title?: string; status?: string }) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof input.title === "string") patch.title = input.title.trim();
  if (typeof input.status === "string") patch.status = input.status;

  const { error } = await supabase.from("course_sections").update(patch).eq("id", id);
  if (error) return { error: "Không thể lưu section, vui lòng thử lại." };

  revalidatePath(builderPath(courseId));
  return { error: null };
}

/** ON DELETE CASCADE trên course_lessons.section_id — xoá section tự xoá hết lesson con. */
export async function deleteSection(id: number, courseId: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("course_sections").delete().eq("id", id);
  if (error) return { error: "Không thể xoá section, vui lòng thử lại." };

  revalidatePath(builderPath(courseId));
  return { error: null };
}

export async function createLesson(sectionId: number, courseId: string, title: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!title.trim()) return { error: "Vui lòng nhập tiêu đề lesson." };

  const { count } = await supabase.from("course_lessons").select("id", { count: "exact", head: true }).eq("section_id", sectionId);

  const { error } = await supabase.from("course_lessons").insert({
    section_id: sectionId,
    title: title.trim(),
    sort_order: count ?? 0,
    status: "Draft",
  });
  if (error) return { error: "Không thể tạo lesson, vui lòng thử lại." };

  revalidatePath(builderPath(courseId));
  return { error: null };
}

export type LessonUpdateInput = {
  title?: string;
  video_url?: string | null;
  content?: string | null;
  duration_minutes?: number;
  is_free_preview?: boolean;
  status?: string;
};

export async function updateLesson(id: number, courseId: string, input: LessonUpdateInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof input.title === "string") patch.title = input.title.trim();
  if (input.video_url !== undefined) patch.video_url = input.video_url?.trim() || null;
  if (input.content !== undefined) patch.content = input.content;
  if (typeof input.duration_minutes === "number") patch.duration_minutes = input.duration_minutes;
  if (typeof input.is_free_preview === "boolean") patch.is_free_preview = input.is_free_preview;
  if (typeof input.status === "string") patch.status = input.status;

  const { error } = await supabase.from("course_lessons").update(patch).eq("id", id);
  if (error) return { error: "Không thể lưu lesson, vui lòng thử lại." };

  revalidatePath(builderPath(courseId));
  return { error: null };
}

export async function deleteLesson(id: number, courseId: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("course_lessons").delete().eq("id", id);
  if (error) return { error: "Không thể xoá lesson, vui lòng thử lại." };

  revalidatePath(builderPath(courseId));
  return { error: null };
}

/**
 * Kéo-thả (Bước 3) — nhận NGUYÊN cây mong muốn sau khi thả (thứ tự section
 * + với mỗi section, thứ tự lesson id thuộc về nó) rồi ghi lại toàn bộ
 * `sort_order`/`section_id` trong 1 lần gọi — cùng tinh thần "gửi lên trạng
 * thái mong muốn toàn bộ" như PUT bulk-replace của route chung
 * (VisualEditor's reorder), chỉ khác là viết tay vì quan hệ lồng 2 cấp
 * (lesson có thể đổi `section_id` khi kéo SANG section khác) mà route
 * chung không biểu diễn được (route chung chỉ có 1 cấp `order` phẳng,
 * không có khái niệm cha-con giữa 2 bảng).
 */
export async function reorderCourseTree(
  courseId: string,
  sections: { id: number; lessonIds: number[] }[],
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  for (let i = 0; i < sections.length; i++) {
    const { error } = await supabase.from("course_sections").update({ sort_order: i }).eq("id", sections[i].id);
    if (error) return { error: "Không thể lưu thứ tự section, vui lòng thử lại." };
  }

  for (const section of sections) {
    for (let j = 0; j < section.lessonIds.length; j++) {
      const { error } = await supabase
        .from("course_lessons")
        .update({ section_id: section.id, sort_order: j })
        .eq("id", section.lessonIds[j]);
      if (error) return { error: "Không thể lưu thứ tự lesson, vui lòng thử lại." };
    }
  }

  revalidatePath(builderPath(courseId));
  return { error: null };
}
