"use client";

import { useEffect, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import type { FieldConfig } from "@/lib/admin/fields";

type BaseItem = { id: string };

function emptyFromFields(fields: FieldConfig[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "boolean") obj[f.key] = false;
    else if (f.type === "tags") obj[f.key] = [];
    else if (f.type === "number") obj[f.key] = 0;
    else obj[f.key] = f.options?.[0] ?? "";
  }
  return obj;
}

/**
 * Slide-over sửa/thêm 1 dòng — "use client", dùng useCollection().add/update
 * (đã gọi đúng API /api/admin/collections/[table] có sẵn, không viết fetch
 * riêng). Generic cho MỌI collection nhờ pattern jsonb chung — chỉ cần
 * đổi `collectionKey`/`fields`.
 *
 * `mutators` (tuỳ chọn): mỗi lần gọi useCollection() tạo 1 state instance
 * riêng, không tự đồng bộ với instance khác cùng collectionKey (đúng hành
 * vi hook này vốn có trong toàn bộ codebase). VisualEditor cần items của
 * chính nó cập nhật ngay sau khi sửa — nên truyền thẳng add/update từ
 * instance useCollection() của VisualEditor vào đây thay vì để panel tự
 * tạo instance riêng. DataTableClient không cần (đã dùng router.refresh()
 * để đồng bộ qua Server Component) nên không truyền, panel tự tạo instance
 * mặc định.
 */
export function DataTableRowPanel<T extends BaseItem>({
  open,
  collectionKey,
  title,
  fields,
  item,
  onClose,
  onSaved,
  mutators,
}: {
  open: boolean;
  collectionKey: string;
  title: string;
  fields: FieldConfig[];
  item: T | null;
  onClose: () => void;
  onSaved?: () => void;
  mutators?: { add: (item: T) => void | Promise<void>; update: (id: string, patch: Partial<T>) => void | Promise<void> };
}) {
  const ownCollection = useCollection<T>(collectionKey, []);
  const add = mutators?.add ?? ownCollection.add;
  const update = mutators?.update ?? ownCollection.update;
  const [form, setForm] = useState<Record<string, unknown>>(() => (item ? { ...item } : emptyFromFields(fields)));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Re-seeds form state when the panel is reopened for a different item
    // (or switches create/edit) — no render-time equivalent since `item`
    // arrives as a prop from the parent's own click handler, not derivable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(item ? { ...item } : emptyFromFields(fields));
  }, [item, fields]);

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (item) {
        await update(item.id, form as Partial<T>);
      } else {
        await add({ id: genId(collectionKey), ...form } as T);
      }
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SlideOver open={open} title={item ? `Sửa: ${title}` : `Thêm mới: ${title}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className={f.full ? "col-span-2" : ""}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              {f.label}
              {f.required && <span className="text-red-500"> *</span>}
            </label>

            {f.type === "textarea" && (
              <textarea
                value={String(form[f.key] ?? "")}
                onChange={(e) => setField(f.key, e.target.value)}
                required={f.required}
                placeholder={f.placeholder}
                rows={4}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
              />
            )}

            {f.type === "select" && (
              <select
                value={String(form[f.key] ?? "")}
                onChange={(e) => setField(f.key, e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
              >
                {(f.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {f.type === "boolean" && (
              <input
                type="checkbox"
                checked={Boolean(form[f.key])}
                onChange={(e) => setField(f.key, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            )}

            {f.type === "number" && (
              <input
                type="number"
                value={Number(form[f.key] ?? 0)}
                onChange={(e) => setField(f.key, Number(e.target.value))}
                required={f.required}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
              />
            )}

            {f.type === "tags" && (
              <input
                type="text"
                value={Array.isArray(form[f.key]) ? (form[f.key] as string[]).join(", ") : ""}
                onChange={(e) => setField(f.key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                placeholder={f.placeholder ?? "Ngăn cách bằng dấu phẩy"}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
              />
            )}

            {(f.type === "text" || f.type === "date") && (
              <input
                type={f.type === "date" ? "date" : "text"}
                value={String(form[f.key] ?? "")}
                onChange={(e) => setField(f.key, e.target.value)}
                required={f.required}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
              />
            )}
          </div>
        ))}

        <div className="flex gap-2 border-t border-gray-200 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-brand-blue py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Huỷ
          </button>
        </div>
      </form>
    </SlideOver>
  );
}
