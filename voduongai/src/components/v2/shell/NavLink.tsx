"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/**
 * Một dòng `.nav-item` trong sidebar.
 *
 * Mockup dùng `<button data-href>` + JS điều hướng thủ công. Ở đây là `<Link>`
 * thật để có prefetch, mở tab mới bằng ⌘/Ctrl-click, và crawler đọc được.
 */
export function NavLink({
  label,
  href,
  icon: Icon,
  active,
  indented = false,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  /** Mục con của một cụm đang bung — thụt vào cho thấy quan hệ cha/con. */
  indented?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "flex w-full items-center gap-[11px] rounded-[9px] py-[10px] text-left text-[14px] font-medium transition-colors",
        indented ? "pl-[30px] pr-3" : "px-3",
        active
          ? "bg-[var(--v2-violet)] text-white"
          : "text-[#b5afd6] hover:bg-[var(--v2-sidebar-hover)] hover:text-white",
      ].join(" ")}
    >
      <Icon
        className={["h-[18px] w-[18px] shrink-0", active ? "opacity-100" : "opacity-85"].join(" ")}
        strokeWidth={2}
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}
