"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

type BaseItem = { id: string; status?: string; title?: string; name?: string };

type CrudPageProps<T extends BaseItem> = {
  title: string;
  description?: string;
  collectionKey: string;
  seed: T[];
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  searchKeys: (keyof T)[];
  statusKey?: keyof T;
  filterOptions?: { key: keyof T; label: string; options: string[] };
  emptyLabel?: string;
};

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

export function CrudPage<T extends BaseItem>({
  title,
  description,
  collectionKey,
  seed,
  columns,
  fields,
  searchKeys,
  filterOptions,
  emptyLabel = "Chưa có dữ liệu nào. Bấm “Thêm mới” để tạo nội dung đầu tiên.",
}: CrudPageProps<T>) {
  const { items, ready, add, update, remove } = useCollection<T>(collectionKey, seed);
  const { push } = useAdminToast();

  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...items];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((it) =>
        searchKeys.some((k) => String(it[k] ?? "").toLowerCase().includes(q))
      );
    }
    if (filterOptions && filterValue !== "all") {
      list = list.filter((it) => String(it[filterOptions.key]) === filterValue);
    }
    const labelOf = (it: T) => String(it.title ?? it.name ?? "");
    list.sort((a, b) => (sortAsc ? labelOf(a).localeCompare(labelOf(b)) : labelOf(b).localeCompare(labelOf(a))));
    return list;
  }, [items, query, filterValue, filterOptions, sortAsc, searchKeys]);

  function openCreate() {
    setEditing(null);
    setForm(emptyFromFields(fields));
    setModalOpen(true);
  }

  function openEdit(item: T) {
    setEditing(item);
    setForm({ ...item });
    setModalOpen(true);
  }

  function handleSave() {
    const missing = fields.find((f) => f.required && !String(form[f.key] ?? "").trim());
    if (missing) {
      push(`Vui lòng nhập "${missing.label}"`, "error");
      return;
    }
    if (editing) {
      update(editing.id, form as Partial<T>);
      push("Đã lưu thay đổi.");
    } else {
      add({ id: genId(collectionKey), ...form } as unknown as T);
      push("Đã thêm mới thành công.");
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    remove(deleteId);
    push("Đã xóa.", "info");
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">{title}</h1>
          {description && <p className="mt-1 text-sm text-white/50">{description}</p>}
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm mới
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        {filterOptions && (
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
          >
            <option value="all">{filterOptions.label}: Tất cả</option>
            {filterOptions.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={() => setSortAsc((v) => !v)}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
        >
          Sắp xếp {sortAsc ? "A→Z" : "Z→A"}
        </button>
        <span className="text-xs text-white/40">{filtered.length} mục</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        {!ready ? (
          <div className="space-y-2 p-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-white/40">{emptyLabel}</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                {columns.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-white/80">
                      {c.render
                        ? c.render(item)
                        : c.key === "status"
                          ? (
                              <Badge tone={STATUS_TONE[String((item as Record<string, unknown>)[c.key])] ?? "gray"}>
                                {String((item as Record<string, unknown>)[c.key] ?? "")}
                              </Badge>
                            )
                          : String((item as Record<string, unknown>)[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(item)}
                      className="mr-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} title={editing ? "Sửa nội dung" : "Thêm mới"} onClose={() => setModalOpen(false)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                {f.label}
                {f.required && <span className="text-brand-orange"> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  value={String(form[f.key] ?? "")}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
                />
              ) : f.type === "select" ? (
                <select
                  value={String(form[f.key] ?? "")}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
                >
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === "boolean" ? (
                <button
                  type="button"
                  onClick={() => setForm((s) => ({ ...s, [f.key]: !s[f.key] }))}
                  className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    form[f.key]
                      ? "border-brand-blue/40 bg-brand-blue/20 text-white"
                      : "border-white/10 bg-white/5 text-white/50"
                  }`}
                >
                  {form[f.key] ? "Có" : "Không"}
                </button>
              ) : f.type === "tags" ? (
                <input
                  value={Array.isArray(form[f.key]) ? (form[f.key] as string[]).join(", ") : ""}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      [f.key]: e.target.value.split(",").map((v) => v.trim()).filter(Boolean),
                    }))
                  }
                  placeholder="Phân tách bằng dấu phẩy"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
                />
              ) : (
                <input
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                  value={String(form[f.key] ?? "")}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            Lưu
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Xóa nội dung này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
