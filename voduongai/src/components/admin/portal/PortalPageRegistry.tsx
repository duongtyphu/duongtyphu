"use client";

import { useMemo, useState } from "react";
import { PORTAL_AREAS } from "@/lib/admin/portal/areas";
import { PORTAL_PAGES } from "@/lib/admin/portal/pages";

/**
 * Portal Page Registry (Task 3) — READ-ONLY, liệt kê toàn bộ route THẬT
 * (`find src/app/portal -name page.tsx`). KHÔNG có Add/Edit/Delete — đây
 * là route thật của code, không phải nội dung admin-editable, sửa route
 * là việc của lập trình, không phải CRUD nghiệp vụ (đúng "Không triển
 * khai CRUD nghiệp vụ" của brief).
 */
export function PortalPageRegistry() {
  const [query, setQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = [...PORTAL_PAGES];
    if (areaFilter === "unmapped") list = list.filter((p) => p.areaKey === null);
    else if (areaFilter !== "all") list = list.filter((p) => p.areaKey === areaFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.path.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.path.localeCompare(b.path));
  }, [areaFilter, query]);

  const areaLabel = (key: string | null) => (key ? PORTAL_AREAS.find((a) => a.key === key)?.label ?? key : "—");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo path..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Area: Tất cả</option>
          <option value="unmapped">Chưa khớp Area nào</option>
          {PORTAL_AREAS.map((a) => (
            <option key={a.key} value={a.key}>
              {a.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40">{filtered.length}/{PORTAL_PAGES.length} page</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40">
              <th className="px-4 py-3 font-semibold">Path</th>
              <th className="px-4 py-3 font-semibold">Area</th>
              <th className="px-4 py-3 font-semibold">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.path} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-mono text-white/80">{p.path}</td>
                <td className="px-4 py-3 text-white/60">{areaLabel(p.areaKey)}</td>
                <td className="px-4 py-3 max-w-md text-xs text-white/40">{p.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
