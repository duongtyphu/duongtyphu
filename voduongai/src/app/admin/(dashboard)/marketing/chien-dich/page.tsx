import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Megaphone } from "lucide-react";

export const metadata = { title: "Chiến dịch · Admin" };

/**
 * ADM-V2-06 — "Chiến dịch" (Marketing). Re-audit xác nhận đúng ghi chú
 * gốc: không có bảng `campaigns`/`email_campaigns` nào tồn tại (đã kiểm
 * tra qua Supabase). Cần thiết kế mới hoàn toàn (mục tiêu/thời gian chạy/
 * kênh, gắn với Landing Page/CTA/Mã giảm giá) — chưa có gì backing thật.
 */
export default async function ChienDichPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Marketing", href: "/admin/marketing/chuyen-doi" }, { label: "Chiến dịch" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Chiến dịch</h1>
        <p className="mt-1 text-sm text-gray-500">
          Lập kế hoạch và theo dõi các chiến dịch marketing (ra mắt khoá học, khuyến mãi theo mùa...).
        </p>
      </div>

      <AdminEmptyState
        icon={Megaphone}
        title="Chưa có module quản lý chiến dịch nào trong sản phẩm"
        description="Cần thiết kế mới hoàn toàn (mục tiêu/thời gian chạy/kênh, gắn với Landing Page/CTA/Mã giảm giá liên quan) — chưa có bảng dữ liệu hay cơ chế nào backing hiện tại."
        action={{ label: "Xem Mã giảm giá (Vận hành)", href: "/admin/van-hanh/ma-giam-gia" }}
      />
    </div>
  );
}
