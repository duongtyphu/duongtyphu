import { cache } from "react";

import { getSupabasePublic } from "@/lib/supabase";
import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";
import { getLiveKnowledgeSeeds } from "@/lib/portal/live-knowledge";
import { awardCourseCompletionBadges } from "@/lib/portal/live-badges";
import type { PremiumStatus } from "@/lib/v2/premium-access";

/**
 * Nguồn dữ liệu THẬT cho Học viện AI 2.0 — `/v2/hoc-vien-ai` (Bước E.2).
 *
 * Bảng: `learning_paths` (4 giai đoạn, DÙNG CHUNG với CKOS — cùng bảng đã
 * chốt taxonomy ở Bước C), `learning_path_courses` (junction), `courses`,
 * `course_sections`/`course_lessons` (Course Builder — Premium), và
 * `user_lesson_progress` (tiến độ per-user, bảng THẬT đã tạo ở Phase 30,
 * hiện 0 dòng vì hệ thống mới — không phải chưa có hạ tầng).
 *
 * ---------------------------------------------------------------------------
 * TRẠNG THÁI DỮ LIỆU THẬT TẠI THỜI ĐIỂM BUILD (không suy đoán, đã audit qua
 * Supabase MCP): CHỈ 1 khoá học có nội dung Course Builder thật —
 * `ai-cho-nguoi-moi-bat-dau` ("AI cho người mới bắt đầu", free, 4 chương/16
 * bài, toàn bộ Published + `is_free_preview=true`), gắn vào giai đoạn 1
 * "Nhập môn AI". 5 khoá còn lại (`ai-coban`/`ai-nangcao`/`openclaw`/`solo`/
 * `scale`) thuộc luồng Premium 1.0 cũ, KHÔNG có section/lesson Course
 * Builder nào Published — nên KHÔNG xuất hiện trong "Khóa học nổi bật" ở
 * đây (lọc theo `lessonCount > 0`, không lọc theo `status`).
 *
 * MỌI CHỖ BẢN THIẾT KẾ CÓ SỐ MẪU KHÔNG CÓ BẢNG NÀO BACKING THẬT (rating
 * "★ 4.8 (256)", "Lớp học sắp diễn ra" LIVE, "Điểm kinh nghiệm XP") — không
 * bịa số. Xem chú thích tương ứng trong `HocVienClient.tsx`.
 * ---------------------------------------------------------------------------
 * BƯỚC D — KHOÁ NỘI DUNG PREMIUM Ở TẦNG SERVER
 *
 * `course_lessons` có RLS "public read published" (mọi người đọc được mọi
 * dòng `Published`) — giống hệt lý do đã áp dụng cho `knowledge_assets`.
 * `getAcademyLesson()` đọc `content`/`video_url` và CẮT BỎ ngay tại server
 * nếu `is_free_preview=false` mà user chưa Premium. Hiện CHƯA có trang chi
 * tiết bài học nào gọi hàm này (khoá duy nhất có nội dung đang free 100%,
 * và thiết kế "Hoc vien AI.html" chỉ là trang hub, không có trang xem bài
 * học) — dựng sẵn hạ tầng đúng như `getCkosDocument()` đã làm ở Bước D,
 * sẵn sàng cho khi có khoá Premium thật + trang xem bài học.
 * ---------------------------------------------------------------------------
 */

type PathRow = {
  slug: string;
  title: string;
  description: string | null;
  stage_order: number;
};

