import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Smartphone } from "lucide-react";

export const metadata = { title: "Thiết bị · Admin" };

/**
 * ADM-V2-01 — "Thiết bị" (Người dùng). Route thật, thuộc kiến trúc chính
 * thức — nhưng hệ thống KHÔNG có bảng/cơ chế theo dõi thiết bị đăng nhập
 * (device fingerprint, user agent lưu trữ...) — đã audit: `members` chỉ có
 * hồ sơ cơ bản, Supabase Auth không expose thông tin thiết bị qua API hiện
 * dùng. Xây tính năng này cần schema mới (bảng `sessions`/`devices`) — theo
 * đúng nguyên tắc "cần migration mới phải lập báo cáo và dừng chờ Founder
 * duyệt trước khi chạy", CHƯA tự tạo bảng ở sprint này.
 */
export default async function ThietBiPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Người dùng", href: "/admin/users" }, { label: "Thiết bị" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Thiết bị</h1>
        <p className="mt-1 text-sm text-gray-500">Danh sách thiết bị đã đăng nhập theo từng tài khoản.</p>
      </div>

      <AdminEmptyState
        icon={Smartphone}
        title="Chưa có dữ liệu theo dõi thiết bị"
        description="Hệ thống hiện chưa lưu thông tin thiết bị đăng nhập (không có bảng sessions/devices, Supabase Auth không expose thông tin này qua API hiện dùng). Cần thiết kế schema mới nếu muốn triển khai — sẽ lập báo cáo schema/rủi ro và chờ Founder duyệt trước khi tạo."
        action={{ label: "Xem Phiên đăng nhập", href: "/admin/nguoi-dung/phien-dang-nhap" }}
      />
    </div>
  );
}
