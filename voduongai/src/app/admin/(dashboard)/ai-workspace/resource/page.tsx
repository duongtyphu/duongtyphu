"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { AI_WORKSPACE_SECTIONS } from "@/lib/admin/aiWorkspace/navigation";
import { CrudPage } from "@/components/admin/CrudPage";
import { AI_RESOURCES, type AiResource } from "@/data/portal/ai-workspace";

const TYPE_OPTIONS: AiResource["type"][] = ["Checklist", "Template", "Cheatsheet", "PDF", "Mindmap", "Quy trình mẫu"];

export default function AiWorkspaceResourcePage() {
  return (
    <AdminWorkspaceShell title="AI Workspace" description="" rootHref="/admin/ai-workspace" sections={AI_WORKSPACE_SECTIONS}>
      <CrudPage<AiResource>
        title="Tài nguyên thực hành"
        description="Section 'Tài nguyên thực hành' trên /portal/aiworkspace."
        collectionKey="ai-workspace-resource"
        seed={AI_RESOURCES}
        searchKeys={["title"]}
        filterOptions={{ key: "type", label: "Loại", options: TYPE_OPTIONS }}
        columns={[
          { key: "title", label: "Tên tài nguyên" },
          { key: "type", label: "Loại" },
        ]}
        fields={[
          { key: "title", label: "Tên tài nguyên", type: "text", required: true },
          { key: "type", label: "Loại", type: "select", options: TYPE_OPTIONS, required: true },
          { key: "href", label: "Link", type: "text", required: true },
        ]}
      />
    </AdminWorkspaceShell>
  );
}
