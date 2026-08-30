"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import type { AffiliateOverview, AffiliateLeaderboardEntry, AffiliateTierRule } from "@/lib/portal/live-affiliate";

import { RequestPayoutButtonV2 } from "./RequestPayoutButtonV2";
import "./affiliate.css";

/**
 * `/v2/affiliate` — 1:1 với `Chuong trinh Affilate.html` (Bước F).
 *
 * ĐÚNG những chỗ khác bản tĩnh:
 *
 * 1. `stat-row` (4 số) — cả 4 real: hoa hồng đã nhận (`commissionTotal`),
 *    người đã giới thiệu (`signups`), lượt click (`visits` — "—" nếu bảng
 *    theo dõi chưa bật), tỷ lệ chuyển đổi (tự tính `customers/visits`,
 *    "—" nếu chưa có lượt click để chia).
 * 2. `link-card` — link giới thiệu + mã thật + QR code thật (sinh server-side,
 *    cùng kỹ thuật `/portal/affiliate` 1.0). 4 icon share (Facebook/Zalo/
 *    TikTok/Email) — chỉ Facebook (`sharer.php?u=`) và Email (`mailto:`) có
 *    URL share chuẩn công khai thật; Zalo/TikTok không có API share-URL
 *    công khai đáng tin cậy → cả 4 nút cùng hành vi copy-to-clipboard thật
 *    (không giả vờ mở dialog chia sẻ không chắc hoạt động).
 * 3. "Mức hoa hồng của bạn" (bảng 3 tầng Người mới 20%/Đối tác 30%/Đại sứ
 *    40%) — GIAI ĐOẠN 6 (tiếp): đúng thiết kế đã chốt trong
 *    `vdaiportal2.0.html`, đọc `tierRules` (bảng `affiliate_tier_rules`
 *    MỚI — KHÔNG dùng chung `affiliate_commission_rules`, bảng đó chỉ
 *    phục vụ trigger `handle_order_confirmed_commission()` theo SẢN PHẨM,
 *    không có khái niệm "tầng theo số giao dịch của referrer", xem
 *    `supabase-giai-doan-6-affiliate-tier-rules.sql`). Tầng hiện tại của
 *    người dùng tính THẬT từ `overview.customers` (số giao dịch đã tạo
 *    đơn hàng thật — đúng bằng số dòng `referrals.status IN
 *    ('confirmed','paid')`, vì cả `orderId` lẫn `status` được set CÙNG
 *    LÚC trong `handle_order_confirmed_commission()`), so với
 *    `minTransactions` mỗi tầng đọc từ DB (không hardcode ngưỡng 10/50
 *    trong UI). **Lưu ý trung thực đã ghi rõ ngay trong UI:** mức % hiển
 *    thị ở đây là MỤC TIÊU tầng bậc Founder đặt ra, hoa hồng THỰC TẾ ghi
 *    nhận trên từng giao dịch vẫn tính theo `affiliate_commission_rules`
 *    (cấu hình theo sản phẩm) cho tới khi trigger được nối theo tầng
 *    referrer — 2 hệ số có thể lệch nhau, không giả vờ đã đồng bộ.
 * 4. "Cách thức hoạt động" (3 bước tĩnh) — khớp đúng luồng thật (lấy link →
 *    chia sẻ → nhận hoa hồng khi đơn được xác nhận), giữ nguyên là copy
 *    hướng dẫn, không phải dữ liệu.
 * 5. "Bộ tài nguyên Marketing" — GIAI ĐOẠN 6 (tiếp, "tự soạn" theo yêu cầu
 *    Founder): 4 hạng mục đúng mockup gốc, mỗi hạng mục chỉ đưa nội dung
 *    THẬT có thể giao ngay, không bịa file không tồn tại — (a) "Video
 *    giới thiệu" trỏ NGUYÊN `youtubeId` thật của Landing Page
 *    (`landing_chrome`'s khối "skills-showcase", Single Source of Truth
 *    với `/` — cùng video demo VDAI Academy đã dùng công khai); (b) "Bộ
 *    nhận diện thương hiệu" trỏ file logo thật `public/brand/primary-logo-
 *    light.svg` (đã tồn tại từ trước, dùng cho mọi nhu cầu nhận diện khác
 *    trong dự án); (c) "Mẫu bài viết chia sẻ" — 1 đoạn caption MỚI do
 *    Claude soạn (nội dung nguyên bản, không phải dữ liệu đo được — cùng
 *    bản chất với FAQ/copy hướng dẫn khác trên trang này), tự động chèn
 *    `overview.referralLink` thật khi đã đăng nhập, nút Sao chép dùng
 *    lại đúng cơ chế `navigator.clipboard` của `CopyableLink`; (d)
 *    "Banner quảng cáo" — KHÔNG có file ảnh banner nào tồn tại → honest
 *    "Đang cập nhật" cho đúng hạng mục này (không giả vờ có link tải).
 * 6. FAQ — 2/4 câu giữ nguyên (khớp thật: không giới hạn số người giới
 *    thiệu/hoa hồng theo đơn hàng xác nhận); 2/4 câu viết lại cho khớp cơ
 *    chế THẬT (mockup bịa "trả tự động ngày 5 hàng tháng, tối thiểu
 *    300.000đ" — thật ra thanh toán là THỦ CÔNG qua yêu cầu; mockup bịa
 *    "cookie 30 ngày" — thật ra mã giới thiệu gắn VĨNH VIỄN vào tài khoản
 *    ngay lúc đăng ký qua link, không phải cookie có hạn; câu "lên cấp
 *    Đối tác/Đại sứ" bỏ hẳn vì không có cấp bậc — thay bằng câu về cách
 *    tính hoa hồng thật).
 * 7. "Bảng xếp hạng Affiliate" (top 4 + hạng của bạn, tên/số bịa) — GIAI
 *    ĐOẠN 6: đổi từ honest empty-state (quyết định gốc, đúng thời điểm đó
 *    vì chưa có endpoint công khai nào cho 1 thành viên đọc dữ liệu giới
 *    thiệu của người KHÁC) sang bảng xếp hạng THẬT —
 *    `getAffiliateLeaderboard()` gọi RPC `get_affiliate_leaderboard()`
 *    (SECURITY DEFINER, chỉ trả 4 cột an toàn đã tổng hợp, không lộ
 *    `referred_email`/`order_id` — không mở rộng RLS `referrals` trực
 *    tiếp). Founder xác nhận hiển thị TÊN ĐẦY ĐỦ + SỐ HOA HỒNG.
 * 8. "Lịch sử thanh toán" (4 dòng tháng bịa) → `payoutRequests` thật (có
 *    thể `null` nếu tính năng chưa kích hoạt — hiện đã kích hoạt theo
 *    CLAUDE.md). Thêm nút "Yêu cầu thanh toán" thật (không có trong
 *    mockup nhưng khả năng ghi đã có sẵn ở 1.0, không bỏ phí).
 * 9. "Cần hỗ trợ Affiliate?" — nút trỏ `/v2/companion` (GIAI ĐOẠN 6: sửa
 *    từ `/portal/support`, VI PHẠM NGUYÊN TẮC BẤT BIẾN đầu CLAUDE.md —
 *    phát hiện khi audit đợt gộp hệ thống Affiliate; cùng đích chat AI
 *    thật đã dùng cho "Cần hỗ trợ?" ở `/v2/premium`).
 *
 * Chưa đăng nhập / chưa có mã giới thiệu — 2 honest empty-state riêng biệt
 * (khớp đúng 2 nhánh `getAffiliateOverview()` đã xử lý ở 1.0).
 */

