"use client";

import { Bookmark, Clock, Heart } from "lucide-react";
import { useSeedBookmark, type BookmarkKind } from "../utils/use-seed-bookmark";

const OPTIONS: { kind: BookmarkKind; label: string; icon: typeof Bookmark }[] = [
  { kind: "saved", label: "Lưu", icon: Bookmark },
  { kind: "read_later", label: "Đọc sau", icon: Clock },
  { kind: "favorite", label: "Yêu thích", icon: Heart },
];

export function BookmarkButton({ seedId }: { seedId: string }) {
  const { kinds, toggle } = useSeedBookmark(seedId);

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map(({ kind, label, icon: Icon }) => {
        const active = kinds.includes(kind);
        return (
          <button
            key={kind}
            type="button"
            onClick={() => toggle(kind)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "border-blue-300 bg-blue-50 text-blue-600"
                : "border-gray-200 bg-white/70 text-gray-500 hover:border-blue-200"
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${active ? "fill-current" : ""}`} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
