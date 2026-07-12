"use client";

import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { useCollection } from "@/lib/admin/store";
import { PORTAL_MANAGEMENT_SECTIONS } from "@/lib/admin/portal/navigation";
import { PORTAL_AREAS_COLLECTION_KEY, PORTAL_AREAS_SEED, type PortalArea } from "@/lib/admin/portal/areaRegistry";
import { PORTAL_PAGES_COLLECTION_KEY, PORTAL_PAGES_SEED, type PortalPageEntry } from "@/lib/admin/portal/pageRegistry";
import { PORTAL_SECTIONS_COLLECTION_KEY, PORTAL_SECTIONS_SEED, type PortalSection } from "@/lib/admin/portal/sectionRegistry";
import {
  PORTAL_CONTENT_BLOCKS_COLLECTION_KEY,
  PORTAL_CONTENT_BLOCKS_SEED,
  type PortalContentBlock,
} from "@/lib/admin/portal/contentBlockRegistry";

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

/**
 * Portal Dashboard — PORTAL-SPR-301: nâng cấp từ số liệu tĩnh
 * (PORTAL_AREAS/PORTAL_PAGES hardcode, ADM-SPR-200) sang số liệu THẬT đọc
 * từ Registry CRUD (`useCollection`, cùng kỹ thuật Website Dashboard đã
 * dùng từ WEB-SPR-006) — số liệu tự cập nhật theo dữ liệu Founder sửa,
 * không phải chụp nhanh một lần.
 */
export default function PortalDashboardPage() {
  const areas = useCollection<PortalArea>(PORTAL_AREAS_COLLECTION_KEY, PORTAL_AREAS_SEED);
  const pages = useCollection<PortalPageEntry>(PORTAL_PAGES_COLLECTION_KEY, PORTAL_PAGES_SEED);
  const sections = useCollection<PortalSection>(PORTAL_SECTIONS_COLLECTION_KEY, PORTAL_SECTIONS_SEED);
  const content = useCollection<PortalContentBlock>(PORTAL_CONTENT_BLOCKS_COLLECTION_KEY, PORTAL_CONTENT_BLOCKS_SEED);

  const ready = areas.ready && pages.ready && sections.ready && content.ready;
  const ownedAreas = areas.items.filter((a) => a.ownerWorkspace).length;
  const unownedContent = content.items.filter((c) => !c.workspaceOwner).length;

  return (
    <AdminWorkspaceShell
      title="Portal Management"
      description="Toàn cảnh Portal thật (không phải Website Workspace — đây là toàn bộ ứng dụng Portal sau đăng nhập). Chuỗi quản lý: Portal Area → Page → Child Page → Section → Content → Workspace Owner, tất cả bằng dữ liệu."
      rootHref="/admin/portal"
      sections={PORTAL_MANAGEMENT_SECTIONS}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Portal Area" value={areas.items.length} sub="Cố định, khớp sidebar Portal thật" />
          <StatCard label="Page (Parent + Child)" value={pages.items.length} />
          <StatCard label="Section" value={sections.items.length} />
          <StatCard label="Content" value={content.items.length} sub={unownedContent > 0 ? `${unownedContent} chưa có Owner` : "100% có Owner"} />
          <StatCard label="Area có Owner" value={ownedAreas} sub={`${areas.items.length - ownedAreas} chưa xác định`} />
        </div>

        {!ready ? (
          <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
        ) : (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">Portal Areas</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[...areas.items]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((area) => (
                  <Link
                    key={area.id}
                    href={`/admin/portal/areas?area=${area.id}`}
                    className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
                  >
                    <span className="text-sm font-semibold text-white/80">{area.label}</span>
                    <span className="text-xs text-white/40">{area.ownerWorkspace || "Chưa xác định Owner"}</span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </AdminWorkspaceShell>
  );
}
