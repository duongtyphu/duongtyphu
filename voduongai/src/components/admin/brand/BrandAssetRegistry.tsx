"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  ASSET_CATEGORIES,
  BRAND_STATUSES,
  BRAND_ASSETS_COLLECTION_KEY,
  BRAND_ASSETS_SEED,
  emptyBrandAsset,
  type BrandAsset,
  type AssetCategory,
} from "@/lib/admin/brand/assetRegistry";

/**
 * Brand Asset Registry (Task 3) — MỘT bảng dùng chung cho cả 4 category.
 * `lockedCategory` cho các route chuyên biệt (Logo/Wordmark/Icons/Open
 * Graph); không truyền để hiển thị toàn bộ ("Brand Assets Registry").
 * Quản lý METADATA — không có upload/preview file thật (không Asset
 * Editor).
 */
export function BrandAssetRegistry({ lockedCategory }: { lockedCategory?: AssetCategory }) {
  const { items, ready, add, update, remove } = useCollection<BrandAsset>(BRAND_ASSETS_COLLECTION_KEY, BRAND_ASSETS_SEED);
  const { push } = useAdminToast();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BrandAsset | null>(null);
  const [form, setForm] = useState<BrandAsset>({ id: "", ...emptyBrandAsset(lockedCategory ?? "Logo") });
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
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => a.category.localeCompare(b.category) || a.sortOrder - b.sortOrder);
    return list;
  }, [scoped, statusFilter, query]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyBrandAsset(lockedCategory ?? "Logo") });
    setModalOpen(true);
  }
  function openEdit(asset: BrandAsset) {
    setEditing(asset);
    setForm({ ...asset });
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
      add({ ...form, id: genId(BRAND_ASSETS_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Brand Asset mới.");
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
          placeholder="Tìm theo tên..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Trạng thái: Tất cả</option>
          {BRAND_STATUSES.map((s) => (
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
          <div className="p-10 text-center text-sm text-white/40">Chưa có Brand Asset nào.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Name</th>
                {!lockedCategory && <th className="px-4 py-3 font-semibold">Category</th>}
                <th className="px-4 py-3 font-semibold">File Note</th>
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
                    {asset.usageNote && <p className="mt-0.5 max-w-md text-xs text-white/40">{asset.usageNote}</p>}
                  </td>
                  {!lockedCategory && <td className="px-4 py-3 text-white/60">{asset.category}</td>}
                  <td className="px-4 py-3 max-w-xs truncate text-white/60">{asset.fileNote || "—"}</td>
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

      <Modal open={modalOpen} title={editing ? "Sửa Brand Asset" : "Thêm Brand Asset mới"} onClose={() => setModalOpen(false)} width="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Category</label>
              <select
                value={form.category}
                disabled={!!lockedCategory}
                onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as AssetCategory }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none disabled:opacity-50"
              >
                {ASSET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              File Note (chưa có thư viện media — ghi chú đường dẫn/nguồn)
            </label>
            <input
              value={form.fileNote}
              onChange={(e) => setForm((s) => ({ ...s, fileNote: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Format Note</label>
            <input
              value={form.formatNote}
              onChange={(e) => setForm((s) => ({ ...s, formatNote: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Usage Note</label>
            <textarea
              value={form.usageNote}
              onChange={(e) => setForm((s) => ({ ...s, usageNote: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as BrandAsset["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {BRAND_STATUSES.map((s) => (
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
        title="Xóa Brand Asset này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
