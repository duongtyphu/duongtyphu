import type { ReactNode } from "react";

/** Companion Design System™ — khung bọc ngoài cho một section trong thế giới Companion. */
export function CompanionSectionShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`companion-section-shell companion-anim-fade-up ${className}`}>{children}</section>;
}
