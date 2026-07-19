"use client";

import { useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import type { FieldConfig } from "@/lib/admin/fields";

const PERSONA_ID = "current";

type Persona = {
  id: string;
  name: string;
  role: string;
  mission: string;
  coreValues: string;
  personality: string;
  tone: string;
  addressStyle: string;
  behaviorPrinciples: string;
  doList: string;
  dontList: string;
  greeting: string;
  closing: string;
};

const fields: FieldConfig[] = [
  { key: "name", label: "Tên Companion", type: "text", required: true },
  { key: "role", label: "Vai trò", type: "text" },
  { key: "mission", label: "Sứ mệnh", type: "textarea", full: true },
  { key: "coreValues", label: "Giá trị cốt lõi", type: "textarea", full: true },
  { key: "personality", label: "Tính cách", type: "textarea", full: true },
  { key: "tone", label: "Giọng điệu", type: "textarea", full: true },
  { key: "addressStyle", label: "Cách xưng hô", type: "text" },
  { key: "behaviorPrinciples", label: "Nguyên tắc hành xử", type: "textarea", full: true },
  { key: "doList", label: "Việc nên làm", type: "textarea", full: true },
  { key: "dontList", label: "Việc không được làm", type: "textarea", full: true },
  { key: "greeting", label: "Câu chào", type: "textarea" },
  { key: "closing", label: "Cách kết thúc hội thoại", type: "textarea" },
];

export function PersonaTab() {
  const { items } = useCollection<Persona>("companion-persona", []);
  const current = items.find((i) => i.id === PERSONA_ID);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Đây là bản nháp cấu hình — chỉnh sửa an toàn, chưa ảnh hưởng Companion đang hiển thị cho người dùng cho tới khi Xuất bản ở tab Phiên bản &amp; Xuất bản.</p>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
        >
          {showPreview ? "Ẩn xem trước" : "Xem trước"}
        </button>
      </div>

      {showPreview && current && (
        <div className="rounded-2xl border border-brand-blue/30 bg-blue-50/40 p-5 text-sm text-gray-700">
          <p className="font-bold text-gray-900">{current.name || "(chưa đặt tên)"}</p>
          <p className="mt-1 italic text-gray-500">{current.greeting || "(chưa có câu chào)"}</p>
          <p className="mt-3 whitespace-pre-line">{current.mission}</p>
        </div>
      )}

      <SingletonEditor<Persona>
        collectionKey="companion-persona"
        id={PERSONA_ID}
        title="Nhân cách"
        description="Tên, vai trò, sứ mệnh và cách Companion thể hiện bản thân."
        fields={fields}
      />
    </div>
  );
}
