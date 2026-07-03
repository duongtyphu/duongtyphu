import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Companion Design System™ — nút glow dùng chung (Link nếu có href, button
 * nếu không). `pulse=false` (Layer 04, First Meeting CTA) bỏ nhịp breathing
 * liên tục, chỉ còn glow tĩnh nhẹ — đúng yêu cầu "CTA glow nhẹ, không pulse
 * liên tục" cho khoảnh khắc gặp gỡ đầu tiên.
 */
export function CompanionGlowButton({
  children,
  href,
  onClick,
  pulse = true,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  pulse?: boolean;
  className?: string;
}) {
  const classes = `${pulse ? "companion-anim-glow-breathe" : "shadow-[0_0_28px_-8px_rgba(34,211,238,0.45)]"} inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-gradient-to-r from-violet-600/80 to-cyan-500/70 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-violet-500/90 hover:to-cyan-400/80 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
