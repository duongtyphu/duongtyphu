"use client";

import { useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { settingsSeed, type SiteSettings } from "@/data/admin/settings";

const fieldGroups: { title: string; fields: { key: keyof SiteSettings; label: string }[] }[] = [
  {
    title: "Thông tin chung",
    fields: [
      { key: "siteName", label: "Tên website" },
      { key: "slogan", label: "Slogan" },
      { key: "logoUrl", label: "Logo URL" },
      { key: "faviconUrl", label: "Favicon URL" },
    ],
  },
  {
    title: "Màu thương hiệu",
    fields: [
      { key: "primaryColor", label: "Primary color" },
      { key: "secondaryColor", label: "Secondary color" },
      { key: "accentColor", label: "Accent color" },
    ],
  },
  {
    title: "SEO mặc định",
    fields: [
      { key: "seoTitle", label: "SEO Title" },
      { key: "seoDescription", label: "SEO Description" },
    ],
  },
  {
    title: "Footer & Social",
    fields: [
      { key: "footerText", label: "Footer text" },
      { key: "facebookUrl", label: "Facebook" },
      { key: "youtubeUrl", label: "YouTube" },
      { key: "tiktokUrl", label: "TikTok" },
      { key: "zaloUrl", label: "Zalo" },
    ],
  },
  {
    title: "Thông báo",
    fields: [{ key: "adminEmailNotify", label: "Email nhận thông báo" }],
  },
];

export default function SettingsPage() {
  const { items, set } = useCollection<SiteSettings & { id: string }>("settings", [
    { id: "settings", ...settingsSeed },
  ]);
  const { push } = useAdminToast();
  const [form, setForm] = useState(items[0]);

  function save() {
    if (!form) return;
    set([form]);
    push("Đã lưu cài đặt.");
  }

  if (!form) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Cài đặt</h1>
        <p className="mt-1 text-sm text-white/50">Cấu hình thông tin chung của hệ sinh thái VO DUONG AI.</p>
      </div>

      {fieldGroups.map((group) => (
        <section key={group.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-sm font-bold text-white">{group.title}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {group.fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                  {f.label}
                </label>
                <input
                  value={String(form[f.key] ?? "")}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <button
        onClick={save}
        className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-bold text-white hover:opacity-90"
      >
        Lưu cài đặt
      </button>
    </div>
  );
}
