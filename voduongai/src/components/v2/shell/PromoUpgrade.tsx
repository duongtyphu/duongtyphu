"use client";

import Link from "next/link";
import { Crown } from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";

/** Vị trí + độ trễ của các tia lấp lánh quanh vương miện (cố định, không random
 *  ở render — random sẽ lệch giữa server và client gây hydration mismatch). */
const SPARKLES = [
  { top: -6, left: 8, size: 9, delay: "0s" },
  { top: 4, left: 44, size: 7, delay: "0.5s" },
  { top: 30, left: -5, size: 8, delay: "1.1s" },
  { top: 36, left: 42, size: 6, delay: "1.6s" },
  { top: 14, left: 54, size: 5, delay: "0.8s" },
];

/**
 * Khối "Nâng cấp Premium" ở đáy sidebar Portal. Chỉ hiện với người dùng chưa
 * Premium — `plan` do layout truyền xuống.
 */
export function PromoUpgrade() {
  return (
    <div className="relative mt-auto overflow-hidden rounded-[14px] bg-[linear-gradient(160deg,#3d2a8f,#241c46)] px-4 py-[18px]">
      <div className="relative mb-[10px] flex h-[54px] w-[54px] items-center justify-center">
        {SPARKLES.map((s, i) => (
          <svg
            key={i}
            className="v2-sparkle"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        ))}
        <span className="v2-ico relative z-[1] flex h-9 w-9 items-center justify-center rounded-[9px] bg-white/12 text-[#ffd75e]">
          <Crown className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
      </div>

      <h4 className="mb-[6px] text-[14px] font-bold text-white">Nâng cấp Premium</h4>
      <p className="mb-[14px] text-[12px] leading-[1.5] text-[#c3bde3]">
        Mở khóa toàn bộ lộ trình, tài nguyên và trải nghiệm đồng hành cùng AI.
      </p>
      <Link
        href={`${V2_PORTAL_BASE}/premium`}
        className="block w-full rounded-[9px] bg-[linear-gradient(135deg,var(--v2-violet),#9b7bff)] p-[10px] text-center text-[13px] font-bold text-white transition-[transform,box-shadow,filter] duration-150 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_8px_18px_rgba(109,74,255,.5)] active:translate-y-0 active:scale-[.97]"
      >
        Nâng cấp ngay
      </Link>
    </div>
  );
}
