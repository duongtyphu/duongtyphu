import { getSupabaseServer } from "@/lib/supabase-server";

/**
 * Nguồn dữ liệu THẬT cho "Nhật ký học tập" 2.0 — `/v2/nhat-ky-hoc-tap`
 * (Bước F). Trang này KHÁC hẳn `/portal/nhatkyhoctap` 1.0 (đã Live-edit ở
 * Nhóm 3 Phần A — chỉ quản "chrome" tĩnh của 1 sổ nhật ký chiêm nghiệm) và
 * cũng khác `/v2/nhat-ky-hoi-thoai` (lịch sử chat Companion) — trang này là
 * 1 "learning log" tổng hợp hoạt động học tập thật từ nhiều nguồn có sẵn:
 *
 *  - `user_lesson_progress` (Phase 30, thật, có `completed_at`) — bài học
 *    Học viện AI đã hoàn thành, dùng để tính "Bài học đã hoàn thành"/
 *    "Thời gian học hôm nay"/lịch/streak/biểu đồ tuần.
 *  - `reflections` (thật, `useReflections()`) — chiêm nghiệm hằng ngày.
 *  - `memory_capsules` (thật, `useMemoryCapsules()`) — khoảnh khắc/bài học
 *    người dùng tự lưu.
 *  - `documents` (thật, bảng Admin "Tài liệu" — Sprint 4, đã dùng ở
 *    `/portal/resources`) — cho khối "Tài liệu & liên kết gần đây".
 *
 * KHÔNG có hệ thống nào trong dự án theo dõi "điểm kinh nghiệm (XP)"/thời
 * lượng phiên học không gắn với hoàn thành bài học — 2 phần này giữ trạng
 * thái trung thực (rỗng/gạch ngang) trong `NhatKyHocTapClient.tsx`, không
 * suy đoán ở đây.
 */

export type LearningLogEntry = {
  id: string;
  kind: "lesson" | "reflection" | "capsule";
  title: string;
  tagLabel: string;
  occurredAt: string;
};

export type LearningLogStats = {
  signedIn: boolean;
  minutesToday: number;
  lessonsCompletedTotal: number;
  streakDays: number;
  notesCount: number;
};

export type WeekChartDay = { label: string; minutes: number; isToday: boolean };
export type WeekDot = { label: string; done: boolean; isFuture: boolean };
export type CalendarDay = { day: number; iso: string; inMonth: boolean; done: boolean; isToday: boolean };

export type LearningLogData = {
  stats: LearningLogStats;
  entries: LearningLogEntry[];
  todayEntries: LearningLogEntry[];
  weekChart: WeekChartDay[];
  weekTotalMinutes: number;
  weekDots: WeekDot[];
  calendar: { monthLabel: string; days: CalendarDay[] };
  featuredNote: { text: string; authorName: string } | null;
  recentDocuments: { id: number; title: string; url: string }[];
};

const EMPTY_DATA: LearningLogData = {
  stats: { signedIn: false, minutesToday: 0, lessonsCompletedTotal: 0, streakDays: 0, notesCount: 0 },
  entries: [],
  todayEntries: [],
  weekChart: [],
  weekTotalMinutes: 0,
  weekDots: [],
  calendar: { monthLabel: "", days: [] },
  featuredNote: null,
  recentDocuments: [],
};

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function dateKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function startOfWeek(base: Date) {
  const day = base.getDay(); // 0 = CN
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(base.getFullYear(), base.getMonth(), base.getDate() + diffToMonday);
  return monday;
}

