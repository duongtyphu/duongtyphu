import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Image as ImageIcon } from "lucide-react";

export const metadata = { title: "Media Center · Admin" };

/**
 * ADM-V2-04 — "Media Center" (Thương hiệu & Media). Route thật — nhưng
 * chưa có thư viện quản lý ảnh/video tập trung nào (ảnh nằm rải rác trong
 * public/images/ theo từng module, gắn trực tiếp qua đường dẫn code — đã
 * re-audit, không có thay đổi so với ghi chú gốc). Xây thư viện quản lý
 * tập trung + upload cần hạ tầng lưu trữ mới (dự án chưa có upload nào,
 * mọi URL ảnh/video hiện tại đều do Founder dán tay đã host sẵn ở nơi
 * khác — đúng convention xuyên suốt dự án) — phạm vi lớn hơn 1 việc nhỏ,
 * cần Founder xác nhận trước khi thiết kế.
 */
export default async function MediaCenterPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Thương hiệu & Media", href: "/admin/thuong-hieu-media/tai-lieu" }, { label: "Media Center" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Media Center</h1>
        <p className="mt-1 text-sm text-gray-500">
          Thư viện tập trung cho hình ảnh/video dùng trong Website, Portal và Học viện.
        </p>
      </div>

      <AdminEmptyState
        icon={ImageIcon}
        title="Chưa có thư viện quản lý media tập trung"
        description="Ảnh/video hiện nằm rải rác trong public/images/ theo từng module, gắn trực tiếp qua đường dẫn code — dự án chưa có hạ tầng upload nào (mọi URL hiện tại đều dán tay đã host sẵn ở nơi khác). Xây Media Center thật cần hạ tầng lưu trữ/upload mới — cần Founder xác nhận phạm vi trước khi thiết kế."
      />
    </div>
  );
}
