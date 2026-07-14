"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEDIA_WORKSPACE_SECTIONS } from "@/lib/admin/media/navigation";

function isSectionActive(pathname: string, href: string) {
  if (href === "/admin/media-center") return pathname === "/admin/media-center";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Workspace-level layout cho cả 10 mục Media Center (Task 1, cùng pattern
 * BrandWorkspaceShell/WebsiteWorkspaceShell): title bar + tab nav ngang
 * qua đúng 10 mục IA, nằm bên trong AdminShell/AdminBreadcrumb/
 * AdminHeader/access-guard chung — mọi route /admin/media-center/** đã
 * tự động thừa hưởng qua (dashboard)/layout.tsx.
 */
export function MediaWorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/admin/media-center";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Media Center</h1>
        <p className="mt-1 text-sm text-white/50">
          Single Source of Digital Assets — quản lý metadata Image/Video/Document/Audio, Folder, Collection, Tag
          dùng chung toàn hệ thống. Foundation (MEDIA-SPR-201) — không có Upload/Media File Manager/Image-Video
          Editor/AI Image/AI Video thật.
        </p>
      </div>

      <nav aria-label="Điều hướng Media Center" className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
        {MEDIA_WORKSPACE_SECTIONS.map((section) => {
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
