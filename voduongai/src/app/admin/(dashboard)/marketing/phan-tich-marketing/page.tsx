import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { BarChart3 } from "lucide-react";

export const metadata = { title: "Phân tích Marketing · Admin" };

/**
 * ADM-V2-06 — "Phân tích Marketing" (Marketing). Re-audit xác nhận đúng
 * ghi chú gốc: Google Analytics chỉ chạy script phía frontend
 * (NEXT_PUBLIC_GA_ID) — đọc lại số liệu cần Google Analytics Data API +
 * quyền truy cập riêng do Founder cấp, ngoài phạm vi tự tích hợp. Trạng
 * thái cấu hình GA (có/không) đã xem ở Hệ thống → API & Tích hợp — không
 * lặp lại ở đây.
 */
export default async function PhanTichMarketingPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Marketing", href: "/admin/marketing/chuyen-doi" }, { label: "Phân tích Marketing" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Phân tích Marketing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng hợp số liệu marketing (lượt truy cập, nguồn traffic, hiệu suất chiến dịch).
        </p>
      </div>

      <AdminEmptyState
        icon={BarChart3}
        title="Cần Google Analytics Data API + quyền truy cập riêng"
        description="Google Analytics hiện chỉ chạy script thu thập ở frontend — đọc lại số liệu cần Founder cấp quyền truy cập API riêng, ngoài phạm vi tự tích hợp. Chuyển đổi nội bộ (leads → khách mua hàng) đã có ở mục Chuyển đổi."
        action={{ label: "Xem Chuyển đổi", href: "/admin/marketing/chuyen-doi" }}
      />
    </div>
  );
}
