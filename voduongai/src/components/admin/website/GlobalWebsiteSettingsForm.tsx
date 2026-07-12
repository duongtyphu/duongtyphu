"use client";

import { useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  GLOBAL_WEBSITE_SETTINGS_STATUSES,
  GLOBAL_WEBSITE_SETTINGS_ID,
  GLOBAL_WEBSITE_SETTINGS_COLLECTION_KEY,
  GLOBAL_WEBSITE_SETTINGS_SEED,
  SITE_VISIBILITY_MODES,
  type GlobalWebsiteSettings,
} from "@/lib/admin/website/globalSettings";

/**
 * Global Website Settings (Task 10) — form 1 record duy nhất (singleton).
 * Không dùng useEffect để đồng bộ form từ record (bài học từ lỗi
 * react-hooks/set-state-in-effect ở GlobalBrandSettingsForm, BRAND-SPR-001)
 * — form suy ra trực tiếp trong lúc render: localEdits ?? record.
 */
export function GlobalWebsiteSettingsForm() {
  const { items, ready, add, update } = useCollection<GlobalWebsiteSettings>(
    GLOBAL_WEBSITE_SETTINGS_COLLECTION_KEY,
    GLOBAL_WEBSITE_SETTINGS_SEED
  );
  const { push } = useAdminToast();
  const record = items.find((r) => r.id === GLOBAL_WEBSITE_SETTINGS_ID) ?? null;

  const [localEdits, setLocalEdits] = useState<GlobalWebsiteSettings | null>(null);
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

  function setForm(updater: (s: GlobalWebsiteSettings) => GlobalWebsiteSettings) {
    setLocalEdits(updater(form!));
  }

  function handleSave() {
    if (!form) return;
    const today = new Date().toISOString().slice(0, 10);
    const next = { ...form, updatedDate: today };
    if (record) update(GLOBAL_WEBSITE_SETTINGS_ID, next);
    else add(next);
    setLocalEdits(next);
    push("Đã lưu Global Website Settings.");
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-white/40">Cập nhật lần cuối: {form.updatedDate}</p>
        <div className="flex items-center gap-2">
          <select
            value={form.status}
            onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as GlobalWebsiteSettings["status"] }))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-brand-blue focus:outline-none"
          >
            {GLOBAL_WEBSITE_SETTINGS_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Badge tone={STATUS_TONE[form.status] ?? "gray"}>{form.status}</Badge>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
          Website Announcement
        </label>
        <textarea
          value={form.announcementText}
          onChange={(e) => setForm((s) => ({ ...s, announcementText: e.target.value }))}
          rows={2}
          placeholder="Nội dung thông báo toàn site (nếu bật)..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
        />
        <label className="mt-2 flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={form.announcementActive}
            onChange={(e) => setForm((s) => ({ ...s, announcementActive: e.target.checked }))}
            className="h-4 w-4 rounded border-white/20 bg-white/5"
          />
          Announcement đang bật (chỉ metadata — chưa nối vào NotificationTicker thật)
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
          Default Homepage (ghi chú)
        </label>
        <input
          value={form.defaultHomepageNote}
          onChange={(e) => setForm((s) => ({ ...s, defaultHomepageNote: e.target.value }))}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Visibility</label>
        <select
          value={form.visibilityMode}
          onChange={(e) => setForm((s) => ({ ...s, visibilityMode: e.target.value as GlobalWebsiteSettings["visibilityMode"] }))}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          {SITE_VISIBILITY_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-white/40">
          Foundation only — đổi giá trị này KHÔNG thực sự bật/tắt site thật, chỉ là metadata ý định.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
          Presentation Settings (ghi chú)
        </label>
        <input
          value={form.presentationThemeNote}
          onChange={(e) => setForm((s) => ({ ...s, presentationThemeNote: e.target.value }))}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        />
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
          Lưu
        </button>
      </div>
    </div>
  );
}
