import type { ReactNode } from "react";

/** Companion Design System™ — panel kính có gradient tím-cyan nhẹ, dùng cho khối nhấn mạnh. */
export function CompanionGlowPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`companion-glow-panel p-6 sm:p-8 ${className}`}>{children}</div>;
}
