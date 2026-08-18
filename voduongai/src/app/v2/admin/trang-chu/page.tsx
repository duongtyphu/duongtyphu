import "../../inter-gf.css";
import "../../trang-chu/trang-chu.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Trang chủ Portal — Admin" };

/**
 * `/v2/admin/trang-chu` — khớp trực quan `/v2/trang-chu` (CSS `.tcp`).
 *
 * ĐÃ NỐI DỮ LIỆU THẬT một phần (cập nhật sau đợt sửa Trang chủ theo yêu
 * cầu Founder): cột `.right-col` bịa (chào mừng/Premium hết hạn giả,
 * XP/streak giả, thông báo giả) đã BỊ XOÁ HẲN khỏi trang; "Tiếp tục học
 * tập" đọc `getAcademyFeaturedCourses()`/`getAcademyProgress()` (cùng
 * nguồn `/v2/hoc-vien-ai`, tiến độ per-user thật qua `user_lesson_progress`);
 * "Gợi ý dành cho bạn" đọc 1 mục mới nhất/loại từ 5 bảng CKOS
 * `prompts`/`templates`/`sop`/`ebooks`/`tools`
 * (`src/lib/portal/live-resource-suggestions.ts`). Mọi liên kết
 * (Hero/topbar/sidebar/"Xem tất cả"...) đã trỏ đúng route thật, không còn
 * `href="#"` nào.
 *
 * VẪN CHƯA có bảng CMS riêng cho Hero (banner chào mừng cố định
 * "Chào mừng bạn trở lại!"/avatar "Võ Đương") và "Khám phá nhanh" (6 thẻ
 * điều hướng, tên/mô tả vẫn hardcode) — 2 khối này chưa có gì để quản lý
 * qua Admin. Vì vậy trang này VẪN chưa có "Sửa nhanh"/link quản lý nào —
 * chỉ hiện đúng trạng thái thật, tránh dựng CRUD giả cho phần chưa có
 * bảng backing.
 */
export default function AdminTrangChuPage() {
  return (
    <AdminPortalMirror
      prefix="tcp"
      title="Quản lý Trang chủ Portal"
      description="Trang chủ Portal 2.0: 'Tiếp tục học tập'/'Gợi ý dành cho bạn' và mọi liên kết điều hướng đã nối dữ liệu thật; Hero/'Khám phá nhanh' vẫn hardcode, chưa có bảng Supabase backing."
      stats={[]}
      note="Chưa có gì để quản lý qua Admin cho Hero/'Khám phá nhanh' (cần 1 việc riêng: tạo bảng CMS cho banner/quick-explore, tương tự home_cards ở Admin 1.0, trước khi có trang quản lý thật ở đây)."
      links={[]}
    />
  );
}
