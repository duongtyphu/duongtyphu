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
 * PMO DIRECTIVE "ADMIN CMS v1.1 UI REFINEMENT" (Task 6/7, PMO APPROVAL) —
 * trình bày như hệ thống khoá học & thương mại: Khoá học/Giá & mở bán/
 * Đơn hàng/Mã giảm giá là lõi Course Commerce. "Đơn hàng" không còn là mục
 * Sidebar cấp 1 (chuyển vào đây theo đúng Task 6). Ghi chú thật: chưa có
 * màn hình quản trị riêng cho Nội dung học/Chương & bài học/Video & tài
 * liệu/Quyền truy cập — Portal hiện chưa có Course Structure/Learning
 * Object nào (0% content model, xem docs/admin/workspaces/premium
 * report PREMIUM-SPR-701) — không tạo màn hình giả cho các mục này.
 * 5 mục Affiliate (Task 7) ẩn khỏi tab bar — chưa xây thêm chức năng
 * Affiliate mới, tương lai thuộc đây (Premium → Affiliate) khi được giao.
 */
export const PREMIUM_WORKSPACE_SECTIONS: AdminWorkspaceSection[] = [
  { key: "premium", label: "Khoá học", href: "/admin/premium" },
  { key: "course-pricing", label: "Giá & mở bán", href: "/admin/course-pricing" },
  { key: "orders", label: "Đơn hàng", href: "/admin/orders" },
  { key: "coupons", label: "Mã giảm giá", href: "/admin/coupons" },
  { key: "services", label: "Dịch vụ", href: "/admin/services" },
  { key: "support", label: "Hỗ trợ", href: "/admin/support" },
  { key: "leads", label: "Leads", href: "/admin/leads" },
];
