"use client";

import { useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  GLOBAL_BRAND_SETTINGS_STATUSES,
  GLOBAL_BRAND_SETTINGS_ID,
  GLOBAL_BRAND_SETTINGS_COLLECTION_KEY,
  GLOBAL_BRAND_SETTINGS_SEED,
  type GlobalBrandSettings,
} from "@/lib/admin/brand/globalBrandSettings";

const FIELDS: { key: keyof GlobalBrandSettings; label: string; multiline?: boolean }[] = [
  { key: "primaryLogoNote", label: "Primary Logo (ghi chú)" },
  { key: "faviconNote", label: "Favicon (ghi chú)" },
  { key: "primaryColorName", label: "Primary Color" },
  { key: "accentColorName", label: "Accent Color" },
  { key: "tagline", label: "Tagline" },
  { key: "taglineSecondary", label: "Tagline Secondary", multiline: true },
  { key: "brandVoiceNote", label: "Brand Voice Note", multiline: true },
  { key: "defaultOgImageNote", label: "Default Open Graph Image (ghi chú)" },
];

/**
 * Global Brand Settings (Task 7) — form 1 record duy nhất (singleton), dùng
 * chung `useCollection` nhưng luôn thao tác trên đúng 1 id cố định. Không
 * có upload/preview trực quan (không Asset Editor).
 */
export function GlobalBrandSettingsForm() {
  const { items, ready, add, update } = useCollection<GlobalBrandSettings>(
    GLOBAL_BRAND_SETTINGS_COLLECTION_KEY,
    GLOBAL_BRAND_SETTINGS_SEED
  );
  const { push } = useAdminToast();
  const record = items.find((r) => r.id === GLOBAL_BRAND_SETTINGS_ID) ?? null;

  // Không dùng useEffect để đồng bộ state này — form hiển thị chỉnh sửa
  // cục bộ (localEdits) nếu có, ngược lại rơi về record đã tải, tính toán
  // trực tiếp trong lúc render để tránh setState trong effect.
  const [localEdits, setLocalEdits] = useState<GlobalBrandSettings | null>(null);
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

  function setForm(updater: (s: GlobalBrandSettings) => GlobalBrandSettings) {
    setLocalEdits(updater(form!));
  }

  function handleSave() {
    if (!form) return;
    const today = new Date().toISOString().slice(0, 10);
    const next = { ...form, updatedDate: today };
    if (record) update(GLOBAL_BRAND_SETTINGS_ID, next);
    else add(next);
    setLocalEdits(next);
    push("Đã lưu Global Brand Settings.");
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-white/40">Cập nhật lần cuối: {form.updatedDate}</p>
        <div className="flex items-center gap-2">
          <select
            value={form.status}
            onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as GlobalBrandSettings["status"] }))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-brand-blue focus:outline-none"
          >
            {GLOBAL_BRAND_SETTINGS_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Badge tone={STATUS_TONE[form.status] ?? "gray"}>{form.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, multiline }) => (
          <div key={key} className={multiline ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">{label}</label>
            {multiline ? (
              <textarea
                value={form[key]}
                onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            ) : (
              <input
                value={form[key]}
                onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
          Lưu
        </button>
      </div>
    </div>
  );
}
