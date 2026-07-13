"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { AI_WORKSPACE_SECTIONS } from "@/lib/admin/aiWorkspace/navigation";
import { CrudPage } from "@/components/admin/CrudPage";
import { RECOMMENDED_WORKSPACES, type RecommendedWorkspace } from "@/data/portal/ai-workspace";

export default function AiWorkspaceRecommendedPage() {
  return (
    <AdminWorkspaceShell title="AI Workspace" description="" rootHref="/admin/ai-workspace" sections={AI_WORKSPACE_SECTIONS}>
      <CrudPage<RecommendedWorkspace>
        title="Workspace đề xuất"
        description="Section 'Workspace đề xuất cho bạn' trên /portal/aiworkspace. Trước PMO-HARDENING-CONT 100% hardcode — nay Founder tự thêm/sửa/xoá."
        collectionKey="ai-workspace-recommended"
        seed={RECOMMENDED_WORKSPACES}
        searchKeys={["title", "goal"]}
        columns={[
          { key: "title", label: "Tên" },
          { key: "estimatedTime", label: "Thời gian" },
          { key: "expectedOutput", label: "Kết quả" },
        ]}
        fields={[
          { key: "title", label: "Tên workspace", type: "text", required: true },
          { key: "goal", label: "Mục tiêu", type: "textarea", required: true, full: true },
          { key: "expectedOutput", label: "Kết quả mong đợi", type: "text", required: true },
          { key: "estimatedTime", label: "Thời gian ước tính", type: "text", required: true },
          { key: "suggestedTools", label: "Công cụ gợi ý (phân tách bằng dấu phẩy)", type: "tags", full: true },
        ]}
      />
    </AdminWorkspaceShell>
  );
}
