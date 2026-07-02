#!/usr/bin/env node
/**
 * Xuất Living Core™ thành các file SVG tĩnh (đứng độc lập, không cần
 * React) cho assets/companion/. Hình học/gradient/animation ở đây PHẢI
 * khớp với src/components/LivingCore.tsx — đây là
 * cùng một Design Lock (design-system/visual-dna/companion/
 * LIVING-CORE-001.md), chỉ xuất ra dạng file tĩnh để dùng ở nơi không
 * chạy được React (favicon, chia sẻ, preview, <img src>, ...).
 *
 * Mỗi file vẫn "sống" — animation CSS nhúng trong <style> chạy được cả
 * khi nhúng qua thẻ <img>. State cố định = idle (mặc định).
 *
 * Chạy: node scripts/generate-living-core-svg.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "assets", "companion");

// Giữ đồng bộ với DUST_POINTS trong LivingCore.tsx
const DUST_POINTS = [
  { x: 42, y: 46, r: 1.1 },
  { x: 50, y: 40, r: 1.3 },
  { x: 34, y: 40, r: 1.2 },
  { x: 48, y: 56, r: 1.4 },
  { x: 60, y: 48, r: 1.1 },
  { x: 36, y: 54, r: 1 },
  { x: 55, y: 30, r: 1.2 },
  { x: 28, y: 48, r: 1 },
  { x: 62, y: 34, r: 1 },
  { x: 44, y: 66, r: 1.2 },
  { x: 66, y: 58, r: 0.9 },
  { x: 24, y: 58, r: 1 },
  { x: 54, y: 68, r: 0.9 },
  { x: 70, y: 44, r: 0.8 },
  { x: 30, y: 30, r: 0.9 },
  { x: 22, y: 40, r: 0.8 },
  { x: 76, y: 50, r: 0.8 },
  { x: 40, y: 74, r: 0.8 },
  { x: 64, y: 68, r: 0.8 },
  { x: 20, y: 52, r: 0.7 },
  { x: 58, y: 22, r: 0.8 },
  { x: 34, y: 22, r: 0.7 },
  { x: 72, y: 62, r: 0.7 },
  { x: 26, y: 66, r: 0.7 },
  { x: 46, y: 28, r: 1.2, warm: true },
  { x: 64, y: 40, r: 0.9, warm: true },
  { x: 38, y: 60, r: 0.9, warm: true },
];

// Giữ đồng bộ với detailForSize() trong LivingCore.tsx
function detailForSize(size) {
  const orbitCount = size >= 52 ? 2 : size >= 32 ? 1 : 0;
  const dustCount = size >= 256 ? 27 : size >= 128 ? 24 : size >= 64 ? 14 : size >= 52 ? 7 : 0;
  return {
    orbitCount,
    dustCount,
    showAura: size >= 32,
    showSparkleWarm: size >= 128,
  };
}

function buildSvg(size, idSuffix) {
  const detail = detailForSize(size);
  const dust = DUST_POINTS.slice(0, detail.dustCount);

  const bodyGradId = `lc-body-${idSuffix}`;
  const auraGradId = `lc-aura-${idSuffix}`;
  const coreGradId = `lc-core-${idSuffix}`;
  const clipId = `lc-clip-${idSuffix}`;
  const blurId = `lc-blur-${idSuffix}`;

  const auraEl = detail.showAura
    ? `<ellipse class="living-core__aura" cx="50" cy="51" rx="42" ry="40" fill="url(#${auraGradId})" filter="url(#${blurId})" />`
    : "";

  const dustEls =
    dust.length > 0
      ? `<g clip-path="url(#${clipId})" class="living-core__dust">
${dust
  .map((d, i) => {
    const delay = ((i % 7) * 0.35).toFixed(2);
    const duration = (3.6 + (i % 5) * 0.4).toFixed(2);
    const fill = d.warm && detail.showSparkleWarm ? "#FFE082" : "#EAF4FF";
    return `      <circle class="living-core__mote" style="animation-delay:${delay}s;animation-duration:${duration}s" cx="${d.x}" cy="${d.y}" r="${d.r}" fill="${fill}" />`;
  })
  .join("\n")}
    </g>`
      : "";

  const orbit1 =
    detail.orbitCount >= 1
      ? `<ellipse class="living-core__orbit living-core__orbit--1" cx="50" cy="51" rx="52" ry="43" stroke="rgba(255,255,255,0.85)" stroke-width="0.9" />`
      : "";
  const orbit2 =
    detail.orbitCount >= 2
      ? `<ellipse class="living-core__orbit living-core__orbit--2" cx="50" cy="51" rx="47" ry="39" stroke="rgba(224,244,255,0.75)" stroke-width="0.8" />`
      : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" role="img" aria-label="Companion Living Core">
  <title>Companion Living Core™</title>
  <defs>
    <radialGradient id="${bodyGradId}" cx="47%" cy="46%" r="68%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
      <stop offset="14%" stop-color="#BFEAFF" stop-opacity="1" />
      <stop offset="32%" stop-color="#38D5FF" stop-opacity="0.95" />
      <stop offset="55%" stop-color="#4F7DFF" stop-opacity="0.75" />
      <stop offset="78%" stop-color="#4F7DFF" stop-opacity="0.32" />
      <stop offset="100%" stop-color="#4F7DFF" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="${auraGradId}" cx="47%" cy="46%" r="62%">
      <stop offset="0%" stop-color="rgba(180,220,255,0.5)" />
      <stop offset="55%" stop-color="rgba(120,190,255,0.22)" />
      <stop offset="100%" stop-color="rgba(120,190,255,0)" />
    </radialGradient>
    <radialGradient id="${coreGradId}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </radialGradient>
    <clipPath id="${clipId}">
      <ellipse cx="50" cy="51" rx="34" ry="32" />
    </clipPath>
    ${detail.showAura ? `<filter id="${blurId}" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.4" /></filter>` : ""}
    <filter id="${bodyGradId}-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.6" /></filter>
    <style>
      .living-core__aura { transform-box: fill-box; transform-origin: center; mix-blend-mode: screen; animation: lc-aura-breathe 6s ease-in-out infinite; }
      @keyframes lc-aura-breathe { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.045); } }
      .living-core__body { transform-box: fill-box; transform-origin: center; mix-blend-mode: screen; animation: lc-pulse 5s ease-in-out infinite; }
      @keyframes lc-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
      .living-core__core-glow { transform-box: fill-box; transform-origin: center; animation: lc-inner-glow 5s ease-in-out infinite; }
      .living-core__core { transform-box: fill-box; transform-origin: center; animation: lc-pulse 5s ease-in-out infinite; }
      @keyframes lc-inner-glow { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.12); } }
      .living-core__orbit { transform-box: fill-box; transform-origin: center; }
      .living-core__orbit--1 { animation: lc-orbit-1-spin 42s linear infinite; }
      .living-core__orbit--2 { animation: lc-orbit-2-spin 58s linear infinite reverse; }
      @keyframes lc-orbit-1-spin { from { transform: rotate(-22deg); } to { transform: rotate(338deg); } }
      @keyframes lc-orbit-2-spin { from { transform: rotate(26deg); } to { transform: rotate(386deg); } }
      .living-core__mote { transform-box: fill-box; transform-origin: center; animation-name: lc-mote-twinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes lc-mote-twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.25); } }
      @media (prefers-reduced-motion: reduce) {
        .living-core__aura, .living-core__body, .living-core__core, .living-core__core-glow, .living-core__orbit, .living-core__mote { animation: none !important; }
      }
    </style>
  </defs>
  <g transform="rotate(-14 50 51)">
    ${auraEl}
    <ellipse class="living-core__body" cx="50" cy="51" rx="37" ry="35" fill="url(#${bodyGradId})" filter="url(#${bodyGradId}-blur)" />
    ${dustEls}
    ${orbit1}
    ${orbit2}
    <circle class="living-core__core-glow" cx="48" cy="49" r="17" fill="url(#${coreGradId})" />
    <circle class="living-core__core" cx="48" cy="49" r="6.5" fill="#FFFFFF" />
  </g>
</svg>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

const SIZES = [16, 32, 52, 64, 128, 256];

for (const size of SIZES) {
  const svg = buildSvg(size, `${size}`);
  writeFileSync(join(OUT_DIR, `living-core-${size}.svg`), svg, "utf8");
  console.log(`Wrote living-core-${size}.svg`);
}

// living-core.svg — bản mặc định/canonical, đầy đủ chi tiết (256)
const master = buildSvg(256, "master");
writeFileSync(join(OUT_DIR, "living-core.svg"), master, "utf8");
console.log("Wrote living-core.svg (master, full detail)");
