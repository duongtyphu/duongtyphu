"use client";

/**
 * Modal "Nhận chứng nhận" (6/6 modal Giai đoạn 6) — mở từ nút cùng tên ở
 * View Lộ trình (`MnytPathClient.tsx`). GẮN VỚI TRẠNG THÁI HOÀN THÀNH THẬT
 * của lĩnh vực đang chọn — `doneCount < totalTopics` chỉ hiện màn hình
 * "chưa đủ điều kiện" trung thực (còn thiếu bao nhiêu ý tưởng), KHÔNG có
 * canvas/nút tải nào cả — chỉ khi `doneCount >= totalTopics` mới vẽ chứng
 * nhận thật bằng Canvas 2D API. **Lưu ý khác mockup gốc có chủ đích:**
 * `downloadCert()` (dòng 2207-2362) cho tải chứng nhận NGAY CẢ KHI CHƯA
 * hoàn thành (thanh tiến độ thay vì huy hiệu ✓) — bản build này CHỌN gate
 * chặt hơn (chỉ hiện/tải khi đã 100%) vì rõ ràng/trung thực hơn cho người
 * dùng, không phải bỏ sót.
 *
 * Đối chiếu lại nhánh ĐÃ HOÀN THÀNH với `downloadCert()` — trước đây file
 * này tự vẽ 1 bố cục KHÁC hẳn (nền/viền đơn giản hơn, brand vẽ 2 dòng,
 * tiêu đề lớn 46px ngay đầu, KHÔNG có avatar học viên, chữ ký chỉ có chữ
 * không có ảnh chân dung). Đã viết lại đúng theo mockup: canvas 1600×1130
 * → nền gradient chéo + 2 glow góc + vân chéo mảnh → 3 lớp viền bo góc
 * lồng nhau → brand 1 dòng → tiêu đề nhỏ có vạch 2 bên (không phải tiêu
 * đề lớn) → AVATAR học viên (chữ cái đầu, dự án chưa có hạ tầng lưu ảnh
 * đại diện — xem lý do đầy đủ ở `MnytShareCardModal.tsx`) → nhãn "Học
 * viên" → tên → vạch chia → câu trạng thái → tên lĩnh vực → huy hiệu
 * hoàn thành → chân trang: ngày cấp (trái) + chữ ký kèm ẢNH CHÂN DUNG THẬT
 * của Founder (phải, `/images/founder-portrait.jpg` — cùng ảnh đã dùng ở
 * `FounderSpotlight.tsx`/Premium "Người đồng hành", không phải ảnh bịa).
 */

import { useEffect, useRef, useState } from "react";
import { useMnytModalEscape } from "@/lib/mnyt/use-modal-escape";

type Props = {
  lang: "vi" | "en";
  categoryName: string;
  categoryNameEn: string;
  categoryColor: string;
  learnerName: string | null;
  totalTopics: number;
  doneCount: number;
  onClose: () => void;
};

const CERT_W = 1600;
const CERT_H = 1130;
const INSTRUCTOR_PORTRAIT_SRC = "/images/founder-portrait.jpg";
// Vùng cắt vuông quanh khuôn mặt trong `founder-portrait.jpg` (1254×1254px)
// — ảnh gốc là chân dung toàn thân, khuôn mặt nằm lệch trên-giữa, không
// cắt vuông đơn giản theo tâm ảnh được (sẽ lấy trúng phần vai/áo).
const PORTRAIT_CROP = { x: 310, y: 140, size: 560 };

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

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(null), 4000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });
}

