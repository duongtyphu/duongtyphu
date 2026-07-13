"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  COLOR_STATUSES,
  COLOR_ROLES,
  COLOR_TOKENS_COLLECTION_KEY,
  COLOR_TOKENS_SEED,
  emptyColorToken,
  type ColorToken,
} from "@/lib/admin/brand/colorRegistry";

function isValidHex(value: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

/** Color Palette Foundation (Task 5) — danh sách token màu + swatch preview tĩnh (không phải color picker/Theme Builder). */
export function ColorPaletteRegistry() {
  const { items, ready, add, update, remove } = useCollection<ColorToken>(COLOR_TOKENS_COLLECTION_KEY, COLOR_TOKENS_SEED);
  const { push } = useAdminToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ColorToken | null>(null);
  const [form, setForm] = useState<ColorToken>({ id: "", ...emptyColorToken() });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | ColorToken["role"]>("all");

  const sorted = useMemo(() => {
    const list = roleFilter === "all" ? items : items.filter((t) => t.role === roleFilter);
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [items, roleFilter]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyColorToken() });
    setModalOpen(true);
  }
  function openEdit(token: ColorToken) {
    setEditing(token);
    setForm({ ...token });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.name.trim() || !isValidHex(form.hexValue)) {
      push('Vui lòng nhập "Name" và mã hex hợp lệ (VD: #2563EB)', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(COLOR_TOKENS_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Color Token mới.");
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
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "all" | ColorToken["role"])}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Role: Tất cả</option>
          {COLOR_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40">{sorted.length} màu</span>
        <button
          onClick={openCreate}
          className="ml-auto rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Màu
        </button>
      </div>

      {!ready ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/40">
          Chưa có Color Token nào.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((token) => (
            <div key={token.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="h-16 w-full" style={{ backgroundColor: isValidHex(token.hexValue) ? token.hexValue : "#000" }} />
              <div className="p-3">
                <div className="flex items-center justify-between gap-1.5">
                  <button onClick={() => openEdit(token)} className="truncate text-sm font-semibold text-white hover:text-brand-blue">
                    {token.name || "(chưa đặt tên)"}
                  </button>
                  <Badge tone={STATUS_TONE[token.status] ?? "gray"}>{token.status}</Badge>
                </div>
                <p className="mt-0.5 font-mono text-xs text-white/50">
                  {token.hexValue} <span className="text-white/30">· {token.role}</span>
                </p>
                {token.usageNote && <p className="mt-1 text-[11px] text-white/40">{token.usageNote}</p>}
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() => openEdit(token)}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => setDeleteId(token.id)}
                    className="rounded-lg border border-red-400/20 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/10"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Sửa Color Token" : "Thêm Color Token mới"} onClose={() => setModalOpen(false)} width="max-w-lg">
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
              Hex Value <span className="text-brand-orange">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span
                className="h-9 w-9 shrink-0 rounded-lg border border-white/10"
                style={{ backgroundColor: isValidHex(form.hexValue) ? form.hexValue : "transparent" }}
              />
              <input
                value={form.hexValue}
                onChange={(e) => setForm((s) => ({ ...s, hexValue: e.target.value }))}
                placeholder="#2563EB"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((s) => ({ ...s, role: e.target.value as ColorToken["role"] }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              {COLOR_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
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
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as ColorToken["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {COLOR_STATUSES.map((s) => (
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
        title="Xóa Color Token này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
