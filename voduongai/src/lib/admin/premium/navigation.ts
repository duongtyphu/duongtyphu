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
export const PREMIUM_WORKSPACE_SECTIONS: AdminWorkspaceSection[] = [
  { key: "premium", label: "Sản phẩm số", href: "/admin/premium" },
  { key: "course-pricing", label: "Học phí V-SOLO / V-SCALE", href: "/admin/course-pricing" },
  { key: "orders", label: "Đơn hàng", href: "/admin/orders" },
  { key: "coupons", label: "Mã giảm giá", href: "/admin/coupons" },
  { key: "services", label: "Dịch vụ", href: "/admin/services" },
  { key: "support", label: "Hỗ trợ", href: "/admin/support" },
  { key: "leads", label: "Leads", href: "/admin/leads" },
  { key: "affiliate-hub", label: "Affiliate Hub", href: "/admin/affiliate-hub" },
  { key: "affiliate-hub-top-products", label: "Top sản phẩm Affiliate", href: "/admin/affiliate-hub/top-products" },
  { key: "affiliate-products", label: "Sản phẩm Affiliate", href: "/admin/affiliate/products" },
  { key: "affiliate-links", label: "Link Affiliate", href: "/admin/affiliate/links" },
  { key: "affiliate-analytics", label: "Báo cáo Affiliate", href: "/admin/affiliate/analytics" },
];