export type AcademyPath = {
  slug: string;
  title: string;
  /**
   * Câu đầu tiên của `learning_paths.description` (đoạn "Mục tiêu: ..."
   * đầy đủ dùng cho trang lộ trình chi tiết sau này) — bản thiết kế chỉ có
   * 1 dòng ngắn trong `.path-card p` (min-height 36px ~ 2 dòng), cột
   * `subtitle` (nhãn 2-3 từ, dùng cho widget CKOS) lại quá ngắn cho vị trí
   * này. Cắt câu đầu là cách trung thực nhất — không bịa câu mới, không
   * dùng nguyên đoạn dài làm vỡ layout thẻ.
   */
  description: string;
  stageOrder: number;
  /** Số bài học Published thuộc các khoá đã gắn vào giai đoạn này — đếm thật. */
  lessonCount: number;
  /**
   * Số Lesson CKOS (`knowledge_seeds`, "Journey Engine" của Hệ tri thức) map
   * vào giai đoạn này qua `difficulty` — xem `CKOS_DIFFICULTY_TO_PATH_SLUG`.
   * Field CỘNG THÊM, KHÔNG gộp vào `lessonCount` — `lessonCount` được
   * `getAcademyPaths()` dùng chung bởi `live-journey-overview.ts` (widget
   * "Hành trình của tôi") và 2 trang Admin (`admin/hoc-vien-ai`,
   * `admin/dashboard`) để tính % hoàn thành qua `completedByPath` — mà
   * `completedByPath` CHỈ đếm được tiến độ `course_lessons` thật
   * (`user_lesson_progress.lesson_id` là `bigint`, không map được sang
   * `knowledge_seeds.id` dạng slug). Gộp seed vào mẫu số `lessonCount` sẽ
   * làm % hoàn thành bị pha loãng giả tạo (mãi không lên 100% dù đã học hết
   * phần trackable) ở MỌI nơi dùng chung hàm này, không riêng tab này —
   * nên tách field riêng, chỉ hiển thị số lượng (không có state "hoàn
   * thành") ở đúng nơi cần (tab "Khóa học & Lộ trình" của trang gộp).
   */
  ckosLessonCount: number;
};

/**
 * Map `difficulty` của Lesson CKOS (`knowledge_seeds`) sang giai đoạn
 * (`learning_paths.slug`) — dùng field khách quan đã có sẵn (Founder tự
 * chọn khi tạo từng Lesson qua `/admin/ckos/lessons`), không bịa thêm
 * phân loại mới. Dữ liệu thật hiện tại (audit Supabase, 11 Lesson): 8
 * BEGINNER + 3 INTERMEDIATE, 0 ADVANCED — nên "Xây dựng hệ thống AI"/"Tạo
 * giá trị & mở rộng" đang có 0 Lesson CKOS, đúng thực trạng nội dung
 * (11 Lesson đều là kỹ năng văn phòng/nghiên cứu cơ bản-trung cấp), không
 * phải lỗi mapping.
 */
const CKOS_DIFFICULTY_TO_PATH_SLUG: Record<string, string> = {
  BEGINNER: "nhap-mon-ai",
  INTERMEDIATE: "lam-chu-cong-cu-ai",
  ADVANCED: "xay-dung-he-thong-ai",
};

export type AcademyCourse = {
  id: string;
  name: string;
  description: string;
  lessonCount: number;
};

type LessonRef = { id: number; courseId: string; pathSlug: string | null; durationMinutes: number };

/** Toàn bộ bài học Published, kèm khoá/giai đoạn sở hữu — dùng chung cho path/course/progress. */
const getAcademyPublishedLessons = cache(async (): Promise<LessonRef[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const [{ data: sections }, { data: paths }, { data: pathCourses }] = await Promise.all([
    supabase.from("course_sections").select("id, course_id").eq("status", "Published"),
    supabase.from("learning_paths").select("id, slug"),
    supabase.from("learning_path_courses").select("path_id, course_id"),
  ]);

  const pathSlugById = new Map<string, string>();
  for (const p of paths ?? []) pathSlugById.set(p.id as string, p.slug as string);

  // 1 khoá chỉ map 1 giai đoạn ở dữ liệu thật hiện tại (unique(path_id,
  // course_id) không cấm 1 khoá thuộc nhiều giai đoạn — nếu sau này có,
  // dòng cuối cùng thắng, chấp nhận được vì "X bài học" chỉ mang tính tham
  // khảo tiến độ, không phải khoá học chính thức duy nhất).
  const pathSlugByCourse = new Map<string, string>();
  for (const pc of pathCourses ?? []) {
    const slug = pathSlugById.get(pc.path_id as string);
    if (slug) pathSlugByCourse.set(pc.course_id as string, slug);
  }

  const courseBySection = new Map<number, string>();
  for (const s of sections ?? []) courseBySection.set(s.id as number, s.course_id as string);

  const sectionIds = (sections ?? []).map((s) => s.id as number);
  if (sectionIds.length === 0) return [];

  const { data: lessons } = await supabase
    .from("course_lessons")
    .select("id, section_id, duration_minutes")
    .eq("status", "Published")
    .in("section_id", sectionIds);

  const refs: LessonRef[] = [];
  for (const l of lessons ?? []) {
    const courseId = courseBySection.get(l.section_id as number);
    if (!courseId) continue;
    refs.push({
      id: l.id as number,
      courseId,
      pathSlug: pathSlugByCourse.get(courseId) ?? null,
      durationMinutes: (l.duration_minutes as number | null) ?? 0,
    });
  }
  return refs;
});

