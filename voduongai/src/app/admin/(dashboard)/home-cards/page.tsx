"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import type { FieldConfig } from "@/lib/admin/fields";

type HomeCard = {
  id: string;
  icon: string;
  accent: string;
  title: string;
  description: string;
  href: string;
  companionLine: string;
  ctaLabel: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "description", label: "Mô tả", type: "textarea", full: true },
  { key: "href", label: "Đường dẫn", type: "text", required: true },
  { key: "ctaLabel", label: "Nhãn nút bấm", type: "text" },
  { key: "companionLine", label: "Câu gợi ý Companion", type: "textarea", full: true },
  {
    key: "accent",
    label: "Màu chủ đạo",
    type: "select",
    options: ["violet", "blue", "slate", "emerald", "amber", "teal", "rose"],
  },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published"], required: true },
];

export default function AdminHomeCardsPage() {
  return (
    <VisualEditor<HomeCard>
      collectionKey="home-cards"
      title="Trang chủ Học viện"
      itemNoun="thẻ"
      fields={fields}
      renderCard={(item) => (
        <div>
          <p className="text-sm font-bold text-gray-900">{item.title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>
          <p className="mt-1.5 text-[11px] font-semibold text-brand-blue">{item.href}</p>
        </div>
      )}
    />
  );
}
