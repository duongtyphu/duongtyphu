"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { FieldInput } from "@/components/admin/FieldInput";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import type { FieldConfig } from "@/lib/admin/fields";
import { useEditMode } from "./EditModeContext";

/**
 * THÍ ĐIỂM (pilot) — Inline editing cách A cho /portal/su-menh-companion.
 * Ngoài edit mode (useEditMode() === false, đúng Portal thật): render
 * `<>{children}</>` — KHÔNG thêm 1 phần tử DOM nào, zero rủi ro layout,
 * không lộ UI admin. Chỉ khi render qua /admin/su-menh-companion/live-edit
 * (EditModeProvider bọc ngoài) mới kích hoạt affordance sửa.
 *
 * Lưu ý kỹ thuật quan trọng: nhận `record`/`update` từ CHÍNH useCollection()
 * instance của trang cha (page.tsx) qua props — KHÔNG tự gọi useCollection()
 * riêng bên trong, để tránh 2 instance không đồng bộ sau khi Lưu (đúng lý
 * do DataTableRowPanel.tsx có prop `mutators` — xem comment ở đó).
 */
export function EditableRegion<T extends { id: string }>({
  record,
  fields,
  update,
  as = "div",
  className,
  children,
}: {
  record: T;
  fields: FieldConfig[];
  update: (id: string, patch: Partial<T>) => void | Promise<void>;
  /** "span" cho nội dung inline (vd. label trong SVG/absolute layout — xem
   * Genome, nơi phần tử NGOÀI được định vị bằng style={pos} tuyệt đối,
   * KHÔNG được bọc thêm div để tránh đổi ngữ cảnh positioning). */
  as?: "div" | "span";
  className?: string;
  children: React.ReactNode;
}) {
  const editMode = useEditMode();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");

  if (!editMode) return <>{children}</>;

  function openPopover() {
    setForm(Object.fromEntries(fields.map((f) => [f.key, (record as Record<string, unknown>)[f.key] ?? ""])));
    setSaveState("idle");
    setOpen(true);
  }

  async function handleSave() {
    setSaveState("saving");
    try {
      await update(record.id, form as Partial<T>);
      setSaveState("saved");
      setOpen(false);
    } catch {
      setSaveState("error");
    }
  }

  const Wrapper = as;

  return (
    <Wrapper className={`group/editable relative ${as === "span" ? "inline" : ""} ${className ?? ""}`}>
      <Wrapper
        onClick={openPopover}
        className={`cursor-pointer rounded outline-dashed outline-1 outline-transparent transition hover:outline-blue-400 hover:bg-blue-50/40 ${as === "span" ? "inline" : "block"}`}
      >
        {children}
        <Pencil className="ml-1 inline-block h-3 w-3 -translate-y-0.5 text-blue-400 opacity-0 transition group-hover/editable:opacity-100" />
      </Wrapper>

      {open && (
        <>
          {/* Backdrop — click ra ngoài để đóng, không lưu. */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-80 space-y-3 rounded-xl border border-blue-200 bg-white p-4 text-left shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Sửa nhanh (Pilot)</p>
              <SaveStateBadge state={saveState} isDirty={false} />
            </div>
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  {f.label}
                </label>
                <FieldInput
                  field={f}
                  value={form[f.key]}
                  onChange={(value) => setForm((prev) => ({ ...prev, [f.key]: value }))}
                />
              </div>
            ))}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveState === "saving"}
                className="rounded-lg bg-brand-blue px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-40"
              >
                {saveState === "saving" ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
}
