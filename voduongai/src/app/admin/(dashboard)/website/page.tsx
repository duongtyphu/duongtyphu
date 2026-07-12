import Link from "next/link";
import { FileText, Navigation, Home, Rocket, File, LayoutGrid, Search, ArrowRightLeft, Settings } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";

// Mock data only (Task 4 — "Không cần dữ liệu thật. Có thể dùng Mock.").
// No collection/table is read here; real counts arrive with WEB-SPR-002's
// CRUD implementation.
const MOCK_OVERVIEW = { totalItems: 0, draft: 0, published: 0, pendingReview: 0 };

const MOCK_RECENT_CHANGES: { title: string; section: string; date: string }[] = [];

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

export default function WebsiteDashboardPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/40">
            Website Overview
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold normal-case text-white/40">
              Dữ liệu mẫu — thay bằng dữ liệu thật ở WEB-SPR-002
            </span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Tổng số mục" value={MOCK_OVERVIEW.totalItems} />
            <StatCard label="Draft" value={MOCK_OVERVIEW.draft} />
            <StatCard label="Published" value={MOCK_OVERVIEW.published} />
            <StatCard label="Pending Review" value={MOCK_OVERVIEW.pendingReview} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Recent Changes</h2>
          {MOCK_RECENT_CHANGES.length === 0 ? (
            <p className="mt-3 text-sm text-white/40">
              Chưa có thay đổi nào — Website Workspace hiện ở trạng thái Foundation, chưa có CRUD để tạo thay đổi
              thật.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {MOCK_RECENT_CHANGES.map((c) => (
                <li key={c.title} className="flex items-center justify-between gap-2 text-sm">
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
