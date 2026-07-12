"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WEBSITE_WORKSPACE_SECTIONS } from "@/lib/admin/website/navigation";

function isSectionActive(pathname: string, href: string) {
  if (href === "/admin/website") return pathname === "/admin/website";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Workspace-level layout for all 10 Website Workspace sections (WEB-SPR-001
 * Deliverable "Workspace Layout"). Renders a title bar + horizontal tab
 * navigation across the canonical 10-group IA, then the section's own
 * content. Sits *inside* the existing AdminShell/AdminBreadcrumb/
 * AdminHeader/access-guard — every /admin/website/** route already
 * inherits those automatically via (dashboard)/layout.tsx, so this
 * component only adds the Website-Workspace-specific tab strip on top,
 * per Task 3's "Shared Admin Layout" requirement.
 */
export function WebsiteWorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/admin/website";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Website Workspace</h1>
        <p className="mt-1 text-sm text-white/50">
          Quản lý toàn bộ nội dung trang web công khai — Foundation (WEB-SPR-001), CRUD chi tiết sẽ triển khai ở
          WEB-SPR-002 trở đi.
        </p>
      </div>

      <nav aria-label="Điều hướng Website Workspace" className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
        {WEBSITE_WORKSPACE_SECTIONS.map((section) => {
          const active = isSectionActive(pathname, section.href);
          return (
            <Link
              key={section.key}
              href={section.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                active ? "bg-brand-blue text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
