export function CompanionRobotSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 360" className={className} role="img" aria-label="Companion AI">
      <defs>
        <linearGradient id="cr-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E7E4FA" />
          <stop offset="100%" stopColor="#B9AEF0" />
        </linearGradient>
        <linearGradient id="cr-body-soft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CFC7F4" />
        </linearGradient>
        <linearGradient id="cr-ear" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D9D2F6" />
          <stop offset="100%" stopColor="#A79AE8" />
        </linearGradient>
        <radialGradient id="cr-ring-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E6D9FF" stopOpacity="1" />
          <stop offset="45%" stopColor="#9B6BFF" stopOpacity=".85" />
          <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0" />
        </radialGradient>
        <filter id="cr-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* glow ring platform */}
      <g opacity="0.9">
        <ellipse cx="160" cy="322" rx="132" ry="26" fill="none" stroke="#6D3CE8" strokeOpacity=".25" />
        <ellipse cx="160" cy="320" rx="108" ry="21" fill="none" stroke="#8B6BF2" strokeOpacity=".35" />
        <ellipse cx="160" cy="318" rx="82" ry="16" fill="none" stroke="#A78BFA" strokeOpacity=".5" />
        <ellipse cx="160" cy="317" rx="58" ry="12" fill="url(#cr-ring-core)" />
      </g>

      {/* arms */}
      <ellipse cx="82" cy="248" rx="18" ry="30" fill="url(#cr-body-soft)" transform="rotate(18 82 248)" />
      <ellipse cx="238" cy="248" rx="18" ry="30" fill="url(#cr-body-soft)" transform="rotate(-18 238 248)" />

      {/* torso */}
      <path
        d="M112 200c0-14 12-24 26-24h44c14 0 26 10 26 24v46c0 24-21 44-48 44s-48-20-48-44v-46Z"
        fill="url(#cr-body)"
        stroke="#DCD5F7"
        strokeWidth="1"
      />
      {/* torso shading */}
      <path d="M182 180c14 0 26 10 26 24v46c0 20-14 37-33 42 10-9 16-22 16-38v-50c0-9-3-17-9-24Z" fill="#000" opacity=".05" />
      {/* V mark */}
      <path d="M140 214l20 34 20-34h-11l-9 16-9-16h-11Z" fill="#2F49E0" />

      {/* neck */}
      <rect x="142" y="176" width="36" height="18" rx="9" fill="#CFC7F4" />

      {/* head */}
      <ellipse cx="94" cy="128" rx="20" ry="24" fill="url(#cr-ear)" />
      <ellipse cx="226" cy="128" rx="20" ry="24" fill="url(#cr-ear)" />
      <path
        d="M160 26c-46 0-78 32-78 78 0 20 7 37 20 50 5 5 12 8 20 8h76c8 0 15-3 20-8 13-13 20-30 20-50 0-46-32-78-78-78Z"
        fill="url(#cr-body)"
        stroke="#DCD5F7"
        strokeWidth="1"
      />
      {/* head crease detail */}
      <path d="M186 30c14 8 24 20 30 36" fill="none" stroke="#FFFFFF" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
      <path d="M196 34c10 7 18 17 22 29" fill="none" stroke="#9D8FE0" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />

      {/* face plate */}
      <rect x="110" y="86" width="100" height="80" rx="30" fill="#0A0B2E" />
      {/* eyes (closed smiling) + glow */}
      <g filter="url(#cr-glow)" stroke="#8FD9FF" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M133 124c4-10 12-10 16 0" />
        <path d="M171 124c4-10 12-10 16 0" />
        <path d="M144 140c6 8 14 8 20 0" />
      </g>
    </svg>
  );
}
