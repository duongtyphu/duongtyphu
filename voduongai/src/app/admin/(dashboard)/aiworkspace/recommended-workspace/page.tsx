"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 11 — /portal/aiworkspace, khối "Workspace đề xuất"
 * (`RecommendedWorkspaceSection`, `AiSpaceSections.tsx`). Thay mảng tĩnh
 * `RECOMMENDED_WORKSPACES` (`src/data/portal/ai-workspace.ts`, giữ lại
 * @deprecated tham khảo/rollback).
 *
 * LƯU Ý QUAN TRỌNG khi sửa `id`: `mission-catalog.ts`'s
 * `RECOMMENDED_WORKSPACE_TO_MISSION` là map TĨNH RIÊNG (chưa migrate),
 * khoá theo đúng 5/8 id gốc (viet-bai-facebook/tao-landing-page/
 * viet-email-ban-hang/phan-tich-khach-hang/ke-hoach-30-ngay). Đổi id sẽ
 * làm missionId của phiên Companion workspace rơi về undefined (không
 * crash, chỉ mất liên kết Mission) — KHÔNG đổi id các dòng đã có nếu
 * không thật sự cần.
 */
type RecommendedWorkspaceItem = {
  id: string;
  title: string;
  goal: string;
  expectedOutput: string;
  estimatedTime: string;
  suggestedTools: string[];
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "goal", label: "Mục tiêu", type: "textarea", full: true, required: true },
  { key: "expectedOutput", label: "Kết quả mong đợi", type: "text", required: true },
  { key: "estimatedTime", label: "Thời gian ước tính", type: "text", required: true, placeholder: "15 phút" },
  { key: "suggestedTools", label: "Công cụ gợi ý", type: "tags", required: true, placeholder: "ChatGPT, Claude" },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminRecommendedWorkspacePage() {
  return (
    <AdminAtmosphere atmosphereClassName="workspace-atmosphere-bg">
      <VisualEditor<RecommendedWorkspaceItem>
        collectionKey="recommended-workspace"
        title="AI Workspace — Workspace đề xuất"
        itemNoun="mục"
        fields={fields}
        breadcrumb={[
          { label: "Học viện" },
          { label: "AI Workspace", href: "/admin/tools" },
          { label: "Workspace đề xuất" },
        ]}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.goal}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