function formatMoney(n: number) {
  return `${n.toLocaleString("vi-VN")}đ`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

const PAYOUT_STATUS_LABEL: Record<string, string> = {
  pending: "Đang chờ xử lý",
  approved: "Đã duyệt",
  paid: "Đã thanh toán",
  rejected: "Đã từ chối",
};

// Contrast fix (audit "Giai đoạn 6") — 3/4 màu gốc dưới ngưỡng WCAG 4.5:1
// trên nền tương ứng (pending 3.18:1, approved/paid 3.27:1, rejected
// 3.61:1) — đổi sang các sắc đậm hơn cùng tông, đều đạt 4.53-5.97:1.
const PAYOUT_STATUS_STYLE: Record<string, { background: string; color: string }> = {
  pending: { background: "#fdf1e0", color: "#8a6a1f" },
  approved: { background: "#e6f7ed", color: "#066b4d" },
  paid: { background: "#e6f7ed", color: "#066b4d" },
  rejected: { background: "#fdeef0", color: "#b02040" },
};

// "Mức hoa hồng của bạn" — icon/gradient theo `tierKey` thật (đọc từ
// `affiliate_tier_rules.data.tierKey`), fallback cho tierKey lạ (Admin
// thêm tầng mới ngoài 3 tầng gốc) để không vỡ giao diện.
const TIER_ICON_BG: Record<string, string> = {
  new: "linear-gradient(145deg,#a08bff,#6d4aff)",
  partner: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  ambassador: "linear-gradient(145deg,#e2b23c,#a9660f)",
};
const DEFAULT_TIER_ICON_BG = "linear-gradient(145deg,#a08bff,#6d4aff)";

// "Bộ tài nguyên Marketing" — `.material-body button` (CSS gốc) chỉ style
// đúng thẻ <button>; 2 mục có link thật (video/logo) dùng <a>, cần style
// tay để đồng bộ hình dạng nút với 2 mục còn lại (mẫu bài viết/banner).
const buttonLinkStyle: CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "center",
  background: "var(--violet-light)",
  color: "var(--violet-dark)",
  border: "none",
  padding: 8,
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 11.5,
  textDecoration: "none",
  boxSizing: "border-box",
};
const buttonDisabledStyle: CSSProperties = {
  width: "100%",
  background: "var(--bg)",
  color: "var(--muted)",
  border: "1px solid var(--line)",
  padding: 8,
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 11.5,
  cursor: "default",
};

