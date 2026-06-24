"use client";

import { useState } from "react";
import Link from "next/link";
import { useSavedItems, type SavedKind } from "@/lib/portal/saved";

const KIND_LABEL: Record<SavedKind, string> = {
  prompt: "Prompt",
  tool: "Công cụ",
  resource: "Tài nguyên",
  ebook: "Ebook",
  checklist: "Checklist",
  lesson: "Bài học",
  affiliate: "Affiliate",
};

export default function SavedPage() {
  const { items, ready, toggle } = useSavedItems();
  const [filter, setFilter] = useState<SavedKind | "all">("all");

  const filtered = filter === "all" ? items : items.filter((it) => it.kind === filter);
  const kindsPresent = Array.from(new Set(items.map((it) => it.kind)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Đã lưu</h1>
        <p className="mt-2 text-white">Prompt, công cụ, tài nguyên và bài học bạn đã lưu lại để xem sau.</p>
      </div>

      {ready && items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === "all" ? "bg-brand-blue text-white" : "border border-white/10 text-white/70 hover:text-white"
            }`}
          >
            Tất cả
          </button>
          {kindsPresent.map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === k ? "bg-brand-blue text-white" : "border border-white/10 text-white/70 hover:text-white"
              }`}
            >
              {KIND_LABEL[k]}
            </button>
          ))}
        </div>
      )}

      {!ready ? null : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white/70">
          Bạn chưa lưu nội dung nào. Nhấn biểu tượng 🔖 trên Prompt, Công cụ hoặc Tài nguyên để lưu lại.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((it) => (
            <div key={it.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                {KIND_LABEL[it.kind]}
              </span>
              <h3 className="mt-3 text-sm font-bold text-white">{it.title}</h3>
              {it.meta && <p className="mt-1 text-xs text-white/50">{it.meta}</p>}
              <div className="mt-4 flex items-center justify-between">
                <Link href={it.href} className="text-xs font-semibold text-brand-blue hover:underline">
                  Xem lại →
                </Link>
                <button
                  onClick={() => toggle(it)}
                  className="text-xs font-semibold text-white/40 hover:text-brand-orange"
                >
                  Bỏ lưu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
