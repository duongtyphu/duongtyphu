import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PORTAL_MANAGEMENT_SECTIONS } from "@/lib/admin/portal/navigation";
import { ContentRegistry } from "@/components/admin/portal/ContentRegistry";

export default function ContentRegistryPage() {
  return (
    <AdminWorkspaceShell
      title="Content Registry"
      description="Gộp dữ liệu THẬT từ mọi Registry đã có (Website + Brand Studio) — không phải mock. CKOS/Academy/Premium chưa xuất hiện vì chưa dùng Registry pattern, xem docs/admin/ADMIN_INFORMATION_ARCHITECTURE_V2.md."
      rootHref="/admin/portal"
      sections={PORTAL_MANAGEMENT_SECTIONS}
    >
      <ContentRegistry />
    </AdminWorkspaceShell>
  );
}
