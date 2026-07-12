"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PORTAL_AREAS } from "@/lib/admin/portal/areas";
import { PORTAL_PAGES } from "@/lib/admin/portal/pages";

/**
 * Portal Area Landing (Task 2) — "Mỗi Portal Area có Landing riêng."
 * READ-ONLY, chọn 1 Area để xem chi tiết (pattern chọn-Group giống
 * NavigationRegistry, WEB-SPR-003) thay vì 10 route tĩnh riêng biệt —
 * cùng nội dung, ít route hơn, dễ bảo trì hơn.
 *
 * ADM-SPR-201 Task 6: hỗ trợ deep-link `?area=<key>` từ Portal Navigation
 * (Sidebar) — cho phép Founder bấm thẳng vào 1 Area cụ thể từ menu thay vì
 * luôn rơi vào Area đầu tiên.
 */
export function PortalAreaLanding() {
  const searchParams = useSearchParams();
  const areaFromQuery = searchParams.get("area");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const effectiveKey = selectedKey ?? areaFromQuery ?? PORTAL_AREAS[0]?.key ?? null;
  const selectedArea = PORTAL_AREAS.find((a) => a.key === effectiveKey) ?? null;

  const pagesInArea = useMemo(
    () => PORTAL_PAGES.filter((p) => p.areaKey === effectiveKey),
    [effectiveKey]
  );

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40">
              <th className="px-4 py-3 font-semibold">Area</th>
              <th className="px-4 py-3 font-semibold">Href</th>
              <th className="px-4 py-3 font-semibold">Owner Workspace</th>
              <th className="px-4 py-3 font-semibold">Số Page thật</th>
            </tr>
          </thead>
          <tbody>
            {PORTAL_AREAS.map((area) => (
              <tr
                key={area.key}
                className={`border-b border-white/5 hover:bg-white/[0.03] ${
                  effectiveKey === area.key ? "bg-brand-blue/10" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedKey(area.key)}
                    className="text-left font-semibold text-white hover:text-brand-blue"
                  >
                    {area.label}
                  </button>
                </td>
                <td className="px-4 py-3 text-white/60">{area.href}</td>
                <td className="px-4 py-3 text-white/60">{area.ownerWorkspace ?? "Chưa xác định"}</td>
                <td className="px-4 py-3 text-white/60">{PORTAL_PAGES.filter((p) => p.areaKey === area.key).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedArea && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white">Landing — {selectedArea.label}</h3>
            <a href={selectedArea.href} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue hover:underline">
              Xem trên Portal thật →
            </a>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/40">
            <span>Owner Workspace: {selectedArea.ownerWorkspace ?? "Chưa xác định — cần PMO/Founder quyết định"}</span>
            {selectedArea.ownerWorkspaceHref && (
              <a href={selectedArea.ownerWorkspaceHref} className="font-semibold text-brand-blue hover:underline">
                Đi tới Workspace →
              </a>
            )}
          </div>
          <div className="mt-4">
            {pagesInArea.length === 0 ? (
              <p className="text-sm text-white/40">Không có route con nào khớp tiền tố Area này.</p>
            ) : (
              <ul className="space-y-1.5">
                {pagesInArea.map((p) => (
                  <li key={p.path} className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.02] px-3 py-2 text-sm">
                    <span className="font-mono text-white/70">{p.path}</span>
                    {p.note && <span className="max-w-md truncate text-xs text-white/40">{p.note}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