export const getAcademyPaths = cache(async (): Promise<AcademyPath[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const [{ data: paths }, lessons, seeds] = await Promise.all([
    supabase.from("learning_paths").select("slug, title, description, stage_order").order("stage_order"),
    getAcademyPublishedLessons(),
    getLiveKnowledgeSeeds(),
  ]);

  const countBySlug = new Map<string, number>();
  for (const l of lessons) {
    if (!l.pathSlug) continue;
    countBySlug.set(l.pathSlug, (countBySlug.get(l.pathSlug) ?? 0) + 1);
  }

  const ckosCountBySlug = new Map<string, number>();
  for (const seed of seeds) {
    const pathSlug = CKOS_DIFFICULTY_TO_PATH_SLUG[seed.difficulty];
    if (!pathSlug) continue;
    ckosCountBySlug.set(pathSlug, (ckosCountBySlug.get(pathSlug) ?? 0) + 1);
  }

  return (paths ?? []).map((row) => {
    const p = row as PathRow;
    const description = p.description ?? "";
    const dotIndex = description.indexOf(". ");
    return {
      slug: p.slug,
      title: p.title,
      description: dotIndex === -1 ? description : description.slice(0, dotIndex + 1),
      stageOrder: p.stage_order ?? 0,
      lessonCount: countBySlug.get(p.slug) ?? 0,
      ckosLessonCount: ckosCountBySlug.get(p.slug) ?? 0,
    };
  });
});

/** Khoá học có nội dung Course Builder thật (>=1 bài Published) — không lọc theo giá/status "open". */
export const getAcademyFeaturedCourses = cache(async (): Promise<AcademyCourse[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const [{ data: courses }, lessons] = await Promise.all([
    supabase.from("courses").select("id, name, description"),
    getAcademyPublishedLessons(),
  ]);

  const countByCourse = new Map<string, number>();
  for (const l of lessons) countByCourse.set(l.courseId, (countByCourse.get(l.courseId) ?? 0) + 1);

  return (courses ?? [])
    .map((c) => ({
      id: c.id as string,
      name: c.name as string,
      description: (c.description as string | null) ?? "",
      lessonCount: countByCourse.get(c.id as string) ?? 0,
    }))
    .filter((c) => c.lessonCount > 0);
});

export type AcademyProgress = {
  signedIn: boolean;
  totalLessons: number;
  completedLessons: number;
  totalCourses: number;
  startedCourses: number;
  totalMinutes: number;
  /** 0-100, làm tròn. 0 khi `totalLessons = 0`. */
  percent: number;
  /** Số bài đã hoàn thành theo từng giai đoạn (`learning_paths.slug`). */
  completedByPath: Record<string, number>;
  /** Số bài đã hoàn thành theo từng khoá (`courses.id`) — khác `completedByPath`. */
  completedByCourse: Record<string, number>;
};

const EMPTY_PROGRESS: Omit<AcademyProgress, "totalLessons" | "totalCourses"> = {
  signedIn: false,
  completedLessons: 0,
  startedCourses: 0,
  totalMinutes: 0,
  percent: 0,
  completedByPath: {},
  completedByCourse: {},
};

/**
 * Tiến độ học thật của user đang đăng nhập, đọc `user_lesson_progress`
 * (Phase 30 — có thật, hiện 0 dòng vì hệ thống mới). Chưa đăng nhập/chưa
 * cấu hình Supabase → 0 trung thực, không suy đoán.
 */
