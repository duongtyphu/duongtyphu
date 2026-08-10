import type { LucideIcon } from "lucide-react";

/**
 * Khối icon "glossy" — shadow nhiều lớp + overlay gradient chéo, đặc trưng của
 * bộ thiết kế 2.0 (`.ico`, `.sugg-icon`, `.learn-icon`, `.m-ico` trong mockup).
 *
 * Kích thước theo mockup: sm 34px (list row admin), md 38px (thẻ gợi ý),
 * lg 44px (huy hiệu hành trình), xl 88px (lưới khám phá trang chủ).
 */
const SIZES = {
  sm: { box: "h-[34px] w-[34px] rounded-[9px]", icon: "h-4 w-4" },
  md: { box: "h-[38px] w-[38px] rounded-[9px]", icon: "h-[18px] w-[18px]" },
  lg: { box: "h-[44px] w-[44px] rounded-full", icon: "h-[19px] w-[19px]" },
  xl: { box: "h-[88px] w-[88px] rounded-xl", icon: "h-10 w-10" },
} as const;

export function IcoBox({
  icon: Icon,
  size = "md",
  background = "var(--v2-violet-light)",
  color = "var(--v2-violet)",
  className = "",
}: {
  icon: LucideIcon;
  size?: keyof typeof SIZES;
  /** Nhận màu đặc hoặc gradient CSS. */
  background?: string;
  color?: string;
  className?: string;
}) {
  const s = SIZES[size];

  return (
    <span
      className={`v2-ico ${size === "xl" ? "v2-ico--lg" : ""} flex shrink-0 items-center justify-center ${s.box} ${className}`}
      style={{ background, color }}
    >
      <Icon className={s.icon} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}
