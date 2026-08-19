"use client";

/* =============================================================================
 * DigiU 2.0 — chuyển 1:1 từ `design_handoff_vo_duong_ai/DigiU.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `digiu.css` (chép nguyên văn, xem đầu file đó).
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh — tất cả xuất phát từ 1 nguyên tắc: hệ sinh thái
 * DigiU đã có tầng dữ liệu THẬT ở 1.0 (`ecosystem_chrome`/
 * `ecosystem_subprojects`/`ecosystem_articles`/`ecosystem_ratings`,
 * `eco_digiu`) với nội dung do Founder tự viết — nội dung đó có tông điệu
 * TRUNG THỰC/khiêm tốn ("mình đang trực tiếp đồng hành và quan sát, chưa
 * phải đánh giá dài hạn"), khác hẳn tông điệu quảng bá thể chế của bản
 * thiết kế này (quỹ WebWise Capital, đối tác Paradigm/Coinbase Ventures,
 * "3,2 triệu người theo dõi", "+44% tăng trưởng"...) — những con số/tên đối
 * tác đó KHÔNG có trong dữ liệu thật, và việc phát minh ra thể chế/số liệu
 * mới sẽ vi phạm trực tiếp nguyên tắc NO-FAKE-DATA đã áp dụng xuyên suốt dự
 * án (không bao giờ bịa số liệu/nội dung). Quyết định: giữ NGUYÊN bố cục/
 * class/hiệu ứng thị giác của bản thiết kế, nhưng thay MỌI nội dung chữ có
 * tính khẳng định sự kiện/số liệu bằng dữ liệu thật — không suy đoán, không
 * chọn cách map gần đúng.
 *
 *  1. Hero (`.digiu-hero`) — h2 dùng tên hệ sinh thái thật (chuỗi cố định
 *     "DigiU"), p dùng `chrome.shortDescription` thật (thay đoạn quảng bá
 *     "vận hành quỹ đầu tư mạo hiểm WebWise Capital..." không có thật).
 *     Nút "Khám phá hệ sinh thái" cuộn neo tới khối "Các dự án con" thật.
 *     Nút "Xem video giới thiệu" CHỈ hiện khi `chrome.videos` có ít nhất 1
 *     video thật, trỏ thẳng video đó — không có thì ẩn hẳn nút (không bịa
 *     video minh hoạ).
 *  2. `profile-head` — badge "AI & Blockchain"/"VC Funding"/"Web3" (thể loại
 *     tự đặt, không có thật) và "3,2 triệu+ người theo dõi" (số bịa) được
 *     thay bằng đúng 1 chip `chrome.statusBadge` thật (5 giá trị cố định,
 *     Admin chọn qua select) + số dự án con thật.
 *  3. `stat-row` — 5 ô số liệu marketing bịa (follower/khách hàng/tăng
 *     trưởng/sản phẩm/quỹ đối tác) thay bằng 5 số liệu THẬT tương ứng đúng
 *     dữ liệu đã có: số dự án con, số bài cập nhật, số tài liệu, số video,
 *     số tiêu chí Đánh giá đã "Đạt" trên 6.
 *  4. `about-grid` — đoạn giới thiệu dài (`about-text p`) dùng
 *     `chrome.fullIntro` thật; `check-list` dùng `chrome.highlights` thật
 *     (thay 4 dòng bịa "7 mảng nghiên cứu"/"20+ quỹ đối tác"...). Link "Xem
 *     thêm về DigiU →" trỏ trang chi tiết đầy đủ ở 1.0
 *     (`/portal/duan-cohoi/digiu` — v2 chưa có trang tương đương, thuộc 42
 *     trang còn lại của Bước F). `video-card` hiện video thật đầu tiên
 *     trong `chrome.videos` (nhãn thật, không bịa thời lượng "02:45") —
 *     rỗng thì hiện khung trung thực "Video giới thiệu sẽ cập nhật khi có."
 *  5. `pillars-grid` ("Các trụ cột của DigiU") — 4 thẻ bịa (DigiU Technical
 *     Lab/WebWise Capital/Alpha Mind/Sản phẩm thương mại) thay hẳn bằng
 *     lưới "Các dự án con" THẬT (`getLiveSubProjects("eco_digiu")` — đúng
 *     hạ tầng CRUD Admin đã có sẵn, xem CLAUDE.md mục "Dự án & Cơ hội").
 *     Icon/màu mỗi vị trí xoay vòng theo INDEX (không phải dữ liệu — cùng
 *     lý do `PATH_STYLES` ở Học viện AI), tên/mô tả là `sub.name`/
 *     `sub.shortDescription` thật. Link "Khám phá →" trỏ trang chi tiết
 *     dự án con thật ở 1.0 (`/portal/duan-cohoi/digiu/[slug]`). Rỗng →
 *     `.empty-hint` trung thực.
 *  6. "Hiệu suất đầu tư DigiU" (biểu đồ %/tháng bịa hoàn toàn — KHÔNG có hệ
 *     thống theo dõi hiệu suất đầu tư nào trong dự án) → thay bằng "Đánh
 *     giá nhanh": số tiêu chí "Đạt" thật trên 6 (`ecosystem_ratings`,
 *     `getLiveEcosystemRatingRows`), kèm ghi chú minh bạch thay cho dòng
 *     "Hiệu suất quá khứ không đảm bảo tương lai" cũ.
 *  7. "Đối tác & Nhà đầu tư" (Paradigm/Coinbase Ventures/Polychain... —
 *     KHÔNG có thật, DigiU không công khai danh sách nhà đầu tư ở đây) →
 *     thay bằng "Đường link liên kết" thật (`chrome.links`, đúng hạ tầng
 *     "Đường link liên kết dự án" đã có ở 1.0) — rỗng thì `.empty-hint`.
 *  8. "Tin tức nổi bật" → 3 bài viết THẬT mới nhất
 *     (`getLiveEcosystemArticles("eco_digiu")`, đúng "Cập nhật thông tin
 *     mới" đã có ở 1.0), link trỏ trang chi tiết bài viết thật ở 1.0. Nhãn
 *     `.time` giữ trung thực ("Cập nhật" — không bịa mốc thời gian cụ thể
 *     vì `EcosystemArticleRow` không có field ngày công khai). Rỗng thì
 *     `.empty-hint`.
 *  9. CTA cuối trang — bỏ chữ "đồng sở hữu" (ngụ ý quyền sở hữu/cổ phần
 *     không có thật), giữ lời mời chung chung. Nút "Tham gia ngay" trỏ
 *     link đăng ký thật đầu tiên trong `chrome.links` (nếu có, mở tab mới)
 *     — không có thì nút vô hiệu hoá nhẹ, không dẫn tới link giả.
 *
 * CÒN GIỮ NGUYÊN "TRƠ" NHƯ BẢN GỐC (bản mockup cũng không làm gì): 8 tab
 * trong `.tabs-row` chỉ đổi trạng thái active, không đổi nội dung bên dưới.
 * Nút "Theo dõi"/"Chia sẻ" ở `.profile-actions` không có hệ thống theo
 * dõi/chia sẻ thật, giữ trơ. Ô tìm kiếm/chuông thông báo giữ trơ.
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

import "../../inter-gf.css";
import "./digiu.css";

/** Đích điều hướng của mockup (tên file `.html`) → route thật trong `/v2`. */
const HREF_MAP: Record<string, string> = {
  "Trang chu Portal.html": "/v2/trang-chu",
  "Companion.html": "/v2/companion",
  "He tri thuc CKOS.html": "/v2/he-tri-thuc",
  "Hoc vien AI.html": "/v2/hoc-vien-ai",
  "AI Workspace.html": "/v2/ai-workspace",
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

const TABS = ["Tổng quan", "Dự án", "Sản phẩm", "Lộ trình", "Tokenomics", "Tin tức", "Tài liệu", "Câu hỏi thường gặp"];

/** 4 icon/gradient theo VỊ TRÍ (dự án con không có cột icon/màu riêng) —
 * cùng lý do `PATH_STYLES` ở Học viện AI. */
const PILLAR_STYLES = [
  {
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M4 4h6v16H4zM14 4h6v16h-6z" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </svg>
    ),
  },
];

