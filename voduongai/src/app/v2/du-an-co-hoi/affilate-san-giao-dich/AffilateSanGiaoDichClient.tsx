"use client";

/* =============================================================================
 * Affilate sàn giao dịch 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/Affilate san giao dich.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `affilate-san-giao-dich.css` (chép nguyên văn).
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh:
 *
 *  1. Trang này (`nav-parent="Du an Co hoi.html"` trong mockup gốc) map
 *     sang hệ sinh thái THẬT `eco_trading` (slug `sangiaodich`, "Các sàn
 *     giao dịch Crypto") — `ecosystem_chrome.exchanges` (7 sàn: Binance/
 *     OKX/MEXC/Bybit/Kucoin/Gate/Bitget) đã có `url` link affiliate THẬT
 *     (Founder cung cấp trực tiếp, cập nhật qua `execute_sql`) — KHỚP
 *     CHÍNH XÁC 7 thẻ mẫu trong bản thiết kế.
 *  2. `page-head p` dùng `chrome.shortDescription` thật. `aff-hero p` dùng
 *     `chrome.fullIntro` thật.
 *  3. Mỗi `aff-card` — icon/mô tả/nhãn hoa hồng (`tagLabel`, vd "Hoa hồng
 *     trọn đời đến 50%") giữ đúng bản thiết kế gốc cho 7 sàn khớp tên
 *     thật (tra theo `exchange.id` cố định: `exc_binance`/`exc_okx`/
 *     `exc_mexc`/`exc_bybit`/`exc_kucoin`/`exc_gate`/`exc_bitget`) — đây
 *     là mô tả CHUNG về cách chương trình affiliate công khai của từng
 *     sàn hoạt động (không phải số liệu riêng của VDUONG AI), đã có sẵn %
 *     hoa hồng từ bản thiết kế gốc nên không cần bổ sung thêm. Nút "Đăng
 *     ký chương trình →" CHỈ hoạt động khi `exchange.url` có thật; rỗng
 *     thì hiện dòng trung thực "Chưa có link chính thức — sẽ cập nhật khi
 *     có." — không tự bịa link.
 *  4. Ô "Dán link affiliate ___ của bạn" + nút "Lưu" — ĐÃ BỎ theo yêu cầu
 *     Founder (chỉ lưu `localStorage` cá nhân, không có tác dụng thật).
 *  5. Sàn nào không nằm trong 7 id đã biết (Admin thêm mới qua Admin sau
 *     này) vẫn hiển thị được — dùng icon/màu chung mặc định, không crash.
 * ========================================================================== */

import { useRouter } from "next/navigation";

