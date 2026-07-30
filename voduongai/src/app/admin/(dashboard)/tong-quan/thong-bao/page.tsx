import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Bell } from "lucide-react";

export const metadata = { title: "Thông báo · Admin" };

/**
 * ADM-V2-01 — "Thông báo" (Tổng quan). Route thật, đã có trong kiến trúc
 * chính thức — nhưng hệ thống CHƯA có cơ chế thông báo thời gian thực nào
 * (không có bảng `notifications`, không có Supabase Realtime subscription
 * nào trong code — đã grep xác nhận). Theo đúng nguyên tắc "Không tạo dữ
 * liệu giả để làm đầy giao diện", trang này hiển thị Empty State trung
 * thực thay vì badge "Sắp ra mắt" hay danh sách thông báo bịa.
 */
export default async function ThongBaoPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Tổng quan", href: "/admin/dashboard" }, { label: "Thông báo" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Thông báo</h1>
        <p className="mt-1 text-sm text-gray-500">
          Trung tâm thông báo hệ thống — đơn hàng mới, ticket hỗ trợ mới, khách hàng tiềm năng mới.
        </p>
      </div>

      <AdminEmptyState
        icon={Bell}
        title="Chưa có cơ chế thông báo thời gian thực"
        description="Hệ thống hiện chưa có bảng lưu thông báo hay kênh đẩy sự kiện thời gian thực (cần hạ tầng riêng, ví dụ Supabase Realtime). Trong lúc chờ, mục 'Công việc' và Tổng quan Dashboard đã tổng hợp sẵn đơn hàng/ticket/khách hàng tiềm năng mới từ dữ liệu thật."
        action={{ label: "Xem Công việc", href: "/admin/tong-quan/cong-viec" }}
      />
    </div>
  );
}
