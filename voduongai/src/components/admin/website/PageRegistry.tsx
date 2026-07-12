"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  PAGE_LIFECYCLE_STATUSES,
  PAGE_TYPES,
  WEBSITE_PAGES_COLLECTION_KEY,
  WEBSITE_PAGES_SEED,
  emptyWebsitePage,
  type WebsitePage,
  type PageType,
} from "@/lib/admin/website/pageRegistry";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const DETAIL_TABS = ["General", "SEO", "Visibility", "Publish", "Revision"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

/**
 * Website Page Registry (WEB-SPR-002 Task 1) — the ONE shared list+detail
 * component for Homepage/Landing Pages/Static Pages (Task 2: no separate
 * schema per type). `/admin/website/pages` renders it unfiltered; the
 * type-specific routes (Homepage/Landing Pages/Static Pages) render it
 * with `lockedPageType` so each shows only its own rows and pre-fills new
 * entries with the right type.
 *
 * This manages page *metadata* only — Title/Slug/Status/Visibility/SEO/
 * Publish/Revision notes. It does not store or render page *content*
 * (body/sections/layout) — no Visual/Block/Section Editor exists here,
 * per Task 6.
 */
export function PageRegistry({ lockedPageType }: { lockedPageType?: PageType }) {
  const { items, ready, add, update, remove } = useCollection<WebsitePage>(WEBSITE_PAGES_COLLECTION_KEY, WEBSITE_PAGES_SEED);
  const { push } = useAdminToast();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("General");
  const [editing, setEditing] = useState<WebsitePage | null>(null);
  const [form, setForm] = useState<WebsitePage>({ id: "", ...emptyWebsitePage(lockedPageType ?? "Static Page") });
  const [revisionNote, setRevisionNote] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const scoped = useMemo(
    () => (lockedPageType ? items.filter((p) => p.pageType === lockedPageType) : items),
    [items, lockedPageType]
  );

  const filtered = useMemo(() => {
    let list = [...scoped];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter);
    list.sort((a, b) => b.updatedDate.localeCompare(a.updatedDate));
    return list;
  }, [scoped, query, statusFilter]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyWebsitePage(lockedPageType ?? "Static Page") });
    setActiveTab("General");
    setRevisionNote("");
    setModalOpen(true);
  }

  function openEdit(page: WebsitePage) {
    setEditing(page);
    setForm({ ...page });
    setActiveTab("General");
    setRevisionNote("");
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
      const revisions = revisionNote.trim()
        ? [...editing.revisions, { date: today, note: revisionNote.trim() }]
        : editing.revisions;
      update(editing.id, { ...form, slug, updatedDate: today, revisions });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(WEBSITE_PAGES_COLLECTION_KEY), slug, updatedDate: today, revisions: [] });
      push("Đã thêm Page mới.");
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
          placeholder="Tìm theo tiêu đề hoặc slug..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Trạng thái: Tất cả</option>
          {PAGE_LIFECYCLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40">{filtered.length} trang</span>
        <button
          onClick={openCreate}
          className="ml-auto rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Page
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
          <div className="p-10 text-center text-sm text-white/40">
            Chưa có Page nào. Bấm “+ Thêm Page” để tạo mục đầu tiên.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                {!lockedPageType && <th className="px-4 py-3 font-semibold">Type</th>}
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Visibility</th>
                <th className="px-4 py-3 font-semibold">Updated Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((page) => (
                <tr key={page.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(page)} className="text-left font-semibold text-white hover:text-brand-blue">
                      {page.title || "(chưa đặt tiêu đề)"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-white/60">/{page.slug || "—"}</td>
                  {!lockedPageType && <td className="px-4 py-3 text-white/60">{page.pageType}</td>}
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[page.status] ?? "gray"}>{page.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white/60">{page.visible ? "Visible" : "Hidden"}</td>
                  <td className="px-4 py-3 text-white/60">{page.updatedDate || "—"}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(page)}
                      className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setDeleteId(page.id)}
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

      <Modal open={modalOpen} title={editing ? "Sửa Page" : "Thêm Page mới"} onClose={() => setModalOpen(false)} width="max-w-2xl">
        <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
          {DETAIL_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === tab ? "bg-brand-blue text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {activeTab === "General" && (
            <>
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
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
                  placeholder={slugify(form.title) || "tu-dong-tao-tu-title"}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Page Type</label>
                <select
                  value={form.pageType}
                  disabled={!!lockedPageType}
                  onChange={(e) => setForm((s) => ({ ...s, pageType: e.target.value as PageType }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none disabled:opacity-50"
                >
                  {PAGE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {activeTab === "SEO" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">SEO Title</label>
                <input
                  value={form.seoTitle}
                  onChange={(e) => setForm((s) => ({ ...s, seoTitle: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">SEO Description</label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm((s) => ({ ...s, seoDescription: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
                />
              </div>
            </>
          )}

          {activeTab === "Visibility" && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Visibility</label>
              <button
                type="button"
                onClick={() => setForm((s) => ({ ...s, visible: !s.visible }))}
                className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  form.visible ? "border-brand-blue/40 bg-brand-blue/20 text-white" : "border-white/10 bg-white/5 text-white/50"
                }`}
              >
                {form.visible ? "Visible — hiển thị công khai" : "Hidden — chưa hiển thị công khai"}
              </button>
            </div>
          )}

          {activeTab === "Publish" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as WebsitePage["status"] }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
                >
                  {PAGE_LIFECYCLE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
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
            </>
          )}

          {activeTab === "Revision" && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Updated Date: <span className="font-normal normal-case text-white/60">{form.updatedDate || "—"}</span>
              </label>
              {editing && (
                <>
                  <label className="mb-1 mt-3 block text-xs font-semibold uppercase tracking-wide text-white/40">
                    Ghi chú thay đổi
                  </label>
                  <input
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    placeholder="VD: Cập nhật tiêu đề, sửa lỗi chính tả..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
                  />
                  {editing.revisions.length > 0 && (
                    <ul className="mt-3 space-y-1 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-white/50">
                      {[...editing.revisions].reverse().map((r, i) => (
                        <li key={i}>
                          <span className="font-semibold text-white/70">{r.date}</span> — {r.note}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
              {!editing && <p className="mt-2 text-sm text-white/40">Lịch sử thay đổi sẽ xuất hiện sau khi Page được lưu lần đầu.</p>}
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
        title="Xóa Page này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
