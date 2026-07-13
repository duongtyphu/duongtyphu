"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCollection } from "@/lib/admin/store";
import { PORTAL_AREAS_COLLECTION_KEY, PORTAL_AREAS_SEED, type PortalArea } from "@/lib/admin/portal/areaRegistry";
import { PortalAreaTable } from "@/components/admin/portal/PortalAreaTable";
import { PortalPageTable } from "@/components/admin/portal/PortalPageTable";
import { PortalSectionTable } from "@/components/admin/portal/PortalSectionTable";
import { PortalContentBlockTable } from "@/components/admin/portal/PortalContentBlockTable";

/**
 * Portal Area Explorer (PORTAL-SPR-301 Task 2-3) — thay thế
 * `PortalAreaLanding.tsx` (READ-ONLY, ADM-SPR-200). Drill-down 4 tầng
 * Portal Area → Page/Child Page → Section → Content, mỗi tầng CRUD thật
 * qua `useCollection()`. Hỗ trợ deep-link `?area=<key>` (giữ nguyên hành
 * vi cũ từ ADM-SPR-201 Task 6).
 *
 * Chọn lại tầng cha luôn reset tầng con ngay trong handler (không dùng
 * `useEffect` để đồng bộ state nội bộ — tránh cascading render, đúng
 * khuyến nghị react-hooks/set-state-in-effect).
 */
export function PortalAreaExplorer() {
  const searchParams = useSearchParams();
  const areaFromQuery = searchParams.get("area");
  const { items: areas, ready } = useCollection<PortalArea>(PORTAL_AREAS_COLLECTION_KEY, PORTAL_AREAS_SEED);

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<string | null>(null);

  const effectiveAreaId = selectedAreaId ?? areaFromQuery ?? (ready ? areas[0]?.id ?? null : null);
  const selectedArea = useMemo(() => areas.find((a) => a.id === effectiveAreaId) ?? null, [areas, effectiveAreaId]);

  function handleSelectArea(id: string) {
    setSelectedAreaId(id);
    setPageId(null);
    setSectionId(null);
  }
  function handleSelectPage(id: string | null) {
    setPageId(id);
    setSectionId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">1. Portal Area</p>
        <PortalAreaTable selectedId={effectiveAreaId} onSelect={handleSelectArea} />
      </div>

      {selectedArea && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white">2. Page — {selectedArea.label}</h3>
            <a href={selectedArea.href} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue hover:underline">
              Xem trên Portal thật →
            </a>
          </div>
          <div className="mt-4">
            <PortalPageTable areaId={selectedArea.id} selectedId={pageId} onSelect={handleSelectPage} />
          </div>
        </div>
      )}

      {pageId && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 text-sm font-bold text-white">3. Section</h3>
          <PortalSectionTable pageId={pageId} selectedId={sectionId} onSelect={setSectionId} />
        </div>
      )}

      {sectionId && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 text-sm font-bold text-white">4. Content → Workspace Owner</h3>
          <PortalContentBlockTable sectionId={sectionId} />
        </div>
      )}
    </div>
  );
}
