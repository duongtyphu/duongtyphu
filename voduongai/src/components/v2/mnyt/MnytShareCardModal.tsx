"use client";

/**
 * Modal "🖼 Thẻ chia sẻ" (5/6 modal Giai đoạn 6) — mở từ nút cùng tên ở
 * thẻ "Hoàn thành" của View Chi tiết (trước đó `disabled`, "Sắp ra mắt").
 * Vẽ 1 ảnh PNG chia sẻ được bằng Canvas 2D API THUẦN (không thư viện mới —
 * dự án chưa có tiền lệ export ảnh nào, tránh phát sinh dependency cho 1
 * tính năng chưa từng có mẫu). Nội dung 100% dữ liệu THẬT của ý tưởng đang
 * xem (tiêu đề/lĩnh vực/ngày/takeaway/chuỗi ngày học) — không có ô nhập tự
 * do nào (khác Submit Idea modal), không cần validate.
 *
 * Font canvas dùng system-ui thuần (không tham chiếu 'Space Grotesk'/'Be
 * Vietnam Pro') — `next/font/google` đặt tên family nội bộ đã điều chỉnh
 * metric, không đảm bảo `ctx.font` tra cứu đúng tên gốc; system-ui an toàn
 * và không phụ thuộc thời điểm font tải xong.
 */

import { useEffect, useRef, useState } from "react";
import { useMnytModalEscape } from "@/lib/mnyt/use-modal-escape";

type ShareTopic = {
  title: string;
  titleEn: string;
  categoryName: string;
  categoryNameEn: string;
  color: string;
  day: number;
  takeaway: string;
  takeawayEn: string;
};

type Props = {
  lang: "vi" | "en";
  topic: ShareTopic;
  streak: number;
  onClose: () => void;
};

