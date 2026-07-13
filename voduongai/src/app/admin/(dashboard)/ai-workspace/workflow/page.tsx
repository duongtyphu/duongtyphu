"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { AI_WORKSPACE_SECTIONS } from "@/lib/admin/aiWorkspace/navigation";
import { CrudPage } from "@/components/admin/CrudPage";
import { AI_WORKFLOWS, type AiWorkflow } from "@/data/portal/ai-workspace";

export default function AiWorkspaceWorkflowPage() {
  return (
    <AdminWorkspaceShell title="AI Workspace" description="" rootHref="/admin/ai-workspace" sections={AI_WORKSPACE_SECTIONS}>
      <CrudPage<AiWorkflow>
        title="Quy trình AI theo công việc"
        description="Section 'Quy trình AI theo công việc' trên /portal/aiworkspace."
        collectionKey="ai-workspace-workflow"
        seed={AI_WORKFLOWS}
        searchKeys={["title"]}
        columns={[{ key: "title", label: "Tên quy trình" }]}
        fields={[
          { key: "title", label: "Tên quy trình", type: "text", required: true },
          { key: "steps", label: "Các bước (phân tách bằng dấu phẩy)", type: "tags", required: true, full: true },
          { key: "suggestedTools", label: "Công cụ gợi ý (phân tách bằng dấu phẩy)", type: "tags", full: true },
        ]}
      />
    </AdminWorkspaceShell>
  );
}
