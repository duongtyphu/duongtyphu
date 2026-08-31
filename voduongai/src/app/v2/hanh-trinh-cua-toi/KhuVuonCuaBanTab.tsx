"use client";

/* =============================================================================
 * KhuVuonCuaBanTab — tab "Khu vườn của bạn" bên trong `/v2/hanh-trinh-cua-toi`.
 *
 * GIAI ĐOẠN 10 (Founder yêu cầu thiết kế lại hoàn toàn — cây phải thật hơn
 * "có lá có hoa có quả", thêm chi tiết trừu tượng) — bỏ hẳn card trắng bọc
 * quanh cảnh vườn của bản cũ, toàn trang giờ LÀ khí quyển vườn đêm liên
 * tục (dãy núi xa, dải aurora trừu tượng, lá rơi, sương trôi). Mỗi cây vẽ
 * bằng SVG nhiều lớp tán lá + hoa (chấm hồng) + quả (elip đỏ) ở tier cao
 * nhất, thay hẳn khối tròn gradient đơn giản trước đây.
 *
 * Gộp thêm 2 khối thật chuyển từ tab "Hành trình của tôi" (đúng đề xuất
 * gộp nội dung đã duyệt — tránh trùng lặp giữa 2 tab): "Tiếp tục học"
 * (CTA tự nhiên đi cùng chỗ hiện tiến độ, dùng `journey.currentStageIndex`)
 * và "Thành tựu của tôi" (`journey.badges` thật) — thay 2 khối
 * "Nhiệm vụ hằng ngày"/"Vật phẩm của bạn" vốn luôn là empty-hint giả vì
 * tính năng chưa xây, biến 2 chỗ trống giả thành 1 chỗ có dữ liệu thật.
 * ========================================================================== */

import { useRouter } from "next/navigation";

import type { JourneyOverview } from "@/lib/portal/live-journey-overview";

import "./khu-vuon-cua-ban-tab.css";

/** Founder yêu cầu (đợt sau): "nhiều sao hơn, nhiều aurora, nhiều sương
 * hơn, nhiều đom đóm hơn" — tăng mật độ toàn bộ khí quyển vườn đêm, không
 * đổi kỹ thuật/animation gốc, chỉ tăng SỐ LƯỢNG phần tử. Sao tăng từ 6 lên
 * 18 (thêm `size` để có sao lớn/nhỏ khác nhau, tạo chiều sâu), trải rộng
 * top 2–34% (vẫn nằm trên dãy đồi, không lấn xuống vùng cây). */
const GN_STARS = [
  { left: "4%", top: "4%", size: 2, delay: "0s" },
  { left: "10%", top: "18%", size: 1.5, delay: "1.8s" },
  { left: "16%", top: "7%", size: 2.5, delay: "3.2s" },
  { left: "22%", top: "3%", size: 2, delay: "1.4s" },
  { left: "28%", top: "22%", size: 1.5, delay: "2.4s" },
  { left: "34%", top: "10%", size: 2, delay: ".6s" },
  { left: "40%", top: "26%", size: 1.5, delay: "3.8s" },
  { left: "46%", top: "5%", size: 2.5, delay: "1.1s" },
  { left: "52%", top: "16%", size: 2, delay: "2.9s" },
  { left: "58%", top: "8%", size: 1.5, delay: ".9s" },
  { left: "60%", top: "28%", size: 2, delay: "3.4s" },
  { left: "66%", top: "4%", size: 2.5, delay: "1.7s" },
  { left: "72%", top: "20%", size: 1.5, delay: "2.6s" },
  { left: "78%", top: "10%", size: 2, delay: "4.1s" },
  { left: "82%", top: "4%", size: 2, delay: "2.1s" },
  { left: "86%", top: "24%", size: 1.5, delay: "1.3s" },
  { left: "90%", top: "12%", size: 2.5, delay: "3.6s" },
  { left: "94%", top: "6%", size: 2, delay: "2.2s" },
] as const;

/** Đom đóm tăng từ 4 lên 9, trải rộng cả chiều ngang lẫn chiều cao khu
 * vườn (thay vì chỉ tập trung giữa trang). */
