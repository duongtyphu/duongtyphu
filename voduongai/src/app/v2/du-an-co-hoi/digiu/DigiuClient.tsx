"use client";

/* =============================================================================
 * DigiU 2.0 — chuyển 1:1 từ `design_handoff_vo_duong_ai/DigiU.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `digiu.css` (chép nguyên văn, xem đầu file đó).
 *
 * ---------------------------------------------------------------------------
 * ĐỢT SỬA GIAI ĐOẠN 4 PHẦN 2 (theo nội dung Founder cung cấp trực tiếp —
 * KHÁC hẳn hướng đi trước đó): các con số/tên tổ chức ("3,2 triệu người
 * theo dõi", "quỹ WebWise Capital", "20+ quỹ đối tác"...) từng bị coi là
 * "không kiểm chứng được" ở đợt build đầu (nên đã thay bằng dữ liệu
 * `ecosystem_chrome` trung thực/khiêm tốn) — giờ Founder (chủ sở hữu dữ
 * liệu) trực tiếp xác nhận đây là nội dung THẬT, không phải suy đoán từ
 * mockup nữa. Toàn bộ nội dung dưới đây là literal string cố định do
 * Founder cung cấp — KHÔNG map vào `chrome.shortDescription`/`fullIntro`/
 * `highlights` (những field đó không khớp cấu trúc "3 badge + follower
 * count" mới), nhưng `chrome.links`/`chrome.videos`/`chrome.documents`
 * vẫn dùng dữ liệu Supabase thật như trước (không đổi).
 *
 *  1. Logo — thay khối "U" text bằng ảnh logo thật (`/images/duan-cohoi/
 *     logos/digiu-logo.jpg`, tải trực tiếp từ Drive Founder cung cấp).
 *  2. `profile-head` — mô tả ngắn + 3 badge (AI & Blockchain/VC Funding/
 *     Web3) + "3,2 triệu+ người theo dõi cộng đồng" — literal Founder cấp.
 *  3. `digiu-hero` — tiêu đề + đoạn giới thiệu literal Founder cấp.
 *  4. `stat-row` (5 ô số liệu marketing) — ĐÃ BỎ HẲN theo yêu cầu Founder.
 *  5. 8 tab giờ CHỨC NĂNG THẬT (trước chỉ đổi trạng thái active, không đổi
 *     nội dung) — còn lại 6 tab: Tổng quan/Sản phẩm/Lộ trình/Tổng số lượng
 *     cổ phần (đổi tên từ "Tokenomics")/Tin tức/Tài liệu. Bỏ hẳn "Dự án"
 *     (gộp "Các dự án con" vào tab Tổng quan) và "Câu hỏi thường gặp".
 *     - Tổng quan: "Về DigiU" (literal Founder cấp) + video YouTube thật
 *       nhúng trực tiếp (`chrome.videos[0]`, bấm play mới tải iframe) +
 *       "Các dự án con" thật (giữ nguyên `getLiveSubProjects`).
 *     - Sản phẩm: 3 sản phẩm thật DigiU (Thẻ WebWise Pay/Tiền gửi RWA/
 *       Alpha Mind AI Academy) — Claude soạn lại ngắn gọn từ tài liệu
 *       Founder gửi (Google Docs), không phải dữ liệu Supabase.
 *     - Lộ trình: 4 giai đoạn lộ trình gọi vốn (Bridge Round/Scale Up/
 *       Liquidity Event/Value Realization) — soạn lại từ infographic
 *       Founder gửi.
 *     - Tổng số lượng cổ phần: tỷ lệ sở hữu cổ phần + 3 vòng gọi vốn —
 *       soạn lại từ infographic Founder gửi.
 *     - Tin tức: băng marquee "Cập nhật thông tin mới" (bài viết thật
 *       `articles` prop, đúng `ecosystem_articles` — không phải nội dung
 *       mới, chỉ đổi cách hiển thị từ danh sách sang băng chạy).
 *     - Tài liệu: link tới thư mục Drive tài liệu DigiU Founder cung cấp.
 *  6. Đã bỏ MỌI link trỏ ngược Portal 1.0 (đúng NGUYÊN TẮC BẤT BIẾN đầu
 *     file này) — "Xem thêm về DigiU →" (about-text), "Xem chi tiết →"
 *     (Đánh giá nhanh), "Xem tất cả →" (Tin tức nổi bật), "Khám phá →"
 *     (mỗi thẻ dự án con) đều không có đích `/v2/*` tương đương nên XOÁ
 *     hẳn thay vì trỏ bậy — không phải quên, là quyết định có chủ đích.
 *  7. "Đánh giá nhanh"/"Đường link liên kết"/"Tin tức nổi bật" (cột phải)/
 *     CTA cuối trang — giữ nguyên nối dữ liệu thật (`ecosystem_ratings`/
 *     `chrome.links`/`ecosystem_articles`) như bản trước, chỉ bỏ các link
 *     portal 1.0 nêu ở mục 6.
 *
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
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";
import { toYouTubeEmbedUrl } from "@/lib/portal/videoEmbed";

import "../../inter-gf.css";
import "./digiu.css";

/** Thư mục tài liệu DigiU thật trên Drive (Founder cấp trực tiếp trong phiên
 * này) — dùng cho tab "Tài liệu". Không có nguồn `chrome.documents` tương
 * đương (đó là danh sách link rời, đây là 1 thư mục tổng hợp). */
