"use client";

import { useEffect, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { FieldInput } from "@/components/admin/FieldInput";
import { emptyFromFields, toFormValueFor, fromFormValueFor, type FieldConfig } from "@/lib/admin/fields";

type BaseItem = { id: string };

function toFormState<T extends BaseItem>(fields: FieldConfig[], source: T): Record<string, unknown> {
  const next: Record<string, unknown> = { ...(source as unknown as Record<string, unknown>) };
  for (const f of fields) {
    if (f.transform) next[f.key] = toFormValueFor(f, (source as Record<string, unknown>)[f.key]);
  }
  return next;
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
  const [form, setForm] = useState<Record<string, unknown>>(() =>
    item ? toFormState(fields, item) : emptyFromFields(fields),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Re-seeds form state when the panel is reopened for a different item
    // (or switches create/edit) — no render-time equivalent since `item`
    // arrives as a prop from the parent's own click handler, not derivable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(item ? toFormState(fields, item) : emptyFromFields(fields));
  }, [item, fields]);

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...form };
      for (const f of fields) {
        if (f.transform) payload[f.key] = fromFormValueFor(f, payload[f.key]);
      }
      if (item) {
        await update(item.id, payload as Partial<T>);
      } else {
        await add({ id: genId(collectionKey), ...payload } as T);
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
            <FieldInput field={f} value={form[f.key]} onChange={(value) => setField(f.key, value)} />
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
