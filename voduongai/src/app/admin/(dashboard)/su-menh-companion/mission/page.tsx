"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 6 (Nhóm B), Phần 1 — thay MISSION_ITEMS hardcode trong
 * src/app/portal/su-menh-companion/page.tsx (mục "03 · Sứ mệnh"). Mỗi
 * dòng 1 câu, thứ tự hiển thị quan trọng — dùng VisualEditor (kéo-thả),
 * không dùng DataTable.
 */
type MissionItem = {
  id: string;
  content: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "content", label: "Nội dung", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCompanionMissionPage() {
  return (
    <AdminAtmosphere atmosphere={<SanctuaryBackground />}>
      <VisualEditor<MissionItem>
        collectionKey="mission-items"
        title="Sứ mệnh"
        itemNoun="câu"
        fields={fields}
        renderCard={(item) => <p className="text-sm text-gray-700">{item.content}</p>}
      />
    </AdminAtmosphere>
  );
}
