import type { ReactNode } from "react";

type IconProps = { className?: string };

/**
 * Glossy "3D-style" badge icons — flat vector illustrations with a gradient
 * fill + soft highlight + drop shadow to fake volume, since no real 3D
 * render assets exist for this design. Each icon is self-contained (own
 * <defs> ids namespaced by icon) so multiple instances can render on the
 * same page without id collisions.
 */

function Badge({
  id,
  from,
  to,
  className,
  children,
}: {
  id: string;
  from: string;
  to: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="30%" cy="22%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="56" rx="18" ry="4" fill="#0B0F2E" opacity=".12" />
      <rect x="6" y="6" width="52" height="52" rx="16" fill={`url(#${id}-bg)`} />
      <rect x="6" y="6" width="52" height="52" rx="16" fill={`url(#${id}-shine)`} />
      {children}
    </svg>
  );
}

export function StatHeartIcon({ className }: IconProps) {
  return (
    <Badge id="ic-heart" from="#7DD3FC" to="#3B82F6" className={className}>
      <path
        d="M32 42s-13-7.7-13-16.6C19 20.5 22.7 17 27 17c2.4 0 4.6 1.2 6 3.1 1.4-1.9 3.6-3.1 6-3.1 4.3 0 8 3.5 8 8.4C47 34.3 32 42 32 42Z"
        fill="#fff"
      />
    </Badge>
  );
}

export function StatPuzzleIcon({ className }: IconProps) {
  return (
    <Badge id="ic-puzzle" from="#F9A8D4" to="#DB2777" className={className}>
      <path
        d="M25 20h6.5a2.5 2.5 0 0 1 4.6 1.7 2.5 2.5 0 0 1-2.1 3.3v6h6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 0 0 5h-6v6h-6a2.5 2.5 0 1 1-5-1 2.5 2.5 0 0 0-1-4.8H19v-6a2.5 2.5 0 1 1 1-4.8 2.5 2.5 0 0 0 4.8-1H25v-9.4Z"
        fill="#fff"
      />
    </Badge>
  );
}

export function StatClipboardIcon({ className }: IconProps) {
  return (
    <Badge id="ic-clip" from="#86EFAC" to="#16A34A" className={className}>
      <rect x="20" y="18" width="24" height="30" rx="4" fill="#fff" />
      <rect x="26" y="14" width="12" height="8" rx="3" fill="#fff" opacity=".85" />
      <rect x="24" y="27" width="16" height="3" rx="1.5" fill="#16A34A" />
      <rect x="24" y="34" width="16" height="3" rx="1.5" fill="#16A34A" />
      <rect x="24" y="41" width="10" height="3" rx="1.5" fill="#16A34A" />
    </Badge>
  );
}

export function StatPeopleIcon({ className }: IconProps) {
  return (
    <Badge id="ic-people" from="#FDBA74" to="#EA580C" className={className}>
      <circle cx="25" cy="24" r="6.5" fill="#fff" />
      <circle cx="40" cy="27" r="5" fill="#fff" opacity=".85" />
      <path d="M13 46c1.5-8 6-12 12-12s10.5 4 12 12" fill="#fff" />
      <path d="M32 46c1.2-6.4 4.6-9.6 9-9.6s7.8 3.2 9 9.6" fill="#fff" opacity=".85" />
    </Badge>
  );
}

export function StatClockIcon({ className }: IconProps) {
  return (
    <Badge id="ic-clock" from="#C4B5FD" to="#7C3AED" className={className}>
      <circle cx="32" cy="32" r="16" fill="#fff" />
      <path d="M32 22v10l7 5" fill="none" stroke="#7C3AED" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </Badge>
  );
}

export function EcoCapIcon({ className }: IconProps) {
  return (
    <Badge id="ic-cap" from="#93C5FD" to="#1D4ED8" className={className}>
      <path d="M32 16 12 25l20 9 20-9-20-9Z" fill="#fff" />
      <path d="M20 29.5V38c0 3 5.4 6 12 6s12-3 12-6v-8.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 26v9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </Badge>
  );
}

export function EcoRobotIcon({ className }: IconProps) {
  return (
    <Badge id="ic-robot" from="#DDD6FE" to="#7C3AED" className={className}>
      <rect x="18" y="22" width="28" height="22" rx="10" fill="#fff" />
      <circle cx="27" cy="33" r="2.6" fill="#7C3AED" />
      <circle cx="37" cy="33" r="2.6" fill="#7C3AED" />
      <rect x="30" y="12" width="4" height="8" rx="2" fill="#fff" />
      <circle cx="32" cy="11" r="3" fill="#fff" />
      <rect x="12" y="30" width="5" height="10" rx="2.5" fill="#fff" opacity=".85" />
      <rect x="47" y="30" width="5" height="10" rx="2.5" fill="#fff" opacity=".85" />
    </Badge>
  );
}

export function EcoBooksIcon({ className }: IconProps) {
  return (
    <Badge id="ic-books" from="#A5B4FC" to="#4338CA" className={className}>
      <rect x="16" y="16" width="10" height="32" rx="2" fill="#fff" />
      <rect x="27" y="14" width="10" height="34" rx="2" fill="#fff" opacity=".92" />
      <rect x="38" y="18" width="10" height="30" rx="2" fill="#fff" opacity=".85" />
      <rect x="16" y="24" width="32" height="3" fill="#4338CA" opacity=".35" />
    </Badge>
  );
}

export function EcoCubeIcon({ className }: IconProps) {
  return (
    <Badge id="ic-cube" from="#C4B5FD" to="#6D28D9" className={className}>
      <path d="M32 14 50 24v16L32 50 14 40V24L32 14Z" fill="#fff" opacity=".95" />
      <path d="M32 14v18L14 24l18-10Z" fill="#fff" />
      <path d="M32 32v18L14 40V24l18 8Z" fill="#fff" opacity=".7" />
      <path d="M32 32v18l18-10V24l-18 8Z" fill="#fff" opacity=".85" />
    </Badge>
  );
}

export function EcoRocketIcon({ className }: IconProps) {
  return (
    <Badge id="ic-rocket" from="#FDBA74" to="#EA580C" className={className}>
      <path
        d="M32 12c7 4 11 12 11 20 0 4-1 7-2 9l-9 6-9-6c-1-2-2-5-2-9 0-8 4-16 11-20Z"
        fill="#fff"
      />
      <circle cx="32" cy="28" r="4" fill="#EA580C" />
      <path d="M23 38l-6 10 10-4" fill="#fff" opacity=".85" />
      <path d="M41 38l6 10-10-4" fill="#fff" opacity=".85" />
    </Badge>
  );
}

export function EcoDiamondIcon({ className }: IconProps) {
  return (
    <Badge id="ic-diamond" from="#F0ABFC" to="#7C3AED" className={className}>
      <path d="M20 22h24l6 8-18 20-18-20 6-8Z" fill="#fff" />
      <path d="M20 22h24l-12 8-12-8Z" fill="#fff" opacity=".7" />
      <path d="M32 30 20 22l-6 8 18 20 18-20-6-8-12 8Z" fill="none" stroke="#7C3AED" strokeOpacity=".25" strokeWidth="1.5" />
    </Badge>
  );
}
