import type { ReactNode } from "react";

/** Companion Design System™ — thẻ kính mờ dùng chung cho nội dung Companion. */
export function CompanionGlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`companion-glass-card p-6 sm:p-8 ${className}`}>{children}</div>;
}
