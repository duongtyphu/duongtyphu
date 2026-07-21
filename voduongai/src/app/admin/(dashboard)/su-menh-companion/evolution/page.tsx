"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 6 (Nhóm B), Phần 1 — thay EVOLUTION hardcode trong
 * src/app/portal/su-menh-companion/page.tsx (mục "07 · Tiến hóa", "Logo
 * Evolution™" — 5 giai đoạn). `icon` giới hạn đúng 5 slug có component
 * Lucide tương ứng (`EvolutionIcon` trong page.tsx) — dùng select, không
 * cho gõ tay tự do để tránh icon lạ không hiển thị được gì.
 */
type EvolutionStage = {
  id: string;
  stage: string;
  icon: string;
  meaning: string;
  status: string;
};

const ICON_OPTIONS = ["seed", "sprout", "leaf", "sparkles", "infinity"];

const fields: FieldConfig[] = [
  { key: "stage", label: "Tên giai đoạn (vd. \"Seed\")", type: "text", required: true },
  { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, required: true },
  { key: "meaning", label: "Ý nghĩa", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCompanionEvolutionPage() {
  return (
    <AdminAtmosphere atmosphere={<SanctuaryBackground />}>
      <VisualEditor<EvolutionStage>
        collectionKey="evolution"
        title="Hành trình tiến hoá"
        itemNoun="giai đoạn"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.stage}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.meaning}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
