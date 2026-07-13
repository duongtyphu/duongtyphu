"use client";

import { useState } from "react";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { AI_WORKSPACE_SECTIONS } from "@/lib/admin/aiWorkspace/navigation";
import { useCollection } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import {
  AI_WORKSPACE_SETTINGS_COLLECTION_KEY,
  AI_WORKSPACE_SETTINGS_ID,
  AI_WORKSPACE_SETTINGS_SEED,
  type AiWorkspaceSettings,
} from "@/lib/admin/aiWorkspace/settings";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none";

export default function AiWorkspaceSettingsPage() {
  const { items, ready, add, update } = useCollection<AiWorkspaceSettings>(
    AI_WORKSPACE_SETTINGS_COLLECTION_KEY,
    AI_WORKSPACE_SETTINGS_SEED
  );
  const { push } = useAdminToast();
  const record = items.find((r) => r.id === AI_WORKSPACE_SETTINGS_ID) ?? null;
  const [localEdits, setLocalEdits] = useState<AiWorkspaceSettings | null>(null);
  const form = localEdits ?? record;

  if (!ready || !form) {
    return (
      <AdminWorkspaceShell title="AI Workspace" description="" rootHref="/admin/ai-workspace" sections={AI_WORKSPACE_SECTIONS}>
        <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      </AdminWorkspaceShell>
    );
  }

  function setForm(updater: (s: AiWorkspaceSettings) => AiWorkspaceSettings) {
    setLocalEdits(updater(form!));
  }

  function handleSave() {
    if (!form) return;
    const next = { ...form, updatedDate: new Date().toISOString().slice(0, 10) };
    if (record) update(AI_WORKSPACE_SETTINGS_ID, next);
    else add(next);
    setLocalEdits(next);
    push("Đã lưu Hero & Footer CTA.");
  }

  return (
    <AdminWorkspaceShell title="AI Workspace" description="" rootHref="/admin/ai-workspace" sections={AI_WORKSPACE_SECTIONS}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-white">Hero & Footer CTA</h1>
            <p className="mt-1 text-sm text-white/50">
              Text + CTA của Section Hero (đầu trang) và Footer CTA (cuối trang) trên /portal/aiworkspace.
              Cập nhật lần cuối: {form.updatedDate}.
            </p>
          </div>
          <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
            Lưu
          </button>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Hero</h2>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Dòng phụ đề</label>
            <input value={form.heroSubtitle} onChange={(e) => setForm((s) => ({ ...s, heroSubtitle: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Mô tả</label>
            <textarea
              rows={3}
              value={form.heroDescription}
              onChange={(e) => setForm((s) => ({ ...s, heroDescription: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">CTA chính</label>
              <input
                value={form.heroPrimaryCtaLabel}
                onChange={(e) => setForm((s) => ({ ...s, heroPrimaryCtaLabel: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">CTA phụ</label>
              <input
                value={form.heroSecondaryCtaLabel}
                onChange={(e) => setForm((s) => ({ ...s, heroSecondaryCtaLabel: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Footer CTA</h2>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Tiêu đề</label>
            <input value={form.footerTitle} onChange={(e) => setForm((s) => ({ ...s, footerTitle: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Mô tả</label>
            <textarea
              rows={3}
              value={form.footerDescription}
              onChange={(e) => setForm((s) => ({ ...s, footerDescription: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Nút chính — nhãn</label>
              <input
                value={form.footerPrimaryLabel}
                onChange={(e) => setForm((s) => ({ ...s, footerPrimaryLabel: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Nút chính — link</label>
              <input
                value={form.footerPrimaryHref}
                onChange={(e) => setForm((s) => ({ ...s, footerPrimaryHref: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Nút phụ — nhãn</label>
              <input
                value={form.footerSecondaryLabel}
                onChange={(e) => setForm((s) => ({ ...s, footerSecondaryLabel: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Nút phụ — link</label>
              <input
                value={form.footerSecondaryHref}
                onChange={(e) => setForm((s) => ({ ...s, footerSecondaryHref: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
            Lưu
          </button>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
