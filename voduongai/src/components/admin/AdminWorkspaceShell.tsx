"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type AdminWorkspaceSection = { key: string; label: string; href: string };

function isSectionActive(pathname: string, href: string, rootHref: string) {
  if (href === rootHref) return pathname === rootHref;
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Generic Workspace Shell (ADM-SPR-200 — "Main Shell hoàn chỉnh"),
 * tổng quát hóa từ `WebsiteWorkspaceShell`/`BrandWorkspaceShell` (2 bản
 * gần như giống hệt nhau, chỉ khác text) — đúng đề xuất Task 4 của
 * `docs/admin/ADMIN_INFORMATION_ARCHITECTURE_V2.md` (IMP-ADM-100).
 * Dùng cho Portal Management và Founder — 2 khu vực MỚI của sprint này —
 * không đổi Website/Brand Studio (đã Approved, không đụng vào Shell đang
 * hoạt động tốt của họ để tránh rủi ro không cần thiết).
 */
export function AdminWorkspaceShell({
  title,
  description,
  rootHref,
  sections,
  children,
}: {
  title: string;
  description: string;
  rootHref: string;
  sections: AdminWorkspaceSection[];
  children: React.ReactNode;
}) {
  const pathname = usePathname() || rootHref;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">{title}</h1>
        <p className="mt-1 text-sm text-white/50">{description}</p>
      </div>

      <nav aria-label={`Điều hướng ${title}`} className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
        {sections.map((section) => {
          const active = isSectionActive(pathname, section.href, rootHref);
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
