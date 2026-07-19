"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import type { FieldConfig } from "@/lib/admin/fields";

type SafetyRule = {
  id: string;
  title: string;
  category: string;
  condition: string;
  action: string;
  description: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tên quy tắc", type: "text", required: true },
  {
    key: "category",
    label: "Nhóm",
    type: "select",
    options: [
      "Bảo mật",
      "Dữ liệu cá nhân",
      "Chủ đề hạn chế",
      "Điều kiện từ chối",
      "Điều kiện cảnh báo",
      "Chuyển hỗ trợ con người",
      "Chống bịa thông tin",
      "Quy tắc nguồn & trích dẫn",
      "Giới hạn hành động",
      "Mức độ tự chủ",
    ],
    required: true,
  },
  { key: "condition", label: "Điều kiện áp dụng", type: "textarea", full: true },
  { key: "action", label: "Hành động của Companion", type: "textarea", full: true },
  { key: "description", label: "Mô tả thêm", type: "textarea", full: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published"], required: true },
];

export function SafetyTab() {
  return (
    <VisualEditor<SafetyRule>
      collectionKey="companion-safety-rules"
      title="Quy tắc an toàn"
      itemNoun="quy tắc"
      fields={fields}
      renderCard={(item) => (
        <div>
          <p className="text-sm font-bold text-gray-900">{item.title}</p>
          <p className="mt-1 text-xs font-semibold text-brand-blue">{item.category}</p>
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.condition}</p>
        </div>
      )}
    />
  );
}
