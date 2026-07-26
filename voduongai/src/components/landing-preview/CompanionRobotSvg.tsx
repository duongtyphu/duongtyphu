export function CompanionRobotSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 360" className={className} role="img" aria-label="Companion AI">
      <defs>
        <radialGradient id="cr-body" cx="38%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E9E5FB" />
          <stop offset="85%" stopColor="#C7BCF2" />
          <stop offset="100%" stopColor="#A796E8" />
        </radialGradient>
        <radialGradient id="cr-ear" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#EDE9FC" />
          <stop offset="100%" stopColor="#9C8CE0" />
        </radialGradient>
        <linearGradient id="cr-arm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#C3B8EE" />
        </linearGradient>
        <radialGradient id="cr-ring-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F1E8FF" stopOpacity="1" />
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
        <filter id="cr-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#3B1F8F" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* glow ring platform */}
      <g opacity="0.9">
        <ellipse cx="160" cy="323" rx="134" ry="27" fill="none" stroke="#6D3CE8" strokeOpacity=".22" />
        <ellipse cx="160" cy="321" rx="110" ry="22" fill="none" stroke="#8B6BF2" strokeOpacity=".32" />
        <ellipse cx="160" cy="319" rx="84" ry="17" fill="none" stroke="#A78BFA" strokeOpacity=".48" />
        <ellipse cx="160" cy="318" rx="60" ry="13" fill="url(#cr-ring-core)" />
      </g>

      <g filter="url(#cr-shadow)">
        {/* arms */}
        <ellipse cx="80" cy="246" rx="17" ry="29" fill="url(#cr-arm)" transform="rotate(20 80 246)" />
        <ellipse cx="240" cy="246" rx="17" ry="29" fill="url(#cr-arm)" transform="rotate(-20 240 246)" />
        <ellipse cx="72" cy="266" rx="9" ry="7" fill="#EFEAFC" transform="rotate(20 72 266)" />
        <ellipse cx="248" cy="266" rx="9" ry="7" fill="#EFEAFC" transform="rotate(-20 248 266)" />

        {/* torso */}
        <path
          d="M112 200c0-14 12-24 26-24h44c14 0 26 10 26 24v44c0 25-22 46-48 46s-48-21-48-46v-44Z"
          fill="url(#cr-body)"
          stroke="#DCD5F7"
          strokeWidth="1"
        />
        <path d="M182 179c14 0 26 10 26 24v44c0 21-15 39-35 44 11-10 18-24 18-40v-48c0-9-2-17-7-24-.7-.1-1.3 0-2 0Z" fill="#5B4BAE" opacity=".12" />
        <ellipse cx="140" cy="196" rx="16" ry="9" fill="#fff" opacity=".55" />
        {/* V mark */}
        <path d="M139 213l21 36 21-36h-12l-9 17-9-17h-12Z" fill="#2F49E0" />
        <path d="M139 213h12l3 5h-9l-6-5Z" fill="#5B72FF" opacity=".6" />

        {/* neck */}
        <rect x="141" y="175" width="38" height="20" rx="10" fill="#D4CBF6" />
        <rect x="141" y="175" width="38" height="8" rx="4" fill="#B7A9EE" opacity=".6" />

        {/* ear pods */}
        <ellipse cx="92" cy="126" rx="21" ry="26" fill="url(#cr-ear)" />
        <ellipse cx="228" cy="126" rx="21" ry="26" fill="url(#cr-ear)" />
        <ellipse cx="86" cy="116" rx="6" ry="8" fill="#fff" opacity=".55" />
        <ellipse cx="222" cy="116" rx="6" ry="8" fill="#fff" opacity=".45" />

        {/* head */}
        <path
          d="M160 24c-47 0-80 33-80 80 0 20 7 38 21 51 5 5 12 8 20 8h78c8 0 15-3 20-8 14-13 21-31 21-51 0-47-33-80-80-80Z"
          fill="url(#cr-body)"
          stroke="#DCD5F7"
          strokeWidth="1"
        />
        {/* big soft specular highlight */}
        <ellipse cx="122" cy="70" rx="42" ry="30" fill="#fff" opacity=".55" />
        {/* bottom ambient occlusion */}
        <path d="M84 130c4 16 12 28 24 34h104c12-6 20-18 24-34-6 20-15 33-30 40H114c-15-7-24-20-30-40Z" fill="#5B4BAE" opacity=".08" />
        {/* head crease detail (segmented visor look) */}
        <path d="M188 28c15 8 26 21 32 38" fill="none" stroke="#FFFFFF" strokeOpacity=".65" strokeWidth="3" strokeLinecap="round" />
        <path d="M198 33c11 7 19 18 23 31" fill="none" stroke="#9D8FE0" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />

        {/* face plate */}
        <rect x="106" y="84" width="108" height="86" rx="32" fill="#080A26" />
        <rect x="106" y="84" width="108" height="86" rx="32" fill="none" stroke="#2A2860" strokeWidth="1.5" />
        <ellipse cx="140" cy="100" rx="28" ry="10" fill="#fff" opacity=".05" />

        {/* eyes (closed smiling) + mouth, glowing cyan */}
        <g filter="url(#cr-glow)" stroke="#8FE3FF" strokeWidth="4.2" strokeLinecap="round" fill="none">
          <path d="M131 125c4.5-11 13-11 17.5 0" />
          <path d="M171 125c4.5-11 13-11 17.5 0" />
          <path d="M143 142c6.5 8.5 15 8.5 21.5 0" />
        </g>
      </g>
    </svg>
  );
}
