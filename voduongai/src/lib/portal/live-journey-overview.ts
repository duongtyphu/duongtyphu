import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";

import { getAcademyFeaturedCourses, getAcademyPaths, getAcademyProgress } from "./live-academy";

/**
 * Nguồn dữ liệu THẬT cho "Hành trình của tôi" 2.0 — `/v2/hanh-trinh-cua-toi`
 * (Bước F). Đây là trang TỔNG QUAN hành trình học tập (khác 5 "cửa" của
 * `/portal/hanhtrinhcuatoi` 1.0 — Mirror/Nhật ký học tập/My Story/Bản đồ
 * hành trình/Khu vườn — trang này KHÔNG đụng tới hệ thống đó, hoàn toàn là
 * trang mới của Học viện AI 2.0).
 *
 * Tái dùng trực tiếp `getAcademyPaths()`/`getAcademyProgress()`/
 * `getAcademyFeaturedCourses()` (đã có ở Bước E.2, `live-academy.ts`) —
 * không viết lại logic tính lộ trình/tiến độ.
 *
 * MỌI CHỖ BẢN THIẾT KẾ CÓ SỐ MẪU KHÔNG CÓ HỆ THỐNG BACKING THẬT:
 *  - "Điểm kinh nghiệm (XP)" — dự án chưa có hệ thống gamification (đã xác
 *    nhận nhiều lần ở các trang trước). Giữ `—`.
 *  - "Lộ trình của tôi" — bản thiết kế có 5 chặng đặt tên riêng, KHÔNG khớp
 *    `learning_paths` thật (4 giai đoạn, đã chốt taxonomy ở Bước C: Nhập
 *    môn AI/Làm chủ công cụ AI/Xây dựng hệ thống AI/Tạo giá trị & mở rộng).
 *    Dùng đúng 4 giai đoạn thật thay vì bịa thêm 1 chặng cho khớp số 5.
 *  - "Thành tựu của tôi" (huy hiệu) — bảng `badges`/`user_badges` (Phase
 *    30) có thật nhưng **0 huy hiệu nào được định nghĩa** (không phải 0
 *    người đạt — hệ thống huy hiệu chưa có nội dung nào cả). Trả mảng rỗng
 *    trung thực, không bịa 4 huy hiệu mẫu.
 *  - "Mục tiêu đang theo đuổi" — đọc `goal-runtime.ts` (localStorage), CHỈ
 *    thực hiện được ở Client Component (giống `ChienLuocCaNhanClient.tsx`)
 *    — hàm ở đây KHÔNG trả field này, `JourneyClient` tự đọc qua `useEffect`.
 */

export type JourneyStage = {
  slug: string;
  title: string;
  description: string;
  percent: number;
  lessonCount: number;
};

export type JourneyCourse = {
  id: string;
  name: string;
  lessonCount: number;
  completedCount: number;
  percent: number;
};

export type JourneyActivity = {
  id: string;
  kind: "lesson" | "reflection" | "capsule";
  title: string;
  occurredAt: string;
};

export type JourneyBadge = { id: string; name: string; icon: string | null };

export type JourneyOverview = {
  signedIn: boolean;
  overallPercent: number;
  totalLessons: number;
  completedLessons: number;
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  stages: JourneyStage[];
  currentStageIndex: number | null;
  courses: JourneyCourse[];
  streakDays: number;
  weekDots: { label: string; done: boolean }[];
  activities: JourneyActivity[];
  badges: JourneyBadge[];
};

/** Nhãn thứ theo `Date.getDay()` (0 = Chủ nhật). */
const WEEKDAY_BY_JSDAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function dateKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * `.week-dots` ở trang này có ĐÚNG 6 chấm (khác `.week-dots` 7 chấm
 * Mon-Sun của Nhật ký học tập — đã audit xác nhận markup gốc chỉ liệt kê 6
 * `.week-dot`) — dùng cửa sổ 6 ngày gần nhất, kết thúc ở hôm nay, thay vì
 * cố định Thứ 2→CN.
 */
function trailingSixDays(base: Date) {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() - 5);
}

const EMPTY: JourneyOverview = {
  signedIn: false,
  overallPercent: 0,
  totalLessons: 0,
  completedLessons: 0,
  totalCourses: 0,
  completedCourses: 0,
  totalHours: 0,
  stages: [],
  currentStageIndex: null,
  courses: [],
  streakDays: 0,
  weekDots: [],
  activities: [],
  badges: [],
};

