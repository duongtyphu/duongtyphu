"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { FieldInput } from "@/components/admin/FieldInput";
import type { FieldConfig } from "@/lib/admin/fields";
import { genId } from "@/lib/admin/store";
import { MarketingLinksFieldEditor } from "./MarketingLinksFieldEditor";
import type { SubProjectRow } from "@/lib/portal/live-subprojects";
import type { MarketingLink } from "@/data/portal/ecosystems";

/**
 * "Thêm được các dự án con" (mở rộng riêng) — panel thêm/sửa/xoá dự án
 * con, CHỈ hiện khi `editMode=true`, cùng pattern `ArticlesAdminPanel.tsx`
 * (props `add`/`update`/`remove` truyền vào từ 1 `useCollection()` chia
 * sẻ, không tự gọi hook riêng).
 */
const SUBPROJECT_FIELDS: FieldConfig[] = [
  { key: "name", label: "Tên dự án con", type: "text", required: true, full: true },
  {
    key: "slug",
    label: "Slug (phần cuối URL, không dấu/không khoảng trắng)",
    type: "text",
    required: true,
    placeholder: "vd. alphamind",
  },
  { key: "shortDescription", label: "Mô tả ngắn", type: "textarea", full: true, required: true },
  { key: "displayOrder", label: "Thứ tự hiển thị (số nhỏ hơn hiện trước)", type: "number" },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

function emptySubProject(ecosystemId: string): Record<string, unknown> {
  return {
    ecosystemId,
    name: "",
    slug: "",
    shortDescription: "",
    displayOrder: 0,
    status: "Draft",
    links: [] as MarketingLink[],
  };
}

export function SubProjectsAdminPanel({
  subProjects,
  ecosystemId,
  add,
  update,
  remove,
}: {
  subProjects: SubProjectRow[];
  ecosystemId: string;
  add: (item: SubProjectRow) => void | Promise<void>;
  update: (id: string, patch: Partial<SubProjectRow>) => void | Promise<void>;
  remove: (id: string) => void | Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});

  function startAdd() {
    setEditingId("__new__");
    setForm(emptySubProject(ecosystemId));
  }

  function startEdit(sub: SubProjectRow) {
    setEditingId(sub.id);
    setForm({ ...sub });
  }

  function cancel() {
    setEditingId(null);
    setForm({});
  }

  async function save() {
    if (editingId === "__new__") {
      await add({ id: genId("subproject"), ecosystemId, ...form } as SubProjectRow);
    } else if (editingId) {
      await update(editingId, form as Partial<SubProjectRow>);
    }
    cancel();
  }

  async function handleDelete(sub: SubProjectRow) {
    if (!window.confirm(`Xoá dự án con "${sub.name}"? Không thể hoàn tác.`)) return;
    await remove(sub.id);
  }

  const formLinks = Array.isArray(form.links) ? (form.links as MarketingLink[]) : [];

  return (
    <div className="mt-3 rounded-xl border border-dashed border-blue-300 bg-blue-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Quản lý dự án con (Live-edit)</p>
        {editingId === null && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm dự án con mới
          </button>
        )}
      </div>

      {editingId !== null ? (
        <div className="space-y-3 rounded-lg border border-blue-200 bg-white p-4">
          {SUBPROJECT_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {f.label}
              </label>
              <FieldInput field={f} value={form[f.key]} onChange={(value) => setForm((prev) => ({ ...prev, [f.key]: value }))} />
            </div>
          ))}

          <MarketingLinksFieldEditor links={formLinks} onChange={(next) => setForm((prev) => ({ ...prev, links: next }))} />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-brand-blue px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
            >
              Lưu
            </button>
          </div>
        </div>
      ) : subProjects.length === 0 ? (
        <p className="text-xs text-gray-500">Chưa có dự án con nào — bấm &quot;Thêm dự án con mới&quot; để tạo.</p>
      ) : (
        <ul className="space-y-1.5">
          {subProjects.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-gray-900">{s.name || "(chưa có tên)"}</p>
                <p className="text-[11px] text-gray-400">
                  {s.status} · /{s.slug || "(chưa có slug)"} · {s.links.length} link
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(s)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-brand-blue"
                  aria-label="Sửa"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Xoá"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
