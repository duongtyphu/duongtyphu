"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 9 — "Hành trình của tôi", cửa Mirror. CHỈ static chrome (title/
 * empty-state/footer) — 1 dòng duy nhất (id='mirror'). KHÔNG đụng
 * `invitation` (dòng mở Companion, tính động từ growthSignals thật của
 * member) hay bất kỳ dữ liệu reflections/memory_capsules/growth-view.ts
 * nào khác — xem MirrorChamber.tsx/page.tsx (`/portal/mirror`).
 */
type MirrorChrome = {
  id: string;
  title: string;
  emptyStateLine1: string;
  emptyStateLine2: string;
  emptyStateCtaLabel: string;
  footer: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "emptyStateLine1", label: "Trạng thái trống — dòng 1", type: "textarea", full: true, required: true },
  { key: "emptyStateLine2", label: "Trạng thái trống — dòng 2", type: "textarea", full: true, required: true },
  { key: "emptyStateCtaLabel", label: "Nhãn nút ở trạng thái trống", type: "text", required: true },
  { key: "footer", label: "Dòng chân trang", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminMirrorChromePage() {
  return (
    <AdminAtmosphere atmosphereClassName="mirror-chamber-bg">
      <VisualEditor<MirrorChrome>
        collectionKey="mirror-chrome"
        title="Mirror — Nội dung tĩnh"
        itemNoun="mục"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.emptyStateLine1}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
