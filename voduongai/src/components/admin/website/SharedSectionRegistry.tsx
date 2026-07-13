"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  SECTION_CATEGORIES,
  SECTION_STATUSES,
  VISIBILITY_RULES,
  SHARED_SECTIONS_COLLECTION_KEY,
  SHARED_SECTIONS_SEED,
  emptySharedSection,
  type SharedSection,
  type SectionCategory,
} from "@/lib/admin/website/sharedSectionRegistry";

/**
 * Shared Section Registry (WEB-SPR-004 Task 1) — MỘT bảng list+detail dùng
 * chung cho cả 9 category (Task 2), giống nguyên tắc Shared Structure đã
 * dùng ở Page Registry (WEB-SPR-002) và Navigation Registry (WEB-SPR-003).
 * Quản lý NỘI DUNG/COPY (headline/body/CTA) — không có Section
 * Builder/Landing Builder/AI Generator/Dynamic Layout Engine/Drag & Drop.
 */
export function SharedSectionRegistry() {
  const { items, ready, add, update, remove } = useCollection<SharedSection>(
    SHARED_SECTIONS_COLLECTION_KEY,
    SHARED_SECTIONS_SEED
  );
  const { push } = useAdminToast();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | SectionCategory>("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SharedSection | null>(null);
  const [form, setForm] = useState<SharedSection>({ id: "", ...emptySharedSection() });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...items];
    if (categoryFilter !== "all") list = list.filter((s) => s.category === categoryFilter);
    if (statusFilter !== "all") list = list.filter((s) => s.status === statusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((s) => s.title.toLowerCase().includes(q) || s.headline.toLowerCase().includes(q));
    }
    list.sort((a, b) => a.category.localeCompare(b.category) || a.sortOrder - b.sortOrder);
    return list;
  }, [items, categoryFilter, statusFilter, query]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptySharedSection(categoryFilter !== "all" ? categoryFilter : "Hero") });
    setModalOpen(true);
  }
  function openEdit(section: SharedSection) {
    setEditing(section);
    setForm({ ...section });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.title.trim()) {
      push('Vui lòng nhập "Title"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(SHARED_SECTIONS_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Shared Section mới.");
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tiêu đề hoặc headline..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as "all" | SectionCategory)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Category: Tất cả</option>
          {SECTION_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Trạng thái: Tất cả</option>
          {SECTION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40">{filtered.length} section</span>
        <button
          onClick={openCreate}
          className="ml-auto rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Section
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        {!ready ? (
          <div className="space-y-2 p-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-white/40">Chưa có Shared Section nào.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Visibility</th>
                <th className="px-4 py-3 font-semibold">Sort Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((section) => (
                <tr key={section.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(section)} className="text-left font-semibold text-white hover:text-brand-blue">
                      {section.title || "(chưa đặt tiêu đề)"}
                    </button>
                    {section.headline && <p className="mt-0.5 truncate text-xs text-white/40">{section.headline}</p>}
                  </td>
                  <td className="px-4 py-3 text-white/60">{section.category}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[section.status] ?? "gray"}>{section.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white/60">{section.visibilityRule}</td>
                  <td className="px-4 py-3 text-white/60">{section.sortOrder}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(section)}
                      className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setDeleteId(section.id)}
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

      <Modal open={modalOpen} title={editing ? "Sửa Shared Section" : "Thêm Shared Section mới"} onClose={() => setModalOpen(false)} width="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
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
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as SectionCategory }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {SECTION_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Headline</label>
            <input
              value={form.headline}
              onChange={(e) => setForm((s) => ({ ...s, headline: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Body</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">CTA Label</label>
              <input
                value={form.ctaLabel}
                onChange={(e) => setForm((s) => ({ ...s, ctaLabel: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">CTA URL</label>
              <input
                value={form.ctaUrl}
                onChange={(e) => setForm((s) => ({ ...s, ctaUrl: e.target.value }))}
                placeholder="/portal/..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as SharedSection["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {SECTION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Visibility Rule</label>
              <select
                value={form.visibilityRule}
                onChange={(e) => setForm((s) => ({ ...s, visibilityRule: e.target.value as SharedSection["visibilityRule"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {VISIBILITY_RULES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            Hủy
          </button>
          <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
            Lưu
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Xóa Shared Section này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
