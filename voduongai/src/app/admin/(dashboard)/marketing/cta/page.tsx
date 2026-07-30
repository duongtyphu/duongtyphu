import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MousePointerClick } from "lucide-react";

export const metadata = { title: "CTA · Admin" };

/**
 * ADM-V2-06 — "CTA" (Marketing). Re-audit xác nhận đúng ghi chú gốc:
 * không có cơ chế tracking click nào (đã grep — không có gtag custom
 * event/bảng analytics_events). Trang này CHỈ đọc số liệu hiệu suất khi
 * có — KHÔNG sửa nội dung CTA (nội dung sửa ở đúng module sở hữu, vd
 * Landing Page → Workspace Website).
 */
export default async function CtaPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Marketing", href: "/admin/marketing/chuyen-doi" }, { label: "CTA" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">CTA</h1>
        <p className="mt-1 text-sm text-gray-500">
          Theo dõi hiệu suất các nút kêu gọi hành động (CTA) trên toàn hệ sinh thái — không phải nơi sửa
          nội dung CTA.
        </p>
      </div>

      <AdminEmptyState
        icon={MousePointerClick}
        title="Chưa có cơ chế theo dõi lượt click CTA nào"
        description="Cần tích hợp tracking (Google Analytics event hoặc bảng riêng) trước khi có số liệu hiệu suất. Sửa nhãn/nội dung CTA vẫn thực hiện tại đúng module sở hữu (vd CTA Landing Page sửa ở Website)."
        action={{ label: "Sửa CTA của Landing Page", href: "/admin/landing" }}
      />
    </div>
  );
}
