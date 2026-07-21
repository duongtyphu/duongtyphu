"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 6 (Nhóm B), Phần 1 — thay CONSTITUTION hardcode trong
 * src/app/portal/su-menh-companion/page.tsx (mục "05 · Hiến chương",
 * "The Companion Constitution™"). Mỗi dòng 1 nguyên tắc.
 */
type ConstitutionRule = {
  id: string;
  content: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "content", label: "Nguyên tắc", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCompanionConstitutionPage() {
  return (
    <AdminAtmosphere atmosphere={<SanctuaryBackground />}>
      <VisualEditor<ConstitutionRule>
        collectionKey="constitution"
        title="Điều lệ"
        itemNoun="điều"
        fields={fields}
        renderCard={(item) => <p className="text-sm text-gray-700">{item.content}</p>}
      />
    </AdminAtmosphere>
  );
}
