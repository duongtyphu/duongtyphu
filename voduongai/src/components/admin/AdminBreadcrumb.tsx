"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { adminNavGroups } from "@/lib/admin/nav";

type Match = { label: string; group: string | null };

function findMatch(pathname: string): Match | null {
  let exact: Match | null = null;
  let bestPrefix: Match | null = null;
  let bestPrefixLength = -1;

  for (const section of adminNavGroups) {
    for (const item of section.items) {
      if (item.href === pathname) {
        exact = { label: item.label, group: section.group };
      } else if (pathname.startsWith(item.href + "/") && item.href.length > bestPrefixLength) {
        bestPrefix = { label: item.label, group: section.group };
        bestPrefixLength = item.href.length;
      }
    }
  }

  return exact ?? bestPrefix;
}

/**
 * Auto-derived from the current pathname + adminNavGroups — no per-page
 * props needed, so it applies uniformly across every Canonical Admin page
 * (CrudPage/ResourceManager/ContentManager and hand-rolled CUSTOM pages
 * alike) without any page-level migration. Intentionally does not render
 * an <h1>: each page already owns its own heading, and a second one here
 * would create a duplicate-heading defect like the one fixed on Portal
 * in IMP-SPR-006.
 */
export function AdminBreadcrumb() {
  const pathname = usePathname() || "/admin/dashboard";
  const match = findMatch(pathname);
  const isDashboard = pathname === "/admin/dashboard";

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/50">
      <Link href="/admin/dashboard" className="font-semibold text-white/70 hover:text-white">
        Admin
      </Link>
      {!isDashboard && match?.group && (
        <>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span>{match.group}</span>
        </>
      )}
      {!isDashboard && match && (
        <>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span aria-current="page" className="font-semibold text-white">
            {match.label}
          </span>
        </>
      )}
    </nav>
  );
}