export function MnytCertificateModal({ lang, categoryName, categoryNameEn, categoryColor, learnerName, totalTopics, doneCount, onClose }: Props) {
  const isVi = lang === "vi";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  const catName = isVi ? categoryName : categoryNameEn || categoryName;
  const completed = totalTopics > 0 && doneCount >= totalTopics;
  const remaining = Math.max(0, totalTopics - doneCount);
  const displayName = (learnerName || "").trim() || (isVi ? "Học viên" : "Learner");

  useMnytModalEscape(onClose);

  const t = {
    title: isVi ? "Chứng nhận hoàn thành" : "Certificate of completion",
    close: isVi ? "Đóng" : "Close",
    download: isVi ? "Tải chứng nhận" : "Download certificate",
    lockedTitle: isVi ? "Chưa đủ điều kiện" : "Not eligible yet",
    lockedBody: isVi
      ? `Hoàn thành thêm ${remaining} ý tưởng nữa trong lộ trình "${catName}" để nhận chứng nhận.`
      : `Complete ${remaining} more idea${remaining === 1 ? "" : "s"} in the "${catName}" path to earn your certificate.`,
    progress: `${doneCount}/${totalTopics}`,
  };

  useEffect(() => {
    if (!completed) return;
    let cancelled = false;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const instructorImg = await loadImage(INSTRUCTOR_PORTRAIT_SRC);
      if (cancelled) return;

      canvas.width = CERT_W;
      canvas.height = CERT_H;

      const bg = ctx.createLinearGradient(0, 0, CERT_W, CERT_H);
      bg.addColorStop(0, "#16141f");
      bg.addColorStop(0.55, "#0e0d16");
      bg.addColorStop(1, "#0b0b13");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CERT_W, CERT_H);
      for (const [px, py] of [
        [0.12, 0.1],
        [0.88, 0.9],
      ]) {
        const rg = ctx.createRadialGradient(CERT_W * px, CERT_H * py, 0, CERT_W * px, CERT_H * py, CERT_W * 0.42);
        rg.addColorStop(0, `${categoryColor}1f`);
        rg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, CERT_W, CERT_H);
      }
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.4;
      for (let x = -CERT_H; x < CERT_W; x += 26) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + CERT_H, CERT_H);
        ctx.stroke();
      }
      ctx.restore();

      ctx.strokeStyle = `${categoryColor}77`;
      ctx.lineWidth = 4;
      roundRectPath(ctx, 34, 34, CERT_W - 68, CERT_H - 68, 30);
      ctx.stroke();
      ctx.strokeStyle = `${categoryColor}33`;
      ctx.lineWidth = 2;
      roundRectPath(ctx, 56, 56, CERT_W - 112, CERT_H - 112, 20);
      ctx.stroke();
      ctx.strokeStyle = `${categoryColor}1c`;
      ctx.lineWidth = 1.5;
      roundRectPath(ctx, 70, 70, CERT_W - 140, CERT_H - 140, 14);
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      drawBrandMark(ctx, CERT_W / 2 - 90, 116, 44);
      ctx.fillStyle = "#8f8da3";
      ctx.font = '700 22px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.textAlign = "left";
      const brand = isVi ? "Mỗi ngày một ý tưởng AI" : "One AI idea a day";
      ctx.fillText(brand.toUpperCase(), CERT_W / 2 - 34, 128);
      ctx.textAlign = "center";

      let y = 208;
      const titleTxt = t.title.toUpperCase();
      ctx.fillStyle = categoryColor;
      ctx.font = '700 27px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.save();
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "6px";
      } catch {
        // letterSpacing chưa hỗ trợ ở trình duyệt này — bỏ qua, không chặn vẽ tiếp.
      }
      const tw = ctx.measureText(titleTxt).width;
      ctx.fillText(titleTxt, CERT_W / 2, y);
      ctx.restore();
      ctx.strokeStyle = `${categoryColor}77`;
      ctx.lineWidth = 1.5;
      for (const [x0, dir] of [
        [CERT_W / 2 - tw / 2 - 40, -1],
        [CERT_W / 2 + tw / 2 + 40, 1],
      ]) {
        ctx.beginPath();
        ctx.moveTo(x0, y + 16);
        ctx.lineTo(x0 + dir * 120, y + 16);
        ctx.stroke();
      }

      drawInitialsAvatar(ctx, CERT_W / 2, 350, 74, `${categoryColor}aa`, learnerInitials(learnerName));

      y = 452;
      ctx.fillStyle = "#8f8da3";
      ctx.font = '700 20px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText((isVi ? "Học viên" : "Learner").toUpperCase(), CERT_W / 2, y);
      y += 34;
      ctx.fillStyle = "#f5f3ff";
      ctx.font = '700 62px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(displayName, CERT_W / 2, y);

      y += 88;
      ctx.strokeStyle = `${categoryColor}66`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(CERT_W / 2 - 130, y);
      ctx.lineTo(CERT_W / 2 + 130, y);
      ctx.stroke();

      y += 34;
      ctx.fillStyle = "#a5a3b6";
      ctx.font = '400 27px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText(isVi ? "đã hoàn thành toàn bộ ý tưởng trong lĩnh vực" : "has completed every idea in", CERT_W / 2, y);

      y += 46;
      ctx.fillStyle = "#f5f3ff";
      ctx.font = '700 58px "Space Grotesk", system-ui, sans-serif';
      for (const line of wrapLines(ctx, catName, CERT_W - 420, 2)) {
        ctx.fillText(line, CERT_W / 2, y);
        y += 70;
      }

      y += 26;
      const label = `${doneCount}/${totalTopics} ${isVi ? "ý tưởng" : "ideas"}`;
      ctx.font = '700 26px "Be Vietnam Pro", system-ui, sans-serif';
      const lw = ctx.measureText(label).width + 74;
      ctx.fillStyle = `${categoryColor}22`;
      roundRectPath(ctx, CERT_W / 2 - lw / 2, y - 8, lw, 52, 26);
      ctx.fill();
      ctx.strokeStyle = `${categoryColor}66`;
      ctx.lineWidth = 1.5;
      roundRectPath(ctx, CERT_W / 2 - lw / 2, y - 8, lw, 52, 26);
      ctx.stroke();
      ctx.strokeStyle = categoryColor;
      ctx.lineWidth = 3.4;
      ctx.lineCap = "round";
      const kx = CERT_W / 2 - lw / 2 + 26;
      const ky = y + 18;
      ctx.beginPath();
      ctx.moveTo(kx, ky);
      ctx.lineTo(kx + 8, ky + 8);
      ctx.lineTo(kx + 22, ky - 8);
      ctx.stroke();
      ctx.fillStyle = categoryColor;
      ctx.textAlign = "left";
      ctx.fillText(label, kx + 36, y + 4);
      ctx.textAlign = "center";

      const footY = CERT_H - 168;
      ctx.strokeStyle = "rgba(231,229,240,0.12)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(140, footY - 26);
      ctx.lineTo(CERT_W - 140, footY - 26);
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#8f8da3";
      ctx.font = '700 18px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText((isVi ? "Ngày cấp" : "Issued on").toUpperCase(), 140, footY);
      ctx.fillStyle = "#dedcea";
      ctx.font = '400 24px "Be Vietnam Pro", system-ui, sans-serif';
      const today = new Date();
      const dateStr = today.toLocaleDateString(isVi ? "vi-VN" : "en-US", { year: "numeric", month: "long", day: "numeric" });
      ctx.fillText(dateStr, 140, footY + 30);

      if (instructorImg) {
        const r = 40;
        const cx = CERT_W - 180;
        const cy = footY + 24;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(instructorImg, PORTRAIT_CROP.x, PORTRAIT_CROP.y, PORTRAIT_CROP.size, PORTRAIT_CROP.size, cx - r, cy - r, r * 2, r * 2);
        ctx.restore();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `${categoryColor}88`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.textAlign = "right";
        ctx.fillStyle = "#dedcea";
        ctx.font = '700 24px "Space Grotesk", system-ui, sans-serif';
        ctx.fillText("Võ Đương", cx - r - 20, footY);
        ctx.fillStyle = "#8f8da3";
        ctx.font = '700 17px "Be Vietnam Pro", system-ui, sans-serif';
        ctx.fillText((isVi ? "Nhà sáng lập VO DUONG AI" : "Founder, VO DUONG AI").toUpperCase(), cx - r - 20, footY + 32);
      }

      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [completed, categoryColor, catName, learnerName, displayName, totalTopics, doneCount, isVi, t.title]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `vdai-chung-nhan-${categoryName.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  };

  return (
    <div className="mnyt-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="mnyt-cert-card" onClick={(e) => e.stopPropagation()}>
        <div className="mnyt-cert-head">
          <div className="mnyt-cert-title">{t.title}</div>
          <button type="button" className="mnyt-cert-close-btn" onClick={onClose} aria-label={t.close}>
            ✕
          </button>
        </div>

        {completed ? (
          <>
            <div className="mnyt-cert-canvas-wrap">
              <canvas ref={canvasRef} className="mnyt-cert-canvas" aria-label={catName} />
            </div>
            <button type="button" className="mnyt-cert-download-btn" style={{ ["--cert-accent" as string]: categoryColor }} onClick={handleDownload} disabled={!ready}>
              {t.download}
            </button>
          </>
        ) : (
          <div className="mnyt-cert-locked">
            <div className="mnyt-cert-locked-icon" style={{ borderColor: categoryColor, color: categoryColor }}>
              🔒
            </div>
            <div className="mnyt-cert-locked-title">{t.lockedTitle}</div>
            <p className="mnyt-cert-locked-body">{t.lockedBody}</p>
            <div className="mnyt-cert-locked-track">
              <div
                className="mnyt-cert-locked-fill"
                style={{ width: `${totalTopics ? Math.round((doneCount / totalTopics) * 100) : 0}%`, background: categoryColor }}
              />
            </div>
            <div className="mnyt-cert-locked-progress">{t.progress}</div>
          </div>
        )}
      </div>
    </div>
  );
}
