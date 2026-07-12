"use client";

import { useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  MEDIA_SETTINGS_STATUSES,
  MEDIA_SETTINGS_ID,
  MEDIA_SETTINGS_COLLECTION_KEY,
  MEDIA_SETTINGS_SEED,
  MEDIA_VISIBILITY_MODES,
  type MediaSettings,
} from "@/lib/admin/media/settings";
import { MEDIA_FOLDERS_COLLECTION_KEY, MEDIA_FOLDERS_SEED, type MediaFolder } from "@/lib/admin/media/folderRegistry";

/**
 * Media Settings (Task 9) — form 1 record duy nhất (singleton), dùng
 * chung `useCollection` nhưng luôn thao tác trên đúng 1 id cố định. Không
 * dùng `useEffect` để đồng bộ state — `form = localEdits ?? record` tính
 * trực tiếp trong lúc render (tránh lỗi `react-hooks/set-state-in-effect`
 * đã gặp ở Brand Studio, BRAND-SPR-001).
 */
export function MediaSettingsForm() {
  const { items, ready, add, update } = useCollection<MediaSettings>(MEDIA_SETTINGS_COLLECTION_KEY, MEDIA_SETTINGS_SEED);
  const { items: folders } = useCollection<MediaFolder>(MEDIA_FOLDERS_COLLECTION_KEY, MEDIA_FOLDERS_SEED);
  const { push } = useAdminToast();
  const record = items.find((r) => r.id === MEDIA_SETTINGS_ID) ?? null;

  const [localEdits, setLocalEdits] = useState<MediaSettings | null>(null);
  const form = localEdits ?? record;

  if (!ready || !form) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  function setForm(updater: (s: MediaSettings) => MediaSettings) {
    setLocalEdits(updater(form!));
  }

  function handleSave() {
    if (!form) return;
    const today = new Date().toISOString().slice(0, 10);
    const next = { ...form, updatedDate: today };
    if (record) update(MEDIA_SETTINGS_ID, next);
    else add(next);
    setLocalEdits(next);
    push("Đã lưu Media Settings.");
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-white/40">Cập nhật lần cuối: {form.updatedDate}</p>
        <div className="flex items-center gap-2">
          <select
            value={form.status}
            onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as MediaSettings["status"] }))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-brand-blue focus:outline-none"
          >
            {MEDIA_SETTINGS_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Badge tone={STATUS_TONE[form.status] ?? "gray"}>{form.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Upload Rules</label>
          <textarea
            value={form.uploadRulesNote}
            onChange={(e) => setForm((s) => ({ ...s, uploadRulesNote: e.target.value }))}
            rows={2}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Default Folder</label>
          <select
            value={form.defaultFolderId}
            onChange={(e) => setForm((s) => ({ ...s, defaultFolderId: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
          >
            <option value="">— Không có mặc định —</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Visibility</label>
          <select
            value={form.visibility}
            onChange={(e) => setForm((s) => ({ ...s, visibility: e.target.value as MediaSettings["visibility"] }))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
          >
            {MEDIA_VISIBILITY_MODES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Storage Policy</label>
          <textarea
            value={form.storagePolicyNote}
            onChange={(e) => setForm((s) => ({ ...s, storagePolicyNote: e.target.value }))}
            rows={2}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
          Lưu
        </button>
      </div>
    </div>
  );
}
