import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAcademyProgress } from "@/lib/portal/live-academy";
import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";

/**
 * Portal 2.0, Giai đoạn 9 (tiếp) — "Companion trưởng thành" theo đúng định
 * nghĩa Founder chốt lại: "có khả năng ghi nhớ người dùng về quá trình học
 * AI" (KHÔNG phải hệ XP/level trang trí cho nhân vật Companion đã đề xuất
 * và bị thay thế). Đây là NGƯỜI HỌC nhớ, không phải Companion tự "lớn
 * lên" — mỗi lượt chat đọc lại đúng 3 nguồn dữ liệu THẬT đã tồn tại từ
 * trước (không tạo bảng mới, không bịa số liệu):
 *
 * 1. Tiến độ Học viện AI (`getAcademyProgress()`, đã dùng ở `/v2/companion`'s
 *    vòng tròn hồ sơ) — % hoàn thành, số bài đã học/tổng.
 * 2. "Mỗi ngày một ý tưởng" (`getMnytStateBundle()`) — chuỗi ngày học liên
 *    tiếp, tổng ý tưởng đã hoàn thành, số huy hiệu.
 * 3. Mục tiêu đang hoạt động — query trực tiếp `goal_records` (KHÔNG qua
 *    `goal-runtime.ts`'s `hydrateGoalRuntime()`/cache — hàm đó dùng
 *    `getSupabaseBrowser()`, chỉ chạy đúng trong trình duyệt, không dùng
 *    được trong Route Handler server-side này).
 *
 * Best-effort — mỗi nguồn tự bọc try/catch riêng, 1 nguồn lỗi không chặn
 * 2 nguồn còn lại (đúng nguyên tắc honest-fallback áp dụng xuyên suốt dự
 * án). Trả về CHUỖI RỖNG nếu cả 3 nguồn đều không có gì — không hiện 1
 * khối "Hồ sơ học tập" trống rỗng vào prompt.
 */
export async function getCompanionLearnerMemory(supabase: SupabaseClient, userId: string): Promise<string> {
  const lines: string[] = [];

  try {
    const academy = await getAcademyProgress();
    if (academy.signedIn && academy.totalLessons > 0) {
      lines.push(
        `Học viện AI: đã hoàn thành ${academy.completedLessons}/${academy.totalLessons} bài học (${academy.percent}%), đang học ${academy.startedCourses}/${academy.totalCourses} khoá.`
      );
    }
  } catch {
    // Best-effort — bỏ qua nguồn này nếu lỗi, không chặn 2 nguồn còn lại.
  }

  try {
    const mnyt = await getMnytStateBundle();
    if (mnyt.signedIn && (mnyt.completedIds.length > 0 || mnyt.streak > 0)) {
      lines.push(
        `Mỗi ngày một ý tưởng: đã hoàn thành ${mnyt.completedIds.length} ý tưởng, chuỗi ngày học liên tiếp hiện tại ${mnyt.streak} ngày, đã đạt ${mnyt.badges.length} huy hiệu.`
      );
    }
  } catch {
    // Best-effort.
  }

  try {
    const { data: goals } = await supabase
      .from("goal_records")
      .select("title, status")
      .eq("member_id", userId)
      .in("status", ["active", "ready_for_analysis"])
      .order("created_at", { ascending: false })
      .limit(5);
    if (goals && goals.length > 0) {
      const titles = goals.map((g) => `"${g.title}"`).join(", ");
      lines.push(`Mục tiêu đang theo đuổi: ${titles}.`);
    }
  } catch {
    // Best-effort.
  }

  if (lines.length === 0) return "";

  return `Hồ sơ học tập THẬT của người dùng này (dữ liệu đo được, không suy đoán) — dùng để cá nhân hoá câu trả lời, nhắc lại đúng tiến độ khi phù hợp, KHÔNG lặp lại máy móc mỗi câu:\n${lines.join("\n")}`;
}
