"use client";

import { useMemo } from "react";
import { useCollection } from "@/lib/admin/store";
import { SEO_ENTRIES_COLLECTION_KEY, SEO_ENTRIES_SEED, type SEOEntry } from "@/lib/admin/website/seoRegistry";
import { siteConfig } from "@/lib/site";

/**
 * Preview Placeholder (Task 5) — minh họa dạng kết quả tìm kiếm Google
 * (Title xanh/URL xanh lá/Description xám) dựng từ Meta Title/Description
 * của SEO Entry đang Active. Đây là hình dạng GẦN ĐÚNG, không phải render
 * pixel-perfect của Google SERP thật (Google có thể hiển thị khác tùy
 * thiết bị/site links/rich snippet) — không phải AI SEO/SEO Generator nào
 * tính toán lại nội dung, chỉ hiển thị lại đúng dữ liệu Founder đã nhập.
 */
export function SEOPreviewPlaceholder() {
  const { items, ready } = useCollection<SEOEntry>(SEO_ENTRIES_COLLECTION_KEY, SEO_ENTRIES_SEED);

  const activeEntries = useMemo(
    () => items.filter((e) => e.status === "Active").sort((a, b) => a.sortOrder - b.sortOrder),
    [items]
  );

  if (!ready) {
    return <div className="h-32 animate-pulse rounded-2xl bg-white/5" />;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div>
        <h3 className="text-sm font-bold text-white">Preview Placeholder — Google SERP</h3>
        <p className="mt-1 text-xs text-white/40">
          Minh họa gần đúng, không phải render pixel-perfect của Google thật — chỉ hiển thị lại Meta Title/Description
          của SEO Entry đang Active.
        </p>
      </div>

      {activeEntries.length === 0 ? (
        <p className="text-xs text-white/30">Chưa có SEO Entry nào đang Active.</p>
      ) : (
        <div className="space-y-3">
          {activeEntries.map((entry) => (
            <div key={entry.id} className="max-w-xl rounded-xl border border-white/10 bg-white p-4">
              <p className="truncate text-xs text-[#202124]">
                {siteConfig.url.replace(/^https?:\/\//, "")}
                {entry.targetUrl !== "/" ? entry.targetUrl : ""}
              </p>
              <p className="mt-0.5 truncate text-lg text-[#1a0dab]">{entry.metaTitle || entry.title || "(chưa có Meta Title)"}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-[#4d5156]">
                {entry.metaDescription || "(chưa có Meta Description)"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
