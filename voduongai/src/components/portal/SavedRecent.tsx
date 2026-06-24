"use client";

import Link from "next/link";
import { useSavedItems } from "@/lib/portal/saved";

export function SavedRecent() {
  const { items, ready } = useSavedItems();
  if (!ready || items.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-white">Tài nguyên đã lưu gần đây</h2>
        <Link href="/portal/saved" className="text-sm font-semibold text-brand-blue hover:underline">
          Xem tất cả →
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.slice(0, 3).map((it) => (
          <Link
            key={it.id}
            href={it.href}
            className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:shadow-lg hover:shadow-black/30"
          >
            <p className="text-sm font-semibold text-white">{it.title}</p>
            {it.meta && <p className="mt-1 text-xs text-white/50">{it.meta}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
