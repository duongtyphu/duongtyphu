"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  PORTAL_CONTENT_BLOCKS_COLLECTION_KEY,
  PORTAL_CONTENT_BLOCKS_SEED,
  emptyPortalContentBlock,
  type PortalContentBlock,
} from "@/lib/admin/portal/contentBlockRegistry";
import { PORTAL_STATUSES } from "@/lib/admin/portal/areaRegistry";
import { WORKSPACE_OWNERS } from "@/lib/admin/workspaceOwnership";

/**
 * Portal Content Block Table (Task 1-4) — CRUD Content trong 1 Section.
 * `workspaceOwner` BẮT BUỘC — chặn Lưu nếu để trống khi Status khác
 * "Draft" (đúng Acceptance "Mỗi Content có đúng một Workspace Owner").
 */
export function PortalContentBlockTable({ sectionId }: { sectionId: string }) {
  const { items, ready, add, update, remove } = useCollection<PortalContentBlock>(PORTAL_CONTENT_BLOCKS_COLLECTION_KEY, PORTAL_CONTENT_BLOCKS_SEED);
  const { push } = useAdminToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PortalContentBlock | null>(null);
  const [form, setForm] = useState<Omit<PortalContentBlock, "id">>(emptyPortalContentBlock(sectionId));
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const contentInSection = useMemo(
    () => items.filter((c) => c.sectionId === sectionId).sort((a, b) => a.sortOrder - b.sortOrder),
    [items, sectionId]
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyPortalContentBlock(sectionId));
    setModalOpen(true);
  }
  function openEdit(block: PortalContentBlock) {
    setEditing(block);
    setForm({ ...block });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.title.trim()) {
      push('Vui lòng nhập "Tiêu đề"', "error");
      return;
    }
    if (!form.workspaceOwner.trim() && form.status !== "Draft") {
      push("Content ở trạng thái khác Draft bắt buộc phải có đúng 1 Workspace Owner.", "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(PORTAL_CONTENT_BLOCKS_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Content mới.");
    }
    setModalOpen(false);
  }
  function handleDelete() {
    if (!deleteId) return;
    remove(deleteId);
    push("Đã xóa.", "info");
    setDeleteId(null);
  }
  function move(block: PortalContentBlock, dir: -1 | 1) {
    const idx = contentInSection.findIndex((c) => c.id === block.id);
    const target = contentInSection[idx + dir];
    if (!target) return;
    update(block.id, { sortOrder: target.sortOrder });
    update(target.id, { sortOrder: block.sortOrder });
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
        <p className="text-xs font-bold uppercase tracking-wide text-white/40">Content trong Section này ({contentInSection.length})</p>
        <button onClick={openCreate} className="rounded-full bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90">
          + Thêm Content
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        {contentInSection.length === 0 ? (
          <div className="p-6 text-center text-sm text-white/40">Chưa có Content nào trong Section này.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Content</th>
                <th className="px-4 py-3 font-semibold">Workspace Owner</th>
                <th className="px-4 py-3 font-semibold">Ẩn/Hiện</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {contentInSection.map((c, idx) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(c)} className="text-left font-semibold text-white hover:text-brand-blue">
                      {c.title}
                    </button>
                    {c.contentTypeNote && <p className="mt-0.5 max-w-md text-xs text-white/40">{c.contentTypeNote}</p>}
                  </td>
                  <td className="px-4 py-3 text-white/60">{c.workspaceOwner || "⚠️ Chưa xác định"}</td>
                  <td className="px-4 py-3 text-white/60">{c.visible ? "Hiện" : "Ẩn"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[c.status] ?? "gray"}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => move(c, -1)} disabled={idx === 0} className="mr-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30">
                      ↑
                    </button>
                    <button onClick={() => move(c, 1)} disabled={idx === contentInSection.length - 1} className="mr-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30">
                      ↓
                    </button>
                    <button onClick={() => openEdit(c)} className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
                      Sửa
                    </button>
                    <button onClick={() => setDeleteId(c.id)} className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} title={editing ? "Sửa Content" : "Thêm Content"} onClose={() => setModalOpen(false)} width="max-w-2xl">
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
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Loại nội dung (ghi chú — không copy dữ liệu nghiệp vụ)</label>
            <textarea
              value={form.contentTypeNote}
              onChange={(e) => setForm((s) => ({ ...s, contentTypeNote: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Workspace Owner <span className="text-brand-orange">*</span> (đúng 1)
            </label>
            <input
              list="content-workspace-owner-options"
              value={form.workspaceOwner}
              onChange={(e) => setForm((s) => ({ ...s, workspaceOwner: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
            <datalist id="content-workspace-owner-options">
              {WORKSPACE_OWNERS.map((w) => (
                <option key={w.key} value={w.name} />
              ))}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as PortalContentBlock["status"] }))}
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

      <ConfirmDialog open={!!deleteId} title="Xóa Content này?" description="Hành động này không thể hoàn tác." onCancel={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