const GN_FIREFLIES = [
  { left: "10%", bottom: "20%", color: "#FDE68A", delay: "0s" },
  { left: "26%", bottom: "25%", color: "#FDE68A", delay: "1.4s" },
  { left: "18%", bottom: "38%", color: "#86EFAC", delay: "3.6s" },
  { left: "38%", bottom: "18%", color: "#BEF264", delay: "2.5s" },
  { left: "52%", bottom: "42%", color: "#BEF264", delay: "2.1s" },
  { left: "46%", bottom: "30%", color: "#FBCFE8", delay: "5s" },
  { left: "62%", bottom: "22%", color: "#86EFAC", delay: "4.2s" },
  { left: "68%", bottom: "52%", color: "#FBCFE8", delay: "1.2s" },
  { left: "80%", bottom: "34%", color: "#FDE68A", delay: "3s" },
] as const;

const GN_LEAVES = [
  { left: "20%", top: "8%", color: "#4ADE80", size: 12, delay: "0s" },
  { left: "48%", top: "3%", color: "#FDE68A", size: 10, delay: "4s" },
  { left: "75%", top: "6%", color: "#86EFAC", size: 11, delay: "8s" },
] as const;

type GardenTier = "seed" | "sapling" | "growing" | "bloom";

function tierOf(percent: number): GardenTier {
  if (percent <= 0) return "seed";
  if (percent < 50) return "sapling";
  if (percent < 100) return "growing";
  return "bloom";
}

/** Chiều cao khu vực lối đi + cây — đủ cho cây "bloom" cao nhất (~180px)
 * cộng biên độ lệch dọc lớn nhất, tránh bị cắt. */
const SCENE_HEIGHT = 460;

/** Vị trí (%, px) + đường nối uốn lượn cho N cây trên "lối đi" — chia đều
 * theo chiều ngang, lệch dọc xen kẽ để tạo cảm giác con đường thật, không
 * cần khớp cứng với số chương cố định (khác Bản đồ hành trình luôn có
 * đúng 5). Toạ độ path dùng chung hệ 0–1000 với % ngang để luôn thẳng hàng
 * dù khung co giãn theo chiều rộng thật. */
