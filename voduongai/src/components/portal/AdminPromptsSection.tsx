"use client";

import { useCollection } from "@/lib/admin/store";
import { promptsSeed } from "@/data/admin/prompts";
import { CopyPromptButton } from "@/components/portal/CopyPromptButton";

export function AdminPromptsSection() {
  const { items, ready } = useCollection("prompts", promptsSeed);
  const published = items.filter((p) => p.status === "Published");
  if (!ready || published.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
        Prompt từ Admin
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {published.map((p) => (
          <div key={p.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
              {p.category}
            </span>
            <h3 className="mt-3 text-sm font-bold text-white">{p.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-white/70">{p.description}</p>
            <CopyPromptButton content={p.content} />
          </div>
        ))}
      </div>
    </div>
  );
}
