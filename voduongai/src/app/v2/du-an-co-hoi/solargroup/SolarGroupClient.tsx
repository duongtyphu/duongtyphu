"use client";

/* =============================================================================
 * SolarGroup 2.0 — chuyển 1:1 từ `design_handoff_vo_duong_ai/SolarGroup.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `solargroup.css` (chép nguyên văn, xem đầu file đó).
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh — CÙNG NGUYÊN TẮC đã áp dụng cho DigiU: dữ liệu
 * thật của SolarGroup ở 1.0 (`ecosystem_chrome`, id `eco_solargroup`) mang
 * tông điệu THẬN TRỌNG rõ rệt ("mình đang nghiên cứu, chưa coi đây là
 * khuyến nghị tham gia", "không phù hợp cho nhu cầu thanh khoản ngắn hạn")
 * — trong khi bản thiết kế này có RẤT NHIỀU tuyên bố mời gọi đầu tư cụ thể
 * không có thật (580.000+ nhà đầu tư, 194 quốc gia, $50 đầu tư tối thiểu,
 * 20+ bằng sáng chế, mốc lộ trình theo năm, "Trở thành nhà đầu tư ngay hôm
 * nay"...) — phát minh thêm số liệu/mốc thời gian sẽ vi phạm trực tiếp
 * NO-FAKE-DATA, và với nội dung mang tính mời gọi đầu tư thì rủi ro sai
 * lệch còn nghiêm trọng hơn (có thể hiểu nhầm là cam kết/khuyến nghị tài
 * chính). Quyết định: giữ NGUYÊN bố cục/class/hiệu ứng thị giác, thay MỌI
 * nội dung mang tính khẳng định số liệu/mốc thời gian/mời gọi đầu tư bằng
 * dữ liệu thật hoặc honest empty-state — không suy đoán, không chọn map
 * gần đúng.
 *
 *  1. Hero (`.sg-hero`) — h2 dùng tên cố định "SolarGroup — Mô hình cổ phần
 *     dài hạn" (không bịa tên dự án con "Slavyanka"/"Duyunov" ở vị trí
 *     hero vì đây là chi tiết chỉ đúng với 1 dự án con cụ thể, không phải
 *     mô tả cả hệ sinh thái); p dùng `chrome.shortDescription` thật. Nút
 *     "Xem video giới thiệu" CHỈ hiện khi có video thật.
 *  2. `profile-head` — bỏ "580.000+ nhà đầu tư tại 194 quốc gia" (bịa),
 *     thay bằng chip `chrome.statusBadge` thật + số dự án con thật.
 *  3. `stat-row` — 5 số liệu bịa (nhà đầu tư/quốc gia/đầu tư tối thiểu/bằng
 *     sáng chế/giảm tiêu thụ năng lượng) → 5 số liệu THẬT: số dự án con, số
 *     bài cập nhật, số tài liệu, số video, số tiêu chí Đánh giá đã "Đạt".
 *  4. `about-grid` — đoạn giới thiệu dùng `chrome.fullIntro` thật,
 *     check-list dùng `chrome.highlights` thật (thay 4 dòng bịa về công
 *     nghệ Slavyanka). `video-card` hiện video thật đầu tiên nếu có, rỗng
 *     thì khung trung thực.
 *  5. `sub-grid` ("2 dự án con") — dùng dữ liệu thật
 *     `getLiveSubProjects("eco_solargroup")` (Sovelmash/AeroNova thật).
 *     Bỏ `sub-mini-stats` (3 số liệu/mốc mỗi thẻ đều bịa — "$100M cần huy
 *     động", "2019 cư dân SEZ Moscow"... không có trong dữ liệu thật).
 *     Link "Xem chi tiết →" trỏ trang chi tiết dự án con thật ở 1.0.
 *  6. "Lộ trình dự án" (mốc năm 2017/2019/2025/"Sắp tới" — bịa, không có hệ
 *     thống theo dõi mốc lộ trình nào trong dự án) → thay bằng "Đánh giá
 *     nhanh" (số tiêu chí Đạt/6 thật, cùng mẫu đã dùng ở DigiU).
 *  7. "Tổng quan đầu tư" (toàn bộ 4 dòng đều bịa — $50/580K/194/24-7) →
 *     thay bằng "Đường link liên kết" thật (`chrome.links`).
 *  8. "Tài liệu & Báo cáo" (3 tài liệu PDF/PPTX bịa tên) → dùng
 *     `chrome.documents` thật, rỗng thì `.empty-hint`.
 *  9. "Câu hỏi thường gặp" — KHÔNG có hệ thống FAQ nào cho từng hệ sinh
 *     thái trong dự án (chỉ có 3 câu hỏi trơ, không có câu trả lời) →
 *     honest empty-state thay vì hiện 3 câu hỏi không trả lời được.
 * 10. "Tin tức nổi bật" → 3 bài viết THẬT mới nhất
 *     (`getLiveEcosystemArticles("eco_solargroup")`), rỗng thì
 *     `.empty-hint`.
 * 11. CTA cuối trang — bỏ "Đầu tư từ $50, được bảo vệ bởi thoả thuận pháp
 *     lý..." (lời mời đầu tư cụ thể không có thật) và nút "Bắt đầu đầu tư"
 *     → đổi thành lời mời tìm hiểu chung chung + nút trỏ link đăng ký thật
 *     đầu tiên trong `chrome.links` (không có thì vô hiệu hoá nhẹ).
 *
 * CÒN GIỮ NGUYÊN "TRƠ" NHƯ BẢN GỐC: 8 tab trong `.tabs-row` chỉ đổi trạng
 * thái active. Nút "Theo dõi"/"Chia sẻ" giữ trơ. Ô tìm kiếm/chuông giữ trơ.
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DEFAULT_POTENTIAL_ANALYSIS } from "@/data/portal/ecosystems";
import type { EcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import type { SubProjectRow } from "@/lib/portal/live-subprojects";
import type { EcosystemArticleRow } from "@/lib/portal/live-ecosystem-articles";
import type { EcosystemRatingRow } from "@/lib/portal/live-ecosystem-ratings";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../../inter-gf.css";
import "./solargroup.css";

const HREF_MAP: Record<string, string> = {
  "Trang chu Portal.html": "/v2/trang-chu",
  "Companion.html": "/v2/companion",
  "He tri thuc CKOS.html": "/v2/hoc-vien-ai",
  "Hoc vien AI.html": "/v2/hoc-vien-ai",
  "AI Workspace.html": "/v2/hoc-vien-ai",
  "Du an Co hoi.html": "/v2/du-an-co-hoi",
  "DigiU.html": "/v2/du-an-co-hoi/digiu",
  "SolarGroup.html": "/v2/du-an-co-hoi/solargroup",
  "Ohana.html": "/v2/du-an-co-hoi/ohana",
  "Cac mo hinh Affilate.html": "/v2/du-an-co-hoi/cac-mo-hinh-affilate",
  "Affilate san giao dich.html": "/v2/du-an-co-hoi/affilate-san-giao-dich",
  "Premium.html": "/v2/premium",
  "Chuong trinh Affilate.html": "/v2/affiliate",
  "Cong dong AI.html": "/v2/cong-dong-ai",
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

const TABS = ["Tổng quan", "Dự án con", "Công nghệ", "Lộ trình", "Đầu tư", "Tin tức", "Tài liệu", "Câu hỏi thường gặp"];

const SUB_STYLES = [
  { bg: "linear-gradient(150deg,#1a1400,#3d2a08)", stroke: "#f0c96a", icon: <><rect x="3" y="9" width="18" height="11" rx="1.5" /><path d="M7 9V6a2 2 0 012-2h6a2 2 0 012 2v3M3 14h18" /></> },
  { bg: "linear-gradient(150deg,#0c1a3d,#1a1044)", stroke: "#9fd4ff", icon: <><ellipse cx="12" cy="10" rx="8" ry="5" /><path d="M6 13c0 3 2.5 7 6 8 3.5-1 6-5 6-8" /></> },
];

const STAT_STYLES = [
  { bg: "linear-gradient(145deg,#8b6bff,#5a37e6)", icon: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="3" /><path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" /></> },
  { bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)", icon: <><path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></> },
  { bg: "linear-gradient(145deg,#e2b23c,#a9660f)", icon: <><path d="M4 4h6v16H4zM14 4h6v16h-6z" /></> },
  { bg: "linear-gradient(145deg,#a08bff,#6d4aff)", icon: <><path d="M8 5v14l11-7z" /></> },
  { bg: "linear-gradient(145deg,#3ecf7e,#189a52)", icon: <><path d="M20 6L9 17l-5-5" /></> },
];

function CheckSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function SolarGroupClient({
  chrome,
  subProjects,
  articles,
  ratings,
  premium,
}: {
  chrome: EcosystemChrome;
  subProjects: SubProjectRow[];
  articles: EcosystemArticleRow[];
  ratings: EcosystemRatingRow[];
  premium: PremiumStatus;
}) {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const firstVideo = chrome.videos.find((v) => v.visible);
  const metCount = ratings.filter((r) => r.ratingStatus === "met").length;
  const registerLink = chrome.links.find((l) => l.visible)?.url ?? "";
  const topArticles = articles.slice(0, 3);
  const visibleDocs = chrome.documents.filter((d) => d.visible);
  const visibleLinks = chrome.links.filter((l) => l.visible);

  const stats = [
    { num: String(subProjects.length), lbl: "Dự án con", sub: "Đang triển khai" },
    { num: String(articles.length), lbl: "Cập nhật mới", sub: "Tin tức & bài viết" },
    { num: String(visibleDocs.length), lbl: "Tài liệu", sub: "Có thể tải về" },
    { num: String(chrome.videos.length), lbl: "Video", sub: "Giới thiệu & hướng dẫn" },
    { num: `${metCount}/6`, lbl: "Tiêu chí đạt", sub: "Đánh giá minh bạch" },
  ];

  return (
    <div className="sgr">
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="mark">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#3B82F6" />
                <circle cx="27" cy="7.5" r="3" fill="#F97316" />
              </svg>
            </div>
            <div className="name">
              <span className="vo">VO DUONG</span> <span className="ai">AI</span>
            </div>
          </div>

          <nav className="main">
            <button className="nav-item" onClick={() => go("Trang chu Portal.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10l9-7 9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Trang chủ
            </button>
            <button className="nav-item" onClick={() => go("Companion.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              Companion AI
            </button>
            <button className="nav-item" onClick={() => go("Hoc vien AI.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
              </svg>
              Học viện AI
            </button>
            <button className="nav-item active nav-parent" onClick={() => go("Du an Co hoi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
              </svg>
              Dự án &amp; Cơ hội
            </button>
            <div className="nav-sub">
              <button className="nav-item" onClick={() => go("DigiU.html")}>
                DigiU
              </button>
              <button className="nav-item active">SolarGroup</button>
              <button className="nav-item" onClick={() => go("Ohana.html")}>
                Ohana
              </button>
              <button className="nav-item" onClick={() => go("Cac mo hinh Affilate.html")}>
                Các mô hình Affilate
              </button>
              <button className="nav-item" onClick={() => go("Affilate san giao dich.html")}>
                Affilate sàn giao dịch
              </button>
            </div>
            <button className="nav-item" onClick={() => go("Premium.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
              </svg>
              Premium
            </button>
            <button className="nav-item" onClick={() => go("Chuong trinh Affilate.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
              </svg>
              Chương trình Affilate
            </button>
            <button className="nav-item" onClick={() => go("Cong dong AI.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="8" r="3" />
                <circle cx="17" cy="9" r="3" />
                <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
              </svg>
              Cộng đồng AI
            </button>
          </nav>

          <nav className="main">
            <button className="nav-item" onClick={() => go("Nhat ky hoc tap.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
              </svg>
              Nhật ký học tập
            </button>
            <button className="nav-item" onClick={() => go("Hanh trinh cua toi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              Hành trình của tôi
            </button>
            <button className="nav-item" onClick={() => go("Khu vuon cua ban.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
              </svg>
              Khu vườn của bạn
            </button>
          </nav>

          <div className="promo" style={premium.isPremium ? { display: "none" } : undefined}>
            <div className="crown" style={{ background: "none", boxShadow: "none", width: 54, height: 54, overflow: "visible" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- ảnh minh hoạ tĩnh cố định của bản thiết kế */}
              <img
                src="/v2-static/assets/icon-premium.png"
                alt=""
                style={{ width: 58.5, height: 58.5, objectFit: "contain", position: "relative", zIndex: 1 }}
              />
            </div>
            <h4>Premium Member</h4>
            <p>Mở khoá toàn bộ tài liệu, khoá học nâng cao và cơ hội đầu tư độc quyền.</p>
            <button onClick={() => go("Premium.html")}>Nâng cấp ngay</button>
          </div>
        </aside>

        <div className="main-col">
          <div className="topbar">
            <PortalSearchBox placeholder="Tìm kiếm dự án, cơ hội, token, tài liệu..." variant="box" />
            <div className="topbar-right">
              {!premium.isPremium && (
                <button className="upgrade-btn" onClick={() => go("Premium.html")}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                  Nâng cấp Premium
                </button>
              )}
              <NotificationBell />
              <ProfileMenu premium={premium} />
            </div>
          </div>

          <div className="content">
            <div className="center-col">
              <div className="profile-head">
                <div className="profile-logo">
                  <svg viewBox="0 0 24 24" fill="#e2b23c">
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                </div>
                <div className="profile-info">
                  <h1>
                    SolarGroup
                    <div className="verify-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </h1>
                  <p>{chrome.shortDescription}</p>
                  <div className="tag-row">
                    <span className="p-tag">{chrome.statusBadge}</span>
                    <span className="p-since">{subProjects.length} dự án con đang theo dõi</span>
                  </div>
                </div>
                <div className="profile-actions">
                  <button className="act-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                    </svg>
                    Theo dõi
                  </button>
                  <button className="act-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
                    </svg>
                    Chia sẻ
                  </button>
                </div>
              </div>

              <div className="sg-hero">
                <div className="sg-hero-text">
                  <h2>SolarGroup — Mô hình cổ phần dài hạn</h2>
                  <p>{chrome.shortDescription}</p>
                  <div className="hero-btn-row">
                    <a className="btn-primary" href="#du-an-con">
                      Giới thiệu dự án
                    </a>
                    {firstVideo ? (
                      <a className="btn-ghost" href={firstVideo.url} target="_blank" rel="noopener noreferrer">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Xem video giới thiệu
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="sg-graphic">
                  <div className="net-glow" />
                  <svg width="280" height="220" viewBox="0 0 280 220" fill="none">
                    <g className="coil-spin">
                      <circle cx="140" cy="110" r="58" fill="none" stroke="#e2b23c" strokeWidth="2.4" strokeDasharray="10 7" />
                      <circle cx="140" cy="110" r="42" fill="none" stroke="#f0c96a" strokeWidth="2" strokeDasharray="7 6" />
                    </g>
                    <circle cx="140" cy="110" r="26" fill="url(#coreGrad)" stroke="#f0c96a" strokeWidth="1.6" />
                    <g className="spark" style={{ animationDelay: "0s" }}>
                      <circle cx="140" cy="42" r="4" fill="#f0c96a" />
                    </g>
                    <g className="spark" style={{ animationDelay: ".5s" }}>
                      <circle cx="208" cy="110" r="4" fill="#f0c96a" />
                    </g>
                    <g className="spark" style={{ animationDelay: "1s" }}>
                      <circle cx="140" cy="178" r="4" fill="#f0c96a" />
                    </g>
                    <g className="spark" style={{ animationDelay: "1.5s" }}>
                      <circle cx="72" cy="110" r="4" fill="#f0c96a" />
                    </g>
                    <path d="M140 68v-20M140 152v20M98 110H78M182 110h20" stroke="#e2b23c" strokeWidth="1.4" opacity=".7" />
                    <defs>
                      <linearGradient id="coreGrad" x1="114" y1="84" x2="166" y2="136">
                        <stop offset="0" stopColor="#f0c96a" />
                        <stop offset="1" stopColor="#a9660f" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="stat-row">
                {stats.map((s, i) => (
                  <div className="stat-box" key={s.lbl}>
                    <div className="ico" style={{ background: STAT_STYLES[i].bg }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                        {STAT_STYLES[i].icon}
                      </svg>
                    </div>
                    <div className="num">{s.num}</div>
                    <div className="lbl">{s.lbl}</div>
                    <div className="sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="tabs-row">
                {TABS.map((label, i) => (
                  <button key={label} className={i === tab ? "tab active" : "tab"} onClick={() => setTab(i)}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="about-grid">
                <div className="about-text">
                  <h3>Về SolarGroup</h3>
                  <p>{chrome.fullIntro}</p>
                  {chrome.highlights.length > 0 ? (
                    <div className="check-list">
                      {chrome.highlights.map((h) => (
                        <div className="check-item" key={h}>
                          <CheckSvg />
                          {h}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <a href="https://voduongai.com/portal/duan-cohoi/solargroup" target="_blank" rel="noopener noreferrer">
                    Xem thêm về SolarGroup →
                  </a>
                </div>
                <div className="video-card">
                  {firstVideo ? (
                    <>
                      <div className="vtitle">SolarGroup</div>
                      <div className="vsub">{firstVideo.label || "Video giới thiệu"}</div>
                      <a className="play-btn" href={firstVideo.url} target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" fill="#fff">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="vtitle">SolarGroup</div>
                      <p className="empty-hint" style={{ color: "#d0c9e8" }}>
                        Video giới thiệu sẽ cập nhật khi có.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div id="du-an-con">
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14 }}>
                  {subProjects.length} dự án con của SolarGroup
                </h3>
                {subProjects.length === 0 ? (
                  <p className="empty-hint">Chưa có dự án con nào được công bố.</p>
                ) : (
                  <div className="sub-grid">
                    {subProjects.map((sub, i) => {
                      const style = SUB_STYLES[i % SUB_STYLES.length];
                      return (
                        <div className="sub-card" key={sub.id}>
                          <div className="sub-thumb" style={{ background: style.bg }}>
                            <div className="ico2">
                              <svg viewBox="0 0 24 24" fill="none" stroke={style.stroke} strokeWidth="1.8">
                                {style.icon}
                              </svg>
                            </div>
                            <div>
                              <h4>{sub.name}</h4>
                              <span>{sub.shortDescription}</span>
                            </div>
                          </div>
                          <div className="sub-body">
                            <p>{sub.fullIntro || sub.shortDescription}</p>
                            <a href={`https://voduongai.com/portal/duan-cohoi/solargroup/${sub.slug}`} target="_blank" rel="noopener noreferrer">
                              Xem chi tiết {sub.name} →
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Đánh giá nhanh</h4>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#189a52", marginBottom: 2 }}>{metCount}/6</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 12 }}>Tiêu chí minh bạch đã đạt</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {DEFAULT_POTENTIAL_ANALYSIS.map((c) => {
                    const row = ratings.find((r) => r.criterionId === c.id);
                    const status = row?.ratingStatus ?? "not-assessed";
                    const color = status === "met" ? "#189a52" : status === "not-met" ? "#e0455a" : "#9691b3";
                    return (
                      <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11.5, color: "var(--muted)" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, marginTop: 5, flexShrink: 0 }} />
                        {c.criterion}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Đường link liên kết</h4>
                </div>
                {visibleLinks.length === 0 ? (
                  <p className="empty-hint">Chưa có đường link liên kết nào.</p>
                ) : (
                  visibleLinks.map((l) => (
                    <div className="fin-row" key={l.id}>
                      <a className="lbl" href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)" }}>
                        {l.label}
                      </a>
                    </div>
                  ))
                )}
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Tài liệu &amp; Báo cáo</h4>
                </div>
                {visibleDocs.length === 0 ? (
                  <p className="empty-hint">Chưa có tài liệu nào.</p>
                ) : (
                  visibleDocs.map((d) => (
                    <a
                      className="news-row"
                      key={d.id}
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="news-thumb" style={{ background: "#fdeef0", color: "#e0455a" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                        </svg>
                      </div>
                      <div>
                        <h6>{d.label}</h6>
                        <span className="time">Tải về</span>
                      </div>
                    </a>
                  ))
                )}
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Câu hỏi thường gặp</h4>
                </div>
                <p className="empty-hint">Chưa có câu hỏi thường gặp cho SolarGroup.</p>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Tin tức nổi bật</h4>
                  {topArticles.length > 0 ? (
                    <a href="https://voduongai.com/portal/duan-cohoi/solargroup" target="_blank" rel="noopener noreferrer">
                      Xem tất cả →
                    </a>
                  ) : null}
                </div>
                {topArticles.length === 0 ? (
                  <p className="empty-hint">Chưa có bài viết cập nhật nào.</p>
                ) : (
                  topArticles.map((a) => (
                    <a
                      className="news-row"
                      key={a.id}
                      href={`https://voduongai.com/portal/duan-cohoi/solargroup/cap-nhat/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="news-thumb" style={{ background: "linear-gradient(145deg,#3d2a08,#a9660f)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#ffe4c2" strokeWidth="1.8">
                          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="news-cat" style={{ color: "#a9660f" }}>
                          CẬP NHẬT
                        </div>
                        <h6>{a.title}</h6>
                        <span className="time">Xem bài viết</span>
                      </div>
                    </a>
                  ))
                )}
              </div>

              <div className="cta-card">
                <h4>Tìm hiểu cùng SolarGroup</h4>
                <p>Khám phá thêm thông tin và tài liệu về mô hình SolarGroup.</p>
                {registerLink ? (
                  <a className="cta-link-btn" href={registerLink} target="_blank" rel="noopener noreferrer">
                    Tìm hiểu ngay
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                ) : (
                  <button disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                    Chưa có link
                  </button>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
