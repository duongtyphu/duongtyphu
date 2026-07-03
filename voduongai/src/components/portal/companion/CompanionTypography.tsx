import type { ReactNode } from "react";

/** Companion Design System™ — Layer 01, Bước 4: Typography Foundation. Chỉ dùng trong scope Companion. */

export function CompanionChapterLabel({ children }: { children: ReactNode }) {
  return <p className="companion-chapter-label">{children}</p>;
}

export function CompanionHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h1 className={`companion-heading text-4xl sm:text-5xl ${className}`}>{children}</h1>;
}

export function CompanionSubtitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`companion-subtitle text-lg leading-relaxed ${className}`}>{children}</p>;
}

export function CompanionQuote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`companion-quote text-xl leading-relaxed ${className}`}>{children}</p>;
}

export function CompanionBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`companion-body text-base ${className}`}>{children}</p>;
}
