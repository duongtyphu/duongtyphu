"use client";

import { useMemo, useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import { WEBSITE_PAGES_COLLECTION_KEY, type WebsitePage } from "@/lib/admin/website/pageRegistry";
import {
  NAVIGATION_GROUPS_COLLECTION_KEY,
  NAVIGATION_ITEMS_COLLECTION_KEY,
  NAVIGATION_GROUPS_SEED,
  NAVIGATION_ITEMS_SEED,
  type NavigationGroup,
  type NavigationItem,
} from "@/lib/admin/website/navigationRegistry";
import {
  SHARED_SECTIONS_COLLECTION_KEY,
  SHARED_SECTIONS_SEED,
  type SharedSection,
} from "@/lib/admin/website/sharedSectionRegistry";
import { SEO_ENTRIES_COLLECTION_KEY, SEO_ENTRIES_SEED, type SEOEntry } from "@/lib/admin/website/seoRegistry";
import {
  REDIRECT_ENTRIES_COLLECTION_KEY,
  REDIRECT_ENTRIES_SEED,
  type RedirectEntry,
} from "@/lib/admin/website/redirectRegistry";
import { BRAND_ASSETS_COLLECTION_KEY, BRAND_ASSETS_SEED, type BrandAsset } from "@/lib/admin/brand/assetRegistry";
import {
  TYPOGRAPHY_TOKENS_COLLECTION_KEY,
  TYPOGRAPHY_TOKENS_SEED,
  type TypographyToken,
} from "@/lib/admin/brand/typographyRegistry";
import { COLOR_TOKENS_COLLECTION_KEY, COLOR_TOKENS_SEED, type ColorToken } from "@/lib/admin/brand/colorRegistry";
import { THEME_PROFILES_COLLECTION_KEY, THEME_PROFILES_SEED, type ThemeProfile } from "@/lib/admin/brand/themeRegistry";

type ContentRow = { id: string; title: string; workspace: string; collection: string; status: string };

/**
 * Content Registry (Task 4) — gộp dữ liệu THẬT (không mock) từ mọi
 * Registry đã tồn tại (Website: Pages/Navigation Group/Navigation Item/
 * Shared Section/SEO/Redirect; Brand Studio: Asset/Typography/Color/
 * Theme) qua `useCollection` — đúng kỹ thuật đã dùng để sửa Website
 * Dashboard ở WEB-SPR-006. CKOS/Academy/Premium KHÔNG xuất hiện ở đây vì
 * chưa dùng Registry pattern (`useCollection` + schema riêng) — ghi nhận
 * rõ, không giả lập dữ liệu cho chúng.
 */
export function ContentRegistry() {
  const pages = useCollection<WebsitePage>(WEBSITE_PAGES_COLLECTION_KEY, []);
  const navGroups = useCollection<NavigationGroup>(NAVIGATION_GROUPS_COLLECTION_KEY, NAVIGATION_GROUPS_SEED);
  const navItems = useCollection<NavigationItem>(NAVIGATION_ITEMS_COLLECTION_KEY, NAVIGATION_ITEMS_SEED);
  const sections = useCollection<SharedSection>(SHARED_SECTIONS_COLLECTION_KEY, SHARED_SECTIONS_SEED);
  const seoEntries = useCollection<SEOEntry>(SEO_ENTRIES_COLLECTION_KEY, SEO_ENTRIES_SEED);
  const redirects = useCollection<RedirectEntry>(REDIRECT_ENTRIES_COLLECTION_KEY, REDIRECT_ENTRIES_SEED);
  const brandAssets = useCollection<BrandAsset>(BRAND_ASSETS_COLLECTION_KEY, BRAND_ASSETS_SEED);
  const typography = useCollection<TypographyToken>(TYPOGRAPHY_TOKENS_COLLECTION_KEY, TYPOGRAPHY_TOKENS_SEED);
  const colors = useCollection<ColorToken>(COLOR_TOKENS_COLLECTION_KEY, COLOR_TOKENS_SEED);
  const themes = useCollection<ThemeProfile>(THEME_PROFILES_COLLECTION_KEY, THEME_PROFILES_SEED);

  const ready =
    pages.ready && navGroups.ready && navItems.ready && sections.ready && seoEntries.ready && redirects.ready &&
    brandAssets.ready && typography.ready && colors.ready && themes.ready;

  const rows = useMemo<ContentRow[]>(() => {
    if (!ready) return [];
    return [
      ...pages.items.map((p) => ({ id: p.id, title: p.title || "(chưa đặt tiêu đề)", workspace: "Website", collection: "Pages", status: p.status })),
      ...navGroups.items.map((g) => ({ id: g.id, title: g.name, workspace: "Website", collection: "Navigation Group", status: g.status })),
      ...navItems.items.map((i) => ({ id: i.id, title: i.label, workspace: "Website", collection: "Navigation Item", status: i.status })),
      ...sections.items.map((s) => ({ id: s.id, title: s.title, workspace: "Website", collection: "Shared Section", status: s.status })),
      ...seoEntries.items.map((s) => ({ id: s.id, title: s.title, workspace: "Website", collection: "SEO Entry", status: s.status })),
      ...redirects.items.map((r) => ({ id: r.id, title: `${r.fromPath} → ${r.toPath}`, workspace: "Website", collection: "Redirect", status: r.status })),
      ...brandAssets.items.map((a) => ({ id: a.id, title: a.name, workspace: "Brand Studio", collection: `Brand Asset (${a.category})`, status: a.status })),
      ...typography.items.map((t) => ({ id: t.id, title: t.name, workspace: "Brand Studio", collection: "Typography Token", status: t.status })),
      ...colors.items.map((c) => ({ id: c.id, title: c.name, workspace: "Brand Studio", collection: "Color Token", status: c.status })),
      ...themes.items.map((t) => ({ id: t.id, title: t.name, workspace: "Brand Studio", collection: "Theme Profile", status: t.status })),
    ];
  }, [ready, pages.items, navGroups.items, navItems.items, sections.items, seoEntries.items, redirects.items, brandAssets.items, typography.items, colors.items, themes.items]);

  const [query, setQuery] = useState("");
  const [workspaceFilter, setWorkspaceFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = [...rows];
    if (workspaceFilter !== "all") list = list.filter((r) => r.workspace === workspaceFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q));
    }
    return list;
  }, [rows, workspaceFilter, query]);

  const workspaceCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) map.set(r.workspace, (map.get(r.workspace) ?? 0) + 1);
    return map;
  }, [rows]);

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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {["Website", "Brand Studio"].map((ws) => (
          <div key={ws} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{ws}</p>
            <p className="mt-1.5 text-2xl font-extrabold text-white">{workspaceCounts.get(ws) ?? 0}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">Tổng cộng</p>
          <p className="mt-1.5 text-2xl font-extrabold text-white">{rows.length}</p>
          <p className="mt-1 text-xs text-white/40">CKOS/Academy/Premium chưa dùng Registry pattern — không có trong tổng này</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tiêu đề..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={workspaceFilter}
          onChange={(e) => setWorkspaceFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Workspace: Tất cả</option>
          <option value="Website">Website</option>
          <option value="Brand Studio">Brand Studio</option>
        </select>
        <span className="text-xs text-white/40">{filtered.length}/{rows.length} mục</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Workspace</th>
              <th className="px-4 py-3 font-semibold">Collection</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={`${r.collection}-${r.id}`} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-white/80">{r.title}</td>
                <td className="px-4 py-3 text-white/60">{r.workspace}</td>
                <td className="px-4 py-3 text-white/60">{r.collection}</td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[r.status] ?? "gray"}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
