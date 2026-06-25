"use client";

import { Bookmark } from "lucide-react";
import { useSavedItems, type SavedItem } from "@/lib/portal/saved";

export function SaveButton({ item, className }: { item: SavedItem; className?: string }) {
  const { isSaved, toggle, ready } = useSavedItems();
  const saved = ready && isSaved(item.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      aria-label={saved ? "Bỏ lưu" : "Lưu lại"}
      className={
        className ??
        `inline-flex h-7 w-7 items-center justify-center rounded-full border transition ${
          saved
            ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
            : "border-white/10 bg-white/5 text-white/50 hover:border-brand-orange/50 hover:text-brand-orange"
        }`
      }
    >
      <Bookmark className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
