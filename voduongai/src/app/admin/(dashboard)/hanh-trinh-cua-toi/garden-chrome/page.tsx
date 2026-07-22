"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 9 — "Hành trình của tôi", cửa Khu vườn của bạn (cuối cùng, RỦI RO
 * CAO NHẤT — đã audit kỹ trước khi build). CHỈ 5 field static chrome đã
 * chốt — 1 dòng duy nhất (id='garden').
 *
 * KHÔNG đụng companionLine/treeStage/buildElements (template nội suy biến
 * runtime + ngưỡng dữ liệu thật) hay cặp CTA (nhãn+href cùng đổi theo
 * gardenEmpty, giữ nguyên cả khối trong code — nhất quán với
 * nextDirection.text ở Cửa 4) — xem GardenExperience.tsx
 * (`/portal/khuvuoncuaban`) và CLAUDE.md.
 *
 * Atmosphere: Garden KHÔNG có 1 class `*-atmosphere-bg` đơn giản (khác 4
 * cửa trước) — nền thật là hệ nhiều lớp `garden-sky` + `data-garden-period`
 * (xem GardenExperience.tsx dòng 283-303). Dùng prop `atmosphere`
 * (ReactNode) của AdminAtmosphere thay vì bịa 1 class mới, cố định
 * period="sunset" cho nền Admin tĩnh (không cần chu kỳ ngày/đêm thật ở
 * đây).
 */
type GardenChrome = {
  id: string;
  title: string;
  subtitle: string;
  footer: string;
  emptyStateNoTree: string;
  emptyStateNoMoments: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "subtitle", label: "Câu phụ đề", type: "textarea", full: true, required: true },
  { key: "footer", label: "Lời khép cuối trang", type: "textarea", full: true, required: true },
  {
    key: "emptyStateNoTree",
    label: "Dòng chữ khi vườn chưa có cây (treeStage rỗng)",
    type: "textarea",
    full: true,
    required: true,
  },
  {
    key: "emptyStateNoMoments",
    label: "Dòng chữ khi Viên ngọc chưa có khoảnh khắc nào",
    type: "textarea",
    full: true,
    required: true,
  },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

function GardenAdminAtmosphere() {
  return (
    <div data-garden-period="sunset" aria-hidden className="absolute inset-0">
      <div className="garden-sky garden-sky--dawn" />
      <div className="garden-sky garden-sky--day" />
      <div className="garden-sky garden-sky--sunset" />
      <div className="garden-sky garden-sky--night" />
    </div>
  );
}

export default function AdminGardenChromePage() {
  return (
    <AdminAtmosphere atmosphere={<GardenAdminAtmosphere />}>
      <VisualEditor<GardenChrome>
        collectionKey="garden-chrome"
        title="Khu vườn của bạn — Nội dung tĩnh"
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