export async function getJourneyOverview(): Promise<JourneyOverview> {
  const [paths, progress, featuredCourses] = await Promise.all([
    getAcademyPaths(),
    getAcademyProgress(),
    getAcademyFeaturedCourses(),
  ]);

  const stages: JourneyStage[] = paths.map((p) => {
    const completed = progress.completedByPath[p.slug] ?? 0;
    return {
      slug: p.slug,
      title: p.title,
      description: p.description,
      percent: p.lessonCount > 0 ? Math.round((completed / p.lessonCount) * 100) : 0,
      lessonCount: p.lessonCount,
    };
  });
  const firstIncomplete = stages.findIndex((s) => s.percent < 100);
  const currentStageIndex = stages.length === 0 ? null : firstIncomplete === -1 ? stages.length - 1 : firstIncomplete;

  const courses: JourneyCourse[] = featuredCourses
    .map((c) => {
      const completedCount = progress.completedByCourse[c.id] ?? 0;
      return {
        id: c.id,
        name: c.name,
        lessonCount: c.lessonCount,
        completedCount,
        percent: c.lessonCount > 0 ? Math.round((completedCount / c.lessonCount) * 100) : 0,
      };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 4);

  const completedCourses = featuredCourses.filter((c) => (progress.completedByCourse[c.id] ?? 0) === c.lessonCount && c.lessonCount > 0).length;

  const base: JourneyOverview = {
    ...EMPTY,
    signedIn: progress.signedIn,
    overallPercent: progress.percent,
    totalLessons: progress.totalLessons,
    completedLessons: progress.completedLessons,
    totalCourses: progress.totalCourses,
    completedCourses,
    totalHours: Math.round((progress.totalMinutes / 60) * 10) / 10,
    stages,
    currentStageIndex,
    courses,
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !progress.signedIn) {
    return base;
  }

  const supabase = await getSupabaseServer();
  const user = await getCachedAuthUser();
  const userId = user?.id;
  if (!userId) return base;

  const [{ data: lessonRows }, { data: reflectionRows }, { data: capsuleRows }, { data: badgeRows }] = await Promise.all([
    supabase
      .from("user_lesson_progress")
      .select("completed_at, course_lessons(title)")
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false }),
    supabase
      .from("reflections")
      .select("id, question, created_at")
      .eq("member_id", userId)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("memory_capsules")
      .select("id, title, occurred_at")
      .eq("member_id", userId)
      .order("occurred_at", { ascending: false })
      .limit(4),
    supabase.from("user_badges").select("badge_id, badges(id, name, icon)").eq("user_id", userId),
  ]);

  type LessonRow = { completed_at: string; course_lessons: { title: string } | null };
  const lessons = ((lessonRows ?? []) as unknown as LessonRow[]).filter((r) => r.completed_at);

  const now = new Date();
  const activeDayKeys = new Set(lessons.map((l) => dateKey(l.completed_at)));
  let streakDays = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (activeDayKeys.has(dateKey(cursor.toISOString()))) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sixDaysAgo = trailingSixDays(now);
  const weekDots = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(sixDaysAgo.getFullYear(), sixDaysAgo.getMonth(), sixDaysAgo.getDate() + i);
    return { label: WEEKDAY_BY_JSDAY[d.getDay()], done: activeDayKeys.has(dateKey(d.toISOString())) };
  });

  const activities: JourneyActivity[] = [
    ...lessons.slice(0, 4).map((l, i) => ({
      id: `lesson-${i}`,
      kind: "lesson" as const,
      title: l.course_lessons?.title ?? "Bài học",
      occurredAt: l.completed_at,
    })),
    ...(reflectionRows ?? []).map((r) => ({
      id: `reflection-${r.id}`,
      kind: "reflection" as const,
      title: r.question as string,
      occurredAt: r.created_at as string,
    })),
    ...(capsuleRows ?? []).map((c) => ({
      id: `capsule-${c.id}`,
      kind: "capsule" as const,
      title: c.title as string,
      occurredAt: c.occurred_at as string,
    })),
  ]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 4);

  type BadgeRow = { badge_id: string; badges: { id: string; name: string; icon: string | null } | null };
  const badges: JourneyBadge[] = ((badgeRows ?? []) as unknown as BadgeRow[])
    .filter((r) => r.badges)
    .map((r) => ({ id: r.badges!.id, name: r.badges!.name, icon: r.badges!.icon }));

  return { ...base, streakDays, weekDots, activities, badges };
}