function TierIcon({ tierKey }: { tierKey: string }) {
  if (tierKey === "ambassador") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M5 18h14M5 18l-1.5-9L8 12l4-6 4 6 4.5-3L19 18" strokeLinejoin="round" />
      </svg>
    );
  }
  if (tierKey === "partner") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function CopyableLink({ link }: { link: string }) {
  const [label, setLabel] = useState("Sao chép");
  const copy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setLabel("Đã sao chép!");
      setTimeout(() => setLabel("Sao chép"), 2000);
    });
  };
  return (
    <>
      <div className="link-row2">
        <div className="link-input">{link}</div>
        <button className="copy-btn" onClick={copy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          <span>{label}</span>
        </button>
      </div>
      <div className="share-icons">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`} target="_blank" rel="noopener noreferrer">
          <button title="Chia sẻ Facebook" type="button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5 21v-7h2.4l.4-2.8h-2.8v-1.9c0-.8.2-1.3 1.4-1.3h1.5V5.4c-.7-.1-1.6-.2-2.4-.2-2.4 0-4 1.5-4 4.1V11H7.6v2.8H10V21z" />
            </svg>
          </button>
        </a>
        <button title="Sao chép để chia sẻ Zalo" type="button" onClick={copy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M8 15h8M8 15l4-6M12 9l4 6" strokeLinecap="round" />
          </svg>
        </button>
        <button title="Sao chép để chia sẻ TikTok" type="button" onClick={copy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 4v10.5a3.5 3.5 0 11-3.5-3.5" />
            <path d="M14 4c.5 2.5 2.5 4.5 5 5" />
          </svg>
        </button>
        <a href={`mailto:?subject=${encodeURIComponent("VO DUONG AI")}&body=${encodeURIComponent(link)}`}>
          <button title="Gửi qua Email" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </button>
        </a>
      </div>
    </>
  );
}

export function AffiliateClient({
  premium,
  overview,
  qrSvg,
  leaderboard,
  tierRules,
  introVideoId,
}: {
  premium: PremiumStatus;
  overview: AffiliateOverview | null;
  qrSvg: string | null;
  leaderboard: AffiliateLeaderboardEntry[];
  tierRules: AffiliateTierRule[];
  introVideoId: string | null;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [templateCopyLabel, setTemplateCopyLabel] = useState("Sao chép mẫu");

  const conversionRate = overview?.visits && overview.visits > 0 ? ((overview.customers / overview.visits) * 100).toFixed(1) + "%" : "—";

  // "Mức hoa hồng của bạn" — tầng hiện tại = tầng cao nhất mà số giao
  // dịch thành công thật (overview.customers) đã đạt ngưỡng minTransactions
  // (đọc từ DB, không hardcode). Tầng đầu (minTransactions=0) luôn khớp
  // nên currentTier chỉ null khi chưa đăng nhập.
  const successfulTransactions = overview?.customers ?? 0;
  const sortedTiers = [...tierRules].sort((a, b) => a.minTransactions - b.minTransactions);
  const currentTier = overview
    ? sortedTiers.reduce<AffiliateTierRule | null>((acc, t) => (successfulTransactions >= t.minTransactions ? t : acc), null)
    : null;
  const currentTierIndex = currentTier ? sortedTiers.findIndex((t) => t.id === currentTier.id) : -1;
  const nextTier = currentTierIndex >= 0 && currentTierIndex + 1 < sortedTiers.length ? sortedTiers[currentTierIndex + 1] : null;
  const transactionsToNextTier = nextTier ? Math.max(0, nextTier.minTransactions - successfulTransactions) : 0;

  const shareTemplate = `Mình đang dùng VO DUONG AI để học và làm chủ AI trong công việc — chương trình Premium có Học viện AI, Companion cá nhân hoá và cộng đồng thực chiến. Bạn tham gia qua link giới thiệu của mình nhé:\n${overview?.referralLink ?? "[link giới thiệu của bạn — đăng nhập để lấy]"}`;
  const copyTemplate = () => {
    navigator.clipboard.writeText(shareTemplate).then(() => {
      setTemplateCopyLabel("Đã sao chép!");
      setTimeout(() => setTemplateCopyLabel("Sao chép mẫu"), 2000);
    });
  };

  const faqItems = [
    {
      q: "Khi nào tôi nhận được hoa hồng?",
      a: "Hoa hồng được ghi nhận ngay khi đơn hàng của người được giới thiệu được xác nhận thanh toán thành công. Bạn gửi yêu cầu thanh toán ở mục \"Lịch sử thanh toán\" bên dưới, đội ngũ VO DUONG AI sẽ xác nhận và chuyển khoản.",
    },
    {
      q: "Liên kết giới thiệu có thời hạn không?",
      a: "Không có thời hạn — mã giới thiệu được gắn vĩnh viễn vào tài khoản ngay khi người được giới thiệu đăng ký qua liên kết của bạn, không phải cookie có hạn.",
    },
    {
      q: "Tôi có thể giới thiệu không giới hạn số người không?",
      a: "Có, không giới hạn số lượng người được giới thiệu và không giới hạn tổng hoa hồng bạn có thể nhận.",
    },
    {
      q: "Mức hoa hồng của tôi được tính thế nào?",
      a: "Mỗi sản phẩm có thể có mức hoa hồng riêng do Admin cấu hình — không có cấp bậc tăng theo số lượng người bạn giới thiệu.",
    },
  ];

  return (
    <div className="aff">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          searchPlaceholder="Tìm kiếm liên kết, tài nguyên affiliate..."
          promoTitle="Kiếm thu nhập cùng VO DUONG AI"
          promoText="Giới thiệu bạn bè, nhận hoa hồng thật trên mỗi giao dịch."
          promoButtonLabel="Xem chương trình →"
          promoButtonTarget="Chuong trinh Affilate.html"
          activeHtmlFile="Chuong trinh Affilate.html"
        >
          <div className="content">
            <div className="center-col">
              <div className="aff-hero">
                <div className="aff-hero-text">
                  <h2>
                    Kiếm thu nhập bền vững
                    <br />
                    cùng <span className="hl">Chương trình Affiliate</span>
                  </h2>
                  <p>
                    Giới thiệu VO DUONG AI đến bạn bè và cộng đồng của bạn — nhận hoa hồng minh bạch, thanh toán đúng hạn, không giới hạn số
                    lượng giới thiệu.
                  </p>
                  <div className="hero-btn-row">
                    <a href="#lien-ket" className="btn-gold">
                      Lấy liên kết giới thiệu
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b2a06" strokeWidth="2.4">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                    <a href="#faq" className="btn-ghost">
                      Xem câu hỏi thường gặp
                    </a>
                  </div>
                </div>
                <div className="aff-graphic">
                  <div className="net-glow" />
                  <svg width="230" height="200" viewBox="0 0 230 200" fill="none">
                    <circle cx="115" cy="90" r="30" fill="url(#coreGrad)" stroke="#f0c96a" strokeWidth="1.6" />
                    <path d="M115 90L60 55M115 90L170 55M115 90L60 130M115 90L170 130" stroke="rgba(226,178,60,.4)" strokeWidth="1.6" />
                    <g className="orbit-icon" style={{ animationDelay: "0s" }}>
                      <circle cx="55" cy="50" r="20" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                      <circle cx="55" cy="47" r="5" fill="#fff" />
                      <path d="M47 58c0-4 4-7 8-7s8 3 8 7" fill="none" stroke="#fff" strokeWidth="1.6" />
                    </g>
                    <g className="orbit-icon" style={{ animationDelay: ".5s" }}>
                      <circle cx="175" cy="50" r="20" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                      <circle cx="175" cy="47" r="5" fill="#fff" />
                      <path d="M167 58c0-4 4-7 8-7s8 3 8 7" fill="none" stroke="#fff" strokeWidth="1.6" />
                    </g>
                    <g className="orbit-icon" style={{ animationDelay: "1s" }}>
                      <circle cx="55" cy="135" r="20" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                      <circle cx="55" cy="132" r="5" fill="#fff" />
                      <path d="M47 143c0-4 4-7 8-7s8 3 8 7" fill="none" stroke="#fff" strokeWidth="1.6" />
                    </g>
                    <g className="orbit-icon" style={{ animationDelay: "1.5s" }}>
                      <circle cx="175" cy="135" r="20" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                      <circle cx="175" cy="132" r="5" fill="#fff" />
                      <path d="M167 143c0-4 4-7 8-7s8 3 8 7" fill="none" stroke="#fff" strokeWidth="1.6" />
                    </g>
                    <text x="115" y="95" fontFamily="Inter,sans-serif" fontSize="13" fontWeight="800" fill="#3b2a06" textAnchor="middle">
                      %
                    </text>
                    <defs>
                      <linearGradient id="coreGrad" x1="85" y1="60" x2="145" y2="120">
                        <stop offset="0" stopColor="#f0c96a" />
                        <stop offset="1" stopColor="#e2b23c" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {!overview ? (
                <div className="card">
                  <p className="empty-hint">Đăng nhập để lấy link giới thiệu và xem hoa hồng của bạn.</p>
                </div>
              ) : !overview.referralCode || !overview.referralLink ? (
                <div className="card">
                  <p className="empty-hint">Tài khoản của bạn chưa được cấp mã giới thiệu. Liên hệ đội ngũ VO DUONG AI để được hỗ trợ.</p>
                </div>
              ) : (
                <>
                  <div className="stat-row">
                    <div className="stat-box">
                      <div className="ico" style={{ background: "linear-gradient(145deg,#8b6bff,#5a37e6)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="num">{formatMoney(overview.commissionTotal)}</div>
                      <div className="lbl">Hoa hồng đã nhận</div>
                    </div>
                    <div className="stat-box">
                      <div className="ico" style={{ background: "linear-gradient(145deg,#5f8fff,#1d5fd8)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <circle cx="9" cy="8" r="3.5" />
                          <path d="M2.5 20c0-3.6 3-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
                        </svg>
                      </div>
                      <div className="num">{overview.signups}</div>
                      <div className="lbl">Người đã giới thiệu</div>
                    </div>
                    <div className="stat-box">
                      <div className="ico" style={{ background: "linear-gradient(145deg,#3ecf7e,#189a52)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                        </svg>
                      </div>
                      <div className="num">{overview.visits === null ? "—" : overview.visits}</div>
                      <div className="lbl">{overview.visits === null ? "Lượt click (chưa bật)" : "Lượt click liên kết"}</div>
                    </div>
                    <div className="stat-box">
                      <div className="ico" style={{ background: "linear-gradient(145deg,#e2b23c,#a9660f)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                        </svg>
                      </div>
                      <div className="num">{conversionRate}</div>
                      <div className="lbl">Tỷ lệ chuyển đổi</div>
                    </div>
                  </div>

                  <div className="link-card" id="lien-ket">
                    <div className="link-card-head">
                      <h4>Liên kết giới thiệu của bạn</h4>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#066b4d", background: "#e6f7ed", padding: "3px 10px", borderRadius: 6 }}>
                        Đang hoạt động
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 260 }}>
                        <CopyableLink link={overview.referralLink} />
                        <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 10 }}>
                          Mã giới thiệu của bạn: <span style={{ fontFamily: "monospace", fontWeight: 800, color: "var(--text)" }}>{overview.referralCode}</span>
                        </p>
                      </div>
                      {qrSvg ? (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 8, background: "#fff" }} dangerouslySetInnerHTML={{ __html: qrSvg }} />
                          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>Quét để chia sẻ</p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <div className="section-head" style={{ marginBottom: 14 }}>
                      <h3>Mức hoa hồng của bạn</h3>
                    </div>
                    {sortedTiers.length === 0 ? (
                      <div className="card">
                        <p className="empty-hint">Chưa có cấu hình tầng hoa hồng — Admin cần thiết lập ở &quot;Cấu hình cấp độ Affiliate&quot;.</p>
                      </div>
                    ) : (
                      <>
                        <div className="tier-grid">
                          {sortedTiers.map((tier) => {
                            const isCurrent = currentTier?.id === tier.id;
                            return (
                              <div className={isCurrent ? "tier-card current" : "tier-card"} key={tier.id}>
                                {isCurrent ? (
                                  <span className="tier-badge">Cấp của bạn</span>
                                ) : tier.isFeatured ? (
                                  <span className="tier-badge" style={{ background: "var(--gold)", color: "#3b2a06" }}>
                                    Phổ biến
                                  </span>
                                ) : null}
                                <div className="tier-ico" style={{ background: TIER_ICON_BG[tier.tierKey] ?? DEFAULT_TIER_ICON_BG }}>
                                  <TierIcon tierKey={tier.tierKey} />
                                </div>
                                <h5>{tier.label}</h5>
                                <div className="rate">
                                  {tier.ratePercent}%<span> / giao dịch</span>
                                </div>
                                <div className="tier-feat">
                                  {tier.benefits.map((benefit) => (
                                    <div key={benefit}>
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6L9 17l-5-5" />
                                      </svg>
                                      <span>{benefit}</span>
                                    </div>
                                  ))}
                                </div>
                                <p className="tier-req">{tier.condition}</p>
                              </div>
                            );
                          })}
                        </div>
                        <p className="rate-note" style={{ marginTop: 12 }}>
                          {nextTier ? (
                            <>
                              Bạn đang ở tầng <strong>{currentTier?.label}</strong> với {successfulTransactions} giao dịch thành công — còn{" "}
                              <strong>{transactionsToNextTier}</strong> giao dịch nữa để lên {nextTier.label} ({nextTier.ratePercent}%).
                            </>
                          ) : (
                            <>
                              Bạn đang ở tầng cao nhất — <strong>{currentTier?.label}</strong> với {successfulTransactions} giao dịch thành công.
                            </>
                          )}{" "}
                          Mức % hiển thị là mục tiêu tầng bậc — hoa hồng thực tế trên từng giao dịch vẫn theo cấu hình sản phẩm đang áp dụng.
                        </p>
                      </>
                    )}
                  </div>
                </>
              )}

              <div>
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <h3>Cách thức hoạt động</h3>
                </div>
                <div className="steps-row">
                  <div className="step-card">
                    <span className="step-num">1</span>
                    <div className="ico" style={{ background: "linear-gradient(145deg,#a08bff,#6d4aff)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    </div>
                    <h5>Lấy liên kết giới thiệu</h5>
                    <p>Sao chép liên kết cá nhân hoặc mã giới thiệu của bạn từ trang này.</p>
                  </div>
                  <div className="step-card">
                    <span className="step-num">2</span>
                    <div className="ico" style={{ background: "linear-gradient(145deg,#5f8fff,#1d5fd8)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
                      </svg>
                    </div>
                    <h5>Chia sẻ đến cộng đồng</h5>
                    <p>Đăng lên mạng xã hội, gửi email hoặc chia sẻ trực tiếp cho người quan tâm.</p>
                  </div>
                  <div className="step-card">
                    <span className="step-num">3</span>
                    <div className="ico" style={{ background: "linear-gradient(145deg,#3ecf7e,#189a52)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h5>Nhận hoa hồng</h5>
                    <p>Nhận hoa hồng ngay khi người được giới thiệu thanh toán đơn hàng thành công.</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <h3>Bộ tài nguyên Marketing</h3>
                </div>
                <div className="material-grid">
                  <div className="material-card">
                    <div className="material-thumb" style={{ background: "linear-gradient(145deg,#ff6b6b,#c81d4a)" }}>
                      <svg viewBox="0 0 24 24" fill="#fff" stroke="none">
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                    </div>
                    <div className="material-body">
                      <h6>Video giới thiệu VDAI Academy</h6>
                      {introVideoId ? (
                        <a
                          href={`https://www.youtube.com/watch?v=${introVideoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={buttonLinkStyle}
                        >
                          Xem trên YouTube ↗
                        </a>
                      ) : (
                        <button type="button" disabled style={buttonDisabledStyle}>
                          Đang cập nhật
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="material-card">
                    <div className="material-thumb" style={{ background: "linear-gradient(145deg,#8b6bff,#5a37e6)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                      </svg>
                    </div>
                    <div className="material-body">
                      <h6>Bộ nhận diện thương hiệu</h6>
                      <a href="/brand/primary-logo-light.svg" download style={buttonLinkStyle}>
                        Tải logo ↓
                      </a>
                    </div>
                  </div>
                  <div className="material-card">
                    <div className="material-thumb" style={{ background: "linear-gradient(145deg,#3ecf7e,#189a52)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M14 3v4a1 1 0 001 1h4" />
                        <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                        <path d="M9 13h6M9 17h6" />
                      </svg>
                    </div>
                    <div className="material-body">
                      <h6>Mẫu bài viết chia sẻ</h6>
                      <button type="button" onClick={copyTemplate}>
                        {templateCopyLabel}
                      </button>
                    </div>
                  </div>
                  <div className="material-card">
                    <div className="material-thumb" style={{ background: "linear-gradient(145deg,#a0a4b8,#6b6685)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <circle cx="8.5" cy="10.5" r="1.5" />
                        <path d="M21 16l-5.5-5.5L3 19" />
                      </svg>
                    </div>
                    <div className="material-body">
                      <h6>Banner quảng cáo</h6>
                      <button type="button" disabled style={buttonDisabledStyle}>
                        Đang cập nhật
                      </button>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
                  Đăng ký sử dụng nội dung/logo VO DUONG AI khi chia sẻ đúng mục đích quảng bá chương trình Affiliate.
                </p>
              </div>

              <div className="card" id="faq">
                <div className="card-head">
                  <h4>Câu hỏi thường gặp</h4>
                </div>
                {faqItems.map((item, i) => (
                  <div className={i === openFaq ? "faq-item open" : "faq-item"} key={item.q}>
                    <div className="faq-q" onClick={() => setOpenFaq(i === openFaq ? null : i)}>
                      {item.q}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                    <div className="faq-a">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Bảng xếp hạng Affiliate</h4>
                </div>
                {leaderboard.length === 0 ? (
                  <p className="empty-hint">Chưa có ai phát sinh hoa hồng — hãy là người đầu tiên xuất hiện trên bảng xếp hạng!</p>
                ) : (
                  leaderboard.map((entry) => (
                    <div className={entry.isYou ? "rank-row you" : "rank-row"} key={entry.memberId}>
                      <span className="rk">{entry.rank}</span>
                      <div className="info">
                        <h6>
                          {entry.fullName}
                          {entry.isYou ? " (Bạn)" : ""}
                        </h6>
                        <span>{entry.referralCount} người đã giới thiệu</span>
                      </div>
                      <span className="amt">{formatMoney(entry.totalCommission)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Lịch sử thanh toán</h4>
                </div>
                {overview?.payoutRequests === null || overview?.payoutRequests === undefined ? (
                  <p className="empty-hint">Tính năng yêu cầu thanh toán chưa được kích hoạt.</p>
                ) : overview.payoutRequests.length === 0 ? (
                  <p className="empty-hint">Chưa có yêu cầu thanh toán nào.</p>
                ) : (
                  overview.payoutRequests.map((p) => (
                    <div className="payout-row" key={p.id}>
                      <span>{formatDate(p.requestedAt)}</span>
                      <span className="status" style={PAYOUT_STATUS_STYLE[p.status]}>
                        {PAYOUT_STATUS_LABEL[p.status] ?? p.status}
                      </span>
                    </div>
                  ))
                )}
                {overview && overview.payoutRequests !== null && (
                  <div style={{ marginTop: 12 }}>
                    <RequestPayoutButtonV2 maxAmount={overview.commissionConfirmed} />
                  </div>
                )}
              </div>

              <div className="card" style={{ background: "linear-gradient(150deg,#150c38,#241c56)", color: "#fff" }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Cần hỗ trợ Affiliate?</h4>
                <p style={{ fontSize: 12, color: "#c3bde3", lineHeight: 1.5, marginBottom: 14 }}>
                  Liên hệ đội ngũ đối tác để được tư vấn chiến lược tăng chuyển đổi.
                </p>
                <Link
                  href="/v2/companion"
                  style={{ display: "block", textAlign: "center", width: "100%", background: "var(--gold)", color: "#3b2a06", border: "none", padding: 10, borderRadius: 9, fontWeight: 800, fontSize: 13, textDecoration: "none" }}
                >
                  Chat với Companion
                </Link>
              </div>
            </aside>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
