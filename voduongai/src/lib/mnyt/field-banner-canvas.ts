/**
 * Hàm vẽ Canvas 2D thuần cho banner 35 thẻ chủ đề (Trang chủ "Mỗi ngày một
 * ý tưởng") — theo yêu cầu Founder: "Banner 35 thẻ chủ đề => dùng canvas
 * để thiết kế, theo đúng từng chủ đề." Trước đó `.mnyt-home-field-cover`
 * chỉ là nền phẳng (`var(--surface)`) + 1 lớp gradient vignette CSS
 * (`::after`, giữ nguyên, không đụng) — không có thiết kế riêng theo từng
 * lĩnh vực. Dự án chưa có hạ tầng upload ảnh cover thật (đã ghi nhận nhiều
 * lần trong CLAUDE.md) nên không dùng ảnh — vẽ trực tiếp bằng Canvas 2D,
 * cùng tiền lệ kỹ thuật `MnytShareCardModal.tsx`/`MnytCertificateModal.tsx`.
 *
 * Icon minh hoạ lấy từ `MNYT_CATEGORY_ICON`/`MNYT_BANNER_ICONS`
 * (field-banner-icons.ts) — dữ liệu thô của lucide-react, vẽ bằng
 * `Path2D`/`ctx.arc()`/`ctx.rect()`/`moveTo+lineTo` theo đúng loại thẻ
 * (path/circle/rect/line/polyline/ellipse).
 */

import { MNYT_BANNER_ICONS, MNYT_CATEGORY_ICON, type MnytBannerIconShape } from "./field-banner-icons";

function hexWithAlpha(hex: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  const a = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

function drawIconShape(ctx: CanvasRenderingContext2D, shape: MnytBannerIconShape): void {
  const { tag, attrs } = shape;
  switch (tag) {
    case "path": {
      if (typeof attrs.d === "string") {
        ctx.stroke(new Path2D(attrs.d));
      }
      return;
    }
    case "circle": {
      ctx.beginPath();
      ctx.arc(Number(attrs.cx), Number(attrs.cy), Number(attrs.r), 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    case "ellipse": {
      ctx.beginPath();
      ctx.ellipse(Number(attrs.cx), Number(attrs.cy), Number(attrs.rx), Number(attrs.ry), 0, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    case "rect": {
      const x = Number(attrs.x ?? 0);
      const y = Number(attrs.y ?? 0);
      const w = Number(attrs.width);
      const h = Number(attrs.height);
      const rx = attrs.rx != null ? Number(attrs.rx) : attrs.ry != null ? Number(attrs.ry) : 0;
      ctx.beginPath();
      if (rx > 0 && typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, w, h, rx);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.stroke();
      return;
    }
    case "line": {
      ctx.beginPath();
      ctx.moveTo(Number(attrs.x1), Number(attrs.y1));
      ctx.lineTo(Number(attrs.x2), Number(attrs.y2));
      ctx.stroke();
      return;
    }
    case "polyline": {
      if (typeof attrs.points !== "string") return;
      const pts = attrs.points
        .trim()
        .split(/\s+/)
        .map((pair) => pair.split(",").map(Number));
      if (pts.length === 0) return;
      ctx.beginPath();
      pts.forEach(([px, py], i) => {
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      return;
    }
    default:
      return;
  }
}

/**
 * Vẽ banner Canvas cho 1 thẻ chủ đề — nền tối pha màu chủ đề + hoạ tiết
 * đường chéo trang trí + icon minh hoạ lớn dạng watermark bên phải.
 * `width`/`height` là kích thước CSS thật (đã tính `devicePixelRatio` ở
 * phía gọi, hàm này chỉ vẽ trong không gian toạ độ CSS px).
 */
export function drawMnytFieldBanner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  categoryKey: string,
  color: string,
): void {
  ctx.clearRect(0, 0, width, height);

  // Nền tối cơ bản, khớp `#0a0b12` đã dùng trong overlay CSS ::after hiện có.
  ctx.fillStyle = "#0a0b12";
  ctx.fillRect(0, 0, width, height);

  // Mảng màu chủ đề phủ nhẹ từ góc trái (dưới badge chữ cái đầu) mờ dần sang phải.
  const wash = ctx.createLinearGradient(0, 0, width, 0);
  wash.addColorStop(0, hexWithAlpha(color, 0.22));
  wash.addColorStop(1, hexWithAlpha(color, 0));
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  // Hoạ tiết đường chéo mỏng, tinted theo màu chủ đề — texture trang trí nhẹ.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.clip();
  ctx.strokeStyle = hexWithAlpha(color, 0.08);
  ctx.lineWidth = 1;
  const step = 12;
  for (let x = -height; x < width + height; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(x + height, 0);
    ctx.stroke();
  }
  ctx.restore();

  // Glow tròn phía sau icon minh hoạ (bên phải).
  const iconCx = width - Math.min(42, width * 0.26);
  const iconCy = height * 0.52;
  const glowR = height * 1.05;
  const glow = ctx.createRadialGradient(iconCx, iconCy, 0, iconCx, iconCy, glowR);
  glow.addColorStop(0, hexWithAlpha(color, 0.32));
  glow.addColorStop(1, hexWithAlpha(color, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(iconCx, iconCy, glowR, 0, Math.PI * 2);
  ctx.fill();

  // Icon minh hoạ lớn, dạng watermark nét mảnh — vẽ SAU CÙNG để nổi trên hoạ tiết.
  const iconName = MNYT_CATEGORY_ICON[categoryKey];
  const shapes = iconName ? MNYT_BANNER_ICONS[iconName] : undefined;
  if (shapes) {
    const iconSize = Math.min(height * 1.3, 92);
    const scale = iconSize / 24;
    ctx.save();
    ctx.translate(iconCx - iconSize / 2, iconCy - iconSize / 2);
    ctx.scale(scale, scale);
    ctx.strokeStyle = hexWithAlpha(color, 0.6);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const shape of shapes) {
      drawIconShape(ctx, shape);
    }
    ctx.restore();
  }
}
