import Link from "next/link";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";

/**
 * Logo VDAI trong sidebar 2.0.
 *
 * Bản thiết kế 2.0 dùng đúng SVG logo hiện hành (chữ V xanh #3B82F6 + chấm cam
 * #F97316) — trùng quy ước ở CLAUDE.md — nhưng đặt cạnh wordmark "VO DUONG AI"
 * thay vì "VDAI ACADEMY", vì đây là sidebar sản phẩm chứ không phải header
 * marketing.
 */
export function BrandMark({ href = `${V2_PORTAL_BASE}/trang-chu` }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-[10px] px-2 pt-[6px] pb-[22px]"
      aria-label="VO DUONG AI — về trang chủ"
    >
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center">
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#3B82F6" />
          <circle cx="27" cy="7.5" r="3" fill="#F97316" />
        </svg>
      </span>
      <span className="text-[15px] font-extrabold tracking-[0.2px]">
        <span className="text-[#3B82F6]">VO DUONG</span> <span className="text-white">AI</span>
      </span>
    </Link>
  );
}
