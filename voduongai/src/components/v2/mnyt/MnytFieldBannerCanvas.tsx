"use client";

/**
 * Banner Canvas cho 1 thẻ chủ đề ở lưới "Không gian ý tưởng" (Trang chủ) —
 * theo yêu cầu Founder: "Banner 35 thẻ chủ đề => dùng canvas để thiết kế,
 * theo đúng từng chủ đề." Render đúng bên trong `.mnyt-home-field-cover`
 * (76px cao, rộng theo lưới `auto-fill minmax(190px,1fr)`), phía SAU badge
 * chữ cái đầu (`.mnyt-home-field-initial`) và vignette `::after` — cả 2
 * vẫn giữ nguyên, canvas chỉ thay thế nền phẳng `var(--surface)` trước đó.
 *
 * Client-only (canvas không có ở server) — `useEffect` + `ResizeObserver`
 * để co giãn đúng theo bề rộng cột lưới thật (không cố định px), nhân
 * `devicePixelRatio` để nét không bị mờ trên màn hình Retina — cùng kỹ
 * thuật Canvas 2D đã dùng ở `MnytShareCardModal.tsx`.
 */

import { useEffect, useRef } from "react";
import { drawMnytFieldBanner } from "@/lib/mnyt/field-banner-canvas";

type Props = {
  categoryKey: string;
  color: string;
};

export function MnytFieldBannerCanvas({ categoryKey, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    let frame = 0;
    const render = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawMnytFieldBanner(ctx, width, height, categoryKey, color);
    };

    render();
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [categoryKey, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}
