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
    // Khí quyển riêng của Home ("home-atmosphere-bg", globals.css) xếp chồng
    // lên GemBackground của AdminShell — đúng cách /portal/page.tsx (trang
    // Home thật) đang làm, để tông nền khớp Portal thay vì chỉ có gemos-bg
    // xám lạnh. -m-6/p-6 khớp đúng padding p-6 của <main> trong AdminShell.
    <div className="relative -m-6 min-h-full overflow-hidden">
      <div className="home-atmosphere-bg" aria-hidden />
      <div className="relative z-10 p-6">
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
      </div>
    </div>
  );
}