const DIGIU_DOCS_FOLDER_URL =
  "https://drive.google.com/drive/folders/17f4zh0T5-ePDbx5AEysSIE_l8vLm7ku_?usp=drive_link";

/** Đích điều hướng của mockup (tên file `.html`) → route thật trong `/v2`. */
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

const TABS = ["Tổng quan", "Sản phẩm", "Lộ trình", "Tổng số lượng cổ phần", "Tin tức", "Tài liệu"];

/** Sản phẩm thật của DigiU — Claude soạn lại ngắn gọn từ 3 tài liệu Google
 * Docs Founder gửi (Thẻ WebWise Pay, Tiền gửi DigiU, Alpha Mind AI Academy).
 * Không phải dữ liệu Supabase — literal cố định theo tài liệu nguồn. */
const PRODUCTS = [
  {
    name: "Thẻ WebWise Pay",
    desc: "Thẻ MasterCard quốc tế cho phép chi tiêu trực tiếp bằng USDT/crypto — thanh toán dịch vụ AI (ChatGPT, Claude, Netflix, Spotify...), mua sắm quốc tế, vé máy bay/khách sạn. Nạp đa mạng (BSC/TON/ETH/TRX/BTC/POL), tích hợp Apple Pay/Google Pay/Samsung Pay, có cả thẻ vật lý và ứng dụng di động.",
  },
  {
    name: "Tiền gửi DigiU (RWA)",
    desc: "Công cụ đầu tư tài chính thuộc hệ thống Ngân hàng RWA — Tiền gửi Cố định (USDT, kỳ hạn 12–36 tháng, lợi suất 13–20%/năm) và Tiền gửi Linh hoạt (BTC/ETH/USDT, lợi suất đến 12%/năm, chi trả hàng tháng).",
  },
  {
    name: "Alpha Mind AI Academy",
    desc: "Chương trình đào tạo AI 3 cấp độ (Cơ bản → Nâng cao → Chuyên sâu OpenClaw) — mục tiêu bình dân hoá công nghệ AI, giúp học viên làm chủ 30+ công cụ AI và phát triển AI Agent cá nhân.",
  },
];

