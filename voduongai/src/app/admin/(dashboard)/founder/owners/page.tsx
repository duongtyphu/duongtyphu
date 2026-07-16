import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { FOUNDER_SECTIONS } from "@/lib/admin/founder/navigation";
import { WorkspaceOwnerPanel } from "@/components/admin/founder/WorkspaceOwnerPanel";

export default function WorkspaceOwnerPanelPage() {
  return (
    <AdminWorkspaceShell
      title="Nơi phụ trách nội dung"
      description="Mỗi nội dung trong Admin thuộc về đúng 1 khu vực quản trị — bảng này cho biết khu vực nào phụ trách gì, mức độ hoàn thiện và trạng thái tài liệu thật, không suy diễn."
      rootHref="/admin/founder"
      sections={FOUNDER_SECTIONS}
    >
      <WorkspaceOwnerPanel />
    </AdminWorkspaceShell>
  );
}
