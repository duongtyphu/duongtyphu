"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import { MEDIA_TAG_STATUSES, MEDIA_TAGS_COLLECTION_KEY, MEDIA_TAGS_SEED, emptyMediaTag, type MediaTag } from "@/lib/admin/media/tagRegistry";

/** Media Tags (Task 7) — danh sách tag dùng chung toàn hệ thống, tham khảo cho MediaAsset.tags (xem assetRegistry.ts). */
export function MediaTagRegistry() {
  const { items, ready, add, update, remove } = useCollection<MediaTag>(MEDIA_TAGS_COLLECTION_KEY, MEDIA_TAGS_SEED);
  const { push } = useAdminToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MediaTag | null>(null);
  const [form, setForm] = useState<MediaTag>({ id: "", ...emptyMediaTag() });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = useMemo(() => [...items].sort((a, b) => a.sortOrder - b.sortOrder), [items]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyMediaTag() });
    setModalOpen(true);
  }
  function openEdit(tag: MediaTag) {
    setEditing(tag);
    setForm({ ...tag });
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
      add({ ...form, id: genId(MEDIA_TAGS_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Tag mới.");
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
        <span className="text-xs text-white/40">{sorted.length} tag</span>
        <button
          onClick={openCreate}
          className="ml-auto rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Tag
        </button>
      </div>

      {!ready ? (
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-white/5" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/40">Chưa có Tag nào.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sorted.map((tag) => (
            <button
              key={tag.id}
              onClick={() => openEdit(tag)}
              title={tag.description}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/80 hover:border-brand-blue/40 hover:bg-white/[0.06]"
            >
              {tag.name || "(chưa đặt tên)"}
              <Badge tone={STATUS_TONE[tag.status] ?? "gray"}>{tag.status}</Badge>
            </button>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Sửa Tag" : "Thêm Tag mới"} onClose={() => setModalOpen(false)} width="max-w-md">
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
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as MediaTag["status"] }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              {MEDIA_TAG_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
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
        title="Xóa Tag này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
