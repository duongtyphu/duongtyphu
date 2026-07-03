import Link from "next/link";
import type { ReactNode } from "react";

/** Companion Design System™ — nút glow dùng chung (Link nếu có href, button nếu không). */
export function CompanionGlowButton({
  children,
  href,
  onClick,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const classes = `companion-anim-glow-breathe inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-gradient-to-r from-violet-600/80 to-cyan-500/70 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-violet-500/90 hover:to-cyan-400/80 ${className}`;

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
