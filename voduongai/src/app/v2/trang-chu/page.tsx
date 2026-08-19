import { getAcademyFeaturedCourses, getAcademyProgress } from "@/lib/portal/live-academy";
import { getResourceSuggestions } from "@/lib/portal/live-resource-suggestions";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { TrangChuClient } from "./TrangChuClient";

/**
 * `/v2/trang-chu` — Server Component: đọc dữ liệu thật cho "Tiếp tục học
 * tập" (khoá có nội dung Course Builder + tiến độ per-user thật, cùng
 * nguồn `getAcademyFeaturedCourses()`/`getAcademyProgress()` đã dùng ở
 * `/v2/hoc-vien-ai`) và "Gợi ý dành cho bạn" (1 mục mới nhất/loại từ 5
 * bảng CKOS `prompts`/`templates`/`sop`/`ebooks`/`tools`) + trạng thái
 * Premium thật (`getPremiumStatus()`, dropdown hồ sơ thật + ẩn mời nâng
 * cấp cho tài khoản đã Premium — cùng nguyên tắc site-wide đã áp dụng cho
 * `PortalV2Shell`), rồi truyền xuống `TrangChuClient` (Client Component vì
 * bản gốc có state công tắc chủ đề + điều hướng bằng router).
 */
export default async function TrangChuPortalPage() {
  const [courses, progress, suggestions, premium] = await Promise.all([
    getAcademyFeaturedCourses(),
    getAcademyProgress(),
    getResourceSuggestions(),
    getPremiumStatus(),
  ]);

  return <TrangChuClient courses={courses} progress={progress} suggestions={suggestions} premium={premium} />;
}
