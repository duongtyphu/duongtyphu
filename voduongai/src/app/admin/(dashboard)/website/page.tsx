"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FileText, Navigation, Home, Rocket, File, LayoutGrid, Search, ArrowRightLeft, Settings } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { useCollection } from "@/lib/admin/store";
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

const QUICK_ACTIONS = [
  { label: "Pages", href: "/admin/website/pages", icon: FileText },
  { label: "Navigation", href: "/admin/website/navigation", icon: Navigation },
  { label: "Homepage", href: "/admin/website/homepage", icon: Home },
  { label: "Landing Pages", href: "/admin/website/landing-pages", icon: Rocket },
  { label: "Static Pages", href: "/admin/website/static-pages", icon: File },
  { label: "Shared Sections", href: "/admin/website/shared-sections", icon: LayoutGrid },
  { label: "SEO", href: "/admin/website/seo", icon: Search },
  { label: "Redirect", href: "/admin/website/redirect", icon: ArrowRightLeft },
  { label: "Global Settings", href: "/admin/website/global-settings", icon: Settings },
];

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}

type RecentChange = { key: string; title: string; section: string; date: string };

/**
 * Website Overview (WEB-SPR-006 — hoàn thiện, không phải feature mới):
 * WEB-SPR-001 dựng Dashboard bằng dữ liệu mẫu toàn số 0 với ghi chú "sẽ
 * thay bằng dữ liệu thật ở WEB-SPR-002" — nhưng WEB-SPR-002 đến WEB-SPR-005
 * đều dựng Registry thật (Pages/Navigation/Shared Sections/SEO/Redirect)
 * mà không có Sprint nào quay lại nối Dashboard vào các Registry đó. Phát
 * hiện này (P1) được ghi nhận và sửa ở WEB-SPR-006 — chỉ đọc dữ liệu từ
 * các Registry đã tồn tại, không thêm entity/tính năng mới nào.
 *
 * Quy ước gộp trạng thái: Page/Shared Section dùng 5 trạng thái
 * (Draft/Review/Approved/Published/Archived), Navigation/SEO/Redirect
 * dùng 4 trạng thái (Draft/Active/Inactive/Archived). "Published" (thẻ
 * hiển thị) = Published HOẶC Active (cả hai đều nghĩa "đang dùng thật").
 * "Pending Review" chỉ tính Page/Shared Section vì chỉ 2 loại đó có trạng
 * thái Review.
 */
export default function WebsiteDashboardPage() {
  const pages = useCollection<WebsitePage>(WEBSITE_PAGES_COLLECTION_KEY, []);
  const navGroups = useCollection<NavigationGroup>(NAVIGATION_GROUPS_COLLECTION_KEY, NAVIGATION_GROUPS_SEED);
  const navItems = useCollection<NavigationItem>(NAVIGATION_ITEMS_COLLECTION_KEY, NAVIGATION_ITEMS_SEED);
  const sections = useCollection<SharedSection>(SHARED_SECTIONS_COLLECTION_KEY, SHARED_SECTIONS_SEED);
  const seoEntries = useCollection<SEOEntry>(SEO_ENTRIES_COLLECTION_KEY, SEO_ENTRIES_SEED);
  const redirects = useCollection<RedirectEntry>(REDIRECT_ENTRIES_COLLECTION_KEY, REDIRECT_ENTRIES_SEED);

  const ready =
    pages.ready && navGroups.ready && navItems.ready && sections.ready && seoEntries.ready && redirects.ready;

  const stats = useMemo(() => {
    const all: { status: string }[] = [
      ...pages.items,
      ...navGroups.items,
      ...navItems.items,
      ...sections.items,
      ...seoEntries.items,
      ...redirects.items,
    ];
    const draft = all.filter((i) => i.status === "Draft").length;
    const published = all.filter((i) => i.status === "Published" || i.status === "Active").length;
    const pendingReview = [...pages.items, ...sections.items].filter((i) => i.status === "Review").length;
    return { totalItems: all.length, draft, published, pendingReview };
  }, [pages.items, navGroups.items, navItems.items, sections.items, seoEntries.items, redirects.items]);

  const recentChanges = useMemo<RecentChange[]>(() => {
    const combined: RecentChange[] = [
      ...pages.items.map((p) => ({ key: p.id, title: p.title || "(chưa đặt tiêu đề)", section: "Pages", date: p.updatedDate })),
      ...navGroups.items.map((g) => ({ key: g.id, title: g.name || "(chưa đặt tên)", section: "Navigation", date: g.updatedDate })),
      ...navItems.items.map((i) => ({ key: i.id, title: i.label || "(chưa đặt label)", section: "Navigation", date: i.updatedDate })),
      ...sections.items.map((s) => ({ key: s.id, title: s.title || "(chưa đặt tiêu đề)", section: "Shared Sections", date: s.updatedDate })),
      ...seoEntries.items.map((s) => ({ key: s.id, title: s.title || "(chưa đặt tiêu đề)", section: "SEO", date: s.updatedDate })),
      ...redirects.items.map((r) => ({
        key: r.id,
        title: r.fromPath && r.toPath ? `${r.fromPath} → ${r.toPath}` : "(chưa nhập)",
        section: "Redirect",
        date: r.updatedDate,
      })),
    ];
    return combined.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [pages.items, navGroups.items, navItems.items, sections.items, seoEntries.items, redirects.items]);

  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/40">
            Website Overview
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold normal-case text-white/40">
              Tính từ Page/Navigation/Shared Section/SEO/Redirect Registry — Global Settings chưa có Registry
            </span>
          </p>
          {!ready ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Tổng số mục" value={stats.totalItems} />
              <StatCard label="Draft" value={stats.draft} />
              <StatCard label="Published / Active" value={stats.published} />
              <StatCard label="Pending Review" value={stats.pendingReview} />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Recent Changes</h2>
          {!ready ? (
            <div className="mt-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : recentChanges.length === 0 ? (
            <p className="mt-3 text-sm text-white/40">Chưa có thay đổi nào.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {recentChanges.map((c) => (
                <li key={c.key} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-white/80">
                    {c.title} <span className="text-white/40">· {c.section}</span>
                  </span>
                  <span className="shrink-0 text-xs text-white/40">{c.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
              >
                <Icon className="h-5 w-5 text-brand-blue" />
                <span className="text-xs font-semibold text-white/80">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </WebsiteWorkspaceShell>
  );
}
