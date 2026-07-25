"use client";

import { EditableRegion } from "./EditableRegion";
import { useEditMode } from "./EditModeContext";
import { useSubProjectChrome } from "./SubProjectChromeContext";
import type { FieldConfig } from "@/lib/admin/fields";

const NAME_FIELDS: FieldConfig[] = [
  { key: "name", label: "Tên dự án con", type: "text", required: true, full: true },
];
const DESCRIPTION_FIELDS: FieldConfig[] = [
  { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", full: true, required: true },
];
const INTRO_FIELDS: FieldConfig[] = [
  { key: "fullIntro", label: "Giới thiệu chi tiết (không bắt buộc)", type: "textarea", full: true },
];

/**
 * Khối tiêu đề trang chi tiết dự án con — sửa trực tiếp qua
 * `SubProjectChromeContext` (xem comment gốc ở đó). Cùng bố cục/JSX như
 * trước (không đổi khi `editMode=false`), chỉ bọc thêm `EditableRegion`
 * quanh 3 field text.
 */
export function SubProjectOverview({ surface }: { surface: { card: string; chip: string } }) {
  const editMode = useEditMode();
  const { sub, update } = useSubProjectChrome();

  return (
    <div className={`overflow-hidden rounded-2xl border p-6 shadow-token-sm sm:p-8 ${surface.card}`}>
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl shadow-sm ${surface.chip}`}>
        🧩
      </div>
      <EditableRegion record={sub} fields={NAME_FIELDS} update={update}>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{sub.name}</h1>
      </EditableRegion>
      <EditableRegion record={sub} fields={DESCRIPTION_FIELDS} update={update} className="mt-2">
        <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{sub.shortDescription}</p>
      </EditableRegion>
      {(sub.fullIntro || editMode) && (
        <EditableRegion record={sub} fields={INTRO_FIELDS} update={update} className="mt-4">
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
            {sub.fullIntro || "Chưa có giới thiệu chi tiết — bấm để thêm."}
          </p>
        </EditableRegion>
      )}
    </div>
  );
}
