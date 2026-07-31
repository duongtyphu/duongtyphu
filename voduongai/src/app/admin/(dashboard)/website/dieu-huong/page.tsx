import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Navigation } from "lucide-react";

export const metadata = { title: "Điều hướng · Admin" };

/**
 * ADM-V2-02 — "Điều hướng" (Website). Route thật, thuộc kiến trúc chính
 * thức — nhưng menu Header (`mainNav`, `src/lib/site.ts`) và 2 cột link
 * Footer (`columns`, `Footer.tsx`) hiện hardcode trong code, không có bảng
 * Supabase nào quản lý. Đã lập đề xuất migration
 * (`supabase-phase26-site-navigation.sql`, CHƯA apply) + báo cáo rủi ro —
 * Header/Footer xuất hiện ở MỌI trang công khai nên rủi ro cao hơn hẳn các
 * module CMS khác, cần Founder duyệt riêng trước khi triển khai (đúng
 * nguyên tắc "cần migration mới phải lập báo cáo và dừng chờ duyệt").
 */
export default async function DieuHuongPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Website", href: "/admin/landing" }, { label: "Điều hướng" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Điều hướng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Menu Header và các cột link Footer công khai của Website.
        </p>
      </div>

      <AdminEmptyState
        icon={Navigation}
        title="Chưa có bảng dữ liệu cho menu điều hướng"
        description="Menu Header (mainNav) và 2 cột link Footer hiện hardcode trong code — đã lập đề xuất migration (supabase-phase26-site-navigation.sql, chưa chạy) + báo cáo rủi ro riêng vì Header/Footer xuất hiện ở mọi trang công khai. Chờ Founder duyệt riêng trước khi triển khai."
        action={{ label: "Xem Header & Footer (đã có thể sửa)", href: "/admin/website/header-footer" }}
      />
    </div>
  );
}
