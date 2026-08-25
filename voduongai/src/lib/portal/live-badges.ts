import { cache } from "react";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase";
import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";

/**
 * Nguồn thật cho Huy hiệu/Thành tựu (bảng Supabase `badges`/`user_badges`,
 * đã tồn tại từ Phase 30 nhưng CHƯA từng có code nào đọc/ghi cho tới đợt
 * Giai đoạn 8 này) — dùng cho tab "Tiến độ của tôi" của trang gộp
 * `/v2/hoc-vien-ai`.
 *
 * ---------------------------------------------------------------------------
 * MÔ HÌNH THẬT (không suy đoán — đọc trực tiếp schema qua Supabase MCP):
 * `badges` (id/slug/name/description/icon/course_id) — mỗi huy hiệu gắn
 * với ĐÚNG 1 khoá học (`course_id`, FK `courses`) qua field có sẵn trong
 * schema, không phải quyết định tự bịa: nghĩa là tiêu chí trao thưởng DUY
 * NHẤT mà schema này hỗ trợ là "hoàn thành 100% khoá học X". Không có cột
 * nào khác (không có tiêu chí theo streak/điểm số/số lượng...).
 *
 * RLS: `badges_read` (mọi người đọc được catalog) + `user_badges_read_own`
 * (user chỉ đọc huy hiệu CỦA CHÍNH MÌNH) — cả 2 ghi (`badges_admin`/
 * `user_badges_admin`) đều yêu cầu `is_app_admin()`, user thường KHÔNG tự
 * trao huy hiệu cho mình được qua session client. Vì vậy `awardCourseCompletionBadges()`
 * bắt buộc dùng `getSupabaseAdmin()` (service role, bypass RLS).
 * ---------------------------------------------------------------------------
 * GIỚI HẠN THẬT — CHƯA khép kín (đã audit code trước khi build, không suy
 * đoán): KHÔNG CÓ nơi nào trong toàn bộ dự án (kể cả 1.0) từng ghi vào
 * `user_lesson_progress` — trang xem bài học Premium duy nhất
 * (`CourseLearnClient.tsx`, `/portal/premium/[courseId]/hoc`) chỉ ĐỌC nội
 * dung, không có nút "Đánh dấu đã học". Nghĩa là `completedByCourse`
 * (`live-academy.ts`) hiện luôn rỗng trong thực tế → `awardCourseCompletionBadges()`
 * đúng logic, đã nối dây, nhưng SẼ KHÔNG BAO GIỜ TỰ CHẠY cho tới khi có 1
 * việc RIÊNG xây UI "đánh dấu hoàn thành bài học" (ghi `user_lesson_progress`)
 * — ngoài phạm vi Giai đoạn 8 (gộp trang, không phải xây lại trải nghiệm
 * học Premium). Ghi rõ ở đây để không ai tưởng nhầm hệ thống huy hiệu đã
 * "chạy thật" — đúng nguyên tắc NO-FAKE-DATA, không che giấu gap.
 * ---------------------------------------------------------------------------
 */

export type LiveBadge = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  courseId: string | null;
};

export type EarnedBadge = LiveBadge & { earnedAt: string };

/** Toàn bộ catalog huy hiệu (kể cả chưa ai đạt) — đọc công khai. */
export const getLiveBadges = cache(async (): Promise<LiveBadge[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("badges")
    .select("id, slug, name, description, icon, course_id")
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string | null) ?? "",
    icon: (row.icon as string | null) ?? "",
    courseId: (row.course_id as string | null) ?? null,
  }));
});

/** Huy hiệu CỦA user đang đăng nhập (rỗng nếu chưa đăng nhập/chưa đạt cái nào). */
export async function getUserBadges(): Promise<EarnedBadge[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await getSupabaseServer();
  const user = await getCachedAuthUser();
  const userId = user?.id;
  if (!userId) return [];

  const [{ data: earned }, badges] = await Promise.all([
    supabase.from("user_badges").select("badge_id, earned_at").eq("user_id", userId),
    getLiveBadges(),
  ]);
  const badgeById = new Map(badges.map((b) => [b.id, b] as const));

  return (earned ?? [])
    .map((row) => {
      const badge = badgeById.get(row.badge_id as string);
      if (!badge) return null;
      return { ...badge, earnedAt: row.earned_at as string };
    })
    .filter((b): b is EarnedBadge => b !== null);
}

/**
 * Trao huy hiệu "hoàn thành khoá học" cho `userId` — chỉ gọi được từ
 * server, dùng service role (xem lý do RLS ở docblock đầu file).
 * `completedCourseIds`: các `courses.id` mà `live-academy.ts` vừa xác nhận
 * user đã hoàn thành ĐỦ 100% bài Published. Best-effort — mọi lỗi (kể cả
 * chưa cấu hình `SUPABASE_SERVICE_ROLE_KEY`) đều no-op im lặng, không được
 * làm crash trang tiến độ chỉ vì bước "trao thưởng" phụ lỗi.
 */
export async function awardCourseCompletionBadges(userId: string, completedCourseIds: string[]): Promise<void> {
  if (completedCourseIds.length === 0) return;
  const admin = getSupabaseAdmin();
  if (!admin) return;

  try {
    const { data: eligibleBadges } = await admin.from("badges").select("id, course_id").in("course_id", completedCourseIds);
    if (!eligibleBadges || eligibleBadges.length === 0) return;

    const { data: alreadyEarned } = await admin
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId)
      .in(
        "badge_id",
        eligibleBadges.map((b) => b.id as string),
      );
    const earnedIds = new Set((alreadyEarned ?? []).map((r) => r.badge_id as string));

    const toInsert = eligibleBadges.filter((b) => !earnedIds.has(b.id as string)).map((b) => ({ user_id: userId, badge_id: b.id }));
    if (toInsert.length === 0) return;

    await admin.from("user_badges").insert(toInsert);
  } catch {
    // Best-effort — lỗi ở bước trao thưởng không được chặn hiển thị trang.
  }
}
