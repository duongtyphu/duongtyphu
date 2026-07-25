"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil } from "lucide-react";
import { FieldInput } from "@/components/admin/FieldInput";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import { toFormValueFor, fromFormValueFor, type FieldConfig } from "@/lib/admin/fields";
import { useEditMode } from "./EditModeContext";

/**
 * Nhóm 3 — Live-edit (pattern pilot dùng chung cho mọi module: mirror/
 * journal/story/journey-map/garden/gem-home/su-menh-companion/
 * opportunities/premium — trước đây 9 bản sao byte-for-byte, chỉ khác
 * import `useEditMode`).
 *
 * LỆCH KHỎI 8 BẢN CÒN LẠI (có chủ đích, ghi chú lại để không ai tưởng lộn
 * xộn khi so `md5sum`): bản này (`opportunities`) thêm
 * `toFormValueFor`/`fromFormValueFor` (đã có sẵn trong `fields.ts`, dùng
 * cho `DataTableRowPanel`/`LessonEditor` từ trước nhưng chưa từng nối vào
 * `EditableRegion`) để hỗ trợ field `transform: "newline-list"` — cần cho
 * `EcosystemOverview.tsx`'s `highlights` (mảng string, mỗi câu có thể
 * chứa dấu phẩy — dùng `type: "tags"` sẵn có sẽ cắt sai vị trí vì tags
 * tách theo dấu phẩy). Hoàn toàn tương thích ngược: field không khai báo
 * `transform` thì `toFormValueFor`/`fromFormValueFor` trả nguyên giá trị,
 * hành vi y hệt bản cũ — 8 bản còn lại chưa cần đổi vì chưa module nào
 * dùng `transform`.
 *
 * BUG ĐÃ SỬA (phát hiện qua test thật trên 5 trang chi tiết hệ sinh
 * thái): mọi trang Portal Live-edit đều có 1 wrapper ngoài cùng
 * `overflow-hidden` (kỹ thuật full-bleed khí quyển nền, xem
 * `-mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8` ở
 * MirrorChamber/LearningJournalNotebook/MyStoryBook/JourneyMapAtlas/
 * GardenExperience, và card `overflow-hidden rounded-2xl` ở
 * ProjectCards/EcosystemOverview). Popover cũ dùng `position: absolute`
 * bên trong DOM tree bị `overflow-hidden` này cắt cụt — panel sửa hiện ra
 * không đầy đủ, không kéo xuống xem hết field được, kèm giật hình khi
 * click bút vì popup bị bó hẹp/tràn ra ngoài vùng nhìn thấy.
 *
 * Đã sửa: popover giờ render qua `createPortal` thẳng vào `document.body`
 * (thoát khỏi MỌI `overflow-hidden`/stacking context của tổ tiên), định vị
 * `position: absolute` theo toạ độ thật của vùng trigger
 * (`getBoundingClientRect() + window.scrollX/scrollY` — cộng scroll offset
 * để vẫn đúng chỗ khi trang đã cuộn, không dùng `position: fixed` để
 * popup cuộn tự nhiên theo trang thay vì dính cứng theo viewport), kèm
 * `max-h-[70vh] overflow-y-auto` để tự cuộn bên trong khi danh sách field
 * dài hơn màn hình, và tự kẹp lại trong chiều ngang viewport (không tràn
 * phải khi trigger nằm sát mép).
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
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement | HTMLSpanElement>(null);

  if (!editMode) return <>{children}</>;

  function openPopover() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const popoverWidth = 320;
      const margin = 12;
      const left = Math.min(
        rect.left + window.scrollX,
        window.scrollX + window.innerWidth - popoverWidth - margin,
      );
      setPopoverPos({ top: rect.bottom + window.scrollY + 8, left: Math.max(margin, left) });
    }
    setForm(
      Object.fromEntries(
        fields.map((f) => [f.key, toFormValueFor(f, (record as Record<string, unknown>)[f.key] ?? "")]),
      ),
    );
    setSaveState("idle");
    setOpen(true);
  }

  async function handleSave() {
    setSaveState("saving");
    try {
      const patch = Object.fromEntries(fields.map((f) => [f.key, fromFormValueFor(f, form[f.key])]));
      await update(record.id, patch as Partial<T>);
      setSaveState("saved");
      setOpen(false);
    } catch {
      setSaveState("error");
    }
  }

  const Wrapper = as;

  return (
    <>
      <Wrapper
        ref={triggerRef as never}
        onClick={openPopover}
        className={`cursor-pointer rounded outline-dashed outline-1 outline-blue-300/70 transition hover:outline-blue-500 hover:bg-blue-50/40 ${as === "span" ? "inline" : "block"} ${className ?? ""}`}
      >
        {children}
        <Pencil className="ml-1 inline-block h-3 w-3 -translate-y-0.5 text-blue-500" />
      </Wrapper>

      {open &&
        popoverPos &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              style={{ position: "absolute", top: popoverPos.top, left: popoverPos.left }}
              className="z-50 max-h-[70vh] w-80 space-y-3 overflow-y-auto rounded-xl border border-blue-200 bg-white p-4 text-left shadow-xl"
            >
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
          </>,
          document.body,
        )}
    </>
  );
}
