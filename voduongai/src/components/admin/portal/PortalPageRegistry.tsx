"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCollection } from "@/lib/admin/store";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import { PORTAL_AREAS_COLLECTION_KEY, PORTAL_AREAS_SEED, type PortalArea } from "@/lib/admin/portal/areaRegistry";
import { PORTAL_PAGES_COLLECTION_KEY, PORTAL_PAGES_SEED, type PortalPageEntry } from "@/lib/admin/portal/pageRegistry";

/**
 * Portal Page Registry (Task 2) — view tổng hợp CHÉO toàn bộ Page/Child
 * Page của 10 Area, đọc chung collection với Portal Areas (Explorer) —
 * sửa ở đâu cũng đồng bộ. Trang này chỉ tìm kiếm/lọc nhanh xuyên Area;
 * Add/Edit/Delete thật thực hiện ở Portal Areas (drill-down theo Area,
 * đúng luồng Objective của brief).
 */
export function PortalPageRegistry() {
  const { items: areas, ready: areasReady } = useCollection<PortalArea>(PORTAL_AREAS_COLLECTION_KEY, PORTAL_AREAS_SEED);
  const { items: pages, ready: pagesReady } = useCollection<PortalPageEntry>(PORTAL_PAGES_COLLECTION_KEY, PORTAL_PAGES_SEED);

  const [query, setQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = [...pages];
    if (areaFilter !== "all") list = list.filter((p) => p.areaId === areaFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.route.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.route.localeCompare(b.route));
  }, [pages, areaFilter, query]);

  const areaLabel = (id: string) => areas.find((a) => a.id === id)?.label ?? id;

  if (!areasReady || !pagesReady) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tiêu đề hoặc route..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Area: Tất cả</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40">
          {filtered.length}/{pages.length} page
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40">
              <th className="px-4 py-3 font-semibold">Tiêu đề / Route</th>
              <th className="px-4 py-3 font-semibold">Area</th>
              <th className="px-4 py-3 font-semibold">Loại</th>
              <th className="px-4 py-3 font-semibold">Workspace Owner</th>
              <th className="px-4 py-3 font-semibold">Publish Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <p className="font-semibold text-white/80">{p.title}</p>
                  <p className="font-mono text-xs text-white/40">{p.route}</p>
                </td>
                <td className="px-4 py-3 text-white/60">{areaLabel(p.areaId)}</td>
                <td className="px-4 py-3 text-white/60">{p.parentPageId ? "Child Page" : "Parent Page"}</td>
                <td className="px-4 py-3 text-white/60">{p.workspaceOwner || "—"}</td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[p.publishStatus] ?? "gray"}>{p.publishStatus}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/portal/areas?area=${p.areaId}`} className="text-xs font-semibold text-brand-blue hover:underline">
                    Quản lý →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