export async function getAcademyProgress(): Promise<AcademyProgress> {
  const lessons = await getAcademyPublishedLessons();
  const totalLessons = lessons.length;
  const totalCourses = new Set(lessons.map((l) => l.courseId)).size;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { ...EMPTY_PROGRESS, totalLessons, totalCourses };
  }

  const supabase = await getSupabaseServer();
  const user = await getCachedAuthUser();
  const userId = user?.id;
  if (!userId || totalLessons === 0) {
    return { ...EMPTY_PROGRESS, totalLessons, totalCourses };
  }

  const byLessonId = new Map(lessons.map((l) => [l.id, l]));
  const { data: rows } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id, status")
    .eq("user_id", userId)
    .in("lesson_id", lessons.map((l) => l.id));

  const completedByPath: Record<string, number> = {};
  const completedByCourse: Record<string, number> = {};
  const startedCourseIds = new Set<string>();
  let completedLessons = 0;
  let totalMinutes = 0;

  for (const row of rows ?? []) {
    const ref = byLessonId.get(row.lesson_id as number);
    if (!ref) continue;
    const status = row.status as string;
    if (status === "in_progress" || status === "completed") startedCourseIds.add(ref.courseId);
    if (status === "completed") {
      completedLessons += 1;
      totalMinutes += ref.durationMinutes;
      if (ref.pathSlug) completedByPath[ref.pathSlug] = (completedByPath[ref.pathSlug] ?? 0) + 1;
      completedByCourse[ref.courseId] = (completedByCourse[ref.courseId] ?? 0) + 1;
    }
  }

  // Giai đoạn 8 — trao huy hiệu "hoàn thành khoá học" ngay khi phát hiện 1
  // khoá vừa đủ 100% (best-effort, không chặn hiển thị nếu lỗi — xem
  // awardCourseCompletionBadges()). Đặt ở đây vì đây là nơi DUY NHẤT trong
  // toàn dự án tính được "khoá nào user vừa hoàn thành đủ" (so completedByCourse
  // với tổng số bài Published của đúng khoá đó qua `lessons`).
  const totalByCourse = new Map<string, number>();
  for (const l of lessons) totalByCourse.set(l.courseId, (totalByCourse.get(l.courseId) ?? 0) + 1);
  const fullyCompletedCourseIds = Object.entries(completedByCourse)
    .filter(([courseId, count]) => count > 0 && count === totalByCourse.get(courseId))
    .map(([courseId]) => courseId);
  await awardCourseCompletionBadges(userId, fullyCompletedCourseIds);

  return {
    signedIn: true,
    totalLessons,
    completedLessons,
    totalCourses,
    startedCourses: startedCourseIds.size,
    totalMinutes,
    percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    completedByPath,
    completedByCourse,
  };
}

export type AcademyLessonDetail = {
  id: number;
  title: string;
  durationMinutes: number;
  isFreePreview: boolean;
  /** Rỗng khi `locked` — server không trả nội dung về client. */
  content: string;
  videoUrl: string | null;
  locked: boolean;
};

/**
 * Đọc 1 bài học kèm nội dung. Nội dung Premium (`is_free_preview=false`)
 * bị CẮT ngay tại server nếu user chưa Premium — cùng cơ chế `getCkosDocument()`
 * ở Bước D. Chưa có UI nào gọi hàm này (xem docblock đầu file).
 */
export async function getAcademyLesson(lessonId: number, status: PremiumStatus): Promise<AcademyLessonDetail | null> {
  const supabase = getSupabasePublic();
  if (!supabase) return null;

  const { data: row } = await supabase
    .from("course_lessons")
    .select("id, title, content, video_url, duration_minutes, is_free_preview")
    .eq("id", lessonId)
    .eq("status", "Published")
    .maybeSingle();
  if (!row) return null;

  const isFreePreview = Boolean(row.is_free_preview);
  const locked = !isFreePreview && !status.isPremium;

  return {
    id: row.id as number,
    title: row.title as string,
    durationMinutes: (row.duration_minutes as number | null) ?? 0,
    isFreePreview,
    content: locked ? "" : ((row.content as string | null) ?? ""),
    videoUrl: locked ? null : ((row.video_url as string | null) ?? null),
    locked,
  };
}
