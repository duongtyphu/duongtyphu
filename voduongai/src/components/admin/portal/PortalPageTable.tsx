"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  PORTAL_PAGES_COLLECTION_KEY,
  PORTAL_PAGES_SEED,
  emptyPortalPage,
  type PortalPageEntry,
} from "@/lib/admin/portal/pageRegistry";
import { PORTAL_STATUSES } from "@/lib/admin/portal/areaRegistry";
import { WORKSPACE_OWNERS } from "@/lib/admin/workspaceOwnership";

/**
 * Portal Page Table (Task 1-3) — CRUD Page + Child Page trong 1 Area.
 * `parentPageId` phân biệt Parent/Child — Founder "Thêm Page" (Parent,
 * `parentPageId` rỗng) hoặc "Thêm Child Page" (chọn Parent có sẵn trong
 * Area) hoàn toàn bằng dữ liệu, không union đóng nào chặn.
 */
export function PortalPageTable({ areaId, selectedId, onSelect }: { areaId: string; selectedId: string | null; onSelect: (id: string | null) => void }) {
  const { items, ready, add, update, remove } = useCollection<PortalPageEntry>(PORTAL_PAGES_COLLECTION_KEY, PORTAL_PAGES_SEED);
  const { push } = useAdminToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PortalPageEntry | null>(null);
  const [form, setForm] = useState<Omit<PortalPageEntry, "id">>(emptyPortalPage(areaId));
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const pagesInArea = useMemo(() => items.filter((p) => p.areaId === areaId), [items, areaId]);
  const parents = useMemo(() => pagesInArea.filter((p) => !p.parentPageId).sort((a, b) => a.sortOrder - b.sortOrder), [pagesInArea]);
  const childrenOf = (parentId: string) => pagesInArea.filter((p) => p.parentPageId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);

  function openCreate(parentPageId = "") {
    setEditing(null);
    setForm(emptyPortalPage(areaId, parentPageId));
    setModalOpen(true);
  }
  function openEdit(page: PortalPageEntry) {
    setEditing(page);
    setForm({ ...page });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.title.trim()) {
      push('Vui lòng nhập "Tiêu đề"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      const id = genId(PORTAL_PAGES_COLLECTION_KEY);
      add({ ...form, id, updatedDate: today });
      onSelect(id);
      push(form.parentPageId ? "Đã thêm Child Page mới." : "Đã thêm Page mới.");
    }
    setModalOpen(false);
  }
  function handleDelete() {
    if (!deleteId) return;
    // Xoá cả Child Page trực thuộc nếu xoá 1 Parent Page — tránh Child Page mồ côi.
    childrenOf(deleteId).forEach((c) => remove(c.id));
    remove(deleteId);
    if (selectedId === deleteId) onSelect(null);
    push("Đã xóa.", "info");
    setDeleteId(null);
  }
  function move(page: PortalPageEntry, dir: -1 | 1) {
    const siblings = page.parentPageId ? childrenOf(page.parentPageId) : parents;
    const idx = siblings.findIndex((p) => p.id === page.id);
    const target = siblings[idx + dir];
    if (!target) return;
    update(page.id, { sortOrder: target.sortOrder });
    update(target.id, { sortOrder: page.sortOrder });
  }

  const ownerOptions = WORKSPACE_OWNERS.map((w) => w.name);

  function PageRow({ page, isChild }: { page: PortalPageEntry; isChild: boolean }) {
    const siblings = isChild ? childrenOf(page.parentPageId) : parents;
    const idx = siblings.findIndex((p) => p.id === page.id);
    return (
      <tr className={`border-b border-white/5 hover:bg-white/[0.03] ${selectedId === page.id ? "bg-brand-blue/10" : ""}`}>
        <td className={`px-4 py-3 ${isChild ? "pl-10" : ""}`}>
          <button onClick={() => onSelect(page.id)} className="text-left font-semibold text-white hover:text-brand-blue">
            {isChild ? "↳ " : ""}
            {page.title || "(chưa đặt tiêu đề)"}
          </button>
          <p className="mt-0.5 font-mono text-xs text-white/40">{page.route}</p>
        </td>
        <td className="px-4 py-3 text-white/60">{page.workspaceOwner || "Chưa xác định"}</td>
        <td className="px-4 py-3 text-white/60">{page.visible ? "Hiện" : "Ẩn"}</td>
        <td className="px-4 py-3">
          <Badge tone={STATUS_TONE[page.publishStatus] ?? "gray"}>{page.publishStatus}</Badge>
        </td>
        <td className="px-4 py-3 text-right whitespace-nowrap">
          <button onClick={() => move(page, -1)} disabled={idx === 0} className="mr-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30">
            ↑
          </button>
          <button onClick={() => move(page, 1)} disabled={idx === siblings.length - 1} className="mr-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30">
            ↓
          </button>
          <button onClick={() => openEdit(page)} className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
            Sửa
          </button>
          <button onClick={() => setDeleteId(page.id)} className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10">
            Xóa
          </button>
        </td>
      </tr>
    );
  }

  if (!ready) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-white/40">Page trong Area này ({pagesInArea.length})</p>
        <div className="flex gap-2">
          <button onClick={() => openCreate("")} className="rounded-full bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90">
            + Thêm Page
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        {pagesInArea.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/40">Chưa có Page nào trong Area này.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Page / Route</th>
                <th className="px-4 py-3 font-semibold">Nơi phụ trách</th>
                <th className="px-4 py-3 font-semibold">Ẩn/Hiện</th>
                <th className="px-4 py-3 font-semibold">Publish Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {parents.map((p) => (
                <>
                  <PageRow key={p.id} page={p} isChild={false} />
                  {childrenOf(p.id).map((c) => (
                    <PageRow key={c.id} page={c} isChild />
                  ))}
                  <tr key={`${p.id}-add-child`}>
                    <td colSpan={5} className="px-4 pb-2 pl-10">
                      <button onClick={() => openCreate(p.id)} className="text-xs font-semibold text-brand-blue hover:underline">
                        + Thêm Child Page cho &quot;{p.title}&quot;
                      </button>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} title={editing ? "Sửa Page" : form.parentPageId ? "Thêm Child Page" : "Thêm Page"} onClose={() => setModalOpen(false)} width="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Tiêu đề <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Route (presentation context — không đổi routing thật)</label>
            <input
              value={form.route}
              onChange={(e) => setForm((s) => ({ ...s, route: e.target.value }))}
              placeholder="/portal/..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white font-mono placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          {parents.length > 0 && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Parent Page (để trống nếu đây là Page cấp 1)</label>
              <select
                value={form.parentPageId}
                onChange={(e) => setForm((s) => ({ ...s, parentPageId: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                <option value="">— Không có (Parent Page) —</option>
                {parents.filter((p) => p.id !== editing?.id).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Nơi phụ trách</label>
            <input
              list="page-workspace-owner-options"
              value={form.workspaceOwner}
              onChange={(e) => setForm((s) => ({ ...s, workspaceOwner: e.target.value }))}
              placeholder="Để trống nếu chưa xác định"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
            <datalist id="page-workspace-owner-options">
              {ownerOptions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Ghi chú SEO (chưa liên kết với dữ liệu SEO thật)</label>
            <textarea
              value={form.seoContextNote}
              onChange={(e) => setForm((s) => ({ ...s, seoContextNote: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Publish Status</label>
              <select
                value={form.publishStatus}
                onChange={(e) => setForm((s) => ({ ...s, publishStatus: e.target.value as PortalPageEntry["publishStatus"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {PORTAL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 pt-6 text-sm text-white/70">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm((s) => ({ ...s, visible: e.target.checked }))} />
              Hiện
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setModalOpen(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">
            Hủy
          </button>
          <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
            Lưu
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Xóa Page này?"
        description="Nếu là Parent Page, mọi Child Page trực thuộc cũng sẽ bị xóa. Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
