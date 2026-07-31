import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { SlidersHorizontal } from "lucide-react";

export const metadata = { title: "Cấu hình chung · Admin" };

/**
 * ADM-V2-05 — "Cấu hình chung" (Hệ thống). Re-audit xác nhận đúng ghi chú
 * gốc: không có bảng system_config/feature_flags nào tồn tại (đã kiểm tra
 * qua Supabase — `to_regclass()` trả null cho cả 2). Cấu hình site-wide đã
 * có (tên site/slogan/màu thương hiệu/SEO mặc định/social) quản qua bảng
 * `settings` — đã có Admin UI ở "Header & Footer" (Website workspace),
 * KHÔNG lặp lại ở đây (tránh 2 trang cùng sở hữu 1 nguồn dữ liệu). Feature
 * flag mức hệ thống thật sự chưa có cơ chế nào.
 */
export default async function CauHinhChungPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Hệ thống", href: "/admin/he-thong/moi-truong" }, { label: "Cấu hình chung" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Cấu hình chung</h1>
        <p className="mt-1 text-sm text-gray-500">Thiết lập kỹ thuật chung của hệ thống.</p>
      </div>

      <AdminEmptyState
        icon={SlidersHorizontal}
        title="Chưa có cơ chế feature flag/cấu hình hệ thống tập trung"
        description="Cấu hình site-wide (tên site/slogan/màu thương hiệu/SEO mặc định/social) đã quản được ở Header & Footer (Website) — không lặp lại ở đây. Feature flag mức hệ thống chưa có cơ chế nào (không có bảng system_config/feature_flags)."
        action={{ label: "Xem Header & Footer", href: "/admin/website/header-footer" }}
      />
    </div>
  );
}
