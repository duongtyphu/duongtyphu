"use client";

/**
 * Modal "🖼 Thẻ chia sẻ" (5/6 modal Giai đoạn 6) — mở từ nút cùng tên ở
 * thẻ "Hoàn thành" của View Chi tiết. Vẽ 1 ảnh PNG chia sẻ được bằng
 * Canvas 2D API THUẦN (không thư viện mới — dự án chưa có tiền lệ export
 * ảnh nào, tránh phát sinh dependency cho 1 tính năng chưa từng có mẫu).
 *
 * Đối chiếu lại 1:1 với hàm export THẬT của mockup gốc
 * (`downloadShareCard()`, dòng 2134-2205) — trước đây file này tự vẽ 1 bố
 * cục HOÀN TOÀN KHÁC (canvas vuông 1080×1080, viền vuông góc, badge danh
 * mục ở góc phải, KHÔNG có avatar học viên) — không phải chỉ lệch vài giá
 * trị số mà lệch cả kích thước/bố cục/nội dung. Đã viết lại đúng theo thứ
 * tự vẽ của mockup: canvas 1080×1350 → nền gradient chéo + glow góc phải-
 * trên → viền bo góc + vòng tròn nét đứt trang trí góc phải-trên → logo +
 * 1 dòng brand → dòng "Danh mục · #Ngày" màu theo chủ đề → tiêu đề (66px)
 * → vạch màu ngắn → takeaway (36px) → chân thẻ: avatar + tên + nhãn vai
 * trò. Avatar LUÔN vẽ dạng CHỮ CÁI ĐẦU (không ảnh) — dự án CHƯA CÓ hạ tầng
 * lưu ảnh đại diện người dùng ở bất kỳ đâu (đã ghi nhận nhiều lần trong
 * CLAUDE.md, kể cả ảnh chân dung ở Hồ sơ cũng chỉ ephemeral client-side,
 * không persist) — mockup gốc cũng tự rơi về đúng nhánh này
 * (`learnerAvatarText: this.state.learnerPhoto ? '' : this.learnerInitials()`)
 * cho MỌI người dùng chưa từng tải ảnh, tức đây là trạng thái THẬT SỰ phổ
 * biến nhất, không phải bản rút gọn qua loa. Giữ lại 1 dòng "🔥 X ngày
 * liên tiếp" (dữ liệu THẬT `streak`, mockup không có trong canvas export
 * nhưng đã có sẵn ở bản build cũ) — đặt cạnh phải hàng chân thẻ, không
 * chiếm chỗ của avatar/tên/vai trò.
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
  learnerName: string | null;
  onClose: () => void;
};

const CARD_W = 1080;
const CARD_H = 1350;
const PAD = 84;

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

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBrandMark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size / 32;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
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
  ctx.fillStyle = "#FF7A00";
  ctx.beginPath();
  ctx.arc(27, 7.5, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function learnerInitials(name: string | null): string {
  const n = (name || "").trim();
  if (!n) return "?";
  const parts = n.split(/\s+/);
  return (parts.length > 1 ? parts[parts.length - 2][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)).toUpperCase();
}

function drawInitialsAvatar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, ringColor: string, initials: string) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = ringColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(r * 0.85)}px "Space Grotesk", system-ui, sans-serif`;
  ctx.fillText(initials, cx, cy + 2);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 3;
  ctx.stroke();
}

export function MnytShareCardModal({ lang, topic, streak, learnerName, onClose }: Props) {
  const isVi = lang === "vi";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  const title = isVi ? topic.title : topic.titleEn || topic.title;
  const categoryName = isVi ? topic.categoryName : topic.categoryNameEn || topic.categoryName;
  const takeaway = isVi ? topic.takeaway : topic.takeawayEn || topic.takeaway;
  const displayName = (learnerName || "").trim() || (isVi ? "Học viên" : "Learner");

  useMnytModalEscape(onClose);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CARD_W;
    canvas.height = CARD_H;

    const bg = ctx.createLinearGradient(0, 0, CARD_W * 0.5, CARD_H);
    bg.addColorStop(0, "#14121f");
    bg.addColorStop(0.62, "#0b0b13");
    bg.addColorStop(1, "#08080f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    const glow = ctx.createRadialGradient(CARD_W * 0.8, CARD_H * 0.08, 0, CARD_W * 0.8, CARD_H * 0.08, CARD_W * 0.62);
    glow.addColorStop(0, `${topic.color}4d`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    ctx.strokeStyle = `${topic.color}55`;
    ctx.lineWidth = 3;
    roundRectPath(ctx, 24, 24, CARD_W - 48, CARD_H - 48, 46);
    ctx.stroke();

    ctx.save();
    ctx.setLineDash([10, 14]);
    ctx.strokeStyle = `${topic.color}44`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(CARD_W - 60, 60, 220, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    drawBrandMark(ctx, PAD, PAD, 72);
    ctx.fillStyle = "#8f8da3";
    ctx.font = '700 25px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const brand = isVi ? "Mỗi ngày một ý tưởng AI" : "One AI idea a day";
    ctx.fillText(brand.toUpperCase(), PAD + 96, PAD + 38);

    let y = PAD + 210;
    ctx.textBaseline = "top";
    ctx.fillStyle = topic.color;
    ctx.font = '700 27px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(`${categoryName} · #${topic.day}`.toUpperCase(), PAD, y);

    y += 62;
    ctx.fillStyle = "#f5f3ff";
    ctx.font = '700 66px "Space Grotesk", system-ui, sans-serif';
    for (const line of wrapLines(ctx, title, CARD_W - PAD * 2, 4)) {
      ctx.fillText(line, PAD, y);
      y += 80;
    }

    y += 40;
    ctx.fillStyle = topic.color;
    roundRectPath(ctx, PAD, y, 120, 8, 4);
    ctx.fill();

    y += 56;
    ctx.fillStyle = "#c8c6d8";
    ctx.font = '400 36px "Be Vietnam Pro", system-ui, sans-serif';
    for (const line of wrapLines(ctx, takeaway, CARD_W - PAD * 2, 5)) {
      ctx.fillText(line, PAD, y);
      y += 56;
    }

    // Chân thẻ — avatar + tên + vai trò (trái), chuỗi ngày học (phải).
    const footY = CARD_H - PAD - 70;
    ctx.strokeStyle = "rgba(231,229,240,0.14)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, footY - 34);
    ctx.lineTo(CARD_W - PAD, footY - 34);
    ctx.stroke();

    const ar = 35;
    const acx = PAD + ar;
    const acy = footY + 26;
    drawInitialsAvatar(ctx, acx, acy, ar, `${topic.color}aa`, learnerInitials(learnerName));
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#dedcea";
    ctx.font = '700 28px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(displayName, PAD + ar * 2 + 22, acy - 30);
    ctx.fillStyle = "#8f8da3";
    ctx.font = '700 20px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText((isVi ? "Học viên" : "Learner").toUpperCase(), PAD + ar * 2 + 22, acy + 6);

    if (streak > 0) {
      ctx.textAlign = "right";
      ctx.fillStyle = "#fbbf24";
      ctx.font = '700 24px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText(`🔥 ${streak} ${isVi ? "ngày liên tiếp" : "days in a row"}`, CARD_W - PAD, acy - 12);
      ctx.textAlign = "left";
    }

    setReady(true);
  }, [topic, streak, isVi, title, categoryName, takeaway, learnerName, displayName]);

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
