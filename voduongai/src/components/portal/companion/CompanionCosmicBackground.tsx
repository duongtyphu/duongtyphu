/**
 * Companion Design System™ — Layer 01, Bước 2: CompanionCosmicBackground.
 * Nền dùng chung cho toàn bộ thế giới Companion — không video, không
 * Three.js, chỉ CSS (gradient + blur + keyframe nhẹ), an toàn cho mobile.
 */

import { COMPANION_STAR_FIELD } from "@/lib/companion/design-tokens";

export function CompanionCosmicBackground() {
  return (
    <div aria-hidden="true" className="companion-cosmic-base pointer-events-none absolute inset-0 overflow-hidden">
      {/* Aurora blobs — trôi rất chậm, không choán mắt */}
      <div
        className="companion-aurora-blob h-[420px] w-[420px] bg-violet-500/40"
        style={{ top: "-10%", left: "-8%", animationDelay: "0s" }}
      />
      <div
        className="companion-aurora-blob h-[380px] w-[380px] bg-cyan-400/30"
        style={{ top: "10%", right: "-10%", animationDelay: "4s" }}
      />
      <div
        className="companion-aurora-blob h-[340px] w-[340px] bg-blue-500/25"
        style={{ bottom: "-12%", left: "20%", animationDelay: "8s" }}
      />

      {/* Star particles — vị trí cố định, không Math.random() để tránh lệch hydration */}
      {COMPANION_STAR_FIELD.map((star, i) => (
        <span
          key={i}
          className="companion-star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
