"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 11 — /portal/aiworkspace, khối "Quy trình AI theo công việc"
 * (`AiWorkflowSection`, `AiSpaceSections.tsx`). Thay mảng tĩnh
 * `AI_WORKFLOWS` (`src/data/portal/ai-workspace.ts`, giữ lại
 * @deprecated tham khảo/rollback).
 *
 * KHÁC HẲN bảng `sop` (Workflow/SOP đầy đủ, đã Full ở /admin/ckos/sop) —
 * đã xác nhận qua audit: `sop` là tài liệu quy trình đầy đủ (mô tả/khi
 * dùng/khi không dùng/tham chiếu Prompt), còn đây chỉ là thẻ CTA nhẹ để
 * mở phiên Companion workspace. Không trùng id, không chung schema.
 */
type AiWorkflowItem = {
  id: string;
  title: string;
  steps: string[];
  suggestedTools: string[];
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "steps", label: "Các bước (theo thứ tự)", type: "tags", required: true, placeholder: "Nghiên cứu, Kịch bản, Dựng video" },
  { key: "suggestedTools", label: "Công cụ gợi ý", type: "tags", required: true, placeholder: "ChatGPT, Canva" },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminAiWorkflowSectionsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="workspace-atmosphere-bg">
      <VisualEditor<AiWorkflowItem>
        collectionKey="ai-workflow-sections"
        title="AI Workspace — Quy trình AI (Workflow)"
        itemNoun="quy trình"
        fields={fields}
        breadcrumb={[
          { label: "Học viện" },
          { label: "AI Workspace", href: "/admin/tools" },
          { label: "Quy trình AI (Workflow)" },
        ]}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.steps.join(" → ")}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
