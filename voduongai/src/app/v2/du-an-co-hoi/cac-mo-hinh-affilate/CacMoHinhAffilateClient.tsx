"use client";

/* =============================================================================
 * Các mô hình Affilate 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/Cac mo hinh Affilate.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `cac-mo-hinh-affilate.css` (chép nguyên văn).
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh:
 *
 *  1. Trang này (`nav-parent="Du an Co hoi.html"` trong mockup gốc) map
 *     sang hệ sinh thái THẬT `eco_blockchain` (slug `lam-affilate`, "Làm
 *     tiếp thị liên kết") — `ecosystem_chrome.affiliateOffers` (4 chương
 *     trình: Lazada/Shopee/Unica/Khởi Nguyên MMO) đã có `url` link
 *     affiliate THẬT (Founder cung cấp trực tiếp, cập nhật qua
 *     `execute_sql` — Admin có thể sửa lại sau qua
 *     `/admin/duan-cohoi/lam-affilate`). Bản thiết kế có 5 thẻ mẫu (thêm
 *     "TikTok Shop Affiliate") — KHÔNG có trong dữ liệu thật, không tự
 *     thêm vào.
 *  2. `page-head p` dùng `chrome.shortDescription` thật. `aff-hero p` dùng
 *     `chrome.fullIntro` thật.
 *  3. Mỗi `aff-card` — icon giữ đúng bản thiết kế CHỈ cho 4 chương trình
 *     khớp tên thật (tra theo `offer.id` cố định: `aff_lazada`/
 *     `aff_shopee`/`aff_unica`/`aff_khoi_nguyen_mmo`). `desc` mỗi thẻ thêm
 *     1 câu về chính sách hoa hồng/thanh toán — KHÔNG bịa % cụ thể (dự án
 *     không có số liệu hoa hồng thật của từng nền tảng, Founder yêu cầu
 *     "tự bổ sung" nhưng vẫn phải tránh khẳng định số liệu không kiểm
 *     chứng được — chỉ ghi chung "theo đúng chính sách [nền tảng] công
 *     bố", không phát minh con số %). Nút "Đăng ký chương trình →" CHỈ
 *     hoạt động khi `offer.url` có thật; rỗng thì hiện dòng trung thực
 *     "Chưa có link chính thức — sẽ cập nhật khi có." — không tự bịa link.
 *  4. Ô "Dán link affiliate ___ của bạn" + nút "Lưu" — ĐÃ BỎ theo yêu cầu
 *     Founder ("không có tác dụng" — chỉ lưu vào `localStorage` cá nhân
 *     trình duyệt, không phục vụ mục tiêu affiliate thật nào).
 *  5. Chương trình nào không nằm trong 4 id đã biết (Admin thêm mới qua
 *     Admin sau này) vẫn hiển thị được — dùng icon/màu chung mặc định,
 *     không crash.
 * ========================================================================== */

import { useRouter } from "next/navigation";

import type { EcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import type { MarketingLink } from "@/data/portal/ecosystems";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../../inter-gf.css";
import "./cac-mo-hinh-affilate.css";

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
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
};

type CardStyle = {
  bg: string;
  icon: React.ReactNode;
  desc: string;
  tagBg: string;
  tagColor: string;
};

