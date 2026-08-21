"use client";

/* =============================================================================
 * Ohana 2.0 — chuyển 1:1 từ `design_handoff_vo_duong_ai/Ohana.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `ohana.css` (chép nguyên văn, xem đầu file đó).
 *
 * ---------------------------------------------------------------------------
 * KHÁC HẲN mọi trang khác trong họ "Dự án & Cơ hội" (DigiU/SolarGroup) —
 * theo đúng lệnh riêng của Founder cho trang này: nội dung Ohana là THIẾT
 * KẾ MỚI, không map vào dữ liệu thật nào đã có (đặc biệt KHÔNG map vào
 * `eco_crypto`/"Blockchain & Crypto" dù cùng vị trí trong menu) — "không
 * tự suy đoán ý nghĩa hoặc tự chọn cách map gần đúng nhất". Vì vậy toàn bộ
 * nội dung trang này giữ TĨNH 100%, đúng nguyên văn bản thiết kế — không
 * có chỗ nào "khác bản tĩnh" như các trang khác trong Bước F.
 *
 * Phần DUY NHẤT nối dữ liệu thật: `premium` (trạng thái Premium của phiên
 * đang xem, dùng để ẩn promo sidebar + hiện nhãn Free/Premium ở topbar) —
 * đây là cơ chế chung của toàn bộ Shell `/v2`, không phải nội dung riêng
 * của Ohana.
 *
 * CÒN GIỮ NGUYÊN "TRƠ" NHƯ BẢN GỐC: 8 tab trong `.tabs-row` chỉ đổi trạng
 * thái active. Nút "Theo dõi"/"Chia sẻ"/"Tải Whitepaper"/mọi CTA không có
 * đích thật giữ nguyên như bản thiết kế (không có backend nào phía sau).
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../../inter-gf.css";
import "./ohana.css";

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

const TABS = ["Tổng quan", "Vũ trụ Ohana", "Công nghệ", "Tokenomics", "Lộ trình", "Cộng đồng", "Tin tức", "Tài liệu"];

const STATS = [
  { num: "11+", lbl: "Sản phẩm trụ cột", sub: "Astronixa, AstroPay…", bg: "linear-gradient(145deg,#8b6bff,#5a37e6)", icon: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> },
  { num: "4", lbl: "Giai đoạn lộ trình", sub: "Đến Q2/2027", bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)", icon: <path d="M4 19h16M7 15l3-4 3 3 5-7" /> },
  { num: "3", lbl: "Trụ giá trị chính", sub: "SaaS · Social Commerce · Blockchain", bg: "linear-gradient(145deg,#a08bff,#6d4aff)", icon: <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" /> },
  { num: "Astron", lbl: "Token gốc hệ sinh thái", sub: "Mô hình giảm phát (burn)", bg: "linear-gradient(145deg,#e2b23c,#b3801f)", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></> },
  { num: "Q2/2027", lbl: "Ra mắt Token toàn cầu", sub: "Niêm yết DEX & CEX", bg: "linear-gradient(145deg,#3ecf7e,#189a52)", icon: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /> },
];

const PILLARS = [
  { bg: "linear-gradient(145deg,#a08bff,#6d4aff)", title: "Astronixa & AstroPay", desc: "Nền tảng cốt lõi và ví thanh toán lai kết nối Fiat với Crypto trong toàn hệ sinh thái.", icon: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> },
  { bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)", title: "OhanaSocial & Ohana Meet", desc: "Mạng xã hội, giao tiếp nhóm và xây dựng cộng đồng gắn kết trên toàn cầu.", icon: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="3" /><path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" /></> },
  { bg: "linear-gradient(145deg,#ff9d52,#c2660a)", title: "Ohana-C & AstroBuy", desc: "Hệ thống thương mại điện tử nhẹ, hỗ trợ người bán và mở rộng qua tiếp thị liên kết.", icon: <><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 17l9 4 9-4M3 12l9 4 9-4" /></> },
  { bg: "linear-gradient(145deg,#3ecf7e,#189a52)", title: "AstroPlay & AstroChain", desc: "Cổng game hoá tích điểm và lớp Blockchain ánh xạ phần thưởng thành token Astron.", icon: <path d="M4 4h6v16H4zM14 4h6v16h-6z" /> },
];

const ROADMAP = [
  { done: true, dot: "1", yr: "Q3/2026", text: "Nền tảng: Social, Commerce & Wallet" },
  { done: false, dot: "2", yr: "Q4/2026", text: "Cỗ máy doanh thu: SaaS & mở rộng kiếm tiền" },
  { done: false, dot: "3", yr: "Giai đoạn 3", text: "Giữ chân & mở rộng hệ sinh thái" },
  { done: false, dot: "4", yr: "Q2/2027", text: "Kinh tế Token & thanh khoản toàn cầu" },
];

const TOKEN_ROWS = [
  { lbl: "Universal Utility", val: "Toàn hệ sinh thái" },
  { lbl: "Game Earning", val: "AstroPlay" },
  { lbl: "Deflationary Model", val: "Buyback & Burn" },
  { lbl: "Hybrid Wallet", val: "Fiat ⇄ Crypto" },
];

const NEWS = [
  { bg: "linear-gradient(145deg,#241c4d,#5a37e6)", stroke: "#c9bdff", cat: "PHASE 1", catColor: "#6d4aff", title: "Ohana Social & Wallet v1 dự kiến ra mắt Q3/2026", time: "Sắp tới", icon: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="3" /><path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" /></> },
  { bg: "linear-gradient(145deg,#c2660a,#8b4a08)", stroke: "#ffe4c2", cat: "SAAS", catColor: "#c2660a", title: "Chuẩn bị ra mắt nền tảng SaaS & CRM cho doanh nghiệp", time: "Q4/2026", icon: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></> },
  { bg: "linear-gradient(145deg,#0e7490,#0e2a44)", stroke: "#9fd4ff", cat: "TOKEN", catColor: "#0e7490", title: "Astron Token dự kiến niêm yết DEX vào Q2/2027", time: "Lộ trình", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></> },
];

export function OhanaClient({ premium }: { premium: PremiumStatus }) {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  return (
    <div className="oha">
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
              <button className="nav-item" onClick={() => go("DigiU.html")}>
                DigiU
              </button>
              <button className="nav-item" onClick={() => go("SolarGroup.html")}>
                SolarGroup
              </button>
              <button className="nav-item active">Ohana</button>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="#c9bdff" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="9" />
                    <ellipse cx="12" cy="12" rx="9" ry="3.5" />
                    <path d="M12 3v18" />
                  </svg>
                </div>
                <div className="profile-info">
                  <h1>
                    Ohana
                    <div className="verify-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </h1>
                  <p>Vũ trụ hợp nhất của giá trị và thịnh vượng số — mạng lưới siêu kết nối hợp nhất SaaS, AI và Web3 trong hệ sinh thái Astronixa.</p>
                  <div className="tag-row">
                    <span className="p-tag">SaaS &amp; Web3</span>
                    <span className="p-tag">AI</span>
                    <span className="p-tag">Decentralized</span>
                    <span className="p-since">Astronixa LLC — Delaware, Hoa Kỳ</span>
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

              <div className="oh-hero">
                <div className="oh-hero-text">
                  <h2>Ohana — Vũ trụ hợp nhất của Giá trị &amp; Thịnh vượng số</h2>
                  <p>Chào mừng đến với hệ sinh thái Ohana: mạng lưới siêu kết nối hợp nhất SaaS, AI và Web3, kiến tạo một nền kinh tế số không giới hạn cho mọi người tham gia.</p>
                  <div className="hero-btn-row">
                    <button className="btn-primary">Khám phá hệ sinh thái</button>
                    <button className="btn-ghost">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 21h16" />
                      </svg>
                      Tải Whitepaper
                    </button>
                  </div>
                </div>
                <div className="oh-graphic">
                  <div className="net-glow" />
                  <svg width="300" height="220" viewBox="0 0 300 220" fill="none">
                    <g className="orbit-spin">
                      <ellipse cx="150" cy="110" rx="120" ry="42" fill="none" stroke="#6d84ff" strokeWidth="1.2" opacity=".6" />
                    </g>
                    <g className="orbit-spin2">
                      <ellipse cx="150" cy="110" rx="90" ry="66" fill="none" stroke="#9b7bff" strokeWidth="1.2" opacity=".5" />
                    </g>
                    <circle cx="150" cy="110" r="28" fill="url(#coreGrad)" stroke="#c9bdff" strokeWidth="1.6" />
                    <path d="M138 110l7 7 14-16" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <g className="net-node" style={{ animationDelay: "0s" }}>
                      <circle cx="30" cy="110" r="14" fill="rgba(80,60,180,.4)" stroke="#8b6bff" strokeWidth="1.3" />
                    </g>
                    <g className="net-node" style={{ animationDelay: ".5s" }}>
                      <circle cx="270" cy="110" r="14" fill="rgba(80,60,180,.4)" stroke="#8b6bff" strokeWidth="1.3" />
                    </g>
                    <g className="net-node" style={{ animationDelay: "1s" }}>
                      <circle cx="150" cy="44" r="12" fill="rgba(80,60,180,.4)" stroke="#8b6bff" strokeWidth="1.3" />
                    </g>
                    <g className="net-node" style={{ animationDelay: "1.5s" }}>
                      <circle cx="150" cy="176" r="12" fill="rgba(80,60,180,.4)" stroke="#8b6bff" strokeWidth="1.3" />
                    </g>
                    <defs>
                      <linearGradient id="coreGrad" x1="122" y1="82" x2="178" y2="138">
                        <stop offset="0" stopColor="#9b7bff" />
                        <stop offset="1" stopColor="#1a1044" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="stat-row">
                {STATS.map((s) => (
                  <div className="stat-box" key={s.lbl}>
                    <div className="ico" style={{ background: s.bg }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                        {s.icon}
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
                  <h3>Về Ohana</h3>
                  <p>
                    Ohana là hệ sinh thái của Astronixa, kết hợp SaaS, mạng xã hội — thương mại và hạ tầng Blockchain thành một chuỗi giá trị liền
                    mạch. Trung tâm của hệ sinh thái là cỗ máy doanh thu xoay quanh ví lai (Hybrid Wallet) — cầu nối an toàn giữa Fiat và Crypto,
                    thưởng minh bạch cho mọi người tham gia.
                  </p>
                  <div className="check-list">
                    <div className="check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Hợp nhất SaaS, Social Commerce và hạ tầng Blockchain
                    </div>
                    <div className="check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Ví lai (Hybrid Wallet) kết nối Fiat và Crypto
                    </div>
                    <div className="check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Cơ chế thưởng minh bạch cho mọi người tham gia
                    </div>
                    <div className="check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Token Astron với mô hình giảm phát (burn) dài hạn
                    </div>
                  </div>
                  <a href="#">Xem thêm về Ohana →</a>
                </div>
                <div className="video-card">
                  <div className="vtitle">Astronixa</div>
                  <div className="vsub">
                    Universe
                    <br />
                    Overview
                  </div>
                  <button className="play-btn">
                    <svg viewBox="0 0 24 24" fill="#fff">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <span className="video-time">03:20</span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14 }}>Các trụ cột chiến lược của Ohana</h3>
                <div className="pillars-grid">
                  {PILLARS.map((p) => (
                    <div className="pillar-card" key={p.title}>
                      <div className="ico" style={{ background: p.bg }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                          {p.icon}
                        </svg>
                      </div>
                      <h5>{p.title}</h5>
                      <p>{p.desc}</p>
                      <a href="#">Khám phá →</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Lộ trình chiến lược</h4>
                </div>
                <div className="roadmap">
                  {ROADMAP.map((r) => (
                    <div className={r.done ? "rm-item done" : "rm-item"} key={r.dot}>
                      <div className="rm-dot">{r.dot}</div>
                      <div className="rm-text">
                        <div className="yr">{r.yr}</div>
                        <h6>{r.text}</h6>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Token Ecosystem</h4>
                </div>
                {TOKEN_ROWS.map((row) => (
                  <div className="fin-row" key={row.lbl}>
                    <span className="lbl">{row.lbl}</span>
                    <span className="val">{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Tin tức nổi bật</h4>
                  <a href="#">Xem tất cả →</a>
                </div>
                {NEWS.map((n) => (
                  <div className="news-row" key={n.title}>
                    <div className="news-thumb" style={{ background: n.bg }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={n.stroke} strokeWidth="1.8">
                        {n.icon}
                      </svg>
                    </div>
                    <div>
                      <div className="news-cat" style={{ color: n.catColor }}>
                        {n.cat}
                      </div>
                      <h6>{n.title}</h6>
                      <span className="time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cta-card">
                <h4>Sẵn sàng bước vào Vũ trụ Ohana?</h4>
                <p>Tham gia phong trào và trở thành một phần của hệ sinh thái số toàn diện nhất.</p>
                <button>
                  Bắt đầu ngay
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
