"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  THEME_STATUSES,
  THEME_PROFILES_COLLECTION_KEY,
  THEME_PROFILES_SEED,
  emptyThemeProfile,
  type ThemeProfile,
} from "@/lib/admin/brand/themeRegistry";

/** Theme Foundation (Task 6) — ghi nhận các theme đang tồn tại trong code, không phải Theme Builder/switcher thật. */
export function ThemeRegistry() {
  const { items, ready, add, update, remove } = useCollection<ThemeProfile>(THEME_PROFILES_COLLECTION_KEY, THEME_PROFILES_SEED);
  const { push } = useAdminToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ThemeProfile | null>(null);
  const [form, setForm] = useState<ThemeProfile>({ id: "", ...emptyThemeProfile() });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = useMemo(() => [...items].sort((a, b) => a.sortOrder - b.sortOrder), [items]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyThemeProfile() });
    setModalOpen(true);
  }
  function openEdit(profile: ThemeProfile) {
    setEditing(profile);
    setForm({ ...profile });
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
      add({ ...form, id: genId(THEME_PROFILES_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Theme Profile mới.");
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
        <span className="text-xs text-white/40">{sorted.length} theme profile</span>
        <button
          onClick={openCreate}
          className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Theme Profile
        </button>
      </div>

      {!ready ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/40">
          Chưa có Theme Profile nào.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((profile) => (
            <div key={profile.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => openEdit(profile)} className="font-semibold text-white hover:text-brand-blue">
                      {profile.name || "(chưa đặt tên)"}
                    </button>
                    <Badge tone={STATUS_TONE[profile.status] ?? "gray"}>{profile.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-white/40">Background: {profile.backgroundNote || "—"}</p>
                  <p className="text-xs text-white/40">Text: {profile.textNote || "—"}</p>
                  <p className="text-xs text-white/40">Accent: {profile.accentNote || "—"}</p>
                  {profile.usageNote && <p className="mt-1 max-w-2xl text-xs text-white/50">{profile.usageNote}</p>}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => openEdit(profile)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => setDeleteId(profile.id)}
                    className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Sửa Theme Profile" : "Thêm Theme Profile mới"} onClose={() => setModalOpen(false)} width="max-w-lg">
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
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Background Note</label>
            <input
              value={form.backgroundNote}
              onChange={(e) => setForm((s) => ({ ...s, backgroundNote: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Text Note</label>
            <input
              value={form.textNote}
              onChange={(e) => setForm((s) => ({ ...s, textNote: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Accent Note</label>
            <input
              value={form.accentNote}
              onChange={(e) => setForm((s) => ({ ...s, accentNote: e.target.value }))}
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
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as ThemeProfile["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {THEME_STATUSES.map((s) => (
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
        title="Xóa Theme Profile này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
