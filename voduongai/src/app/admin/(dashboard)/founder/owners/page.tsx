import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { FOUNDER_SECTIONS } from "@/lib/admin/founder/navigation";
import { WorkspaceOwnerPanel } from "@/components/admin/founder/WorkspaceOwnerPanel";

export default function WorkspaceOwnerPanelPage() {
  return (
    <AdminWorkspaceShell
      title="Workspace Owner Panel"
      description="Mỗi nội dung trong Admin thuộc về đúng 1 Workspace — bảng này cho biết Workspace nào sở hữu gì, độ trưởng thành (Maturity) và trạng thái WCS thật, không suy diễn."
      rootHref="/admin/founder"
      sections={FOUNDER_SECTIONS}
    >
      <WorkspaceOwnerPanel />
    </AdminWorkspaceShell>
  );
}
