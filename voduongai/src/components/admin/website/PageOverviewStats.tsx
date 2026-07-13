"use client";

import { useMemo } from "react";
import { useCollection } from "@/lib/admin/store";
import { WEBSITE_PAGES_COLLECTION_KEY, WEBSITE_PAGES_SEED, type WebsitePage, type PageType } from "@/lib/admin/website/pageRegistry";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}

/**
 * Page Overview (Task 3) — Draft/Published/Archived/Recently Updated,
 * computed from the real Page Registry collection. WEB-SPR-202: nối vào
 * `WEBSITE_PAGES_SEED` (9 trang thật audit từ src/app/*) — trước đó seed
 * rỗng khiến số liệu luôn = 0, không phản ánh Website thật (xem báo cáo
 * WEB-SPR-202).
 */
export function PageOverviewStats({ lockedPageType }: { lockedPageType?: PageType }) {
  const { items, ready } = useCollection<WebsitePage>(WEBSITE_PAGES_COLLECTION_KEY, WEBSITE_PAGES_SEED);

  const scoped = useMemo(
    () => (lockedPageType ? items.filter((p) => p.pageType === lockedPageType) : items),
    [items, lockedPageType]
  );

  const stats = useMemo(() => {
    const count = (status: string) => scoped.filter((p) => p.status === status).length;
    return { draft: count("Draft"), published: count("Published"), archived: count("Archived") };
  }, [scoped]);

  const recentlyUpdated = useMemo(
    () => [...scoped].sort((a, b) => b.updatedDate.localeCompare(a.updatedDate)).slice(0, 5),
    [scoped]
  );

  if (!ready) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="lg:col-span-3 grid grid-cols-3 gap-3">
        <StatCard label="Draft" value={stats.draft} />
        <StatCard label="Published" value={stats.published} />
        <StatCard label="Archived" value={stats.archived} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">Recently Updated</p>
        {recentlyUpdated.length === 0 ? (
          <p className="mt-2 text-xs text-white/40">Chưa có Page nào.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {recentlyUpdated.map((p) => (
              <li key={p.id} className="truncate text-xs text-white/70">
                {p.title || "(chưa đặt tiêu đề)"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
