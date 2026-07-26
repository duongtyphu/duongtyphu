import type { ReactNode } from "react";

type IconProps = { className?: string };

/**
 * Glossy "3D sticker" style badge icons — hand-drawn vector illustrations
 * (radial gradient body + specular highlight + inner shadow + drop shadow)
 * built to approximate a chunky 3D-emoji look, since this environment has
 * no configured image-generation credentials (Gemini API key) to produce
 * true rendered 3D icon assets. Each icon namespaces its own <defs> ids so
 * multiple instances can coexist on one page.
 */

function Badge({
  id,
  light,
  mid,
  dark,
  className,
  children,
}: {
  id: string;
  light: string;
  mid: string;
  dark: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-bg`} cx="36%" cy="28%" r="80%">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`${id}-glyph`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F3F1FE" />
        </linearGradient>
        <filter id={`${id}-lift`} x="-40%" y="-30%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor={dark} floodOpacity="0.45" />
        </filter>
      </defs>

      {/* ground shadow */}
      <ellipse cx="32" cy="58" rx="17" ry="3.4" fill="#0B0F2E" opacity=".14" />

      {/* body */}
      <rect x="5" y="5" width="54" height="54" rx="17" fill={`url(#${id}-bg)`} />
      {/* bottom inner shadow for volume */}
      <path d="M9 44c8 9 38 9 46 0v10c0 4-3 8-7 8H16c-4 0-7-4-7-8V44Z" fill={dark} opacity=".22" />
      {/* top specular highlight */}
      <ellipse cx="23" cy="17" rx="15" ry="9" fill="#FFFFFF" opacity=".55" />
      {/* rim light */}
      <rect x="5" y="5" width="54" height="54" rx="17" fill="none" stroke="#FFFFFF" strokeOpacity=".35" strokeWidth="1.2" />

      <g filter={`url(#${id}-lift)`}>{children}</g>
    </svg>
  );
}

/* ───────────────────────── stats bar icons ───────────────────────── */

export function StatHeartIcon({ className }: IconProps) {
  return (
    <Badge id="ic-heart" light="#BFE6FF" mid="#5FB2F5" dark="#2563EB" className={className}>
      <path
        d="M32 43.5s-14.2-8.3-14.2-18C17.8 20.6 21.8 17 26.5 17c2.6 0 5 1.3 6.5 3.4 1.5-2.1 3.9-3.4 6.5-3.4 4.7 0 8.7 3.8 8.7 8.5 0 9.7-14.2 18-14.2 18Z"
        fill="url(#ic-heart-glyph)"
      />
      <path d="M32 43.5c1.8-1.1 4.4-2.9 6.8-5.1-2.7 1-6-0.4-6.8-3.6-.8 3.2-4.1 4.6-6.8 3.6 2.4 2.2 5 4 6.8 5.1Z" fill="#93C5FD" opacity=".5" />
    </Badge>
  );
}

export function StatPuzzleIcon({ className }: IconProps) {
  return (
    <Badge id="ic-puzzle" light="#FFD9EE" mid="#F472B6" dark="#BE185D" className={className}>
      <path
        d="M25 20h6.5a2.6 2.6 0 0 1 4.9 1.2 2.6 2.6 0 0 1-1.9 3.9c-.3.1-.6.1-.9.1v6.3h6.2a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 0 0 5.2h-6.2v6h-6.3a2.6 2.6 0 1 1-5.1-1 2.6 2.6 0 0 0-1-5H19v-6.2a2.6 2.6 0 1 1 1-5.1 2.6 2.6 0 0 0 5-1H25V20Z"
        fill="url(#ic-puzzle-glyph)"
      />
    </Badge>
  );
}

export function StatClipboardIcon({ className }: IconProps) {
  return (
    <Badge id="ic-clip" light="#CFF7DC" mid="#4ADE80" dark="#15803D" className={className}>
      <rect x="19" y="18" width="26" height="31" rx="5" fill="url(#ic-clip-glyph)" />
      <rect x="26" y="13" width="12" height="8" rx="3" fill="#fff" />
      <rect x="24" y="27" width="17" height="3" rx="1.5" fill="#15803D" opacity=".8" />
      <rect x="24" y="34" width="17" height="3" rx="1.5" fill="#15803D" opacity=".8" />
      <rect x="24" y="41" width="10" height="3" rx="1.5" fill="#15803D" opacity=".8" />
    </Badge>
  );
}

export function StatPeopleIcon({ className }: IconProps) {
  return (
    <Badge id="ic-people" light="#FFE3C2" mid="#FB923C" dark="#C2410C" className={className}>
      <circle cx="25" cy="23" r="7" fill="url(#ic-people-glyph)" />
      <circle cx="41" cy="26" r="5.5" fill="#fff" opacity=".8" />
      <path d="M12 47c1.6-9 6.5-13.5 13-13.5S37 38 38.6 47Z" fill="url(#ic-people-glyph)" />
      <path d="M33 47c1.3-7 5-10.5 9.7-10.5S51.3 40 52.6 47Z" fill="#fff" opacity=".8" />
    </Badge>
  );
}

export function StatClockIcon({ className }: IconProps) {
  return (
    <Badge id="ic-clock" light="#E4D9FF" mid="#A78BFA" dark="#6D28D9" className={className}>
      <circle cx="32" cy="32" r="17" fill="url(#ic-clock-glyph)" />
      <circle cx="32" cy="32" r="13" fill="none" stroke="#6D28D9" strokeOpacity=".18" strokeWidth="1.5" />
      <path d="M32 21v11l7.5 5.4" fill="none" stroke="#6D28D9" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="2" fill="#6D28D9" />
    </Badge>
  );
}

/* ───────────────────────── ecosystem row icons ───────────────────────── */

export function EcoCapIcon({ className }: IconProps) {
  return (
    <Badge id="ic-cap" light="#CFE3FF" mid="#5B9BFA" dark="#1D4ED8" className={className}>
      <path d="M32 15 10 25.5 32 36l22-10.5L32 15Z" fill="url(#ic-cap-glyph)" />
      <path d="M19 29.5v8c0 3.6 6 6.7 13 6.7s13-3.1 13-6.7v-8L32 34.2 19 29.5Z" fill="#fff" opacity=".92" />
      <path d="M48 27.5v10.8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="48" cy="40.5" r="2.1" fill="#fff" />
    </Badge>
  );
}

export function EcoRobotIcon({ className }: IconProps) {
  return (
    <Badge id="ic-robot" light="#E7DBFF" mid="#A879F5" dark="#6D28D9" className={className}>
      <rect x="30" y="10" width="4" height="7" rx="2" fill="#fff" />
      <circle cx="32" cy="9" r="3" fill="#fff" />
      <rect x="15" y="30" width="6" height="12" rx="3" fill="#fff" opacity=".85" />
      <rect x="43" y="30" width="6" height="12" rx="3" fill="#fff" opacity=".85" />
      <rect x="17" y="20" width="30" height="26" rx="12" fill="url(#ic-robot-glyph)" />
      <ellipse cx="25" cy="23" rx="4" ry="3" fill="#fff" opacity=".6" />
      <circle cx="26" cy="33" r="3" fill="#3B2A8A" />
      <circle cx="38" cy="33" r="3" fill="#3B2A8A" />
      <path d="M27 41c2.5 2.4 7.5 2.4 10 0" fill="none" stroke="#3B2A8A" strokeWidth="2.2" strokeLinecap="round" />
    </Badge>
  );
}

export function EcoBooksIcon({ className }: IconProps) {
  return (
    <Badge id="ic-books" light="#D6DBFF" mid="#7C87F0" dark="#4338CA" className={className}>
      <rect x="15" y="15" width="11" height="34" rx="2.4" fill="url(#ic-books-glyph)" />
      <rect x="26.5" y="12" width="11" height="37" rx="2.4" fill="#fff" opacity=".95" />
      <rect x="38" y="17" width="11" height="32" rx="2.4" fill="url(#ic-books-glyph)" opacity=".9" />
      <rect x="15" y="24" width="34" height="2.6" fill="#3730A3" opacity=".35" />
      <rect x="29" y="16" width="5" height="9" rx="1" fill="#EEF2FF" opacity=".9" />
    </Badge>
  );
}

export function EcoCubeIcon({ className }: IconProps) {
  return (
    <Badge id="ic-cube" light="#E6D9FF" mid="#9B6BFF" dark="#5B21B6" className={className}>
      <path d="M32 12 51 23v18L32 52 13 41V23L32 12Z" fill="#fff" opacity=".25" />
      <path d="M32 12v18L13 23l19-11Z" fill="#fff" />
      <path d="M32 30v18L13 41V23l19 7Z" fill="url(#ic-cube-glyph)" opacity=".85" />
      <path d="M32 30v18l19-7V23l-19 7Z" fill="url(#ic-cube-glyph)" />
      <path d="M32 12v18l19-7-19-11Z" fill="#fff" opacity=".7" />
    </Badge>
  );
}

export function EcoRocketIcon({ className }: IconProps) {
  return (
    <Badge id="ic-rocket" light="#FFE1C2" mid="#FB923C" dark="#C2410C" className={className}>
      <path d="M21 40l-6.5 10.5L25 45" fill="url(#ic-rocket-glyph)" opacity=".9" />
      <path d="M43 40l6.5 10.5L39 45" fill="url(#ic-rocket-glyph)" opacity=".9" />
      <path
        d="M32 11c8 4.6 12.5 13.5 12.5 22.5 0 4.6-1.2 8-2.4 10.2L32 49l-10.1-5.3c-1.2-2.2-2.4-5.6-2.4-10.2C19.5 24.5 24 15.6 32 11Z"
        fill="url(#ic-rocket-glyph)"
      />
      <circle cx="32" cy="27" r="5.4" fill="#fff" />
      <circle cx="32" cy="27" r="2.6" fill="#C2410C" />
      <path d="M24 44c2.6 2 5.2 3 8 3s5.4-1 8-3" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.6" />
    </Badge>
  );
}

export function EcoDiamondIcon({ className }: IconProps) {
  return (
    <Badge id="ic-diamond" light="#FBD9FF" mid="#C77BF0" dark="#7E22CE" className={className}>
      <path d="M19 22h26l6.5 8.5L32 49 12.5 30.5 19 22Z" fill="url(#ic-diamond-glyph)" />
      <path d="M19 22h26l-13 8.4-13-8.4Z" fill="#fff" opacity=".8" />
      <path d="M32 30.4 19 22l-6.5 8.5L32 49l19.5-18.5L45 22l-13 8.4Z" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1.4" />
      <path d="M25.5 22 32 30.4 38.5 22" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" />
    </Badge>
  );
}
