import type { PremiumCourseMatch } from "./PremiumProgramCard";

/**
 * Ghép 1 chương trình Premium (`PREMIUM_PROGRAMS`) với đúng dòng `courses`
 * thật trong Supabase.
 *
 * ---------------------------------------------------------------------------
 * VÌ SAO KHÔNG SO KHỚP THEO TÊN NỮA (bug thật, đã xảy ra)
 *
 * Bản cũ nằm trong `premium/page.tsx`, ghép bằng cách tìm dòng ĐẦU TIÊN có
 * `name` CHỨA một trong các `matchPatterns` (vd. "cơ bản"). Cách này vỡ ngay
 * khi có 2 khoá tên gần giống nhau: khoá nhập môn miễn phí "AI cho người mới
 * bắt đầu" từng được đặt tên "AI cơ bản cho mọi người" — cũng chứa "cơ bản",
 * lại sắp TRƯỚC "Lớp học AI Cơ bản" theo thứ tự tên, nên `find()` trả về khoá
 * FREE và thẻ khoá trả phí 1.500.000đ trên `/portal/premium` sẽ hiện giá 0đ.
 *
 * Lỗi này không cần ai gõ sai gì cả — chỉ cần thêm 1 khoá mới có tên hợp lý
 * là đủ. Vì vậy ghép theo `courses.id` (khoá chính, ổn định, do Admin quản ở
 * `/admin/course-pricing`), không theo chuỗi tên hiển thị vốn được sửa tự do.
 *
 * `courses.id` là `text` (KHÔNG phải số — `page.tsx` từng khai sai
 * `id: number`, không crash vì Supabase client không ép kiểu chặt).
 * ---------------------------------------------------------------------------
 */
export type MatchableCourseRow = {
  id: string;
  status: string;
  price: number;
};

export function matchCourse(
  courses: MatchableCourseRow[],
  courseId: string,
  purchasedCourseIds: Set<string>,
): PremiumCourseMatch {
  const row = courses.find((c) => String(c.id) === courseId);
  if (!row) return null;
  return {
    id: row.id,
    price: row.price,
    owned: purchasedCourseIds.has(String(row.id)),
    // Admin bật/tắt mở bán qua cột status tại /admin/course-pricing:
    // 'open' → CTA thanh toán; giá trị khác → "Sắp mở đăng ký".
    open: row.status === "open",
  };
}
