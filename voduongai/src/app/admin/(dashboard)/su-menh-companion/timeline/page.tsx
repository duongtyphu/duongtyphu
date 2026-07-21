"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 6 (Nhóm B), Phần 1 — thay TIMELINE hardcode trong
 * src/app/portal/su-menh-companion/page.tsx (mục "08 · Cuộc đời",
 * "Companion Timeline™" — 6 giai đoạn trưởng thành). Đặt tên admin "Dòng
 * thời gian" — tránh nhầm với 1 artwork khác cùng tên "Cuộc đời Companion"
 * ở 7 trang flipbook (Phần 2, bảng companion_flipbook_pages riêng biệt).
 */
type TimelineStage = {
  id: string;
  stage: string;
  philosophy: string;
  meaning: string;
  lesson: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "stage", label: "Tên giai đoạn (vd. \"Tuổi thơ\")", type: "text", required: true },
  { key: "philosophy", label: "Câu triết lý", type: "textarea", full: true, required: true },
  { key: "meaning", label: "Ý nghĩa", type: "textarea", full: true, required: true },
  { key: "lesson", label: "Điều học được", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCompanionTimelinePage() {
  return (
    <AdminAtmosphere atmosphere={<SanctuaryBackground />}>
      <VisualEditor<TimelineStage>
        collectionKey="timeline"
        title="Dòng thời gian"
        itemNoun="giai đoạn"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.stage}</p>
            <p className="mt-1 line-clamp-2 text-xs italic text-gray-500">{item.philosophy}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
