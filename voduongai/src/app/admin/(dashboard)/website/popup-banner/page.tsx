import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Megaphone } from "lucide-react";

export const metadata = { title: "Popup & Banner · Admin" };

/**
 * ADM-V2-02 — "Popup & Banner" (Website). Route thật — nhưng KHÔNG có
 * component hiển thị popup/banner nào ở tầng Landing Page/Portal (đã grep
 * xác nhận, không phải chỉ thiếu bảng dữ liệu). Khác "Điều hướng" (chỉ
 * thiếu 1 bảng, code hiển thị đã có sẵn) — module này cần CẢ component mới
 * ở tầng hiển thị LẪN schema mới, phạm vi lớn hơn 1 migration đơn thuần
 * (thời gian hiệu lực, vị trí hiển thị Landing/Portal/cả hai, animation...)
 * — cần Founder quyết định phạm vi cụ thể trước khi lập đề xuất migration.
 */
export default async function PopupBannerPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Website", href: "/admin/landing" }, { label: "Popup & Banner" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Popup & Banner</h1>
        <p className="mt-1 text-sm text-gray-500">
          Popup/banner thông báo hiển thị trên Website hoặc Portal (khuyến mãi, bảo trì, sự kiện...).
        </p>
      </div>

      <AdminEmptyState
        icon={Megaphone}
        title="Chưa có hệ thống popup/banner nào trong sản phẩm"
        description="Không chỉ thiếu dữ liệu — chưa có component hiển thị popup/banner nào ở Landing Page hay Portal. Cần Founder quyết định phạm vi cụ thể (thời gian hiệu lực, vị trí hiển thị, kiểu banner) trước khi lập đề xuất migration + xây component mới — phạm vi lớn hơn 1 việc chỉ-thêm-bảng."
      />
    </div>
  );
}
