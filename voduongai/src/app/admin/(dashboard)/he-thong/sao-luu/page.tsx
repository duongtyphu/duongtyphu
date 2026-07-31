import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { DatabaseBackup } from "lucide-react";

export const metadata = { title: "Sao lưu · Admin" };

/**
 * ADM-V2-05 — "Sao lưu" (Hệ thống). Re-audit xác nhận đúng ghi chú gốc,
 * không phát hiện gì mới: sao lưu database do Supabase quản lý ở cấp hạ
 * tầng (Point-in-Time Recovery/snapshot tự động) — ứng dụng không có
 * quyền/API nào đọc lại lịch sử sao lưu (cần Supabase Management API +
 * access token riêng, chưa cấu hình trong ứng dụng). Kích hoạt sao lưu/
 * khôi phục thủ công là hành động nhạy cảm ảnh hưởng toàn bộ dữ liệu —
 * chủ động loại khỏi phạm vi.
 */
export default async function SaoLuuPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Hệ thống", href: "/admin/he-thong/moi-truong" }, { label: "Sao lưu" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Sao lưu</h1>
        <p className="mt-1 text-sm text-gray-500">Lịch sử sao lưu dữ liệu Supabase và tình trạng khôi phục.</p>
      </div>

      <AdminEmptyState
        icon={DatabaseBackup}
        title="Sao lưu do Supabase quản lý ở cấp hạ tầng"
        description="Database được Supabase tự động sao lưu (Point-in-Time Recovery/snapshot) ở cấp hạ tầng — ứng dụng không có quyền/kết nối nào đọc lại lịch sử này (cần Supabase Management API riêng, chưa cấu hình). Kích hoạt sao lưu/khôi phục thủ công là hành động nhạy cảm, chủ động loại khỏi phạm vi Admin."
      />
    </div>
  );
}
