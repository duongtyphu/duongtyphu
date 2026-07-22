import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Course Builder (Premium), Bước 4 — nội dung Section/Lesson cho trang
 * học viên `/portal/premium/[courseId]/hoc`. Đọc bảng typed
 * `course_sections`/`course_lessons` (Bước 1/2, KHÔNG phải schema
 * generic jsonb) qua `getSupabasePublic()` — cùng pattern mọi `live-*.ts`
 * khác trong dự án.
 *
 * `.eq("status", "Published")` ở cả 2 truy vấn — RLS ("public read
 * published", Bước 1) đã chặn Draft/Hidden ở tầng DB rồi, filter này chỉ
 * là lớp tường minh thứ 2 (đúng phong cách `live-projects.ts` đã làm),
 * không phải cơ chế ẩn duy nhất.
 */
export type LiveCourseLesson = {
  id: number;
  section_id: number;
  title: string;
  video_url: string | null;
  content: string | null;
  duration_minutes: number;
  is_free_preview: boolean;
};

export type LiveCourseSection = {
  id: number;
  title: string;
  lessons: LiveCourseLesson[];
};

export const getLiveCourseContent = cache(async (courseId: string): Promise<LiveCourseSection[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data: sectionRows, error: sectionError } = await supabase
    .from("course_sections")
    .select("id, title")
    .eq("course_id", courseId)
    .eq("status", "Published")
    .order("sort_order", { ascending: true });
  if (sectionError || !sectionRows || sectionRows.length === 0) return [];

  const { data: lessonRows, error: lessonError } = await supabase
    .from("course_lessons")
    .select("id, section_id, title, video_url, content, duration_minutes, is_free_preview")
    .in(
      "section_id",
      sectionRows.map((s) => s.id),
    )
    .eq("status", "Published")
    .order("sort_order", { ascending: true });

  const lessonsBySection = new Map<number, LiveCourseLesson[]>();
  if (!lessonError) {
    for (const lesson of lessonRows ?? []) {
      const list = lessonsBySection.get(lesson.section_id) ?? [];
      list.push(lesson);
      lessonsBySection.set(lesson.section_id, list);
    }
  }

  return sectionRows.map((s) => ({ ...s, lessons: lessonsBySection.get(s.id) ?? [] }));
});