export async function getLearningLogData(): Promise<LearningLogData> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return EMPTY_DATA;
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data: docsRows } = await supabase
    .from("documents")
    .select("id, title, url, active, display_order")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .limit(3);
  const recentDocuments = (docsRows ?? []).map((d) => ({
    id: d.id as number,
    title: d.title as string,
    url: (d.url as string | null) ?? "#",
  }));

  if (!user) {
    return { ...EMPTY_DATA, recentDocuments };
  }

  const [{ data: memberRow }, { data: progressRows }, { data: reflectionRows }, { data: capsuleRows }] =
    await Promise.all([
      supabase.from("members").select("full_name").eq("id", user.id).maybeSingle(),
      supabase
        .from("user_lesson_progress")
        .select("status, completed_at, watched_seconds, lesson_id, course_lessons(title, duration_minutes)")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .not("completed_at", "is", null),
      supabase
        .from("reflections")
        .select("id, question, answer, created_at")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("memory_capsules")
        .select("id, kind, title, description, occurred_at")
        .eq("member_id", user.id)
        .order("occurred_at", { ascending: false }),
    ]);

  type LessonRow = { completed_at: string; course_lessons: { title: string; duration_minutes: number | null } | null };
  const lessons = ((progressRows ?? []) as unknown as LessonRow[]).filter((r) => r.completed_at);

  const reflections = reflectionRows ?? [];
  const capsules = capsuleRows ?? [];

  // ---- entries: gộp cả 3 nguồn thành 1 dòng thời gian ----
  const entries: LearningLogEntry[] = [
    ...lessons.map((l, i) => ({
      id: `lesson-${i}-${l.completed_at}`,
      kind: "lesson" as const,
      title: l.course_lessons?.title ?? "Bài học đã hoàn thành",
      tagLabel: "Học viện AI",
      occurredAt: l.completed_at,
    })),
    ...reflections.map((r) => ({
      id: `reflection-${r.id}`,
      kind: "reflection" as const,
      title: r.question as string,
      tagLabel: "Chiêm nghiệm",
      occurredAt: r.created_at as string,
    })),
    ...capsules.map((c) => ({
      id: `capsule-${c.id}`,
      kind: "capsule" as const,
      title: c.title as string,
      tagLabel: "Ghi chú",
      occurredAt: c.occurred_at as string,
    })),
  ].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  const now = new Date();
  const todayKey = dateKey(now.toISOString());
  const todayEntries = entries
    .filter((e) => dateKey(e.occurredAt) === todayKey)
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());

  // ---- stats ----
  const minutesToday = lessons
    .filter((l) => dateKey(l.completed_at) === todayKey)
    .reduce((sum, l) => sum + (l.course_lessons?.duration_minutes ?? 0), 0);

  const activeDayKeys = new Set(entries.map((e) => dateKey(e.occurredAt)));
  let streakDays = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (activeDayKeys.has(dateKey(cursor.toISOString()))) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const stats: LearningLogStats = {
    signedIn: true,
    minutesToday,
    lessonsCompletedTotal: lessons.length,
    streakDays,
    notesCount: reflections.length + capsules.length,
  };

  // ---- week chart (thứ 2 -> CN tuần hiện tại) ----
  const monday = startOfWeek(now);
  const weekChart: WeekChartDay[] = [];
  const weekDots: WeekDot[] = [];
  let weekTotalMinutes = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const key = dateKey(d.toISOString());
    const minutes = lessons
      .filter((l) => dateKey(l.completed_at) === key)
      .reduce((sum, l) => sum + (l.course_lessons?.duration_minutes ?? 0), 0);
    weekTotalMinutes += minutes;
    weekChart.push({ label: WEEKDAY_LABELS[i], minutes, isToday: key === todayKey });
    weekDots.push({ label: WEEKDAY_LABELS[i], done: activeDayKeys.has(key), isFuture: d.getTime() > now.getTime() });
  }

  // ---- lịch tháng hiện tại ----
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = T2
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: CalendarDay[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    const day = daysInPrevMonth - firstWeekday + 1 + i;
    calendarDays.push({ day, iso: "", inMonth: false, done: false, isToday: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = dateKey(d.toISOString());
    calendarDays.push({
      day,
      iso: d.toISOString(),
      inMonth: true,
      done: activeDayKeys.has(key),
      isToday: key === todayKey,
    });
  }
  const remainder = calendarDays.length % 7;
  if (remainder > 0) {
    for (let day = 1; day <= 7 - remainder; day++) {
      calendarDays.push({ day, iso: "", inMonth: false, done: false, isToday: false });
    }
  }

  const featuredReflection = reflections[0] as { answer: string } | undefined;
  const featuredCapsule = capsules.find((c) => c.description) as { description: string } | undefined;
  const featuredText = featuredReflection?.answer ?? featuredCapsule?.description ?? null;
  const featuredNote =
    featuredText != null
      ? {
          text: featuredText,
          authorName: (memberRow?.full_name as string | null) || "Bạn",
        }
      : null;

  return {
    stats,
    entries,
    todayEntries,
    weekChart,
    weekTotalMinutes,
    weekDots,
    calendar: { monthLabel: `Tháng ${month + 1}, ${year}`, days: calendarDays },
    featuredNote,
    recentDocuments,
  };
}
