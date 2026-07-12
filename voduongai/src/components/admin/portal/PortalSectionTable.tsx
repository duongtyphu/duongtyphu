"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  PORTAL_SECTIONS_COLLECTION_KEY,
  PORTAL_SECTIONS_SEED,
  emptyPortalSection,
  type PortalSection,
} from "@/lib/admin/portal/sectionRegistry";
import { PORTAL_STATUSES } from "@/lib/admin/portal/areaRegistry";

/** Portal Section Table (Task 1-3) — CRUD Section trong 1 Page, gắn CTA/Media qua ghi chú tham chiếu. */
export function PortalSectionTable({ pageId, selectedId, onSelect }: { pageId: string; selectedId: string | null; onSelect: (id: string | null) => void }) {
  const { items, ready, add, update, remove } = useCollection<PortalSection>(PORTAL_SECTIONS_COLLECTION_KEY, PORTAL_SECTIONS_SEED);
  const { push } = useAdminToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PortalSection | null>(null);
  const [form, setForm] = useState<Omit<PortalSection, "id">>(emptyPortalSection(pageId));
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sectionsInPage = useMemo(() => items.filter((s) => s.pageId === pageId).sort((a, b) => a.sortOrder - b.sortOrder), [items, pageId]);

  function openCreate() {
    setEditing(null);
    setForm(emptyPortalSection(pageId));
    setModalOpen(true);
  }
  function openEdit(section: PortalSection) {
    setEditing(section);
    setForm({ ...section });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.name.trim()) {
      push('Vui lòng nhập "Tên Section"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      const id = genId(PORTAL_SECTIONS_COLLECTION_KEY);
      add({ ...form, id, updatedDate: today });
      onSelect(id);
      push("Đã thêm Section mới.");
    }
    setModalOpen(false);
  }
  function handleDelete() {
    if (!deleteId) return;
    remove(deleteId);
    if (selectedId === deleteId) onSelect(null);
    push("Đã xóa.", "info");
    setDeleteId(null);
  }
  function move(section: PortalSection, dir: -1 | 1) {
    const idx = sectionsInPage.findIndex((s) => s.id === section.id);
    const target = sectionsInPage[idx + dir];
    if (!target) return;
    update(section.id, { sortOrder: target.sortOrder });
    update(target.id, { sortOrder: section.sortOrder });
  }

  if (!ready) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-white/40">Section trong Page này ({sectionsInPage.length})</p>
        <button onClick={openCreate} className="rounded-full bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90">
          + Thêm Section
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        {sectionsInPage.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/40">Chưa có Section nào trong Page này.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Section</th>
                <th className="px-4 py-3 font-semibold">CTA</th>
                <th className="px-4 py-3 font-semibold">Media</th>
                <th className="px-4 py-3 font-semibold">Ẩn/Hiện</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sectionsInPage.map((s, idx) => (
                <tr key={s.id} className={`border-b border-white/5 hover:bg-white/[0.03] ${selectedId === s.id ? "bg-brand-blue/10" : ""}`}>
                  <td className="px-4 py-3">
                    <button onClick={() => onSelect(s.id)} className="text-left font-semibold text-white hover:text-brand-blue">
                      {s.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-xs text-white/50">{s.ctaNote || "—"}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-xs text-white/50">{s.mediaNote || "—"}</td>
                  <td className="px-4 py-3 text-white/60">{s.visible ? "Hiện" : "Ẩn"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[s.status] ?? "gray"}>{s.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => move(s, -1)} disabled={idx === 0} className="mr-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30">
                      ↑
                    </button>
                    <button onClick={() => move(s, 1)} disabled={idx === sectionsInPage.length - 1} className="mr-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30">
                      ↓
                    </button>
                    <button onClick={() => openEdit(s)} className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
                      Sửa
                    </button>
                    <button onClick={() => setDeleteId(s.id)} className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} title={editing ? "Sửa Section" : "Thêm Section"} onClose={() => setModalOpen(false)} width="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Tên Section <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Gắn CTA (ghi chú tham chiếu)</label>
            <input
              value={form.ctaNote}
              onChange={(e) => setForm((s) => ({ ...s, ctaNote: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Gắn Media (ghi chú tham chiếu)</label>
            <input
              value={form.mediaNote}
              onChange={(e) => setForm((s) => ({ ...s, mediaNote: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as PortalSection["status"] }))}
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

      <ConfirmDialog open={!!deleteId} title="Xóa Section này?" description="Hành động này không thể hoàn tác." onCancel={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