function buildGardenPath(n: number) {
  const baseY = 140;
  const amp = 90;
  const points = Array.from({ length: n }, (_, i) => {
    const leftPct = ((i + 1) / (n + 1)) * 100;
    const bottomPx = baseY + (i % 2 === 0 ? -amp * 0.7 : amp);
    return { leftPct, bottomPx, svgY: SCENE_HEIGHT - bottomPx };
  });
  if (points.length < 2) return { points, d: "" };
  let d = `M ${points[0].leftPct * 10} ${points[0].svgY}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const midX = (prev.leftPct * 10 + cur.leftPct * 10) / 2;
    d += ` Q ${midX} ${prev.svgY} ${midX} ${(prev.svgY + cur.svgY) / 2} Q ${midX} ${cur.svgY} ${cur.leftPct * 10} ${cur.svgY}`;
  }
  return { points, d };
}

/** Cây SVG thật — nhiều lớp tán lá xếp chồng (không phải 1 khối tròn),
 * "bloom" (100%) có thêm hoa (chấm hồng) + quả (elip đỏ), "growing" (50–99%)
 * có hoa chưa có quả, "sapling" (<50%) chỉ có tán lá. */
function TreeSVG({ tier }: { tier: Exclude<GardenTier, "seed"> }) {
  if (tier === "bloom") {
    return (
      <svg width="150" height="180" viewBox="0 0 150 180">
        {/* Thân + rễ toả — thân thật có độ cong tự nhiên, rễ bè ra ở gốc */}
        <path d="M75 180 Q68 172 70 160 Q60 172 50 176" stroke="#4A2E18" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M75 180 Q82 172 80 160 Q90 172 100 176" stroke="#4A2E18" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M75 180 C73 156 78 132 74 108 C72 98 76 90 75 82" stroke="#5A3A22" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M74 130 Q54 118 46 96" stroke="#5A3A22" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M76 118 Q98 104 104 84" stroke="#5A3A22" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M74 96 Q60 84 55 68" stroke="#4A2E18" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Tán lá — nhiều thuỳ chồng lớp tạo khối tròn tự nhiên, không phải 1 khối tròn đơn */}
        <g>
          <circle cx="75" cy="70" r="42" fill="#14532D" />
          <circle cx="42" cy="86" r="26" fill="#166534" />
          <circle cx="108" cy="86" r="26" fill="#166534" />
          <circle cx="75" cy="40" r="34" fill="#15803D" />
          <circle cx="46" cy="58" r="26" fill="#16A34A" />
          <circle cx="104" cy="58" r="26" fill="#16A34A" />
          <circle cx="75" cy="26" r="26" fill="#22C55E" />
          <circle cx="52" cy="40" r="18" fill="#4ADE80" opacity=".9" />
          <circle cx="98" cy="42" r="17" fill="#4ADE80" opacity=".85" />
          <circle cx="75" cy="16" r="16" fill="#86EFAC" opacity=".8" />
        </g>
        {/* Vài chiếc lá đơn lẻ nổi rõ trên viền tán — tăng cảm giác "lá thật".
            Founder yêu cầu thêm "nhiều lá hơn" — tăng từ 5 lên 8. */}
        <g fill="#22C55E" stroke="#14532D" strokeWidth=".6">
          <ellipse cx="30" cy="70" rx="6" ry="3.4" transform="rotate(-30 30 70)" />
          <ellipse cx="120" cy="72" rx="6" ry="3.4" transform="rotate(30 120 72)" />
          <ellipse cx="75" cy="8" rx="6" ry="3.4" transform="rotate(4 75 8)" />
          <ellipse cx="40" cy="30" rx="5.5" ry="3" transform="rotate(-50 40 30)" />
          <ellipse cx="110" cy="32" rx="5.5" ry="3" transform="rotate(50 110 32)" />
          <ellipse cx="18" cy="50" rx="5" ry="2.8" transform="rotate(-60 18 50)" />
          <ellipse cx="132" cy="52" rx="5" ry="2.8" transform="rotate(60 132 52)" />
          <ellipse cx="60" cy="4" rx="5" ry="2.8" transform="rotate(-8 60 4)" />
        </g>
        {/* Hoa — cụm 5 cánh nhỏ quanh nhuỵ vàng, không chỉ chấm tròn đơn sắc.
            Founder yêu cầu thêm "nhiều hoa hơn" — tăng từ 8 lên 11. */}
        {[
          [40, 52], [102, 42], [66, 14], [112, 66], [30, 80], [88, 20], [56, 96], [96, 92],
          [20, 60], [118, 50], [75, 4],
        ].map(([fx, fy], i) => (
          <g key={i} transform={`translate(${fx} ${fy})`}>
            <circle cx="-3.6" cy="0" r="3" fill="#FBCFE8" />
            <circle cx="3.6" cy="0" r="3" fill="#FBCFE8" />
            <circle cx="0" cy="-3.6" r="3" fill="#F9A8D4" />
            <circle cx="0" cy="3.6" r="3" fill="#F9A8D4" />
            <circle cx="0" cy="0" r="2.2" fill="#FDE047" />
          </g>
        ))}
        {/* Quả — elip đỏ có điểm sáng nhỏ tạo khối căng mọng — tăng từ 5 lên 7. */}
        <g>
          {[
            [56, 100], [90, 102], [72, 110], [104, 92], [44, 96], [66, 84], [36, 110],
          ].map(([fx, fy], i) => (
            <g key={i} transform={`translate(${fx} ${fy})`}>
              <ellipse cx="0" cy="0" rx="6" ry="7" fill="#DC2626" />
              <ellipse cx="-1.6" cy="-2" rx="1.8" ry="2.2" fill="#F87171" opacity=".8" />
              <path d="M0 -7 Q1 -9.5 3 -9" stroke="#166534" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </g>
          ))}
        </g>
      </svg>
    );
  }
  if (tier === "growing") {
    return (
      <svg width="110" height="140" viewBox="0 0 110 140">
        <path d="M55 140 C53 118 57 96 54 78 C53 70 56 64 55 56" stroke="#5A3A22" strokeWidth="6.5" fill="none" strokeLinecap="round" />
        <path d="M54 96 Q40 86 35 70" stroke="#5A3A22" strokeWidth="3.6" fill="none" strokeLinecap="round" />
        <path d="M56 88 Q72 78 76 64" stroke="#5A3A22" strokeWidth="3.6" fill="none" strokeLinecap="round" />
        <circle cx="55" cy="52" r="30" fill="#4D7C0F" />
        <circle cx="34" cy="66" r="19" fill="#65A30D" />
        <circle cx="76" cy="66" r="19" fill="#65A30D" />
        <circle cx="55" cy="28" r="23" fill="#84CC16" />
        <circle cx="38" cy="42" r="15" fill="#A3E635" opacity=".85" />
        <circle cx="72" cy="42" r="14" fill="#A3E635" opacity=".8" />
        {/* "Phát triển theo từng giai đoạn": tier "growing" nhiều lá/nụ hoa
            hơn tier "sapling" nhưng vẫn ít hơn "bloom" — tăng lá từ 2 lên 5,
            nụ hoa (chấm nhạt, chưa nở hẳn như bloom) từ 5 lên 8. */}
        <g fill="#84CC16" stroke="#4D7C0F" strokeWidth=".5">
          <ellipse cx="22" cy="58" rx="5" ry="2.8" transform="rotate(-30 22 58)" />
          <ellipse cx="88" cy="60" rx="5" ry="2.8" transform="rotate(30 88 60)" />
          <ellipse cx="20" cy="54" rx="4.6" ry="2.6" transform="rotate(-40 20 54)" />
          <ellipse cx="90" cy="58" rx="4.6" ry="2.6" transform="rotate(40 90 58)" />
          <ellipse cx="55" cy="8" rx="4.6" ry="2.6" transform="rotate(-6 55 8)" />
        </g>
        <g fill="#FEF3C7">
          <circle cx="30" cy="48" r="3.4" /><circle cx="78" cy="42" r="3.4" /><circle cx="55" cy="12" r="3.4" />
          <circle cx="64" cy="66" r="3" /><circle cx="42" cy="70" r="3" />
          <circle cx="20" cy="40" r="2.8" /><circle cx="90" cy="44" r="2.8" /><circle cx="55" cy="30" r="3" />
        </g>
      </svg>
    );
  }
  return (
    <svg width="70" height="90" viewBox="0 0 70 90">
      <path d="M35 90 C34 76 36 64 35 54 C34 48 36 44 35 38" stroke="#5A3A22" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M35 64 Q26 58 24 48" stroke="#5A3A22" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M35 58 Q44 52 46 44" stroke="#5A3A22" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="36" r="18" fill="#854D0E" />
      <circle cx="22" cy="44" r="11" fill="#A16207" />
      <circle cx="48" cy="44" r="11" fill="#A16207" />
      <circle cx="35" cy="20" r="14" fill="#CA8A04" />
      <circle cx="35" cy="34" r="9" fill="#EAB308" opacity=".8" />
      {/* "Phát triển theo từng giai đoạn": tier "sapling" — cây non, tán lá
          còn ít, CHƯA có hoa/quả (chỉ xuất hiện từ "growing" trở lên).
          Founder yêu cầu thêm "nhiều lá hơn" — tăng từ 2 lên 5. */}
      <g fill="#CA8A04" stroke="#854D0E" strokeWidth=".4">
        <ellipse cx="16" cy="38" rx="3.6" ry="2" transform="rotate(-30 16 38)" />
        <ellipse cx="54" cy="40" rx="3.6" ry="2" transform="rotate(30 54 40)" />
        <ellipse cx="35" cy="6" rx="3.4" ry="1.9" transform="rotate(-4 35 6)" />
        <ellipse cx="10" cy="28" rx="3.2" ry="1.8" transform="rotate(-55 10 28)" />
        <ellipse cx="60" cy="30" rx="3.2" ry="1.8" transform="rotate(55 60 30)" />
      </g>
    </svg>
  );
}

/** Founder yêu cầu: giai đoạn "Chưa bắt đầu" (0%) cũng phải là hình cây
    thật (mầm cây nhú lên từ đất, có 2 lá non) thay vì vòng tròn nét đứt
    trừu tượng cũ — vẫn trung thực đúng trạng thái "chưa học" (không vẽ
    thân/tán như các tier cao hơn), chỉ đổi từ ký hiệu trừu tượng sang
    hình ảnh cây/mầm thật. */
function SproutSVG() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" style={{ margin: "0 auto" }}>
      <ellipse cx="17" cy="30" rx="12" ry="3" fill="#3F2A16" opacity=".7" />
      <path d="M17 30 L17 20" stroke="#4D7C0F" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M17 24 Q10 21 8 15" stroke="#4D7C0F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M17 21 Q24 18 26 12" stroke="#4D7C0F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <ellipse cx="8" cy="14" rx="6" ry="4" fill="#84CC16" transform="rotate(-25 8 14)" />
      <ellipse cx="26" cy="11" rx="5.5" ry="3.6" fill="#65A30D" transform="rotate(20 26 11)" />
    </svg>
  );
}

export function KhuVuonCuaBanTab({ journey }: { journey: JourneyOverview }) {
  const router = useRouter();
  const { stages, currentStageIndex, badges } = journey;
  const { points: gardenPoints, d: gardenPathD } = buildGardenPath(stages.length);
  const currentStage = currentStageIndex != null ? stages[currentStageIndex] : null;

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      {/* Founder yêu cầu (đợt sau, sau khi thấy ảnh chụp còn seam): KHÔNG
          "đắp" màu riêng lên khung giữa nữa — phải dùng CHUNG đúng 1 nguồn
          màu nền của cả trang. Base đổi từ literal `#0D2C50` (trùng nhưng
          ĐỘC LẬP với `TAB_HEADER_BG` ở component cha) sang `var(--bg)` —
          biến CSS đã được `.htct` (component cha) override đúng theo tab
          đang mở, kế thừa tự nhiên xuống tới đây. Chỉ còn ĐÚNG 1 nơi định
          nghĩa màu (`TAB_HEADER_BG`), loại bỏ nguy cơ 2 nguồn lệch nhau.
          ĐÃ BỎ HẲN "chiều sâu, độ bóng" (2 lớp radial "ánh sáng gần đầu
          trang") — Founder yêu cầu áp dụng cho cả 5 tab: chỉ giữ lại đúng
          màu nền gốc `var(--bg)`. Toàn bộ nội dung "vườn đêm cổ tích" bên
          dưới (sao/trăng/aurora/đồi/sương/đom đóm/cây) GIỮ NGUYÊN 100% —
          không thuộc lớp "chiều sâu" đang bỏ, đây là chủ đề thị giác gốc
          của tab này (Giai đoạn 9). */}
      <div className="absolute inset-0 z-0" style={{ background: "var(--bg)" }} aria-hidden />

      {/* Dải aurora trừu tượng vắt ngang trời — Founder yêu cầu "nhiều
          aurora hơn": thêm dải thứ 2 (góc/màu khác, lệch xuống thấp hơn)
          + 1 điểm glow phụ ở radial layer, cạnh 2 lớp gốc. */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -80, left: -100, right: -100, height: 420, opacity: 0.35,
          background: "linear-gradient(100deg, transparent 10%, rgba(74,222,128,.18) 30%, rgba(34,211,238,.14) 45%, rgba(139,124,246,.16) 62%, transparent 80%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: -20, left: -120, right: -120, height: 360, opacity: 0.28,
          background: "linear-gradient(70deg, transparent 15%, rgba(167,139,250,.16) 35%, rgba(56,189,248,.14) 55%, transparent 78%)",
          filter: "blur(50px)",
        }}
        aria-hidden
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: 0, right: 0, height: 680,
          background: "radial-gradient(ellipse 75% 45% at 50% 95%, rgba(74,222,128,.12), transparent 70%), radial-gradient(ellipse 50% 30% at 78% 10%, rgba(139,124,246,.10), transparent 70%), radial-gradient(ellipse 40% 25% at 15% 20%, rgba(74,222,128,.10), transparent 70%)",
        }}
        aria-hidden
      />

      {/* dãy đồi xa 2 lớp */}
      <svg width="1440" height="200" viewBox="0 0 1440 200" style={{ position: "absolute", bottom: 280, left: 0, opacity: 0.5, width: "100%" }} preserveAspectRatio="none">
        <path d="M0 140 Q 200 80 420 120 T 860 100 T 1300 130 L1440 110 V200 H0Z" fill="#0F2A22" />
      </svg>
      <svg width="1440" height="160" viewBox="0 0 1440 160" style={{ position: "absolute", bottom: 260, left: 0, opacity: 0.7, width: "100%" }} preserveAspectRatio="none">
        <path d="M0 110 Q 260 60 540 100 T 1000 80 T 1440 100 V160 H0Z" fill="#0A1D18" />
      </svg>

      {/* Sương trôi — Founder yêu cầu "nhiều sương hơn": tăng từ 2 lên 4 dải. */}
      <div className="gd-mistband" style={{ left: "5%", bottom: 250, width: 340, height: 36, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.05), transparent 70%)", filter: "blur(6px)" }} />
      <div className="gd-mistband" style={{ left: "55%", bottom: 300, width: 280, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.04), transparent 70%)", filter: "blur(6px)", animationDelay: "6s" }} />
      <div className="gd-mistband" style={{ left: "30%", bottom: 230, width: 260, height: 26, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.045), transparent 70%)", filter: "blur(6px)", animationDelay: "3s" }} />
      <div className="gd-mistband" style={{ left: "78%", bottom: 270, width: 220, height: 24, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.04), transparent 70%)", filter: "blur(6px)", animationDelay: "9s" }} />

      {GN_STARS.map((star, i) => (
        <div key={i} className="gd-star" style={{ width: star.size, height: star.size, left: star.left, top: star.top, animationDelay: star.delay }} />
      ))}
      <div
        aria-hidden
        style={{ position: "absolute", right: "9%", top: "5%", width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle,#F6F0D8 0%,rgba(246,240,216,.5) 55%,transparent 75%)", boxShadow: "0 0 40px rgba(246,240,216,.35)" }}
      />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
        {/* Founder yêu cầu: bỏ dòng "Hành trình của tôi" (eyebrow), giữ lại
            h1 + subtitle — chuyển sang góc trái trên cùng, subtitle viết lại
            tinh tế/chuyên nghiệp hơn (thay câu liệt kê cơ chế cũ). */}
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Khu vườn của bạn</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.6, margin: 0 }}>
            Mỗi cây là một giai đoạn học tập — lớn lên, đơm hoa kết trái theo từng bước tiến của bạn.
          </p>
        </div>

        {/* Lối đi + cây — full-bleed, không giới hạn maxWidth 900 như phần chữ */}
        <div style={{ position: "relative", height: SCENE_HEIGHT, marginTop: 8 }}>
          {GN_LEAVES.map((leaf, i) => (
            <svg key={i} className="gd-leaf" width={leaf.size} height={leaf.size} viewBox="0 0 12 12" style={{ left: leaf.left, top: leaf.top, animationDelay: leaf.delay }}>
              <path d="M6 0C9 3 12 6 6 12C0 6 3 3 6 0Z" fill={leaf.color} opacity=".6" />
            </svg>
          ))}

          {stages.length === 0 ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.5)", fontSize: 13, fontStyle: "italic" }}>
              Chưa có giai đoạn học tập nào — bắt đầu học tại Học viện AI.
            </div>
          ) : (
            <>
              {gardenPathD && (
                <svg viewBox={`0 0 1000 ${SCENE_HEIGHT}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                  <path d={gardenPathD} stroke="rgba(190,242,210,.25)" strokeWidth="2.5" strokeDasharray="1 12" strokeLinecap="round" fill="none" />
                </svg>
              )}
              {GN_FIREFLIES.map((f, i) => (
                <div
                  key={i}
                  className="gd-firefly"
                  style={{ width: 4, height: 4, left: f.left, bottom: f.bottom, background: f.color, boxShadow: `0 0 9px ${f.color}`, animationDelay: f.delay }}
                />
              ))}
              {stages.map((s, i) => {
                const point = gardenPoints[i];
                const tier = tierOf(s.percent);
                return (
                  <div className="gd-tree" key={s.slug} style={{ position: "absolute", left: `${point.leftPct}%`, bottom: point.bottomPx, textAlign: "center", transform: "translateX(-50%)" }}>
                    {tier === "seed" ? (
                      <SproutSVG />
                    ) : (
                      <TreeSVG tier={tier} />
                    )}
                    <div style={{ marginTop: 2, fontSize: 11, fontWeight: 700, color: "#fff" }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: tier === "seed" ? "rgba(255,255,255,.4)" : "rgba(74,222,128,.85)" }}>
                      {tier === "seed" ? "Chưa bắt đầu" : `${s.percent}% · ${s.lessonCount} bài`}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Founder yêu cầu: 3 khối (Tiếp tục học/Thành tựu/Câu triết lý) xếp
            thành 1 hàng ngang, gọn gàng — thay vì xếp chồng dọc như trước. */}
        <div className="kvcb-row" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Tiếp tục học — chuyển từ tab Hành trình của tôi, gắn liền chỗ hiện tiến độ */}
          {currentStage && (
            <div
              className="kvcb-col"
              style={{
                background: "linear-gradient(135deg,rgba(74,222,128,.08),rgba(255,255,255,.02))",
                border: "1px solid rgba(74,222,128,.28)",
                borderRadius: 16,
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 10, background: "rgba(74,222,128,.16)", border: "1px solid rgba(74,222,128,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7EE8A6" strokeWidth="2">
                    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                  </svg>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#7EE8A6" }}>
                  Giai đoạn {(currentStageIndex ?? 0) + 1}: {currentStage.title}
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.6)", lineHeight: 1.5, flex: 1 }}>{currentStage.description}</div>
              <button
                type="button"
                onClick={() => router.push("/v2/hoc-vien-ai")}
                className="gd-cta-btn"
                style={{
                  background: "linear-gradient(135deg,#4ADE80,#16A34A)",
                  color: "#06210F",
                  border: "none",
                  padding: "11px 18px",
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 12.5,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 8px 20px -6px rgba(74,222,128,.5)",
                  alignSelf: "flex-start",
                }}
              >
                Tiếp tục học →
              </button>
            </div>
          )}

          {/* Thành tựu của tôi — badges thật, thay 2 ô "Nhiệm vụ hằng ngày"/"Vật phẩm" giả cũ */}
          <div className="kvcb-col">
            <h3 style={{ color: "#fff", fontSize: 13.5, fontWeight: 800, margin: 0 }}>Thành tựu của tôi</h3>
            {badges.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,.03)", border: "1px dashed rgba(255,255,255,.18)", borderRadius: 12, padding: "16px", display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="8" r="5" />
                  <path d="M8.5 13l-2 7 5.5-3 5.5 3-2-7" />
                </svg>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontStyle: "italic" }}>Chưa có huy hiệu nào.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(84px,1fr))", gap: 8 }}>
                {badges.map((b) => (
                  <div key={b.id} title={b.name} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(74,222,128,.16)", borderRadius: 12, padding: 10, textAlign: "center" }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        margin: "0 auto 6px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 30%,#86EFAC,#16A34A 70%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 12px rgba(74,222,128,.35)",
                      }}
                    >
                      {b.icon ? (
                        <span style={{ fontSize: 14 }}>{b.icon}</span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                        </svg>
                      )}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{b.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Câu triết lý — nội dung riêng của trang này, giữ nguyên */}
          <div
            className="kvcb-col"
            style={{ background: "linear-gradient(150deg,rgba(74,222,128,.08),rgba(255,255,255,.02))", border: "1px solid rgba(74,222,128,.16)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#4ADE80" style={{ opacity: 0.7 }}>
              <path d="M7 7c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5zm10 0c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5z" />
            </svg>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,.75)", lineHeight: 1.55, margin: 0, flex: 1 }}>
              Bạn không cần tuyệt vời ngay hôm nay. Chỉ cần tốt hơn ngày hôm qua một chút. Và khu vườn của bạn sẽ nở hoa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
