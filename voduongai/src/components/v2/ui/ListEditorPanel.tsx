"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { GripVertical, Plus, Trash2 } from "lucide-react";

import { Field, SelectField, TextareaField } from "./Field";
import { IcoBox } from "./IcoBox";

/**
 * `.split` = `.list-panel` (trái) + `.card` (phải) — pattern CRUD lặp lại ở hầu
 * hết trang Admin của bộ thiết kế 2.0.
 *
 * Mockup dùng `onclick="selectEco(this)"` riêng cho từng trang; ở đây gom về
 * một component nhận `items` + `fields` (schema form), tự quản lý chọn / sửa /
 * xóa / thêm / kéo sắp xếp bằng React state.
 */

export type ListEditorField =
  | { name: string; label: string; type: "text"; hint?: string }
  | { name: string; label: string; type: "textarea"; rows?: number; hint?: string }
  | { name: string; label: string; type: "select"; options: string[]; hint?: string };

export type ListEditorItem = {
  id: string;
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  /** Giá trị form, khớp `name` của các field trong schema. */
  values: Record<string, string>;
};

export function ListEditorPanel({
  listTitle,
  listHint = "Kéo để sắp xếp",
  addLabel,
  formTitle,
  items: initialItems,
  fields,
  /** Field dùng làm tiêu đề dòng khi người dùng sửa — mặc định field đầu tiên. */
  titleField,
}: {
  listTitle: string;
  listHint?: string;
  addLabel: string;
  formTitle: string;
  items: ListEditorItem[];
  fields: ListEditorField[];
  titleField?: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(initialItems[0]?.id ?? null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const nameOfTitle = titleField ?? fields[0]?.name;
  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  function updateValue(name: string, value: string) {
    if (!selected) return;
    setDirty(true);
    setItems((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              values: { ...item.values, [name]: value },
              title: name === nameOfTitle ? value : item.title,
            }
          : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (id === selectedId) setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }

  function addItem() {
    const id = `new_${Date.now()}`;
    const values = Object.fromEntries(fields.map((field) => [field.name, ""]));
    setItems((prev) => [...prev, { id, title: "Mục mới", subtitle: "Chưa có mô tả", values }]);
    setSelectedId(id);
    setDirty(true);
  }

  /** Chuyển item ở `from` tới vị trí `to`, giữ nguyên thứ tự phần còn lại. */
  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDirty(true);
  }

  return (
    <div className="grid grid-cols-1 gap-[18px] min-[860px]:grid-cols-2">
      {/* ---------------------------------------------------- danh sách trái */}
      <div className="overflow-hidden rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--v2-line)] px-5 py-[18px]">
          <h4 className="text-[15px] font-extrabold">{listTitle}</h4>
          <span className="text-[12px] text-[var(--v2-muted)]">{listHint}</span>
        </div>

        <ul>
          {items.map((item, index) => {
            const isSelected = item.id === selectedId;
            return (
              <li
                key={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                onDragEnd={() => setDragId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (!dragId) return;
                  move(
                    items.findIndex((candidate) => candidate.id === dragId),
                    index,
                  );
                  setDragId(null);
                }}
                className={[
                  "flex items-center gap-[11px] border-b border-[var(--v2-line)] px-[18px] py-3 last:border-b-0",
                  isSelected ? "bg-[var(--v2-violet-light)]" : "hover:bg-[var(--v2-bg)]",
                  dragId === item.id ? "opacity-50" : "",
                ].join(" ")}
              >
                {/* Kéo bằng chuột, hoặc focus rồi dùng ↑/↓ — mockup chỉ có chuột. */}
                <button
                  type="button"
                  aria-label={`Đổi vị trí ${item.title}. Dùng phím mũi tên lên xuống để di chuyển.`}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      move(index, index - 1);
                    } else if (event.key === "ArrowDown") {
                      event.preventDefault();
                      move(index, index + 1);
                    }
                  }}
                  className="shrink-0 cursor-grab text-[#c7c2df] hover:text-[var(--v2-muted)]"
                >
                  <GripVertical className="h-[14px] w-[14px]" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                  }}
                  className="flex min-w-0 flex-1 items-center gap-[11px] text-left"
                >
                  {item.icon ? <IcoBox icon={item.icon} size="sm" /> : null}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold">{item.title}</span>
                    <span className="block truncate text-[11px] text-[var(--v2-muted)]">
                      {item.subtitle}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Xóa ${item.title}`}
                  className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] text-[var(--v2-muted)] hover:bg-[var(--v2-surface)] hover:text-[var(--v2-red)]"
                >
                  <Trash2 className="h-[13px] w-[13px]" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center gap-2 px-[18px] py-[13px] text-[12.8px] font-bold text-[var(--v2-violet)] hover:bg-[var(--v2-bg)]"
        >
          <Plus className="h-[14px] w-[14px]" aria-hidden="true" />
          {addLabel}
        </button>
      </div>

      {/* ------------------------------------------------------ form bên phải */}
      <div className="rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[22px]">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-[15px] font-extrabold">{formTitle}</h4>
          {dirty ? (
            <span className="rounded-md bg-[#fff3d9] px-2 py-1 text-[11px] font-bold text-[#a9822c]">
              Chưa lưu
            </span>
          ) : null}
        </div>

        {selected ? (
          <>
            {fields.map((field) => {
              const value = selected.values[field.name] ?? "";

              if (field.type === "textarea") {
                return (
                  <TextareaField
                    key={`${selected.id}-${field.name}`}
                    label={field.label}
                    hint={field.hint}
                    rows={field.rows}
                    value={value}
                    onChange={(next) => updateValue(field.name, next)}
                  />
                );
              }

              if (field.type === "select") {
                return (
                  <SelectField
                    key={`${selected.id}-${field.name}`}
                    label={field.label}
                    hint={field.hint}
                    options={field.options}
                    value={value || field.options[0]}
                    onChange={(next) => updateValue(field.name, next)}
                  />
                );
              }

              return (
                <Field
                  key={`${selected.id}-${field.name}`}
                  label={field.label}
                  hint={field.hint}
                  value={value}
                  onChange={(next) => updateValue(field.name, next)}
                />
              );
            })}

            <div className="mt-4 flex gap-[10px]">
              <button
                type="button"
                onClick={() => setDirty(false)}
                className="flex-1 rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet)] p-[11px] text-[13px] font-bold text-white hover:brightness-110"
              >
                Lưu thay đổi
              </button>
              <button
                type="button"
                onClick={() => {
                  setItems(initialItems);
                  setDirty(false);
                }}
                className="rounded-[var(--v2-radius-sm)] border border-[var(--v2-line)] bg-[var(--v2-surface)] px-4 py-[11px] text-[13px] font-bold text-[var(--v2-muted)] hover:text-[var(--v2-text)]"
              >
                Hủy
              </button>
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-[13px] text-[var(--v2-muted)]">
            Chưa có mục nào được chọn. Thêm một mục mới để bắt đầu.
          </p>
        )}
      </div>
    </div>
  );
}