import type { EcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import type { MarketingLink } from "@/data/portal/ecosystems";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../../inter-gf.css";
import "./affilate-san-giao-dich.css";

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
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

type CardStyle = {
  bg: string;
  stroke: string;
  icon: React.ReactNode;
  desc: string;
  sub: string;
  tagLabel: string;
  tagBg: string;
  tagColor: string;
};

const CARD_STYLE: Record<string, CardStyle> = {
  exc_binance: {
    bg: "linear-gradient(145deg,#f0b90b,#ad7f00)",
    stroke: "#1a1400",
    icon: <><path d="M12 2l3 3-3 3-3-3zM12 16l3 3-3 3-3-3zM5 9l3 3-3 3-3-3zM19 9l3 3-3 3-3-3z" /><path d="M12 9l3 3-3 3-3-3z" /></>,
    desc: "Giới thiệu người dùng mới đến Binance qua link/mã giới thiệu, nhận hoa hồng liên tục từ phí giao dịch của họ.",
    sub: "Sàn giao dịch crypto lớn nhất thế giới",
    tagLabel: "Hoa hồng trọn đời đến 50%",
    tagBg: "#fdf6dc",
    tagColor: "#ad7f00",
  },
  exc_okx: {
    bg: "linear-gradient(145deg,#1a1a1a,#000)",
    stroke: "#fff",
    icon: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 15V9l6 3-6 3z" /></>,
    desc: "Chia sẻ link giới thiệu OKX, nhận hoa hồng từ phí giao dịch spot, futures của người dùng được mời.",
    sub: "Sàn giao dịch & Web3 toàn cầu",
    tagLabel: "Hoa hồng theo cấp bậc",
    tagBg: "#eceff1",
    tagColor: "#1a1a1a",
  },
  exc_mexc: {
    bg: "linear-gradient(145deg,#1e63ff,#0a3fc2)",
    stroke: "#fff",
    icon: <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>,
    desc: "Giới thiệu người dùng đến MEXC, hưởng hoa hồng từ phí giao dịch với chính sách trả thưởng minh bạch.",
    sub: "Sàn giao dịch niêm yết coin mới nhanh",
    tagLabel: "Hoa hồng đến 40%",
    tagBg: "#e6edff",
    tagColor: "#0a3fc2",
  },
  exc_bybit: {
    bg: "linear-gradient(145deg,#f7a600,#c27f00)",
    stroke: "#1a1400",
    icon: <path d="M13 2L3 14h7l-1 8 10-12h-7z" />,
    desc: "Chia sẻ link giới thiệu Bybit, nhận hoa hồng từ giao dịch spot và futures của người dùng mời.",
    sub: "Sàn giao dịch Derivatives hàng đầu",
    tagLabel: "Hoa hồng theo khối lượng",
    tagBg: "#fff3dc",
    tagColor: "#c27f00",
  },
  exc_kucoin: {
    bg: "linear-gradient(145deg,#24ae8f,#136b57)",
    stroke: "#fff",
    icon: <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></>,
    desc: "Giới thiệu người dùng mới tới KuCoin, nhận hoa hồng liên tục từ phí giao dịch của họ.",
    sub: "Sàn giao dịch đa dạng altcoin",
    tagLabel: "Hoa hồng trọn đời",
    tagBg: "#e2f6f0",
    tagColor: "#136b57",
  },
  exc_gate: {
    bg: "linear-gradient(145deg,#17e6a1,#0aa876)",
    stroke: "#0c2b1f",
    icon: <><path d="M4 19h16M7 15l3-4 3 3 5-7" /></>,
    desc: "Chia sẻ link giới thiệu Gate.io, nhận hoa hồng ổn định từ phí giao dịch của cộng đồng bạn xây dựng.",
    sub: "Sàn giao dịch lâu đời, đa dạng token",
    tagLabel: "Hoa hồng theo cấp bậc VIP",
    tagBg: "#e1fbf1",
    tagColor: "#066b4d",
  },
  exc_bitget: {
    bg: "linear-gradient(145deg,#00d1a3,#00987a)",
    stroke: "#062f26",
    icon: <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M9 9h6v6H9z" /></>,
    desc: "Giới thiệu người dùng đến Bitget, nhận hoa hồng từ giao dịch spot, futures và copy trading.",
    sub: "Sàn giao dịch Copy Trading hàng đầu",
    tagLabel: "Hoa hồng đến 50%",
    tagBg: "#dffaf3",
    tagColor: "#00987a",
  },
};

const DEFAULT_STYLE: CardStyle = {
  bg: "linear-gradient(145deg,#8b6bff,#5a37e6)",
  stroke: "#fff",
  icon: <path d="M13 2L3 14h7l-1 8 10-12h-7z" />,
  desc: "Sàn giao dịch crypto — gắn link giới thiệu để bắt đầu theo dõi.",
  sub: "Chương trình Affiliate",
  tagLabel: "Chương trình Affiliate",
  tagBg: "var(--violet-light)",
  tagColor: "var(--violet)",
};

function ExchangeCard({ exchange }: { exchange: MarketingLink }) {
  const style = CARD_STYLE[exchange.id] ?? DEFAULT_STYLE;

  return (
    <div className="aff-card">
      <div className="aff-top">
        <div className="ico" style={{ background: style.bg }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={style.stroke} strokeWidth="1.8">
            {style.icon}
          </svg>
        </div>
        <div>
          <h4>{exchange.label}</h4>
          <span>{style.sub}</span>
        </div>
      </div>
      <div className="aff-body">
        <p>{style.desc}</p>
        <span className="comm-tag" style={{ background: style.tagBg, color: style.tagColor }}>
          {style.tagLabel}
        </span>
        {exchange.url ? (
          <a href={exchange.url} target="_blank" rel="noopener noreferrer" className="go-btn">
            Đăng ký chương trình →
          </a>
        ) : (
          <span className="go-btn-disabled">Chưa có link chính thức — sẽ cập nhật khi có.</span>
        )}
      </div>
    </div>
  );
}

export function AffilateSanGiaoDichClient({ chrome, premium }: { chrome: EcosystemChrome; premium: PremiumStatus }) {
  const router = useRouter();

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const exchanges = chrome.exchanges.filter((e) => e.visible);

  return (
    <div className="asg">
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
              <button className="nav-item" onClick={() => go("SolarGroup.html")}>
                SolarGroup
              </button>
              <button className="nav-item" onClick={() => go("Ohana.html")}>
                Ohana
              </button>
              <button className="nav-item" onClick={() => go("Cac mo hinh Affilate.html")}>
                Các mô hình Affilate
              </button>
              <button className="nav-item active">Affilate sàn giao dịch</button>
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
            <PortalSearchBox placeholder="Tìm kiếm sàn giao dịch, chương trình affiliate..." variant="box" />
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
            <div className="page-head">
              <h1>Affilate sàn giao dịch</h1>
              <p>{chrome.shortDescription}</p>
            </div>

            <div className="aff-hero">
              <div className="aff-hero-text">
                <div className="tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19h16M7 15l3-4 3 3 5-7" />
                  </svg>
                  HOA HỒNG GIAO DỊCH
                </div>
                <h2>Giới thiệu sàn — nhận hoa hồng mỗi giao dịch</h2>
                <p>{chrome.fullIntro}</p>
              </div>
              <div className="aff-graphic">
                <div className="net-glow" />
                <svg width="260" height="200" viewBox="0 0 260 200" fill="none">
                  <circle cx="60" cy="100" r="26" fill="rgba(80,60,180,.4)" stroke="#8b6bff" strokeWidth="1.4" className="node-float" style={{ animationDelay: "0s" }} />
                  <path d="M86 100h60" stroke="#6d84ff" strokeWidth="1.6" strokeDasharray="4 4" />
                  <path d="M146 100l-8-4M146 100l-8 4" stroke="#6d84ff" strokeWidth="1.6" />
                  <g className="node-float" style={{ animationDelay: ".3s" }}>
                    <circle cx="180" cy="55" r="16" fill="rgba(80,60,180,.35)" stroke="#9b7bff" strokeWidth="1.3" />
                    <text x="180" y="60" fontFamily="Inter,sans-serif" fontSize="11" fontWeight="800" fill="#fff" textAnchor="middle">
                      %
                    </text>
                  </g>
                  <g className="node-float" style={{ animationDelay: ".6s" }}>
                    <circle cx="215" cy="100" r="16" fill="rgba(80,60,180,.35)" stroke="#9b7bff" strokeWidth="1.3" />
                    <text x="215" y="105" fontFamily="Inter,sans-serif" fontSize="11" fontWeight="800" fill="#fff" textAnchor="middle">
                      %
                    </text>
                  </g>
                  <g className="node-float" style={{ animationDelay: ".9s" }}>
                    <circle cx="180" cy="145" r="16" fill="rgba(80,60,180,.35)" stroke="#9b7bff" strokeWidth="1.3" />
                    <text x="180" y="150" fontFamily="Inter,sans-serif" fontSize="11" fontWeight="800" fill="#fff" textAnchor="middle">
                      %
                    </text>
                  </g>
                  <rect className="rise-bar" x="30" y="160" width="12" height="26" rx="2" fill="#e2b23c" style={{ animationDelay: "0s" }} />
                  <rect className="rise-bar" x="48" y="150" width="12" height="36" rx="2" fill="#f0c96a" style={{ animationDelay: ".3s" }} />
                  <rect className="rise-bar" x="66" y="140" width="12" height="46" rx="2" fill="#e2b23c" style={{ animationDelay: ".6s" }} />
                  <path d="M60 74a26 26 0 019 3" stroke="#c9bdff" strokeWidth="1.6" fill="none" />
                </svg>
              </div>
            </div>

            <div className="section-head">
              <h3>Sàn giao dịch đang mở chương trình</h3>
            </div>
            {exchanges.length === 0 ? (
              <p className="empty-hint">Chưa có sàn giao dịch nào được công bố.</p>
            ) : (
              <div className="aff-grid">
                {exchanges.map((exchange) => (
                  <ExchangeCard exchange={exchange} key={exchange.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