/** Lộ trình gia tăng giá trị cổ đông — soạn lại từ infographic Founder gửi. */
const ROADMAP_STAGES = [
  {
    stage: "01 · 2026",
    title: "Bridge Round",
    desc: "Định giá ưu đãi trước thương mại hoá — hoàn thiện sản phẩm AI Hub, mở rộng Alpha AI và thị trường toàn cầu, tăng quy mô cộng đồng.",
  },
  {
    stage: "02 · 2026–2027",
    title: "Scale Up",
    desc: "Mở rộng hệ sinh thái (AI Alpha, AI Hub, Thiết bị AI, Blockchain Infrastructure, WebWise Capital) — mục tiêu tăng trưởng doanh thu 3–5 lần.",
  },
  {
    stage: "03 · 2028–2029",
    title: "Liquidity Event",
    desc: "Các lựa chọn thanh khoản: IPO / Series A / Tokenization / Strategic Acquisition / Buy-back Program — mục tiêu vốn hoá 1+ tỷ USD.",
  },
  {
    stage: "04 · Tương lai",
    title: "Value Realization",
    desc: "Hiện thực hoá lợi nhuận cho cổ đông qua cổ tức, buy-back, IPO, thị trường thứ cấp và tokenized assets.",
  },
];

/** 3 vòng gọi vốn — soạn lại từ infographic "Các vòng gọi vốn của DigiU". */
const FUNDING_ROUNDS = [
  {
    name: "Pre-seed (Tiền hạt giống)",
    period: "01.11.2019 – 04.12.2019",
    status: "Đã kết thúc",
    desc: "Giai đoạn sớm nhất, chứng minh ý tưởng và thử nghiệm thị trường ban đầu. Nhà đầu tư: người sáng lập và nhà đầu tư thiên thần.",
  },
  {
    name: "Seed (Hạt giống)",
    period: "05.12.2019 – 30.6.2025",
    status: "Đã kết thúc",
    desc: "Phát triển sản phẩm, xây dựng đội ngũ, tạo mô hình kinh doanh. Nhà đầu tư: nhà đầu tư thiên thần, cộng đồng (crowdfunding), quỹ BR Capital.",
  },
  {
    name: "Bridge round (Vòng cầu nối)",
    period: "15.9.2025 – 15.9.2027",
    status: "Đang diễn ra",
    desc: "Tận dụng cơ hội tăng trưởng nhanh, chuẩn bị cho Series A/IPO/Tokenization. Nhà đầu tư: cộng đồng hiện tại và nhà đầu tư mới.",
  },
];

