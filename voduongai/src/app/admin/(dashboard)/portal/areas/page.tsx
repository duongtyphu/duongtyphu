import { Suspense } from "react";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PORTAL_MANAGEMENT_SECTIONS } from "@/lib/admin/portal/navigation";
import { PortalAreaExplorer } from "@/components/admin/portal/PortalAreaExplorer";

export default function PortalAreasPage() {
  return (
    <AdminWorkspaceShell
      title="Portal Areas"
      description="10 Area thật theo đúng sidebar Portal hiện tại (portalNavSections, src/lib/portal/hubs.ts). Chọn 1 Area để quản lý Page → Child Page → Section → Content → Workspace Owner, chỉ bằng dữ liệu."
      rootHref="/admin/portal"
      sections={PORTAL_MANAGEMENT_SECTIONS}
    >
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/5" />}>
        <PortalAreaExplorer />
      </Suspense>
    </AdminWorkspaceShell>
  );
}
