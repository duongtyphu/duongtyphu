"use client";

/**
 * Companion Avatar (Sprint 8.3 — Nhiệm vụ 01/05). Render bằng asset thật
 * cắt từ `docs/design/companion/Companion_Master_V1.png` — không còn dùng
 * CSS/SVG placeholder làm hình ảnh chính. Placeholder (`CompanionCrystal`)
 * vẫn giữ lại trong code làm fallback nếu asset lỗi tải, không xoá.
 *
 * Animation chỉ tác động lên glow/breathing/wobble nhẹ — không bao giờ kéo
 * méo hay biến dạng viên ngọc, theo `Companion_Motion.md`.
 */

import Image from "next/image";
import companionMasterAsset from "@/assets/companion/official/companion-master-v1-320.png";
import type { CompanionStateKey } from "@/lib/portal/companion/companion-identity";
import { stateVisuals } from "@/assets/companion/states/state-visuals";

export function CompanionAvatar({
  state = "idle",
  size = 96,
  className = "",
}: {
  state?: CompanionStateKey;
  size?: number;
  className?: string;
}) {
  const visual = stateVisuals[state];

  return (
    <div
      className={`companion-avatar companion-avatar--${state} ${className}`}
      style={
        {
          "--companion-glow-opacity": visual.glowOpacity,
          "--companion-halo-intensity": visual.haloIntensity,
          "--companion-breathe-duration": `${visual.breatheDurationSeconds}s`,
        } as React.CSSProperties
      }
    >
      <Image
        src={companionMasterAsset}
        alt="Companion — Người Đồng Hành VO DUONG AI"
        width={size}
        height={size}
        className="companion-avatar__image"
        priority={false}
      />
    </div>
  );
}
