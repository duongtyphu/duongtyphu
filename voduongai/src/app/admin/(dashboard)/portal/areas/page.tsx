import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PORTAL_MANAGEMENT_SECTIONS } from "@/lib/admin/portal/navigation";
import { PortalAreaLanding } from "@/components/admin/portal/PortalAreaLanding";

export default function PortalAreasPage() {
  return (
    <AdminWorkspaceShell
      title="Portal Areas"
      description="10 Area thật theo đúng sidebar Portal hiện tại (portalNavSections, src/lib/portal/hubs.ts). Chọn 1 Area để xem Landing riêng — route con thật, Owner Workspace."
      rootHref="/admin/portal"
      sections={PORTAL_MANAGEMENT_SECTIONS}
    >
      <PortalAreaLanding />
    </AdminWorkspaceShell>
  );
}
