"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 9 — "Hành trình của tôi", cửa Nhật ký học tập. Thay
 * JOURNAL_INTENTIONS (src/lib/portal/growth-map/journal-intention.ts) —
 * mỗi dòng 1 lời mời "Ý định học tiếp theo", xoay vòng theo ngày qua
 * todaysJournalIntention() (giữ nguyên logic, chỉ đổi nguồn mảng — xem
 * CLAUDE.md mục "Hành trình của tôi").
 */
type JournalIntention = {
  id: string;
  content: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "content", label: "Lời mời", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminJournalIntentionsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="journal-notebook-bg">
      <VisualEditor<JournalIntention>
        collectionKey="journal-intentions"
        title="Nhật ký học tập — Ý định học tiếp"
        itemNoun="lời mời"
        fields={fields}
        renderCard={(item) => <p className="text-sm text-gray-700">{item.content}</p>}
      />
    </AdminAtmosphere>
  );
}