/** Chỉ khớp đúng 4 id thật đã biết — chương trình mới (id lạ) dùng fallback. */
const CARD_STYLE: Record<string, CardStyle> = {
  aff_lazada: {
    bg: "linear-gradient(145deg,#5f8fff,#0a3d91)",
    icon: <><path d="M3 6h18l-2 12H5z" /><path d="M8 10V6a4 4 0 018 0v4" /></>,
    desc: "Chia sẻ link sản phẩm Lazada, nhận hoa hồng cho mỗi đơn hàng thành công qua liên kết của bạn. Mức hoa hồng theo đúng chính sách Lazada công bố cho từng ngành hàng, thanh toán định kỳ, không giới hạn số lượt giới thiệu.",
    tagBg: "#e6f0ff",
    tagColor: "#0a3d91",
  },
  aff_shopee: {
    bg: "linear-gradient(145deg,#ff7a45,#c2410c)",
    icon: <><path d="M6 8h12l1 12H5z" /><path d="M9 8a3 3 0 016 0" /></>,
    desc: "Chia sẻ sản phẩm Shopee qua link/mã giới thiệu, nhận hoa hồng hấp dẫn từ mỗi giao dịch mua hàng. Mức hoa hồng theo đúng chính sách Shopee Affiliate công bố cho từng ngành hàng, thanh toán định kỳ.",
    tagBg: "#fff1e6",
    tagColor: "#c2410c",
  },
  aff_unica: {
    bg: "linear-gradient(145deg,#8b6bff,#5a37e6)",
    icon: <><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></>,
    desc: "Giới thiệu các khóa học trên Unica, nhận hoa hồng cho mỗi học viên đăng ký thành công qua link của bạn. Hoa hồng tính trên giá trị đơn hàng, kèm bảng theo dõi hoa hồng riêng của Unica.",
    tagBg: "var(--violet-light)",
    tagColor: "var(--violet)",
  },
  aff_khoi_nguyen_mmo: {
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    icon: <path d="M13 2L3 14h7l-1 8 10-12h-7z" />,
    desc: "Giới thiệu khóa học Khởi Nguyên MMO tới cộng đồng, nhận hoa hồng cho mỗi học viên đăng ký qua link giới thiệu. Không giới hạn số lượt giới thiệu, hoa hồng tính trên giá trị khoá học đã mua.",
    tagBg: "#e6f7ed",
    tagColor: "#189a52",
  },
};

const DEFAULT_STYLE: CardStyle = {
  bg: "linear-gradient(145deg,#8b6bff,#5a37e6)",
  icon: <path d="M13 2L3 14h7l-1 8 10-12h-7z" />,
  desc: "Chương trình tiếp thị liên kết — gắn link giới thiệu để bắt đầu theo dõi.",
  tagBg: "var(--violet-light)",
  tagColor: "var(--violet)",
};

function AffiliateCard({ offer }: { offer: MarketingLink }) {
  const style = CARD_STYLE[offer.id] ?? DEFAULT_STYLE;

  return (
    <div className="aff-card">
      <div className="aff-top">
        <div className="ico" style={{ background: style.bg }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
            {style.icon}
          </svg>
        </div>
        <div>
          <h4>{offer.label}</h4>
          <span>{offer.category}</span>
        </div>
      </div>
      <div className="aff-body">
        <p>{style.desc}</p>
        <span className="comm-tag" style={{ background: style.tagBg, color: style.tagColor }}>
          {offer.category}
        </span>
        {offer.url ? (
          <a href={offer.url} target="_blank" rel="noopener noreferrer" className="go-btn">
            Đăng ký chương trình →
          </a>
        ) : (
          <span className="go-btn-disabled">Chưa có link chính thức — sẽ cập nhật khi có.</span>
        )}
      </div>
    </div>
  );
}

export function CacMoHinhAffilateClient({ chrome, premium }: { chrome: EcosystemChrome; premium: PremiumStatus }) {
  const router = useRouter();

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const offers = chrome.affiliateOffers.filter((o) => o.visible);

  return (
    <div className="cma">
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
              <button className="nav-item active">Các mô hình Affilate</button>
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
          </nav>

          <nav className="main">
            <button className="nav-item" onClick={() => go("Hanh trinh cua toi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              Hành trình của tôi
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
            <PortalSearchBox placeholder="Tìm kiếm mô hình, chương trình affiliate..." variant="box" />
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
              <h1>Các mô hình Affilate</h1>
              <p>{chrome.shortDescription}</p>
            </div>

            <div className="aff-hero">
              <div className="aff-hero-text">
                <div className="tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
                  </svg>
                  THU NHẬP THỤ ĐỘNG
                </div>
                <h2>Một link — nhiều nguồn thu nhập</h2>
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
              <h3>Chương trình đang mở</h3>
            </div>
            {offers.length === 0 ? (
              <p className="empty-hint">Chưa có chương trình affiliate nào được công bố.</p>
            ) : (
              <div className="aff-grid">
                {offers.map((offer) => (
                  <AffiliateCard offer={offer} key={offer.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
