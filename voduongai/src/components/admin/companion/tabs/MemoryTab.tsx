"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import type { FieldConfig } from "@/lib/admin/fields";

type MemoryPolicy = {
  id: string;
  memoryType: string;
  allowed: boolean;
  writeCondition: string;
  retention: string;
  forgetCondition: string;
  privacyNote: string;
  userCanViewDelete: boolean;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "memoryType", label: "Loại thông tin", type: "text", required: true },
  { key: "allowed", label: "Cho phép ghi nhớ", type: "boolean" },
  { key: "writeCondition", label: "Điều kiện ghi", type: "textarea", full: true },
  { key: "retention", label: "Thời gian lưu", type: "text" },
  { key: "forgetCondition", label: "Điều kiện quên", type: "textarea", full: true },
  { key: "privacyNote", label: "Quyền riêng tư", type: "textarea", full: true },
  { key: "userCanViewDelete", label: "Người dùng được xem/xoá", type: "boolean" },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published"], required: true },
];

export function MemoryTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Đây là <strong>chính sách</strong> quy định Companion được phép ghi nhớ gì và trong bao lâu — KHÔNG phải dữ
        liệu trí nhớ thật của bất kỳ người dùng nào. Trí nhớ vận hành thật (nếu có sau này) là dữ liệu theo từng
        người dùng, không quản lý ở đây.
      </div>
      <VisualEditor<MemoryPolicy>
        collectionKey="companion-memory-policy"
        title="Chính sách trí nhớ"
        itemNoun="loại"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.memoryType}</p>
            <p className="mt-1 text-xs text-gray-500">
              {item.allowed ? "Được phép ghi nhớ" : "Chưa cho phép"} · Lưu: {item.retention || "chưa đặt"}
            </p>
          </div>
        )}
      />
    </div>
  );
}
