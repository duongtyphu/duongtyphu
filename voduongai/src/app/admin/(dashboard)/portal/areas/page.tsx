import { Suspense } from "react";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PORTAL_MANAGEMENT_SECTIONS } from "@/lib/admin/portal/navigation";
import { PortalAreaExplorer } from "@/components/admin/portal/PortalAreaExplorer";

export default function PortalAreasPage() {
  return (
    <AdminWorkspaceShell
      title="Khu vực Portal"
      description="Đúng 10 khu vực thật theo menu Portal hiện tại, đúng thứ tự. Chọn 1 khu vực để quản lý Trang → Trang con → Phần nội dung → Nội dung → Nơi phụ trách, chỉ bằng dữ liệu."
      rootHref="/admin/portal"
      sections={PORTAL_MANAGEMENT_SECTIONS}
    >
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/5" />}>
        <PortalAreaExplorer />
      </Suspense>
    </AdminWorkspaceShell>
  );
}
