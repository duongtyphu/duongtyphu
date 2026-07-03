"use client";

/**
 * Companion Design System™ — Layer 04, Nhiệm vụ 06: Chapter Navigation.
 * Cố tình thiết kế như bookmark của một cuốn sách — không phải navbar.
 * Đặt ngay dưới Hero, cùng hàng ngôn ngữ với "The First Meeting".
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const CHAPTERS = [
  { href: "/portal/companion", label: "Xin chào" },
  { href: "/portal/companion/minh-la-ai", label: "Mình là ai?" },
  { href: "/portal/companion/y-nghia-companion", label: "Ý nghĩa Companion" },
  { href: "/portal/companion/nhung-dieu-minh-tin", label: "Những điều mình tin" },
  { href: "/portal/companion/cuoc-doi-companion", label: "Cuộc đời Companion" },
  { href: "/portal/companion/book-notes", label: "Cuốn sách" },
  { href: "/portal/companion/tam-su", label: "Những bức thư" },
  { href: "/portal/companion/dong-hanh", label: "Đồng hành" },
];

export function CompanionChapterNav() {
  const pathname = usePathname() ?? "/portal/companion";

  return (
    <nav aria-label="Các chương của Companion" className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
      {CHAPTERS.map((chapter) => {
        const active = pathname === chapter.href;
        return (
          <Link
            key={chapter.href}
            href={chapter.href}
            aria-current={active ? "page" : undefined}
            className={`companion-bookmark-tab text-xs font-semibold sm:text-sm ${
              active ? "companion-bookmark-tab--active" : ""
            }`}
          >
            {chapter.label}
          </Link>
        );
      })}
    </nav>
  );
}
