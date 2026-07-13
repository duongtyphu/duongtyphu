"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { AI_WORKSPACE_SECTIONS } from "@/lib/admin/aiWorkspace/navigation";
import { CrudPage } from "@/components/admin/CrudPage";
import { prompts, type Prompt } from "@/data/prompts";

const CATEGORY_OPTIONS: Prompt["category"][] = [
  "Marketing",
  "Affiliate",
  "Viết nội dung bán hàng",
  "Nghiên cứu",
  "SEO",
  "Website",
  "Thiết kế",
  "Video",
  "Kinh doanh",
];

export default function AiWorkspacePromptsPage() {
  return (
    <AdminWorkspaceShell title="AI Workspace" description="" rootHref="/admin/ai-workspace" sections={AI_WORKSPACE_SECTIONS}>
      <CrudPage<Prompt>
        title="Prompt Library"
        description="Section 'Prompt Library' trên /portal/aiworkspace — collection RIÊNG, không trùng bảng prompts của CKOS (/admin/prompts)."
        collectionKey="ai-workspace-prompts"
        seed={prompts}
        searchKeys={["title", "preview"]}
        filterOptions={{ key: "category", label: "Danh mục", options: CATEGORY_OPTIONS }}
        columns={[
          { key: "title", label: "Tiêu đề" },
          { key: "category", label: "Danh mục" },
        ]}
        fields={[
          { key: "title", label: "Tiêu đề", type: "text", required: true },
          { key: "category", label: "Danh mục", type: "select", options: CATEGORY_OPTIONS, required: true },
          { key: "preview", label: "Nội dung Prompt", type: "textarea", required: true, full: true },
          { key: "whenToUse", label: "Khi nào dùng", type: "textarea", full: true },
          { key: "whenNotToUse", label: "Khi nào KHÔNG dùng", type: "textarea", full: true },
          { key: "nextStep", label: "Bước tiếp theo", type: "textarea", full: true },
          { key: "relatedProjectHref", label: "Link Dự án & Cơ hội liên quan (nếu có)", type: "text" },
        ]}
      />
    </AdminWorkspaceShell>
  );
}
