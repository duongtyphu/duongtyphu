"use client";

import { useCollection } from "@/lib/admin/store";
import { roadmapSeed } from "@/data/admin/roadmap";

export function AdminRoadmapSection() {
  const { items, ready } = useCollection("roadmap-steps", roadmapSeed);
  const published = items.filter((s) => s.status === "Published").sort((a, b) => a.order - b.order);
  if (!ready || published.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
        Các bước lộ trình (Admin)
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {published.map((s) => (
          <div key={s.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <span className="text-2xl">{s.icon}</span>
            <h3 className="mt-3 text-sm font-bold text-gray-900">
              Bước {s.order}: {s.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
