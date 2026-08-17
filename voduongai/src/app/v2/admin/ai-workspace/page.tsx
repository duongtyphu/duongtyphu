import { getWorkspaceToolGroups, getWorkspaceWorkflows } from "@/lib/portal/live-workspace";

import "../../inter-gf.css";
import "../../ai-workspace/ai-workspace.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "AI Workspace — Admin" };

/**
 * `/v2/admin/ai-workspace` — khớp trực quan `/v2/ai-workspace` (CSS `.aiw`).
 * Dữ liệu thật: bảng `tools` (6 nhóm công cụ) + `ai_workflow_sections` (4
 * workflow mẫu) — cả 2 đã có Admin 1.0 quản lý đầy đủ
 * (`/admin/tools`, `/admin/aiworkspace/ai-workflow-sections`,
 * `/admin/aiworkspace/recommended-workspace`), không xây trùng.
 */
export default async function AdminAiWorkspacePage() {
  const [toolGroups, workflows] = await Promise.all([getWorkspaceToolGroups(), getWorkspaceWorkflows()]);

  const totalTools = toolGroups.reduce((sum, g) => sum + g.count, 0);

  return (
    <AdminPortalMirror
      prefix="aiw"
      title="Quản lý AI Workspace"
      description="Danh sách công cụ AI + workflow mẫu hiển thị ở đây đọc trực tiếp từ bảng tools/ai_workflow_sections — quản lý nội dung qua Admin 1.0."
      stats={[
        { label: "Công cụ AI (Published)", value: String(totalTools) },
        { label: "Nhóm công cụ", value: String(toolGroups.length) },
        { label: "Workflow mẫu", value: String(workflows.length) },
      ]}
      note={`Nhóm công cụ thật: ${toolGroups.map((g) => `${g.category} (${g.count})`).join(" · ")}.`}
      links={[
        { label: "Quản lý Công cụ AI (Admin 1.0) →", href: "/admin/tools" },
        { label: "Quản lý Quy trình AI (Admin 1.0) →", href: "/admin/aiworkspace/ai-workflow-sections" },
        { label: "Quản lý Workspace đề xuất (Admin 1.0) →", href: "/admin/aiworkspace/recommended-workspace" },
      ]}
    />
  );
}
