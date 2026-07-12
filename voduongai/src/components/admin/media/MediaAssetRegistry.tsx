"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  MEDIA_CATEGORIES,
  MEDIA_STATUSES,
  MEDIA_SUBTYPE_OPTIONS,
  MEDIA_ASSETS_COLLECTION_KEY,
  MEDIA_ASSETS_SEED,
  emptyMediaAsset,
  type MediaAsset,
  type MediaCategory,
} from "@/lib/admin/media/assetRegistry";
import { MEDIA_FOLDERS_COLLECTION_KEY, MEDIA_FOLDERS_SEED, type MediaFolder } from "@/lib/admin/media/folderRegistry";
import {
  MEDIA_COLLECTIONS_COLLECTION_KEY,
  MEDIA_COLLECTIONS_SEED,
  type MediaCollection,
} from "@/lib/admin/media/collectionRegistry";

/**
 * Media Asset Registry (Task 2-5, 8) — MỘT bảng dùng chung cho cả 4
 * category (Image/Video/Document/Audio). `lockedCategory` cho các route
 * chuyên biệt (Images/Videos/Documents/Audio); không truyền để hiển thị
 * toàn bộ ("Media Library"). Quản lý METADATA — không có upload/preview
 * file thật (không Media File Manager/Asset Editor).
 */
export function MediaAssetRegistry({ lockedCategory }: { lockedCategory?: MediaCategory }) {
  const { items, ready, add, update, remove } = useCollection<MediaAsset>(MEDIA_ASSETS_COLLECTION_KEY, MEDIA_ASSETS_SEED);
  const { items: folders } = useCollection<MediaFolder>(MEDIA_FOLDERS_COLLECTION_KEY, MEDIA_FOLDERS_SEED);
  const { items: collections } = useCollection<MediaCollection>(MEDIA_COLLECTIONS_COLLECTION_KEY, MEDIA_COLLECTIONS_SEED);
  const { push } = useAdminToast();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const [form, setForm] = useState<MediaAsset>({ id: "", ...emptyMediaAsset(lockedCategory ?? "Image") });
  const [tagsInput, setTagsInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const scoped = useMemo(
    () => (lockedCategory ? items.filter((a) => a.category === lockedCategory) : items),
    [items, lockedCategory]
  );

  const filtered = useMemo(() => {
    let list = [...scoped];
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)));
    }
    list.sort((a, b) => a.category.localeCompare(b.category) || a.sortOrder - b.sortOrder);
    return list;
  }, [scoped, statusFilter, query]);

  function folderName(id: string) {
    return folders.find((f) => f.id === id)?.name || "—";
  }
  function collectionName(id: string) {
    return collections.find((c) => c.id === id)?.name || "—";
  }

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyMediaAsset(lockedCategory ?? "Image") });
    setTagsInput("");
    setModalOpen(true);
  }
  function openEdit(asset: MediaAsset) {
    setEditing(asset);
    setForm({ ...asset });
    setTagsInput(asset.tags.join(", "));
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.name.trim()) {
      push('Vui lòng nhập "Name"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...form, tags, updatedDate: today };
    if (editing) {
      update(editing.id, payload);
      push("Đã lưu thay đổi.");
    } else {
      add({ ...payload, id: genId(MEDIA_ASSETS_COLLECTION_KEY), createdDate: today });
      push("Đã thêm Media Asset mới.");
    }
    setModalOpen(false);
  }
  function handleDelete() {
    if (!deleteId) return;
    remove(deleteId);
    push("Đã xóa.", "info");
    setDeleteId(null);
  }

  const subTypeOptions = MEDIA_SUBTYPE_OPTIONS[form.category] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên hoặc tag..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Trạng thái: Tất cả</option>
          {MEDIA_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40">{filtered.length} asset</span>
        <button
          onClick={openCreate}
          className="ml-auto rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Asset
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
          <div className="p-10 text-center text-sm text-white/40">Chưa có Media Asset nào.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Name</th>
                {!lockedCategory && <th className="px-4 py-3 font-semibold">Category</th>}
                <th className="px-4 py-3 font-semibold">Sub Type</th>
                <th className="px-4 py-3 font-semibold">Folder</th>
                <th className="px-4 py-3 font-semibold">Collection</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr key={asset.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(asset)} className="text-left font-semibold text-white hover:text-brand-blue">
                      {asset.name || "(chưa đặt tên)"}
                    </button>
                    {asset.usedByNote && <p className="mt-0.5 max-w-md text-xs text-white/40">{asset.usedByNote}</p>}
                    {asset.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {asset.tags.map((t) => (
                          <span key={t} className="rounded-full border border-white/10 px-1.5 py-0.5 text-[10px] text-white/40">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  {!lockedCategory && <td className="px-4 py-3 text-white/60">{asset.category}</td>}
                  <td className="px-4 py-3 text-white/60">{asset.subType || "—"}</td>
                  <td className="px-4 py-3 text-white/60">{folderName(asset.folderId)}</td>
                  <td className="px-4 py-3 text-white/60">{asset.collectionId ? collectionName(asset.collectionId) : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[asset.status] ?? "gray"}>{asset.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(asset)}
                      className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setDeleteId(asset.id)}
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

      <Modal open={modalOpen} title={editing ? "Sửa Media Asset" : "Thêm Media Asset mới"} onClose={() => setModalOpen(false)} width="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Name (File Name) <span className="text-brand-orange">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Type (Category)</label>
              <select
                value={form.category}
                disabled={!!lockedCategory}
                onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as MediaCategory, subType: "" }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none disabled:opacity-50"
              >
                {MEDIA_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Sub Type</label>
            <input
              value={form.subType}
              onChange={(e) => setForm((s) => ({ ...s, subType: e.target.value }))}
              list="media-subtype-options"
              placeholder={subTypeOptions.length ? subTypeOptions.join(" / ") : "Chưa có gợi ý cho category này"}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
            <datalist id="media-subtype-options">
              {subTypeOptions.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              File Note (chưa có upload thật — ghi chú đường dẫn/nguồn)
            </label>
            <input
              value={form.fileNote}
              onChange={(e) => setForm((s) => ({ ...s, fileNote: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Format</label>
              <input
                value={form.formatNote}
                onChange={(e) => setForm((s) => ({ ...s, formatNote: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Size</label>
              <input
                value={form.sizeNote}
                onChange={(e) => setForm((s) => ({ ...s, sizeNote: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Dimensions</label>
              <input
                value={form.dimensionsNote}
                onChange={(e) => setForm((s) => ({ ...s, dimensionsNote: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Folder</label>
              <select
                value={form.folderId}
                onChange={(e) => setForm((s) => ({ ...s, folderId: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                <option value="">— Chưa phân loại —</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Collection</label>
              <select
                value={form.collectionId}
                onChange={(e) => setForm((s) => ({ ...s, collectionId: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                <option value="">— Không thuộc Collection —</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Tags (cách nhau bằng dấu phẩy)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="founder, homepage"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Used By</label>
            <textarea
              value={form.usedByNote}
              onChange={(e) => setForm((s) => ({ ...s, usedByNote: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Workspace Owner</label>
            <input
              value={form.workspaceOwnerNote}
              onChange={(e) => setForm((s) => ({ ...s, workspaceOwnerNote: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as MediaAsset["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {MEDIA_STATUSES.map((s) => (
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
        title="Xóa Media Asset này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
