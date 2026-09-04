"use client";

import { useState, useTransition } from "react";
import { createDraftMnytTopicAndRedirect } from "./actions";

export function NewTopicButton({ categories }: { categories: { key: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [categoryKey, setCategoryKey] = useState(categories[0]?.key ?? "");
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
        + Tạo ý tưởng mới
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <select value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm">
        {categories.map((c) => (
          <option key={c.key} value={c.key}>{c.name}</option>
        ))}
      </select>
      <button
        disabled={pending}
        onClick={() => startTransition(() => { void createDraftMnytTopicAndRedirect(categoryKey); })}
        className="rounded-lg bg-brand-blue px-3 py-1.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Đang tạo..." : "Tạo"}
      </button>
      <button onClick={() => setOpen(false)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Huỷ</button>
    </div>
  );
}
