"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 9 — "Hành trình của tôi", cửa Nhật ký học tập. CHỈ static chrome
 * (eyebrow/title/empty-state/section labels/footer) — 1 dòng duy nhất
 * (id='journal'). KHÔNG đụng MODULE_LABEL/TODAY_PRIORITY (enum map) hay
 * dòng "{totalRawOutputs} kết quả thật..." (template nội suy biến runtime)
 * — xem LearningJournalNotebook.tsx (`/portal/nhatkyhoctap`).
 */
type JournalChrome = {
  id: string;
  eyebrowLabel: string;
  title: string;
  emptyStateLine: string;
  emptyStateCtaLabel: string;
  todaySectionLabel: string;
  todayFallbackLine: string;
  entriesSectionLabel: string;
  highlightsSectionLabel: string;
  createdSectionLabel: string;
  createdEmptyLine: string;
  lessonsSectionLabel: string;
  continueCtaLabel: string;
  footer: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "eyebrowLabel", label: "Nhãn nhỏ trên tiêu đề", type: "text", required: true },
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "emptyStateLine", label: "Trạng thái trống — dòng chữ", type: "textarea", full: true, required: true },
  { key: "emptyStateCtaLabel", label: "Nhãn nút ở trạng thái trống", type: "text", required: true },
  { key: "todaySectionLabel", label: "Nhãn mục 'Hôm nay'", type: "text", required: true },
  { key: "todayFallbackLine", label: "Dòng chữ khi hôm nay chưa có gì", type: "textarea", full: true, required: true },
  { key: "entriesSectionLabel", label: "Nhãn mục 'Các trang đã viết'", type: "text", required: true },
  { key: "highlightsSectionLabel", label: "Nhãn mục 'Khoảnh khắc đáng nhớ'", type: "text", required: true },
  { key: "createdSectionLabel", label: "Nhãn mục 'Những gì đã tạo ra'", type: "text", required: true },
  { key: "createdEmptyLine", label: "Dòng chữ khi chưa có tác phẩm nào", type: "textarea", full: true, required: true },
  { key: "lessonsSectionLabel", label: "Nhãn mục 'Những bài học đáng nhớ'", type: "text", required: true },
  { key: "continueCtaLabel", label: "Nhãn nút 'Tiếp tục trong Workspace'", type: "text", required: true },
  { key: "footer", label: "Dòng chân trang", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminJournalChromePage() {
  return (
    <AdminAtmosphere atmosphereClassName="journal-notebook-bg">
      <VisualEditor<JournalChrome>
        collectionKey="journal-chrome"
        title="Nhật ký học tập — Nội dung tĩnh"
        itemNoun="mục"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.emptyStateLine}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
