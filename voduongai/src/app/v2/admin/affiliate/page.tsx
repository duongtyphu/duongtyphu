import { loadAdminReferrals } from "@/lib/affiliate/admin-data";

import "../../inter-gf.css";
import "../../affiliate/affiliate.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Chương trình Affilate — Admin" };

/**
 * `/v2/admin/affiliate` — khớp trực quan `/v2/affiliate` (CSS `.aff`).
 * Chương trình Affiliate (hoa hồng giới thiệu) đã có Workspace Admin 1.0
 * riêng, đầy đủ 8 trang (`/admin/affiliate/*`) — trang này chỉ hiện đúng
 * KPI tổng hợp thật (dùng lại `loadAdminReferrals()` đã có sẵn, không
 * viết truy vấn mới) + trỏ sang đó, không xây trùng.
 */
export default async function AdminAffiliatePage() {
  const { rows, configured } = await loadAdminReferrals();

  const confirmed = rows.filter((r) => r.status === "confirmed" || r.status === "paid");
  const paid = rows.filter((r) => r.status === "paid");
  const totalCommission = confirmed.reduce((sum, r) => sum + (r.commissionAmount ?? 0), 0);

  return (
    <AdminPortalMirror
      prefix="aff"
      title="Quản lý Chương trình Affilate"
      description="Số liệu giới thiệu/hoa hồng ở đây đọc trực tiếp từ bảng referrals (cùng dữ liệu Portal đọc) — quản lý đầy đủ (duyệt thanh toán, cấu hình hoa hồng theo sản phẩm) ở Workspace Affiliate riêng, Admin 1.0."
      stats={[
        { label: "Lượt giới thiệu", value: String(rows.length) },
        { label: "Đã phát sinh hoa hồng", value: String(confirmed.length) },
        { label: "Đã thanh toán", value: String(paid.length) },
        { label: "Tổng hoa hồng đã xác nhận", value: `${totalCommission.toLocaleString("vi-VN")}đ` },
      ]}
      note={
        configured
          ? undefined
          : "Supabase chưa được cấu hình trong môi trường này — số liệu hiển thị 0."
      }
      links={[{ label: "Workspace Affiliate đầy đủ (Admin 1.0) →", href: "/admin/affiliate" }]}
    />
  );
}
