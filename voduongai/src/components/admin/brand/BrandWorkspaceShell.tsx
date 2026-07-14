"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_WORKSPACE_SECTIONS } from "@/lib/admin/brand/navigation";

function isSectionActive(pathname: string, href: string) {
  if (href === "/admin/brand") return pathname === "/admin/brand";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Workspace-level layout cho cả 10 mục Brand Studio (Task 1 — Brand
 * Workspace Shell). Cùng pattern với WebsiteWorkspaceShell (WEB-SPR-001):
 * title bar + tab nav ngang qua đúng 10 mục IA, nằm bên trong
 * AdminShell/AdminBreadcrumb/AdminHeader/access-guard chung — mọi route
 * /admin/brand/** đã tự động thừa hưởng qua (dashboard)/layout.tsx.
 */
export function BrandWorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/admin/brand";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Thương hiệu</h1>
        <p className="mt-1 text-sm text-white/50">
          Quản lý nhận diện thương hiệu VO DUONG AI — Logo, chữ lockup, kiểu chữ, màu sắc, giao diện, icon, ảnh chia
          sẻ mạng xã hội. Chưa có công cụ dựng theme/logo/tạo thương hiệu bằng AI.
        </p>
      </div>

      <nav aria-label="Điều hướng Brand Studio" className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
        {BRAND_WORKSPACE_SECTIONS.map((section) => {
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