const CARD_W = 1080;
const CARD_H = 1080;

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(test).width > maxWidth) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current = test;
    }
  }
  if (lines.length < maxLines && current) lines.push(current);

  const consumedText = lines.join(" ");
  if (consumedText.length < text.length && lines.length === maxLines) {
    let last = lines[maxLines - 1];
    while (last.length > 0 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

function drawLogoMark(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#2563EB";
  ctx.beginPath();
  ctx.moveTo(3, 5);
  ctx.lineTo(16, 28);
  ctx.lineTo(29, 5);
  ctx.lineTo(23, 5);
  ctx.lineTo(16, 18);
  ctx.lineTo(9, 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#F97316";
  ctx.beginPath();
  ctx.arc(27, 7.5, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function MnytShareCardModal({ lang, topic, streak, onClose }: Props) {
  const isVi = lang === "vi";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  const title = isVi ? topic.title : topic.titleEn || topic.title;
  const categoryName = isVi ? topic.categoryName : topic.categoryNameEn || topic.categoryName;
  const takeaway = isVi ? topic.takeaway : topic.takeawayEn || topic.takeaway;

  useMnytModalEscape(onClose);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CARD_W;
    canvas.height = CARD_H;

    ctx.fillStyle = "#0a0b12";
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    const glow = ctx.createRadialGradient(CARD_W * 0.15, CARD_H * 0.1, 0, CARD_W * 0.15, CARD_H * 0.1, CARD_W * 0.9);
    glow.addColorStop(0, `${topic.color}3d`);
    glow.addColorStop(1, "rgba(10,11,18,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    ctx.strokeStyle = `${topic.color}55`;
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, CARD_W - 56, CARD_H - 56);

    const padX = 76;
    ctx.textBaseline = "alphabetic";

    drawLogoMark(ctx, padX, 64, 1.6);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 26px system-ui, sans-serif";
    ctx.fillText("VDAI ACADEMY", padX + 62, 92);
    ctx.fillStyle = "rgba(231,229,240,0.55)";
    ctx.font = "600 15px system-ui, sans-serif";
    ctx.fillText(isVi ? "MỖI NGÀY MỘT Ý TƯỞNG" : "ONE AI IDEA A DAY", padX + 62, 114);

    ctx.font = "700 20px system-ui, sans-serif";
    const catText = categoryName.toUpperCase();
    const badgeW = ctx.measureText(catText).width + 40;
    const badgeX = CARD_W - padX - badgeW;
    const badgeY = 56;
    const badgeH = 40;
    const r = 20;
    ctx.fillStyle = `${topic.color}26`;
    ctx.strokeStyle = topic.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(badgeX + r, badgeY);
    ctx.arcTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + badgeH, r);
    ctx.arcTo(badgeX + badgeW, badgeY + badgeH, badgeX, badgeY + badgeH, r);
    ctx.arcTo(badgeX, badgeY + badgeH, badgeX, badgeY, r);
    ctx.arcTo(badgeX, badgeY, badgeX + badgeW, badgeY, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = topic.color;
    ctx.fillText(catText, badgeX + 20, badgeY + 26);

    ctx.fillStyle = "rgba(231,229,240,0.5)";
    ctx.font = "600 16px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(isVi ? `Ý tưởng #${topic.day}` : `Idea #${topic.day}`, CARD_W - padX, 116);
    ctx.textAlign = "left";

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 54px system-ui, sans-serif";
    const titleLines = wrapLines(ctx, title, CARD_W - padX * 2, 4);
    let ty = 260;
    for (const line of titleLines) {
      ctx.fillText(line, padX, ty);
      ty += 64;
    }

    ctx.fillStyle = "rgba(231,229,240,0.75)";
    ctx.font = "500 26px system-ui, sans-serif";
    const takeawayLines = wrapLines(ctx, takeaway, CARD_W - padX * 2, 4);
    let sy = ty + 36;
    for (const line of takeawayLines) {
      ctx.fillText(line, padX, sy);
      sy += 38;
    }

    ctx.strokeStyle = "rgba(231,229,240,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, CARD_H - 132);
    ctx.lineTo(CARD_W - padX, CARD_H - 132);
    ctx.stroke();

    if (streak > 0) {
      ctx.fillStyle = "#fbbf24";
      ctx.font = "700 24px system-ui, sans-serif";
      ctx.fillText(`🔥 ${streak} ${isVi ? "ngày liên tiếp" : "days in a row"}`, padX, CARD_H - 84);
    }

    ctx.fillStyle = "rgba(231,229,240,0.45)";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("vdai.vn", CARD_W - padX, CARD_H - 84);
    ctx.textAlign = "left";

    setReady(true);
  }, [topic, streak, isVi, title, categoryName, takeaway]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `vdai-y-tuong-${topic.day}.png`;
    a.click();
  };

  const handleShareImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `vdai-y-tuong-${topic.day}.png`, { type: "image/png" });
      const nav = navigator as Navigator & {
        share?: (data: { files?: File[]; title?: string }) => Promise<void>;
        canShare?: (data: { files?: File[] }) => boolean;
      };
      if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
        nav.share({ files: [file], title }).catch(() => {});
      } else {
        handleDownload();
      }
    }, "image/png");
  };

  const t = {
    title: isVi ? "Thẻ chia sẻ" : "Share card",
    download: isVi ? "Tải ảnh xuống" : "Download image",
    share: isVi ? "Chia sẻ ảnh" : "Share image",
    close: isVi ? "Đóng" : "Close",
  };

  return (
    <div className="mnyt-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="mnyt-sharecard-card" onClick={(e) => e.stopPropagation()}>
        <div className="mnyt-sharecard-head">
          <div className="mnyt-sharecard-title">{t.title}</div>
          <button type="button" className="mnyt-sharecard-close-btn" onClick={onClose} aria-label={t.close}>
            ✕
          </button>
        </div>
        <div className="mnyt-sharecard-canvas-wrap">
          <canvas ref={canvasRef} className="mnyt-sharecard-canvas" aria-label={title} />
        </div>
        <div className="mnyt-sharecard-actions">
          <button type="button" className="mnyt-sharecard-download-btn" onClick={handleDownload} disabled={!ready}>
            {t.download}
          </button>
          <button type="button" className="mnyt-sharecard-share-btn" onClick={handleShareImage} disabled={!ready}>
            {t.share}
          </button>
        </div>
      </div>
    </div>
  );
}
