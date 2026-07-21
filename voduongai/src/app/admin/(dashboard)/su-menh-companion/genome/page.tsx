"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 6 (Nhóm B), Phần 1 — thay GENOME hardcode trong
 * src/app/portal/su-menh-companion/page.tsx (mục "06 · DNA", "The
 * Companion Genome™" — 12 gene bố cục vòng tròn). `key` giữ theo shape gốc
 * (tên gene tiếng Anh, vd. "purpose") dù Portal không còn dùng làm React
 * key (đã đổi sang dùng id của dòng, an toàn hơn).
 */
type GenomeGene = {
  id: string;
  key: string;
  label: string;
  meaning: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "key", label: "Key nội bộ (tiếng Anh, không dấu, vd. \"purpose\")", type: "text", required: true },
  { key: "label", label: "Tên gene hiển thị (vd. \"Purpose\")", type: "text", required: true },
  { key: "meaning", label: "Ý nghĩa", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminCompanionGenomePage() {
  return (
    <AdminAtmosphere atmosphere={<SanctuaryBackground />}>
      <VisualEditor<GenomeGene>
        collectionKey="genome"
        title="Bộ gene"
        itemNoun="gene"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.label}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.meaning}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
