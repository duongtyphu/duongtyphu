"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCollection } from "@/lib/admin/store";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import { WEBSITE_PAGES_COLLECTION_KEY, WEBSITE_PAGES_SEED, type WebsitePage } from "@/lib/admin/website/pageRegistry";
import {
  NAVIGATION_GROUPS_COLLECTION_KEY,
  NAVIGATION_ITEMS_COLLECTION_KEY,
  NAVIGATION_GROUPS_SEED,
  NAVIGATION_ITEMS_SEED,
  type NavigationGroup,
  type NavigationItem,
} from "@/lib/admin/website/navigationRegistry";
import { SHARED_SECTIONS_COLLECTION_KEY, SHARED_SECTIONS_SEED, type SharedSection } from "@/lib/admin/website/sharedSectionRegistry";
import {
  HOMEPAGE_SECTIONS_COLLECTION_KEY,
  HOMEPAGE_SECTIONS_SEED,
  type HomepageSection,
} from "@/lib/admin/website/homepageSectionRegistry";

type MappingRow = {
  key: string;
  name: string;
  objectType: string;
  currentRoute: string;
  workspaceOwner: string;
  publishStatus: string;
  publishTone: Parameters<typeof Badge>[0]["tone"];
  lastUpdated: string;
  editHref: string;
};

const OBJECT_TYPES = ["Page", "Navigation Item", "Shared Section", "Homepage Section"] as const;

/**
 * Portal Mapping (WEB-SPR-202, Task 8) — bảng tổng hợp READ-ONLY, gộp mọi
 * Website Object đã có Registry thật (Page/Navigation Item/Shared Section/
 * Homepage Section) thành đúng 1 hàng/object với 4 cột brief yêu cầu:
 * Current Route → Workspace Owner → Publish Status → Last Updated. Không
 * phải Registry mới — chỉ derive từ 4 Registry đã tồn tại, không lưu dữ
 * liệu riêng (đúng FOUNDER-001 Nguyên tắc 5: Portal Management không sở
 * hữu dữ liệu nghiệp vụ mới).
 *
 * `editHref` trỏ về đúng route quản lý thật của object đó — Founder bấm
 * vào để sửa, không sửa được trực tiếp ở đây (đây là bảng tra cứu/mapping,
 * không phải CRUD form thứ 2 cho cùng dữ liệu).
 */
export function PortalMappingTable() {
  const pages = useCollection<WebsitePage>(WEBSITE_PAGES_COLLECTION_KEY, WEBSITE_PAGES_SEED);
  const navGroups = useCollection<NavigationGroup>(NAVIGATION_GROUPS_COLLECTION_KEY, NAVIGATION_GROUPS_SEED);
  const navItems = useCollection<NavigationItem>(NAVIGATION_ITEMS_COLLECTION_KEY, NAVIGATION_ITEMS_SEED);
  const sections = useCollection<SharedSection>(SHARED_SECTIONS_COLLECTION_KEY, SHARED_SECTIONS_SEED);
  const homeSections = useCollection<HomepageSection>(HOMEPAGE_SECTIONS_COLLECTION_KEY, HOMEPAGE_SECTIONS_SEED);

  const ready = pages.ready && navGroups.ready && navItems.ready && sections.ready && homeSections.ready;

  const [typeFilter, setTypeFilter] = useState<"all" | (typeof OBJECT_TYPES)[number]>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo<MappingRow[]>(() => {
    const pageRows: MappingRow[] = pages.items.map((p) => ({
      key: `page_${p.id}`,
      name: p.title || "(chưa đặt tiêu đề)",
      objectType: "Page",
      currentRoute: p.slug || "—",
      workspaceOwner: "Website Workspace",
      publishStatus: p.status,
      publishTone: STATUS_TONE[p.status] ?? "gray",
      lastUpdated: p.updatedDate,
      editHref: "/admin/website/pages",
    }));

    const navRows: MappingRow[] = navItems.items.map((it) => {
      const group = navGroups.items.find((g) => g.id === it.groupId);
      return {
        key: `nav_${it.id}`,
        name: group ? `${it.label || "(chưa đặt label)"} — ${group.location}` : it.label || "(chưa đặt label)",
        objectType: "Navigation Item",
        currentRoute: it.url || "—",
        workspaceOwner: "Website Workspace",
        publishStatus: `${it.status}${it.visible ? "" : " · Ẩn"}`,
        publishTone: STATUS_TONE[it.status] ?? "gray",
        lastUpdated: it.updatedDate,
        editHref: "/admin/website/navigation",
      };
    });

    const sectionRows: MappingRow[] = sections.items.map((s) => ({
      key: `section_${s.id}`,
      name: s.title || "(chưa đặt tiêu đề)",
      objectType: "Shared Section",
      currentRoute: homeSections.items.some((h) => h.sharedSectionId === s.id) ? "/ (Homepage)" : "Chưa gắn route cụ thể",
      workspaceOwner: "Website Workspace",
      publishStatus: s.status,
      publishTone: STATUS_TONE[s.status] ?? "gray",
      lastUpdated: s.updatedDate,
      editHref: "/admin/website/shared-sections",
    }));

    const homeRows: MappingRow[] = homeSections.items.map((h) => ({
      key: `homesec_${h.id}`,
      name: h.label || "(chưa đặt tên)",
      objectType: "Homepage Section",
      currentRoute: "/",
      workspaceOwner: "Website Workspace",
      publishStatus: `${h.status}${h.visible ? "" : " · Ẩn"}`,
      publishTone: STATUS_TONE[h.status] ?? "gray",
      lastUpdated: h.updatedDate,
      editHref: "/admin/website/homepage",
    }));

    return [...pageRows, ...navRows, ...sectionRows, ...homeRows];
  }, [pages.items, navGroups.items, navItems.items, sections.items, homeSections.items]);

  const filtered = useMemo(() => {
    let list = rows;
    if (typeFilter !== "all") list = list.filter((r) => r.objectType === typeFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.currentRoute.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  }, [rows, typeFilter, query]);

  if (!ready) {
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
          placeholder="Tìm theo tên hoặc route..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Loại: Tất cả</option>
          {OBJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="text-xs text-white/40">{filtered.length} object</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-white/40">Không có object nào khớp bộ lọc.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Object</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Current Route</th>
                <th className="px-4 py-3 font-semibold">Nơi phụ trách</th>
                <th className="px-4 py-3 font-semibold">Publish Status</th>
                <th className="px-4 py-3 font-semibold">Last Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.key} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-semibold text-white">{row.name}</td>
                  <td className="px-4 py-3 text-white/60">{row.objectType}</td>
                  <td className="px-4 py-3 text-white/60">{row.currentRoute}</td>
                  <td className="px-4 py-3 text-white/60">{row.workspaceOwner}</td>
                  <td className="px-4 py-3">
                    <Badge tone={row.publishTone}>{row.publishStatus}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white/60">{row.lastUpdated}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={row.editHref}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Quản lý
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
