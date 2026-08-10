import Image from "next/image";
import Link from "next/link";
import { Bot, Play } from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";
import { HERO_DOTS } from "./hero-dots";

/** 5 ngôi sao vàng cạnh tay robot — vị trí lấy từ `.hero-stars` của mockup. */
const STARS = [
  { x: 4, y: 30, size: 15, delay: "0s" },
  { x: 22, y: 14, size: 17, delay: "0.4s" },
  { x: 40, y: 6, size: 19, delay: "0.8s" },
  { x: 58, y: 14, size: 17, delay: "1.2s" },
  { x: 76, y: 30, size: 15, delay: "1.6s" },
];

export function PortalHero({ firstName }: { firstName: string }) {
  return (
    <section className="relative flex items-center justify-between gap-6 overflow-hidden rounded-[var(--v2-radius-lg)] px-11 py-[25px] text-white shadow-[inset_0_0_90px_rgba(0,0,0,.4)] [background:radial-gradient(circle_at_78%_22%,#4a3691_0%,transparent_45%),radial-gradient(circle_at_85%_70%,#2d2270_0%,transparent_50%),linear-gradient(160deg,#241c4d_0%,#1a1440_55%,#100b2c_100%)]">
      {/* Trường sao tĩnh + lớp tối chân hero (::before/::after của mockup) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-55 [background-image:radial-gradient(1.5px_1.5px_at_20%_30%,#fff,transparent),radial-gradient(1.5px_1.5px_at_60%_15%,#fff,transparent),radial-gradient(1px_1px_at_80%_60%,#fff,transparent),radial-gradient(1.5px_1.5px_at_40%_75%,#fff,transparent),radial-gradient(1px_1px_at_92%_35%,#fff,transparent),radial-gradient(1px_1px_at_30%_55%,#fff,transparent),radial-gradient(1px_1px_at_68%_82%,#fff,transparent),radial-gradient(1.5px_1.5px_at_10%_60%,#fff,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_50%_100%,rgba(0,0,0,.45),transparent_60%)]"
      />

      {HERO_DOTS.map((dot, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="v2-move-dot"
          style={{
            top: `${dot.top}%`,
            left: `${dot.left}%`,
            width: dot.size,
            height: dot.size,
            ["--dx" as string]: `${dot.dx}px`,
            ["--dy" as string]: `${dot.dy}px`,
            animationDuration: `${dot.duration}s`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}

      <div className="relative z-[1]">
        <h1 className="mb-[10px] text-[26px] font-extrabold">
          Chào mừng bạn trở lại{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="mb-5 max-w-[380px] text-[14.5px] leading-[1.55] text-[#cfc8ee]">
          Hôm nay là một ngày tuyệt vời để học hỏi và phát triển cùng AI.
        </p>
        <div className="flex gap-[10px]">
          <Link
            href={`${V2_PORTAL_BASE}/hoc-vien-ai`}
            className="flex shrink-0 items-center gap-2 rounded-[var(--v2-radius-sm)] bg-[linear-gradient(135deg,var(--v2-violet),#9b7bff)] px-5 py-[11px] text-[13.5px] font-bold whitespace-nowrap text-white transition-[transform,box-shadow,filter] duration-150 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_8px_20px_rgba(109,74,255,.45)] active:translate-y-0 active:scale-[.97]"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Tiếp tục học
          </Link>
          <Link
            href={`${V2_PORTAL_BASE}/companion`}
            className="flex shrink-0 items-center gap-2 rounded-[var(--v2-radius-sm)] border border-white/25 bg-white/8 px-5 py-[11px] text-[13.5px] font-bold whitespace-nowrap text-white transition-[transform,background,border-color] duration-150 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/16 active:translate-y-0 active:scale-[.97]"
          >
            <Bot className="h-4 w-4" aria-hidden="true" />
            Gặp Companion AI Mentor
          </Link>
        </div>
      </div>

      <div className="relative z-[1] flex h-[210px] w-[147px] shrink-0 items-end justify-center">
        <div
          aria-hidden="true"
          className="absolute -inset-5 z-0 blur-[6px] [background:radial-gradient(ellipse_60%_70%_at_50%_55%,rgba(155,123,255,.5),transparent_72%)]"
        />
        <Image
          src="/v2/companion-robot.png"
          alt="Companion AI Mentor"
          width={558}
          height={900}
          priority
          className="relative z-[1] h-full w-full object-contain object-bottom drop-shadow-[0_18px_22px_rgba(8,5,25,.5)]"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 92 76"
          className="pointer-events-none absolute -top-[6px] -right-[18px] z-[2] h-[76px] w-[92px]"
        >
          {STARS.map((star, index) => (
            <path
              key={index}
              className="v2-star"
              style={{ animationDelay: star.delay }}
              transform={`translate(${star.x} ${star.y}) scale(${star.size / 24})`}
              fill="#ffd75e"
              d="M12 0l3.1 7.6L23 9.2l-5.6 5.4 1.4 7.9L12 18.8 5.2 22.5l1.4-7.9L1 9.2l7.9-1.6z"
            />
          ))}
        </svg>
      </div>
    </section>
  );
}
