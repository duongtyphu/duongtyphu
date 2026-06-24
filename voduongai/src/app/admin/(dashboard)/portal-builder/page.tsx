"use client";

import { useState } from "react";
import Link from "next/link";
import { useCollection } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { welcomeSeed, portalSectionsSeed, type WelcomeConfig } from "@/data/admin/portalBuilder";

export default function PortalBuilderPage() {
  const { push } = useAdminToast();
  const { items: sections, set: setSections } = useCollection("portal-sections", portalSectionsSeed);
  const { items: welcomeItems, set: setWelcome } = useCollection<WelcomeConfig & { id: string }>(
    "portal-welcome",
    [{ id: "welcome", ...welcomeSeed }]
  );
  const welcome = welcomeItems[0];
  const [form, setForm] = useState(welcome);

  function saveWelcome() {
    if (!form) return;
    setWelcome([form]);
    push("Đã lưu nội dung chào mừng.");
  }

  function toggleVisible(id: string) {
    setSections(sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  }

  function move(id: string, dir: -1 | 1) {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    setSections(sections.map((s) => (s.id === a.id ? { ...s, order: b.order } : s.id === b.id ? { ...s, order: a.order } : s)));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">Portal Builder</h1>
          <p className="mt-1 text-sm text-white/50">Điều khiển nội dung hiển thị trên Dashboard Portal.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/portal-builder/banner" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            Quản lý Banner
          </Link>
          <Link href="/admin/portal-builder/featured" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            Nội dung nổi bật
          </Link>
          <Link href="/admin/portal-builder/cta" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            CTA Manager
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-sm font-bold text-white">Welcome banner</h2>
        {form && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Welcome title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Welcome subtitle</label>
              <textarea
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">CTA text</label>
              <input
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">CTA link</label>
              <input
                value={form.ctaHref}
                onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
        )}
        <button
          onClick={saveWelcome}
          className="mt-4 rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          Lưu thay đổi
        </button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-sm font-bold text-white">Thứ tự & hiển thị Section</h2>
        <p className="mt-1 text-xs text-white/40">Bật/tắt và sắp xếp các khối nội dung trên trang Portal Dashboard.</p>
        <div className="mt-4 space-y-2">
          {[...sections]
            .sort((a, b) => a.order - b.order)
            .map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-white/40">#{s.order}</span>
                  <span className="text-sm font-semibold text-white">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => move(s.id, -1)} className="rounded-lg border border-white/10 px-2 py-1 text-xs text-white/60 hover:bg-white/10">
                    ↑
                  </button>
                  <button onClick={() => move(s.id, 1)} className="rounded-lg border border-white/10 px-2 py-1 text-xs text-white/60 hover:bg-white/10">
                    ↓
                  </button>
                  <button
                    onClick={() => toggleVisible(s.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      s.visible ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {s.visible ? "Hiện" : "Ẩn"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
