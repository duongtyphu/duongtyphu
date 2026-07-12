"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  TYPOGRAPHY_STATUSES,
  TYPOGRAPHY_TOKENS_COLLECTION_KEY,
  TYPOGRAPHY_TOKENS_SEED,
  emptyTypographyToken,
  type TypographyToken,
} from "@/lib/admin/brand/typographyRegistry";

/** Typography Foundation (Task 4) — danh sách token, có preview chữ mẫu tĩnh (không phải công cụ chỉnh font). */
export function TypographyRegistry() {
  const { items, ready, add, update, remove } = useCollection<TypographyToken>(
    TYPOGRAPHY_TOKENS_COLLECTION_KEY,
    TYPOGRAPHY_TOKENS_SEED
  );
  const { push } = useAdminToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TypographyToken | null>(null);
  const [form, setForm] = useState<TypographyToken>({ id: "", ...emptyTypographyToken() });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = useMemo(() => [...items].sort((a, b) => a.sortOrder - b.sortOrder), [items]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyTypographyToken() });
    setModalOpen(true);
  }
  function openEdit(token: TypographyToken) {
    setEditing(token);
    setForm({ ...token });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.name.trim() || !form.fontFamily.trim()) {
      push('Vui lòng nhập "Name" và "Font Family"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(TYPOGRAPHY_TOKENS_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Typography Token mới.");
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
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{sorted.length} token</span>
        <button
          onClick={openCreate}
          className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Token
        </button>
      </div>

      {!ready ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/40">
          Chưa có Typography Token nào.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((token) => (
            <div key={token.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => openEdit(token)} className="font-semibold text-white hover:text-brand-blue">
                      {token.name || "(chưa đặt tên)"}
                    </button>
                    <Badge tone={STATUS_TONE[token.status] ?? "gray"}>{token.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-white/40">{token.fontFamily}</p>
                  {token.weight && <p className="text-xs text-white/40">Weight: {token.weight}</p>}
                  {token.usageNote && <p className="mt-1 max-w-xl text-xs text-white/50">{token.usageNote}</p>}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => openEdit(token)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => setDeleteId(token.id)}
                    className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              <p className="mt-3 truncate text-xl text-white" style={{ fontFamily: token.fontFamily }}>
                VO DUONG AI — Học AI, xây hệ thống, tạo tài sản số
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Sửa Typography Token" : "Thêm Typography Token mới"} onClose={() => setModalOpen(false)} width="max-w-lg">
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
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Font Family <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.fontFamily}
              onChange={(e) => setForm((s) => ({ ...s, fontFamily: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Weight</label>
            <input
              value={form.weight}
              onChange={(e) => setForm((s) => ({ ...s, weight: e.target.value }))}
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
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as TypographyToken["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {TYPOGRAPHY_STATUSES.map((s) => (
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
        title="Xóa Typography Token này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
