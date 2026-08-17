import "../../inter-gf.css";
import "../../nhat-ky-hoc-tap/nhat-ky-hoc-tap.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Nhật ký học tập — Admin" };

/**
 * `/v2/admin/nhat-ky-hoc-tap` — khớp trực quan `/v2/nhat-ky-hoc-tap` (CSS
 * `.nkt`). Portal đọc `getLearningLogData()` — hoạt động học tập THẬT của
 * CHÍNH người dùng đang xem (streak/phút học/lịch tháng, tính từ tiến độ
 * bài học Course Builder của riêng họ) — đây là dữ liệu PER-USER, không
 * phải nội dung CMS để "quản lý" (không có gì để sửa/thêm/xoá hàng loạt ở
 * đây, tương tự Nhật ký học tập 5-Cửa Hành trình ở Admin 1.0 chỉ quản
 * phần "chrome" tĩnh, không đụng dữ liệu hoạt động). Nội dung THẬT đứng
 * sau các con số này (khoá học/bài học) đã quản lý ở "Học viện AI".
 */
export default function AdminNhatKyHocTapPage() {
  return (
    <AdminPortalMirror
      prefix="nkt"
      title="Quản lý Nhật ký học tập"
      description="Trang này hiển thị hoạt động học tập THẬT theo từng người dùng (streak/phút học/lịch) — không phải nội dung CMS, không có gì để chỉnh sửa hàng loạt ở đây."
      stats={[]}
      note="Nội dung đứng sau số liệu này (khoá học/bài học) quản lý ở trang 'Học viện AI'. Nếu cần sửa chrome tĩnh (tiêu đề/nhãn) cho khái niệm Nhật ký học tập ở 5 Cửa Hành trình (1.0, khác trang này), xem /admin/hanh-trinh-cua-toi/journal."
      links={[
        { label: "Quản lý nội dung Học viện AI (2.0) →", href: "/v2/admin/hoc-vien-ai" },
        { label: "Nhật ký học tập — 5 Cửa Hành trình (Admin 1.0) →", href: "/admin/hanh-trinh-cua-toi/journal" },
      ]}
    />
  );
}
