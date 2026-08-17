import "../../inter-gf.css";
import "../../hanh-trinh-cua-toi/hanh-trinh-cua-toi.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Hành trình của tôi — Admin" };

/**
 * `/v2/admin/hanh-trinh-cua-toi` — khớp trực quan `/v2/hanh-trinh-cua-toi`
 * (CSS `.htct`). Đây là trang TỔNG QUAN hành trình học tập MỚI của 2.0
 * (khác hẳn "5 Cửa Hành trình" của `/portal/hanhtrinhcuatoi` 1.0 —
 * Mirror/Nhật ký học tập/My Story/Bản đồ hành trình/Khu vườn — trang 2.0
 * này không đụng hệ thống đó). Đọc `getJourneyOverview()`, tái dùng NGUYÊN
 * `getAcademyPaths()`/`getAcademyProgress()`/`getAcademyFeaturedCourses()`
 * — cùng dữ liệu "Học viện AI" đã quản lý, tính theo tiến độ THẬT của
 * từng người dùng nên không có "nội dung CMS" riêng để sửa ở đây.
 */
export default function AdminHanhTrinhCuaToiPage() {
  return (
    <AdminPortalMirror
      prefix="htct"
      title="Quản lý Hành trình của tôi"
      description="Trang tổng quan hành trình học tập 2.0 (khác 5 Cửa Hành trình 1.0) tính từ tiến độ THẬT của từng người dùng trên cùng dữ liệu Học viện AI — không có nội dung CMS riêng để sửa ở đây."
      stats={[]}
      note="Nội dung đứng sau (giai đoạn lộ trình/khoá học) quản lý ở trang 'Học viện AI'. Huy hiệu ('Thành tựu của tôi') có bảng thật nhưng chưa có huy hiệu nào được định nghĩa — Portal hiện đúng trạng thái rỗng trung thực, không phải lỗi."
      links={[{ label: "Quản lý nội dung Học viện AI (2.0) →", href: "/v2/admin/hoc-vien-ai" }]}
    />
  );
}
