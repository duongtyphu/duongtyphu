"use client";

import { useMemo } from "react";
import { useCollection } from "@/lib/admin/store";
import {
  SECTION_CATEGORIES,
  SHARED_SECTIONS_COLLECTION_KEY,
  SHARED_SECTIONS_SEED,
  type SharedSection,
} from "@/lib/admin/website/sharedSectionRegistry";

/**
 * Preview Placeholder (WEB-SPR-004 Task 5) — CỐ Ý nhẹ hơn Navigation
 * Preview (WEB-SPR-003 Task 5). Navigation Preview dựng lại được đúng hình
 * dạng thật (hàng ngang/danh sách dọc) vì cấu trúc menu đơn giản. Section
 * thì có bố cục/thiết kế trực quan riêng cho từng loại (Hero khác CTA khác
 * FAQ) — dựng lại đúng bố cục đó là việc của Visual Builder, KHÔNG nằm
 * trong phạm vi Foundation này. Vì vậy đây chỉ là một Ô GIỮ CHỖ
 * (placeholder) dạng khung nét đứt hiển thị Headline/Body/CTA dạng văn bản
 * thuần — để Founder xem lại NỘI DUNG trước khi publish, không phải xem
 * trước GIAO DIỆN.
 */
export function SharedSectionPreviewPlaceholder() {
  const { items, ready } = useCollection<SharedSection>(SHARED_SECTIONS_COLLECTION_KEY, SHARED_SECTIONS_SEED);

  const publishedByCategory = useMemo(() => {
    const map = new Map<string, SharedSection[]>();
    for (const category of SECTION_CATEGORIES) {
      map.set(
        category,
        items
          .filter((s) => s.category === category && s.status === "Published")
          .sort((a, b) => a.sortOrder - b.sortOrder)
      );
    }
    return map;
  }, [items]);

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/5" />;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div>
        <h3 className="text-sm font-bold text-white">Preview Placeholder</h3>
        <p className="mt-1 text-xs text-white/40">
          Chỉ xem trước NỘI DUNG (Headline/Body/CTA) ở dạng văn bản thuần, không phải giao diện thật — chỉ hiển thị
          Section đang Published. Xem giao diện thật là việc của Visual Builder (chưa xây, ngoài phạm vi Foundation
          này).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTION_CATEGORIES.map((category) => {
          const sections = publishedByCategory.get(category) ?? [];
          return (
            <div key={category} className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{category}</p>
              {sections.length === 0 ? (
                <p className="mt-2 text-xs text-white/30">Chưa có Section Published nào ở category này.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {sections.map((s) => (
                    <div key={s.id} className="rounded-lg bg-white/5 p-2">
                      {s.headline && <p className="text-xs font-semibold text-white/80">{s.headline}</p>}
                      {s.body && <p className="mt-0.5 line-clamp-2 text-[11px] text-white/50">{s.body}</p>}
                      {s.ctaLabel && (
                        <span className="mt-1 inline-block rounded-full bg-brand-blue/20 px-2 py-0.5 text-[10px] font-semibold text-brand-blue">
                          {s.ctaLabel}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
