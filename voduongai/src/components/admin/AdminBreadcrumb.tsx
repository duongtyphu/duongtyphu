import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type AdminBreadcrumbItem = { label: string; href?: string };

/**
 * ADM-V2-01 — breadcrumb dùng chung cho mọi module Admin (Workspace →
 * SubGroup/Group → Trang hiện tại). Mục cuối cùng KHÔNG bao giờ là link
 * (đang đứng ở đó). Truyền tường minh `trail` từ mỗi page.tsx — không dùng
 * lookup "ma thuật" từ `nav.ts` để tránh phụ thuộc ẩn giữa cấu trúc sidebar
 * và nội dung trang.
 */
export function AdminBreadcrumb({ trail }: { trail: AdminBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1 text-xs text-gray-400">
      {trail.map((item, i) => {
        const isLast = i === trail.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-gray-600">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-semibold text-gray-500" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