const OWNERSHIP_SHARE = [
  { label: "Đội ngũ sáng lập", pct: 51 },
  { label: "Nhà đầu tư hạt giống", pct: 29 },
  { label: "Quỹ dự trữ", pct: 20 },
];

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
  const [videoPlaying, setVideoPlaying] = useState(false);

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const firstVideo = chrome.videos.find((v) => v.visible);
  const firstVideoEmbedUrl = firstVideo ? toYouTubeEmbedUrl(firstVideo.url) : null;
  const metCount = ratings.filter((r) => r.ratingStatus === "met").length;
  const registerLink = chrome.links.find((l) => l.visible)?.url ?? "";
  const topArticles = articles.slice(0, 3);
  const visibleDocuments = chrome.documents.filter((d) => d.visible);
  const marqueeArticles = articles.length > 0 ? [...articles, ...articles] : [];

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
                {/* eslint-disable-next-line @next/next/no-img-element -- logo tĩnh cố định, không phải nội dung quản trị được */}
                <img
                  src="/images/duan-cohoi/logos/digiu-logo.jpg"
                  alt="Logo DigiU"
                  className="profile-logo"
                  style={{ objectFit: "cover", padding: 0 }}
                />
                <div className="profile-info">
                  <h1>
                    DigiU
                    <div className="verify-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </h1>
                  <p>Hệ sinh thái phát triển và gọi vốn (VC funding) cho các dự án công nghệ AI, Blockchain và Web3.</p>
                  <div className="tag-row">
                    <span className="p-tag">AI &amp; Blockchain</span>
                    <span className="p-tag">VC Funding</span>
                    <span className="p-tag">Web3</span>
                    <span className="p-since">3,2 triệu+ người theo dõi cộng đồng</span>
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
                  <h2>DigiU – Hệ sinh thái phát triển &amp; gọi vốn cho công nghệ tương lai.</h2>
                  <p>
                    DigiU nghiên cứu AI, Blockchain, Web3, RWA và năng lượng, đồng thời vận hành quỹ đầu tư mạo hiểm
                    WebWise Capital để tài trợ các startup công nghệ tiên phong trên toàn cầu.
                  </p>
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

              <div className="tabs-row">
                {TABS.map((label, i) => (
                  <button key={label} className={i === tab ? "tab active" : "tab"} onClick={() => setTab(i)}>
                    {label}
                  </button>
                ))}
              </div>

              {tab === 0 ? (
                <>
                  <div className="about-grid">
                    <div className="about-text">
                      <h3>Về DigiU</h3>
                      <p>
                        DigiU là hệ sinh thái phát triển và gọi vốn (VC funding) cho các dự án công nghệ. DigiU
                        Technical Lab nghiên cứu AI, Blockchain, RWA, VR và năng lượng, còn quỹ WebWise Capital tài
                        trợ cho các startup Blockchain, AI và Web3 giai đoạn đầu.
                      </p>
                      <div className="check-list">
                        <div className="check-item">
                          <CheckSvg />
                          7 mảng nghiên cứu: AI, Blockchain, RWA, VR, năng lượng…
                        </div>
                        <div className="check-item">
                          <CheckSvg />
                          Quỹ WebWise Capital đồng hành cùng 20+ quỹ đối tác quốc tế
                        </div>
                        <div className="check-item">
                          <CheckSvg />
                          Hơn 3,2 triệu người theo dõi trên mạng xã hội
                        </div>
                        <div className="check-item">
                          <CheckSvg />
                          Hơn 100.000 khách hàng, tăng trưởng người dùng +44%/năm
                        </div>
                      </div>
                    </div>
                    <div className="video-card">
                      {videoPlaying && firstVideoEmbedUrl ? (
                        <div style={{ position: "absolute", inset: 0 }}>
                          <iframe
                            src={`${firstVideoEmbedUrl}?autoplay=1`}
                            title={firstVideo?.label || "Video giới thiệu DigiU"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ width: "100%", height: "100%", border: "none" }}
                          />
                        </div>
                      ) : firstVideo ? (
                        <>
                          <div className="vtitle">
                            Digi<span style={{ background: "var(--violet)", padding: "1px 7px", borderRadius: 5, fontSize: 14 }}>U</span>
                          </div>
                          <div className="vsub">{firstVideo.label || "Video giới thiệu"}</div>
                          {firstVideoEmbedUrl ? (
                            <button
                              className="play-btn"
                              onClick={() => setVideoPlaying(true)}
                              aria-label="Phát video giới thiệu DigiU"
                            >
                              <svg viewBox="0 0 24 24" fill="#fff">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          ) : (
                            <a className="play-btn" href={firstVideo.url} target="_blank" rel="noopener noreferrer">
                              <svg viewBox="0 0 24 24" fill="#fff">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </a>
                          )}
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
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : null}

              {tab === 1 ? (
                <div className="pillars-grid">
                  {PRODUCTS.map((p, i) => {
                    const style = PILLAR_STYLES[i % PILLAR_STYLES.length];
                    return (
                      <div className="pillar-card" key={p.name}>
                        <div className="ico" style={{ background: style.bg }}>
                          {style.icon}
                        </div>
                        <h5>{p.name}</h5>
                        <p style={{ minHeight: "auto" }}>{p.desc}</p>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {tab === 2 ? (
                <div className="pillars-grid">
                  {ROADMAP_STAGES.map((s, i) => {
                    const style = PILLAR_STYLES[i % PILLAR_STYLES.length];
                    return (
                      <div className="pillar-card" key={s.stage}>
                        <div className="ico" style={{ background: style.bg }}>
                          {style.icon}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--violet)", marginBottom: 4 }}>{s.stage}</div>
                        <h5>{s.title}</h5>
                        <p style={{ minHeight: "auto" }}>{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {tab === 3 ? (
                <>
                  <div className="card" style={{ marginBottom: 18 }}>
                    <div className="card-head">
                      <h4>Tỷ lệ sở hữu cổ phần DigiU</h4>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                      Từ năm 2019 đến nay, hệ sinh thái DigiU đã và đang trải qua 3 vòng gọi vốn.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {OWNERSHIP_SHARE.map((o) => (
                        <div key={o.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                            <span>{o.label}</span>
                            <span>{o.pct}%</span>
                          </div>
                          <div style={{ height: 8, borderRadius: 6, background: "var(--bg)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${o.pct}%`, background: "var(--violet)", borderRadius: 6 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pillars-grid">
                    {FUNDING_ROUNDS.map((r, i) => {
                      const style = PILLAR_STYLES[i % PILLAR_STYLES.length];
                      return (
                        <div className="pillar-card" key={r.name}>
                          <div className="ico" style={{ background: style.bg }}>
                            {style.icon}
                          </div>
                          <h5>{r.name}</h5>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                            {r.period} · {r.status}
                          </div>
                          <p style={{ minHeight: "auto" }}>{r.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {tab === 4 ? (
                <div className="card">
                  <div className="card-head">
                    <h4>Cập nhật thông tin mới</h4>
                  </div>
                  {articles.length === 0 ? (
                    <p className="empty-hint">Chưa có bài viết cập nhật nào.</p>
                  ) : (
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          display: "flex",
                          width: "max-content",
                          gap: 14,
                          animation: "digiuNewsMarquee 32s linear infinite",
                        }}
                      >
                        {marqueeArticles.map((a, i) => (
                          <a
                            key={`${a.id}-${i}`}
                            href={`https://voduongai.com/portal/duan-cohoi/digiu/cap-nhat/${a.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-hidden={i >= articles.length ? true : undefined}
                            style={{
                              display: "block",
                              width: 220,
                              flexShrink: 0,
                              border: "1px solid var(--line)",
                              borderRadius: 12,
                              padding: 14,
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            <div className="news-cat" style={{ color: "#6d4aff" }}>
                              CẬP NHẬT
                            </div>
                            <h6 style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>{a.title}</h6>
                          </a>
                        ))}
                      </div>
                      <style>{`@keyframes digiuNewsMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
                    </div>
                  )}
                </div>
              ) : null}

              {tab === 5 ? (
                <div className="card">
                  <div className="card-head">
                    <h4>Tài liệu DigiU</h4>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
                    Toàn bộ tài liệu, whitepaper và hướng dẫn của DigiU được tổng hợp trong 1 thư mục Drive.
                  </p>
                  <a className="btn-primary" href={DIGIU_DOCS_FOLDER_URL} target="_blank" rel="noopener noreferrer">
                    Mở thư mục tài liệu →
                  </a>
                  {visibleDocuments.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 16 }}>
                      {visibleDocuments.map((d) => (
                        <div className="fin-row" key={d.id}>
                          <a className="lbl" href={d.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)" }}>
                            {d.label}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Đánh giá nhanh</h4>
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
                </div>
                {topArticles.length === 0 ? (
                  <p className="empty-hint">Chưa có bài viết cập nhật nào.</p>
                ) : (
                  topArticles.map((a) => (
                    <a
                      className="news-row"
                      key={a.id}
                      href={registerLink || undefined}
                      target={registerLink ? "_blank" : undefined}
                      rel={registerLink ? "noopener noreferrer" : undefined}
                      style={{ textDecoration: "none", color: "inherit", cursor: registerLink ? "pointer" : "default" }}
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
                        <span className="time">{registerLink ? "Tham gia ngay" : "DigiU"}</span>
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
