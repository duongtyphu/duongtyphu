"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 6 (Nhóm B), Phần 1 — thay PHILOSOPHY_PAIRS hardcode trong
 * src/app/portal/su-menh-companion/page.tsx (mục "04 · Triết lý"). Mỗi
 * dòng 1 cặp đối lập "AI vs Companion".
 */
type PhilosophyPair = {
  id: string;
  ai: string;
  companion: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "ai", label: "Vế \"AI\"", type: "text", required: true },
  { key: "companion", label: "Vế \"Companion\"", type: "text", required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCompanionPhilosophyPage() {
  return (
    <AdminAtmosphere atmosphere={<SanctuaryBackground />}>
      <VisualEditor<PhilosophyPair>
        collectionKey="philosophy-pairs"
        title="Triết lý"
        itemNoun="cặp"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-xs text-gray-400">{item.ai}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{item.companion}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
