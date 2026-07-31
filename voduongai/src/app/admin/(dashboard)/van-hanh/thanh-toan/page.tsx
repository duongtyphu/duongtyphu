import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { CreditCard } from "lucide-react";

export const metadata = { title: "Thanh toán · Admin" };

/**
 * ADM-V2-03 — "Thanh toán" (Vận hành). Re-audit xác nhận đúng như ghi chú
 * cũ: trạng thái thanh toán CHỈ là cột `orders.status` (webhook SePay,
 * `src/app/api/webhooks/sepay/route.ts`, cập nhật `pending`→`confirmed`)
 * — không có bảng/thực thể "giao dịch thanh toán" tách biệt nào khác. Cố
 * tình KHÔNG tạo trang riêng cùng sở hữu 1 nguồn dữ liệu với Đơn hàng.
 */
export default async function ThanhToanPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Vận hành", href: "/admin/van-hanh/don-hang" }, { label: "Thanh toán" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Thanh toán</h1>
        <p className="mt-1 text-sm text-gray-500">Đối soát trạng thái thanh toán SePay theo từng đơn hàng.</p>
      </div>

      <AdminEmptyState
        icon={CreditCard}
        title="Không có trang riêng — trạng thái nằm ở Đơn hàng"
        description="Thanh toán chỉ là 1 cột (status: pending/confirmed/rejected) của bảng Đơn hàng, cập nhật tự động qua webhook SePay. Không tạo trang thứ 2 cùng sở hữu 1 nguồn dữ liệu — xem trực tiếp tại Đơn hàng."
        action={{ label: "Xem Đơn hàng", href: "/admin/van-hanh/don-hang" }}
      />
    </div>
  );
}
