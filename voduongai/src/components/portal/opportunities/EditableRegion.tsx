"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { FieldInput } from "@/components/admin/FieldInput";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import type { FieldConfig } from "@/lib/admin/fields";
import { useEditMode } from "./EditModeContext";

/**
 * Nhóm 3, Phần D (mở rộng) — Live-edit trang chi tiết hệ sinh thái. Y hệt
 * `mirror/EditableRegion.tsx`/`journal/EditableRegion.tsx`/
 * `story/EditableRegion.tsx`/`journey-map/EditableRegion.tsx`/
 * `garden/EditableRegion.tsx` (pattern pilot), chỉ đổi import
 * `useEditMode` sang bản riêng của opportunities.
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
    <Wrapper className={`relative ${as === "span" ? "inline" : ""} ${className ?? ""}`}>
      <Wrapper
        onClick={openPopover}
        className={`cursor-pointer rounded outline-dashed outline-1 outline-blue-300/70 transition hover:outline-blue-500 hover:bg-blue-50/40 ${as === "span" ? "inline" : "block"}`}
      >
        {children}
        <Pencil className="ml-1 inline-block h-3 w-3 -translate-y-0.5 text-blue-500" />
      </Wrapper>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-80 space-y-3 rounded-xl border border-blue-200 bg-white p-4 text-left shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Sửa nhanh</p>
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
