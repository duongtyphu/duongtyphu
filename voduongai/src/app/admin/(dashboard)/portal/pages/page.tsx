import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PORTAL_MANAGEMENT_SECTIONS } from "@/lib/admin/portal/navigation";
import { PortalPageRegistry } from "@/components/admin/portal/PortalPageRegistry";

export default function PortalPagesRegistryPage() {
  return (
    <AdminWorkspaceShell
      title="Page Registry"
      description="Toàn bộ route THẬT của Portal (liệt kê cơ học từ src/app/portal/**, không phải mock). Chỉ đọc — sửa route là việc của lập trình, không phải CRUD nghiệp vụ."
      rootHref="/admin/portal"
      sections={PORTAL_MANAGEMENT_SECTIONS}
    >
      <PortalPageRegistry />
    </AdminWorkspaceShell>
  );
}
