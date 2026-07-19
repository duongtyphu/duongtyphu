"use client";

import { useEffect, useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { FieldInput } from "@/components/admin/FieldInput";
import { emptyFromFields, type FieldConfig } from "@/lib/admin/fields";

type BaseItem = { id: string };

/**
 * Form sửa TOÀN TRANG (không slide-over) cho collection chỉ có đúng 1 dòng
 * cố định (`id` truyền vào, vd. "current") — dùng cùng FieldInput/
 * emptyFromFields với DataTableRowPanel, không viết lại logic render field.
 * Dùng useCollection() trực tiếp (đã gọi đúng API add/update có sẵn).
 */
export function SingletonEditor<T extends BaseItem>({
  collectionKey,
  id,
  title,
  description,
  fields,
}: {
  collectionKey: string;
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}) {
  const { items, ready, add, update } = useCollection<T>(collectionKey, []);
  const existing = items.find((item) => item.id === id) ?? null;
  const [form, setForm] = useState<Record<string, unknown>>(() => emptyFromFields(fields));
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    // Nạp lại form khi dữ liệu thật từ Supabase về (lần đầu items rỗng do
    // chưa fetch xong) — không có tương đương render-time vì phụ thuộc
    // useCollection() tự fetch bất đồng bộ.
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({ ...existing });
    }
  }, [existing]);

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (existing) {
        await update(id, form as Partial<T>);
      } else {
        await add({ id, ...form } as T);
      }
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  }

  if (!ready) {
    return <p className="text-sm text-gray-500">Đang tải...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-base font-extrabold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>

      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              {f.label}
              {f.required && <span className="text-red-500"> *</span>}
            </label>
            <FieldInput field={f} value={form[f.key]} onChange={(value) => setField(f.key, value)} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
        {savedAt && !saving && <span className="text-sm text-emerald-600">Đã lưu.</span>}
      </div>
    </form>
  );
}
