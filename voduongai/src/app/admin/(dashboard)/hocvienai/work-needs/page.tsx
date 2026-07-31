"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 10 — /portal/hocvienai, khối "Học AI theo nhu cầu"
 * (`WorkNeedSection`, `src/components/portal/ai-space/AiSpaceSections.tsx`).
 * Thay mảng tĩnh `WORK_NEEDS` (`src/data/portal/ai-workspace.ts`, giữ lại
 * @deprecated tham khảo/rollback).
 */
type WorkNeedItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "description", label: "Mô tả", type: "textarea", full: true, required: true },
  { key: "icon", label: "Icon (1 emoji)", type: "text", required: true, placeholder: "✍️" },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminWorkNeedsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="academy-atmosphere-bg">
      <VisualEditor<WorkNeedItem>
        collectionKey="work-needs"
        title="Học viện AI — Theo nhu cầu công việc"
        itemNoun="nhu cầu"
        fields={fields}
        breadcrumb={[
          { label: "Học viện" },
          { label: "Học viện AI", href: "/admin/hocvienai/work-needs" },
          { label: "Theo nhu cầu công việc" },
        ]}
        renderCard={(item) => (
          <div className="flex items-center gap-2">
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>
            </div>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