const STAT_STYLES = [
  { bg: "linear-gradient(145deg,#8b6bff,#5a37e6)", icon: <path d="M13 2L3 14h7l-1 8 10-12h-7z" /> },
  { bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)", icon: <path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /> },
  { bg: "linear-gradient(145deg,#e2b23c,#b3801f)", icon: <path d="M4 4h6v16H4zM14 4h6v16h-6z" /> },
  { bg: "linear-gradient(145deg,#a08bff,#6d4aff)", icon: <path d="M8 5v14l11-7z" /> },
  { bg: "linear-gradient(145deg,#3ecf7e,#189a52)", icon: <path d="M20 6L9 17l-5-5" /> },
];

function CheckSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function DigiuClient({
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

  const stats = [
    { num: String(subProjects.length), lbl: "Dự án con", sub: "Đang triển khai" },
    { num: String(articles.length), lbl: "Cập nhật mới", sub: "Tin tức & bài viết" },
    { num: String(chrome.documents.length), lbl: "Tài liệu", sub: "Có thể tải về" },
    { num: String(chrome.videos.length), lbl: "Video", sub: "Giới thiệu & hướng dẫn" },
    { num: `${metCount}/6`, lbl: "Tiêu chí đạt", sub: "Đánh giá minh bạch" },
  ];

  return (
    <div className="dgu">
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
            <button className="nav-item" onClick={() => go("He tri thuc CKOS.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h6v16H4zM14 4h6v16h-6z" />
              </svg>
              Hệ tri thức (CKOS)
            </button>
            <button className="nav-item" onClick={() => go("Hoc vien AI.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
              </svg>
              Học viện AI
            </button>
            <button className="nav-item" onClick={() => go("AI Workspace.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M8 21h8M12 18v3" />
              </svg>
              AI Workspace
            </button>
            <button className="nav-item active nav-parent" onClick={() => go("Du an Co hoi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
              </svg>
              Dự án &amp; Cơ hội
            </button>
            <div className="nav-sub">
              <button className="nav-item active">DigiU</button>
              <button className="nav-item" onClick={() => go("SolarGroup.html")}>
                SolarGroup
              </button>
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
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input type="text" placeholder="Tìm kiếm dự án, cơ hội, token, tài liệu..." />
              <kbd>⌘ K</kbd>
            </div>
            <div className="topbar-right">
              {!premium.isPremium && (
                <button className="upgrade-btn" onClick={() => go("Premium.html")}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                  Nâng cấp Premium
                </button>
              )}
              <button className="icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.7 21a2 2 0 01-3.4 0" />
                </svg>
                <span className="badge">3</span>
              </button>
              <ProfileMenu premium={premium} />
            </div>
          </div>

          <div className="content">
            <div className="center-col">
              <div className="profile-head">
                <div className="profile-logo">U</div>
                <div className="profile-info">
                  <h1>
                    DigiU
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

              <div className="digiu-hero">
                <div className="digiu-hero-text">
                  <h2>DigiU – Hệ sinh thái phát triển &amp; kiếm thu nhập số</h2>
                  <p>{chrome.shortDescription}</p>
                  <div className="hero-btn-row">
                    <a className="btn-primary" href="#du-an-con">
                      Khám phá hệ sinh thái
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
                <div className="digiu-net">
                  <div className="net-glow" />
                  <svg width="340" height="220" viewBox="0 0 340 220" fill="none">
                    <path
                      d="M120 110h60M225 60l-45 50M225 110h-45M225 160l-45-50"
                      stroke="#6d84ff"
                      strokeWidth="1.4"
                      strokeDasharray="3 3"
                      opacity=".7"
                    />
                    <g className="net-node" style={{ animationDelay: "0s" }}>
                      <circle cx="100" cy="110" r="24" fill="rgba(80,60,180,.4)" stroke="#8b6bff" strokeWidth="1.4" />
                      <text x="100" y="115" fontFamily="Inter,sans-serif" fontSize="13" fontWeight="800" fill="#fff" textAnchor="middle">
                        AI
                      </text>
                    </g>
                    <rect x="150" y="70" width="80" height="80" rx="14" fill="url(#cubeGrad)" stroke="#9b7bff" strokeWidth="1.6" transform="skewY(-6)" />
                    <text x="190" y="118" fontFamily="Inter,sans-serif" fontSize="30" fontWeight="800" fill="#fff" textAnchor="middle">
                      U
                    </text>
                    <g className="net-node" style={{ animationDelay: ".4s" }}>
                      <circle cx="248" cy="58" r="20" fill="rgba(80,60,180,.4)" stroke="#8b6bff" strokeWidth="1.4" />
                      <path d="M241 54l4 4 8-9" stroke="#c9bdff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </g>
                    <text x="278" y="62" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill="#fff">
                      Blockchain
                    </text>
                    <g className="net-node" style={{ animationDelay: ".8s" }}>
                      <circle cx="248" cy="110" r="20" fill="rgba(80,60,180,.4)" stroke="#8b6bff" strokeWidth="1.4" />
                      <path d="M241 116l4-10 4 6 4-8" stroke="#c9bdff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    </g>
                    <text x="278" y="114" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill="#fff">
                      FinTech
                    </text>
                    <g className="net-node" style={{ animationDelay: "1.2s" }}>
                      <circle cx="248" cy="162" r="20" fill="rgba(80,60,180,.4)" stroke="#8b6bff" strokeWidth="1.4" />
                      <path d="M241 168c0-5 3-9 7-9s7 4 7 9" stroke="#c9bdff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    </g>
                    <text x="278" y="166" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill="#fff">
                      Web3
                    </text>
                    <path d="M60 190h30v-15h30v15h20M240 195h40v-10" stroke="#3d2a8f" strokeWidth="10" strokeLinecap="round" opacity=".5" />
                    <defs>
                      <linearGradient id="cubeGrad" x1="150" y1="70" x2="230" y2="150">
                        <stop offset="0" stopColor="#5a37e6" />
                        <stop offset="1" stopColor="#1a1044" />
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
                  <h3>Về DigiU</h3>
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
                  <a href="https://voduongai.com/portal/duan-cohoi/digiu" target="_blank" rel="noopener noreferrer">
                    Xem thêm về DigiU →
                  </a>
                </div>
                <div className="video-card">
                  {firstVideo ? (
                    <>
                      <div className="vtitle">
                        Digi<span style={{ background: "var(--violet)", padding: "1px 7px", borderRadius: 5, fontSize: 14 }}>U</span>
                      </div>
                      <div className="vsub">{firstVideo.label || "Video giới thiệu"}</div>
                      <a className="play-btn" href={firstVideo.url} target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" fill="#fff">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="vtitle">
                        Digi<span style={{ background: "var(--violet)", padding: "1px 7px", borderRadius: 5, fontSize: 14 }}>U</span>
                      </div>
                      <p className="empty-hint" style={{ color: "#c3bde3" }}>
                        Video giới thiệu sẽ cập nhật khi có.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div id="du-an-con">
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14 }}>Các dự án con của DigiU</h3>
                {subProjects.length === 0 ? (
                  <p className="empty-hint">Chưa có dự án con nào được công bố.</p>
                ) : (
                  <div className="pillars-grid">
                    {subProjects.map((sub, i) => {
                      const style = PILLAR_STYLES[i % PILLAR_STYLES.length];
                      return (
                        <div className="pillar-card" key={sub.id}>
                          <div className="ico" style={{ background: style.bg }}>
                            {style.icon}
                          </div>
                          <h5>{sub.name}</h5>
                          <p>{sub.shortDescription}</p>
                          <a href={`https://voduongai.com/portal/duan-cohoi/digiu/${sub.slug}`} target="_blank" rel="noopener noreferrer">
                            Khám phá →
                          </a>
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
                  <a href="https://voduongai.com/portal/duan-cohoi/digiu" target="_blank" rel="noopener noreferrer">
                    Xem chi tiết →
                  </a>
                </div>
                <div className="perf-pct">{metCount}/6</div>
                <div className="perf-lbl">Tiêu chí minh bạch đã đạt</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
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
                <div className="perf-note">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                  Đánh giá dựa trên tiêu chí minh bạch — không phải khuyến nghị đầu tư.
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Đường link liên kết</h4>
                </div>
                {chrome.links.filter((l) => l.visible).length === 0 ? (
                  <p className="empty-hint">Chưa có đường link liên kết nào.</p>
                ) : (
                  chrome.links
                    .filter((l) => l.visible)
                    .map((l) => (
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
                  <h4>Tin tức nổi bật</h4>
                  {topArticles.length > 0 ? (
                    <a href="https://voduongai.com/portal/duan-cohoi/digiu" target="_blank" rel="noopener noreferrer">
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
                      href={`https://voduongai.com/portal/duan-cohoi/digiu/cap-nhat/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="news-thumb" style={{ background: "linear-gradient(145deg,#241c4d,#5a37e6)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#c9bdff" strokeWidth="1.8">
                          <path d="M22 10L12 5 2 10l10 5 10-5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="news-cat" style={{ color: "#6d4aff" }}>
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
                <svg className="cube" viewBox="0 0 100 100" fill="none">
                  <rect x="15" y="15" width="70" height="70" rx="14" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)" strokeWidth="2" />
                  <text x="50" y="62" fontFamily="Inter,sans-serif" fontSize="34" fontWeight="800" fill="#fff" textAnchor="middle" opacity=".8">
                    U
                  </text>
                </svg>
                <h4>Sẵn sàng tham gia cùng DigiU?</h4>
                <p>Khám phá hệ sinh thái và tham gia cùng cộng đồng DigiU.</p>
                {registerLink ? (
                  <a className="cta-link-btn" href={registerLink} target="_blank" rel="noopener noreferrer">
                    Tham gia ngay
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                ) : (
                  <button disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                    Chưa có link đăng ký
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
