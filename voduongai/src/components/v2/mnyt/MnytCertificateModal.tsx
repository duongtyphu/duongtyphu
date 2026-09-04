"use client";

/**
 * Modal "Nhận chứng nhận" (6/6 modal Giai đoạn 6, modal cuối cùng) — mở từ
 * nút cùng tên ở View Lộ trình (`MnytPathClient.tsx`, trước đó `onClick`
 * no-op). GẮN VỚI TRẠNG THÁI HOÀN THÀNH THẬT của lĩnh vực đang chọn —
 * `doneCount < totalTopics` chỉ hiện màn hình "chưa đủ điều kiện" trung
 * thực (còn thiếu bao nhiêu ý tưởng), KHÔNG có canvas/nút tải nào cả —
 * chỉ khi `doneCount >= totalTopics` (đã học hết toàn bộ ý tưởng trong lộ
 * trình lĩnh vực đó) mới vẽ chứng nhận thật bằng Canvas 2D API (cùng kỹ
 * thuật `MnytShareCardModal.tsx`, không thư viện mới).
 *
 * Tên học viên lấy từ `prefs.learnerName` (đã có sẵn field thật, người
 * dùng có thể chưa từng điền) — rỗng thì dùng nhãn chung "Học viên VDAI
 * Academy" (trung thực, không suy đoán tên thật). Chữ ký "Võ Đương — Nhà
 * sáng lập VO DUONG AI" là hồ sơ Founder THẬT đã xác nhận ở nơi khác trong
 * dự án (`/portal/su-menh-companion`'s hồ sơ Founder), không phải bịa.
 */

import { useEffect, useRef, useState } from "react";

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
const CERT_H = 1120;

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

function fitFontSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, weight: number, startSize: number, minSize: number): number {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

export function MnytCertificateModal({ lang, categoryName, categoryNameEn, categoryColor, learnerName, totalTopics, doneCount, onClose }: Props) {
  const isVi = lang === "vi";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  const catName = isVi ? categoryName : categoryNameEn || categoryName;
  const completed = totalTopics > 0 && doneCount >= totalTopics;
  const remaining = Math.max(0, totalTopics - doneCount);

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CERT_W;
    canvas.height = CERT_H;

    ctx.fillStyle = "#0a0b12";
    ctx.fillRect(0, 0, CERT_W, CERT_H);
    const glow = ctx.createRadialGradient(CERT_W / 2, CERT_H / 2, 0, CERT_W / 2, CERT_H / 2, CERT_W * 0.7);
    glow.addColorStop(0, `${categoryColor}26`);
    glow.addColorStop(1, "rgba(10,11,18,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, CERT_W, CERT_H);

    ctx.strokeStyle = `${categoryColor}88`;
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, CERT_W - 96, CERT_H - 96);
    ctx.strokeStyle = "rgba(231,229,240,0.18)";
    ctx.lineWidth = 1;
    ctx.strokeRect(64, 64, CERT_W - 128, CERT_H - 128);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    drawLogoMark(ctx, CERT_W / 2 - 90, 128, 1.8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 24px system-ui, sans-serif";
    ctx.fillText("VDAI ACADEMY", CERT_W / 2 + 18, 156);
    ctx.fillStyle = "rgba(231,229,240,0.5)";
    ctx.font = "600 14px system-ui, sans-serif";
    ctx.fillText(isVi ? "MỖI NGÀY MỘT Ý TƯỞNG" : "ONE AI IDEA A DAY", CERT_W / 2 + 18, 176);

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 46px system-ui, sans-serif";
    ctx.fillText(isVi ? "CHỨNG NHẬN HOÀN THÀNH" : "CERTIFICATE OF COMPLETION", CERT_W / 2, 268);

    ctx.fillStyle = "rgba(231,229,240,0.6)";
    ctx.font = "500 20px system-ui, sans-serif";
    ctx.fillText(isVi ? "được trao cho" : "presented to", CERT_W / 2, 330);

    const nameText = learnerName?.trim() || (isVi ? "Học viên VDAI Academy" : "VDAI Academy learner");
    const nameSize = fitFontSize(ctx, nameText, CERT_W - 260, 700, 64, 34);
    ctx.font = `italic 700 ${nameSize}px system-ui, sans-serif`;
    ctx.fillStyle = categoryColor;
    ctx.fillText(nameText, CERT_W / 2, 410);

    ctx.strokeStyle = `${categoryColor}55`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(CERT_W / 2 - 160, 430);
    ctx.lineTo(CERT_W / 2 + 160, 430);
    ctx.stroke();

    ctx.fillStyle = "rgba(231,229,240,0.75)";
    ctx.font = "500 21px system-ui, sans-serif";
    ctx.fillText(isVi ? "đã hoàn thành xuất sắc lộ trình" : "has successfully completed the path", CERT_W / 2, 486);

    const catSize = fitFontSize(ctx, catName, CERT_W - 260, 800, 42, 26);
    ctx.font = `800 ${catSize}px system-ui, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(catName, CERT_W / 2, 546);

    ctx.fillStyle = "rgba(231,229,240,0.6)";
    ctx.font = "500 19px system-ui, sans-serif";
    ctx.fillText(
      isVi ? `Gồm ${totalTopics} ý tưởng AI thực chiến` : `${totalTopics} real-world AI ideas completed`,
      CERT_W / 2,
      590,
    );

    ctx.strokeStyle = "rgba(231,229,240,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(140, CERT_H - 190);
    ctx.lineTo(CERT_W - 140, CERT_H - 190);
    ctx.stroke();

    const today = new Date();
    const dateStr = today.toLocaleDateString(isVi ? "vi-VN" : "en-US", { year: "numeric", month: "long", day: "numeric" });

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(231,229,240,0.5)";
    ctx.font = "600 16px system-ui, sans-serif";
    ctx.fillText(isVi ? "NGÀY HOÀN THÀNH" : "COMPLETION DATE", 140, CERT_H - 138);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 22px system-ui, sans-serif";
    ctx.fillText(dateStr, 140, CERT_H - 108);

    ctx.textAlign = "right";
    ctx.strokeStyle = "rgba(231,229,240,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CERT_W - 140, CERT_H - 150);
    ctx.lineTo(CERT_W - 400, CERT_H - 150);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.fillText("Võ Đương", CERT_W - 140, CERT_H - 122);
    ctx.fillStyle = "rgba(231,229,240,0.5)";
    ctx.font = "500 15px system-ui, sans-serif";
    ctx.fillText(isVi ? "Nhà sáng lập VO DUONG AI" : "Founder, VO DUONG AI", CERT_W - 140, CERT_H - 100);
    ctx.textAlign = "left";

    setReady(true);
  }, [completed, categoryColor, catName, learnerName, totalTopics, isVi]);

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
