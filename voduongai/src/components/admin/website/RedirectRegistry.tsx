"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  REDIRECT_STATUSES,
  REDIRECT_TYPES,
  REDIRECT_ENTRIES_COLLECTION_KEY,
  REDIRECT_ENTRIES_SEED,
  emptyRedirectEntry,
  type RedirectEntry,
} from "@/lib/admin/website/redirectRegistry";

/**
 * Validation Placeholder (Task 4, phía Redirect) — CHỈ 2 kiểm tra cơ bản:
 * (1) fromPath trùng toPath (vòng lặp tự redirect chính nó), (2) fromPath
 * bị khai báo nhiều hơn 1 lần trong danh sách đang Active (xung đột rule).
 * KHÔNG phải Redirect Engine — không kiểm tra vòng lặp gián tiếp nhiều
 * bước (A→B→A), không kiểm tra với next.config.ts thật.
 */
function useRedirectWarnings(items: RedirectEntry[]) {
  return useMemo(() => {
    const warnings = new Map<string, string[]>();
    const activeFromPaths = new Map<string, number>();
    for (const item of items) {
      if (item.status !== "Active") continue;
      activeFromPaths.set(item.fromPath, (activeFromPaths.get(item.fromPath) ?? 0) + 1);
    }
    for (const item of items) {
      const msgs: string[] = [];
      if (item.fromPath && item.fromPath === item.toPath) msgs.push("From = To (vòng lặp tự redirect chính nó)");
      if (item.status === "Active" && (activeFromPaths.get(item.fromPath) ?? 0) > 1) {
        msgs.push("Trùng From Path với rule Active khác");
      }
      if (msgs.length > 0) warnings.set(item.id, msgs);
    }
    return warnings;
  }, [items]);
}

export function RedirectRegistry() {
  const { items, ready, add, update, remove } = useCollection<RedirectEntry>(
    REDIRECT_ENTRIES_COLLECTION_KEY,
    REDIRECT_ENTRIES_SEED
  );
  const { push } = useAdminToast();
  const warnings = useRedirectWarnings(items);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RedirectEntry | null>(null);
  const [form, setForm] = useState<RedirectEntry>({ id: "", ...emptyRedirectEntry() });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...items];
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) => r.fromPath.toLowerCase().includes(q) || r.toPath.toLowerCase().includes(q));
    }
    list.sort((a, b) => a.sortOrder - b.sortOrder);
    return list;
  }, [items, statusFilter, query]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyRedirectEntry() });
    setModalOpen(true);
  }
  function openEdit(entry: RedirectEntry) {
    setEditing(entry);
    setForm({ ...entry });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.fromPath.trim() || !form.toPath.trim()) {
      push('Vui lòng nhập "From Path" và "To Path"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(REDIRECT_ENTRIES_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Redirect mới.");
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
          placeholder="Tìm theo From/To Path..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Trạng thái: Tất cả</option>
          {REDIRECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40">{filtered.length} redirect</span>
        <button
          onClick={openCreate}
          className="ml-auto rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Redirect
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
          <div className="p-10 text-center text-sm text-white/40">Chưa có Redirect nào.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">From Path</th>
                <th className="px-4 py-3 font-semibold">To Path</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Validation</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const entryWarnings = warnings.get(entry.id) ?? [];
                return (
                  <tr key={entry.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(entry)} className="text-left font-semibold text-white hover:text-brand-blue">
                        {entry.fromPath || "(chưa nhập)"}
                      </button>
                      {entry.note && <p className="mt-0.5 max-w-xs truncate text-xs text-white/40">{entry.note}</p>}
                    </td>
                    <td className="px-4 py-3 text-white/60">{entry.toPath || "—"}</td>
                    <td className="px-4 py-3 text-white/60">{entry.redirectType}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[entry.status] ?? "gray"}>{entry.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {entryWarnings.length === 0 ? (
                        <span className="text-[11px] text-emerald-300">OK</span>
                      ) : (
                        <span className="text-[11px] font-semibold text-red-300" title={entryWarnings.join("; ")}>
                          {entryWarnings.join("; ")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(entry)}
                        className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setDeleteId(entry.id)}
                        className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <p className="text-xs text-white/40">
        Cột Validation chỉ là Validation Placeholder (kiểm tra From=To và trùng From Path giữa các rule Active) —
        không phải Redirect Engine, không kiểm tra với next.config.ts thật.
      </p>

      <Modal open={modalOpen} title={editing ? "Sửa Redirect" : "Thêm Redirect mới"} onClose={() => setModalOpen(false)} width="max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              From Path <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.fromPath}
              onChange={(e) => setForm((s) => ({ ...s, fromPath: e.target.value }))}
              placeholder="/duong-cu"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              To Path <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.toPath}
              onChange={(e) => setForm((s) => ({ ...s, toPath: e.target.value }))}
              placeholder="/duong-moi"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Type</label>
              <select
                value={form.redirectType}
                onChange={(e) => setForm((s) => ({ ...s, redirectType: e.target.value as RedirectEntry["redirectType"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {REDIRECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as RedirectEntry["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {REDIRECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Ghi chú</label>
            <input
              value={form.note}
              onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
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
        title="Xóa Redirect này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
