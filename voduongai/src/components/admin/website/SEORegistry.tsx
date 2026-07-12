"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  SEO_STATUSES,
  SEO_LIMITS,
  SEO_ENTRIES_COLLECTION_KEY,
  SEO_ENTRIES_SEED,
  emptySEOEntry,
  type SEOEntry,
} from "@/lib/admin/website/seoRegistry";

/**
 * Validation Placeholder (Task 4) — CHỈ kiểm tra độ dài Meta Title/Meta
 * Description theo ngưỡng khuyến nghị phổ biến của Google SERP
 * (SEO_LIMITS). KHÔNG phải SEO Audit Engine đầy đủ — không kiểm tra
 * keyword, không kiểm tra trùng lặp nội dung, không chấm điểm SEO.
 */
function lengthBadge(value: string, limit: number) {
  const len = value.length;
  if (len === 0) return <span className="text-[11px] text-white/30">Chưa nhập</span>;
  const ok = len <= limit;
  return (
    <span className={`text-[11px] font-semibold ${ok ? "text-emerald-300" : "text-brand-orange"}`}>
      {len}/{limit} ký tự{!ok && " — vượt khuyến nghị"}
    </span>
  );
}

export function SEORegistry() {
  const { items, ready, add, update, remove } = useCollection<SEOEntry>(SEO_ENTRIES_COLLECTION_KEY, SEO_ENTRIES_SEED);
  const { push } = useAdminToast();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SEOEntry | null>(null);
  const [form, setForm] = useState<SEOEntry>({ id: "", ...emptySEOEntry() });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...items];
    if (statusFilter !== "all") list = list.filter((s) => s.status === statusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((s) => s.title.toLowerCase().includes(q) || s.targetUrl.toLowerCase().includes(q));
    }
    list.sort((a, b) => a.sortOrder - b.sortOrder);
    return list;
  }, [items, statusFilter, query]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptySEOEntry() });
    setModalOpen(true);
  }
  function openEdit(entry: SEOEntry) {
    setEditing(entry);
    setForm({ ...entry });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.title.trim() || !form.targetUrl.trim()) {
      push('Vui lòng nhập "Title" và "Target URL"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(SEO_ENTRIES_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm SEO Entry mới.");
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
          placeholder="Tìm theo tiêu đề hoặc URL..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Trạng thái: Tất cả</option>
          {SEO_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40">{filtered.length} entry</span>
        <button
          onClick={openCreate}
          className="ml-auto rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm SEO Entry
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
          <div className="p-10 text-center text-sm text-white/40">Chưa có SEO Entry nào.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Target URL</th>
                <th className="px-4 py-3 font-semibold">Meta Title</th>
                <th className="px-4 py-3 font-semibold">Meta Description</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(entry)} className="text-left font-semibold text-white hover:text-brand-blue">
                      {entry.title || "(chưa đặt tiêu đề)"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-white/60">{entry.targetUrl || "—"}</td>
                  <td className="px-4 py-3">{lengthBadge(entry.metaTitle, SEO_LIMITS.metaTitle)}</td>
                  <td className="px-4 py-3">{lengthBadge(entry.metaDescription, SEO_LIMITS.metaDescription)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[entry.status] ?? "gray"}>{entry.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(entry)}
                      className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setDeleteId(entry.id)}
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
      <p className="text-xs text-white/40">
        Số ký tự bên cạnh Meta Title/Description chỉ là Validation Placeholder — kiểm tra độ dài cơ bản theo khuyến
        nghị phổ biến, chưa phải SEO Audit Engine đầy đủ (không kiểm tra keyword/trùng lặp nội dung).
      </p>

      <Modal open={modalOpen} title={editing ? "Sửa SEO Entry" : "Thêm SEO Entry mới"} onClose={() => setModalOpen(false)} width="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Title (nội bộ) <span className="text-brand-orange">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Target URL <span className="text-brand-orange">*</span>
              </label>
              <input
                value={form.targetUrl}
                onChange={(e) => setForm((s) => ({ ...s, targetUrl: e.target.value }))}
                placeholder="/portal/..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/40">
              <span>Meta Title</span>
              {lengthBadge(form.metaTitle, SEO_LIMITS.metaTitle)}
            </label>
            <input
              value={form.metaTitle}
              onChange={(e) => setForm((s) => ({ ...s, metaTitle: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/40">
              <span>Meta Description</span>
              {lengthBadge(form.metaDescription, SEO_LIMITS.metaDescription)}
            </label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm((s) => ({ ...s, metaDescription: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Open Graph — Title</label>
              <input
                value={form.ogTitle}
                onChange={(e) => setForm((s) => ({ ...s, ogTitle: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Open Graph — Description</label>
              <input
                value={form.ogDescription}
                onChange={(e) => setForm((s) => ({ ...s, ogDescription: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Open Graph — Image (ghi chú, chưa có thư viện media)
            </label>
            <input
              value={form.ogImageNote}
              onChange={(e) => setForm((s) => ({ ...s, ogImageNote: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Canonical URL</label>
            <input
              value={form.canonicalUrl}
              onChange={(e) => setForm((s) => ({ ...s, canonicalUrl: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.robotsIndex}
                onChange={(e) => setForm((s) => ({ ...s, robotsIndex: e.target.checked }))}
                className="h-4 w-4 rounded border-white/20 bg-white/5"
              />
              Robots: Index
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.robotsFollow}
                onChange={(e) => setForm((s) => ({ ...s, robotsFollow: e.target.checked }))}
                className="h-4 w-4 rounded border-white/20 bg-white/5"
              />
              Robots: Follow
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.sitemapInclude}
                onChange={(e) => setForm((s) => ({ ...s, sitemapInclude: e.target.checked }))}
                className="h-4 w-4 rounded border-white/20 bg-white/5"
              />
              Sitemap: Include
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as SEOEntry["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {SEO_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
        title="Xóa SEO Entry này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
