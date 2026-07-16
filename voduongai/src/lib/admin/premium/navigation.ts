import type { AdminWorkspaceSection } from "@/components/admin/AdminWorkspaceShell";

/**
 * Premium Workspace IA (PREMIUM-SPR-701 Task 2) — khớp 1:1 với 12 mục
 * "Premium" đã có sẵn trong `nav.ts` (không thêm/bớt mục nào — đúng
 * "Không tạo Route dư/Menu dư").
 *
 * Chỉ 4 route trực tiếp thuộc phạm vi Task 6 "Premium sở hữu Pricing,
 * Checkout, Order và Access Entitlement" (Sản phẩm số/Học phí/Đơn hàng/
 * Mã giảm giá) được bọc AdminWorkspaceShell trong Sprint này — Dịch vụ/
 * Hỗ trợ/Leads/Affiliate Hub là các dòng nghiệp vụ khác cùng nhóm nav
 * nhưng ngoài phạm vi "Course Commerce" của brief, không sửa (xem báo cáo
 * docs/admin/PREMIUM_WORKSPACE_MANAGEMENT_PREMIUM-SPR-701.md).
 */
/**
 * FOUNDER DIRECTIVE "PORTAL EXACT MIRROR ADMIN" (mục 5) — Premium quản lý
 * như hệ thống khóa học/thương mại quanh 6 chương trình thật. "Nội dung
 * học" trỏ về route quản lý chương/bài học/video/tài liệu ĐÃ CÓ THẬT
 * (/admin/academy/courses — bảng course_modules/course_lessons, thêm ở
 * STABILIZATION-SPR-1101), không tạo route mới, không tạo màn hình giả.
 * Ghi chú cũ "0% content model" (PREMIUM-SPR-701) đã lỗi thời — đính chính
 * tại đây. Bảng products cũ ẩn khỏi Founder (0 consumer checkout Portal).
 * 5 mục Affiliate vẫn ẩn khỏi tab bar — tương lai thuộc Premium → Affiliate.
 */
export const PREMIUM_WORKSPACE_SECTIONS: AdminWorkspaceSection[] = [
  { key: "premium", label: "Khoá học", href: "/admin/premium" },
  { key: "course-content", label: "Nội dung học", href: "/admin/academy/courses" },
  { key: "course-pricing", label: "Giá & mở bán", href: "/admin/course-pricing" },
  { key: "orders", label: "Đơn hàng", href: "/admin/orders" },
  { key: "coupons", label: "Mã giảm giá", href: "/admin/coupons" },
  { key: "services", label: "Dịch vụ", href: "/admin/services" },
  { key: "support", label: "Hỗ trợ", href: "/admin/support" },
  { key: "leads", label: "Leads", href: "/admin/leads" },
];
