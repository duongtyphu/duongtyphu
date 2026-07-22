"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 9 — "Hành trình của tôi", cửa Bản đồ hành trình (RỦI RO CAO NHẤT,
 * đã audit kỹ). CHỈ static chrome an toàn — 1 dòng duy nhất (id='map').
 *
 * KHÔNG đụng CHAPTER_DESTINATIONS (mảng không key, gắn chương bằng vị trí
 * index — kéo-thả/xoá qua CMS generic sẽ gán sai hoặc crash trang) hay
 * PORTAL_CONNECTIONS (field `module` là key tra cứu thật vào
 * getModuleActivitySummary(), không phải chỉ để hiển thị) — xem
 * JourneyMapAtlas.tsx (`/portal/hanhtrinhcuatoi/ban-do`) và CLAUDE.md.
 */
type MapChrome = {
  id: string;
  title: string;
  subtitle: string;
  emptyStateLine: string;
  emptyStateCtaLabel: string;
  currentPositionLabel: string;
  noChapterYetLine: string;
  chaptersSectionLabel: string;
  statesCaption: string;
  connectionsSectionLabel: string;
  premiumConnectionLabel: string;
  nextDirectionSectionLabel: string;
  closingLine: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "subtitle", label: "Câu phụ đề", type: "textarea", full: true, required: true },
  { key: "emptyStateLine", label: "Trạng thái trống — dòng chữ", type: "textarea", full: true, required: true },
  { key: "emptyStateCtaLabel", label: "Nhãn nút ở trạng thái trống", type: "text", required: true },
  { key: "currentPositionLabel", label: "Nhãn mục 'Vị trí hiện tại'", type: "text", required: true },
  { key: "noChapterYetLine", label: "Dòng chữ khi chưa có chương nào", type: "textarea", full: true, required: true },
  { key: "chaptersSectionLabel", label: "Nhãn mục 'Năm chương cuộc đời'", type: "text", required: true },
  { key: "statesCaption", label: "Chú thích 3 trạng thái", type: "textarea", full: true, required: true },
  { key: "connectionsSectionLabel", label: "Nhãn mục 'Kết nối tới Portal'", type: "text", required: true },
  { key: "premiumConnectionLabel", label: "Nhãn khối 'Premium'", type: "text", required: true },
  { key: "nextDirectionSectionLabel", label: "Nhãn mục 'Hướng tiếp theo'", type: "text", required: true },
  { key: "closingLine", label: "Lời khép của Companion", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminMapChromePage() {
  return (
    <AdminAtmosphere atmosphereClassName="map-parchment-bg">
      <VisualEditor<MapChrome>
        collectionKey="map-chrome"
        title="Bản đồ hành trình — Nội dung tĩnh"
        itemNoun="mục"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.subtitle}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
