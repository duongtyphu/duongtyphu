"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  MEDIA_FOLDER_STATUSES,
  MEDIA_FOLDERS_COLLECTION_KEY,
  MEDIA_FOLDERS_SEED,
  emptyMediaFolder,
  type MediaFolder,
} from "@/lib/admin/media/folderRegistry";

/** Folder Management (Task 6) — danh sách Folder phẳng + parentFolderId tuỳ chọn (tối đa 1 cấp cha). */
export function MediaFolderRegistry() {
  const { items, ready, add, update, remove } = useCollection<MediaFolder>(MEDIA_FOLDERS_COLLECTION_KEY, MEDIA_FOLDERS_SEED);
  const { push } = useAdminToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MediaFolder | null>(null);
  const [form, setForm] = useState<MediaFolder>({ id: "", ...emptyMediaFolder() });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = useMemo(() => [...items].sort((a, b) => a.sortOrder - b.sortOrder), [items]);

  function parentName(id: string) {
    return items.find((f) => f.id === id)?.name || "—";
  }

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyMediaFolder() });
    setModalOpen(true);
  }
  function openEdit(folder: MediaFolder) {
    setEditing(folder);
    setForm({ ...folder });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.name.trim()) {
      push('Vui lòng nhập "Name"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(MEDIA_FOLDERS_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Folder mới.");
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
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/40">{sorted.length} folder</span>
        <button
          onClick={openCreate}
          className="ml-auto rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Folder
        </button>
      </div>

      {!ready ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/40">Chưa có Folder nào.</div>
      ) : (
        <div className="space-y-2">
          {sorted.map((folder) => (
            <div key={folder.id} className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => openEdit(folder)} className="font-semibold text-white hover:text-brand-blue">
                    {folder.name || "(chưa đặt tên)"}
                  </button>
                  {folder.parentFolderId && (
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/40">
                      trong {parentName(folder.parentFolderId)}
                    </span>
                  )}
                  <Badge tone={STATUS_TONE[folder.status] ?? "gray"}>{folder.status}</Badge>
                </div>
                {folder.description && <p className="mt-1 max-w-xl text-xs text-white/50">{folder.description}</p>}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={() => openEdit(folder)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  Sửa
                </button>
                <button
                  onClick={() => setDeleteId(folder.id)}
                  className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Sửa Folder" : "Thêm Folder mới"} onClose={() => setModalOpen(false)} width="max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Name <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Folder cha (tuỳ chọn)</label>
            <select
              value={form.parentFolderId}
              onChange={(e) => setForm((s) => ({ ...s, parentFolderId: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              <option value="">— Không có (thư mục gốc) —</option>
              {items
                .filter((f) => f.id !== editing?.id)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as MediaFolder["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {MEDIA_FOLDER_STATUSES.map((s) => (
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
        title="Xóa Folder này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
