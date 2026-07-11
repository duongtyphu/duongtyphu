"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import { KnowledgeEditor } from "@/components/admin/ckos/KnowledgeEditor";
import { RelationshipPicker } from "@/components/admin/ckos/RelationshipPicker";
import {
  KNOWLEDGE_STATUSES,
  KNOWLEDGE_DIFFICULTIES,
  emptyKnowledgeItem,
  type KnowledgeItem,
} from "@/lib/admin/ckos/metadata";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Shared CRUD framework for all 9 CKOS modules (Task 2) — one component,
 * config-driven by `title`/`collectionKey`/`categoryOptions` only. Every
 * module gets the identical List → Detail(modal) → Create → Edit → Delete →
 * Duplicate → Archive experience (Task "cùng trải nghiệm quản trị").
 * Built on the same `useCollection()`/Modal/ConfirmDialog/Badge primitives
 * CrudPage.tsx already uses — CrudPage itself is left untouched since 25+
 * unrelated admin pages still depend on its simpler field-config shape.
 */
export function KnowledgeCrudPage({
  title,
  description,
  collectionKey,
  categoryOptions = [],
}: {
  title: string;
  description?: string;
  collectionKey: string;
  categoryOptions?: string[];
}) {
  const { items, ready, add, update, remove } = useCollection<KnowledgeItem>(collectionKey, []);
  const { push } = useAdminToast();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sortDesc, setSortDesc] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KnowledgeItem | null>(null);
  const [form, setForm] = useState<KnowledgeItem>({ id: "", ...emptyKnowledgeItem() });
  const [changeNote, setChangeNote] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const fromData = Array.from(new Set(items.map((it) => it.category).filter(Boolean)));
    return Array.from(new Set([...categoryOptions, ...fromData]));
  }, [items, categoryOptions]);

  const authors = useMemo(() => Array.from(new Set(items.map((it) => it.author).filter(Boolean))), [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.summary.toLowerCase().includes(q) ||
          it.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== "all") list = list.filter((it) => it.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter((it) => it.category === categoryFilter);
    if (authorFilter !== "all") list = list.filter((it) => it.author === authorFilter);
    list.sort((a, b) =>
      sortDesc ? b.updatedDate.localeCompare(a.updatedDate) : a.updatedDate.localeCompare(b.updatedDate)
    );
    return list;
  }, [items, query, statusFilter, categoryFilter, authorFilter, sortDesc]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyKnowledgeItem() });
    setChangeNote("");
    setModalOpen(true);
  }

  function openEdit(item: KnowledgeItem) {
    setEditing(item);
    setForm({ ...item });
    setChangeNote("");
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.title.trim()) {
      push('Vui lòng nhập "Title"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const slug = form.slug.trim() || slugify(form.title);

    if (editing) {
      const nextVersion = editing.version + 1;
      const changelog = changeNote.trim()
        ? [...editing.changelog, { version: nextVersion, date: today, note: changeNote.trim() }]
        : editing.changelog;
      update(editing.id, { ...form, slug, version: nextVersion, updatedDate: today, changelog });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(collectionKey), slug, version: 1, updatedDate: today, changelog: [] });
      push("Đã thêm mới thành công.");
    }
    setModalOpen(false);
  }

  function handleDuplicate(item: KnowledgeItem) {
    const today = new Date().toISOString().slice(0, 10);
    add({
      ...item,
      id: genId(collectionKey),
      title: `${item.title} (Bản sao)`,
      slug: "",
      status: "Draft",
      version: 1,
      changelog: [],
      updatedDate: today,
      publishedDate: "",
    });
    push("Đã nhân bản.");
  }

  function handleDelete() {
    if (!deleteId) return;
    remove(deleteId);
    push("Đã xóa.", "info");
    setDeleteId(null);
  }

  function handleArchive() {
    if (!archiveId) return;
    const today = new Date().toISOString().slice(0, 10);
    update(archiveId, { status: "Archived", updatedDate: today });
    push("Đã lưu trữ.", "info");
    setArchiveId(null);
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
          placeholder="Tìm kiếm (tiêu đề, tóm tắt, tag)..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Trạng thái: Tất cả</option>
          {KNOWLEDGE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
          >
            <option value="all">Danh mục: Tất cả</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
        {authors.length > 0 && (
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
          >
            <option value="all">Tác giả: Tất cả</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={() => setSortDesc((v) => !v)}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
        >
          Cập nhật {sortDesc ? "Mới→Cũ" : "Cũ→Mới"}
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
          <div className="p-10 text-center text-sm text-white/40">
            Chưa có tri thức nào. Bấm “Thêm mới” để tạo mục đầu tiên.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Version</th>
                <th className="px-4 py-3 font-semibold">Author</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-white/80">
                    <button onClick={() => openEdit(item)} className="text-left font-semibold text-white hover:text-brand-blue">
                      {item.title || "(chưa đặt tiêu đề)"}
                    </button>
                    {item.tags.length > 0 && (
                      <p className="mt-0.5 truncate text-xs text-white/40">{item.tags.join(", ")}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/60">{item.category || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[item.status] ?? "gray"}>{item.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white/60">v{item.version}</td>
                  <td className="px-4 py-3 text-white/60">{item.author || "—"}</td>
                  <td className="px-4 py-3 text-white/60">{item.updatedDate || "—"}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(item)}
                      className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDuplicate(item)}
                      className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Nhân bản
                    </button>
                    {item.status !== "Archived" && (
                      <button
                        onClick={() => setArchiveId(item.id)}
                        className="mr-1.5 rounded-lg border border-brand-orange/20 px-3 py-1.5 text-xs font-semibold text-brand-orange hover:bg-brand-orange/10"
                      >
                        Lưu trữ
                      </button>
                    )}
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

      <Modal open={modalOpen} title={editing ? "Sửa tri thức" : "Thêm tri thức mới"} onClose={() => setModalOpen(false)} width="max-w-4xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Title <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
              placeholder={slugify(form.title) || "tu-dong-tao-tu-title"}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              list="ckos-category-options"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
            <datalist id="ckos-category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Tags</label>
            <input
              value={form.tags.join(", ")}
              onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }))}
              placeholder="Phân tách bằng dấu phẩy"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm((s) => ({ ...s, difficulty: e.target.value as KnowledgeItem["difficulty"] }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              {KNOWLEDGE_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d || "—"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">AI Tool</label>
            <input
              value={form.aiTool}
              onChange={(e) => setForm((s) => ({ ...s, aiTool: e.target.value }))}
              placeholder="VD: ChatGPT, Claude, Gemini..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as KnowledgeItem["status"] }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              {KNOWLEDGE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Author</label>
            <input
              value={form.author}
              onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Reviewer</label>
            <input
              value={form.reviewer}
              onChange={(e) => setForm((s) => ({ ...s, reviewer: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Published Date</label>
            <input
              type="date"
              value={form.publishedDate}
              onChange={(e) => setForm((s) => ({ ...s, publishedDate: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Updated Date</label>
            <input
              type="date"
              value={form.updatedDate}
              disabled
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Body</label>
            <KnowledgeEditor value={form.body} onChange={(body) => setForm((s) => ({ ...s, body }))} />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Relationship</label>
            <RelationshipPicker
              relatedIds={form.relatedIds}
              onChange={(relatedIds) => setForm((s) => ({ ...s, relatedIds }))}
            />
          </div>

          {editing && (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Ghi chú thay đổi (Change Log — sẽ lưu vào v{editing.version + 1})
              </label>
              <input
                value={changeNote}
                onChange={(e) => setChangeNote(e.target.value)}
                placeholder="VD: Cập nhật ví dụ, sửa lỗi chính tả..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
              />
              {editing.changelog.length > 0 && (
                <ul className="mt-2 space-y-1 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-white/50">
                  {[...editing.changelog].reverse().map((c, i) => (
                    <li key={i}>
                      <span className="font-semibold text-white/70">v{c.version}</span> · {c.date} — {c.note}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
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
        title="Xóa tri thức này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={!!archiveId}
        title="Lưu trữ tri thức này?"
        description="Mục sẽ chuyển sang trạng thái Archived và không còn được CKOS Runtime đọc. Có thể khôi phục sau bằng cách sửa lại Status."
        confirmLabel="Lưu trữ"
        tone="neutral"
        onCancel={() => setArchiveId(null)}
        onConfirm={handleArchive}
      />
    </div>
  );
}
