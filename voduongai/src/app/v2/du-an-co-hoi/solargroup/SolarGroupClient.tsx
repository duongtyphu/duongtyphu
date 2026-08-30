"use client";

/* =============================================================================
 * SolarGroup 2.0 — chuyển 1:1 từ `design_handoff_vo_duong_ai/SolarGroup.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `solargroup.css` (chép nguyên văn, xem đầu file đó).
 *
 * ---------------------------------------------------------------------------
 * ĐỢT SỬA GIAI ĐOẠN 4 PHẦN 2 (theo nội dung Founder cung cấp trực tiếp —
 * đảo ngược quyết định NO-FAKE-DATA thận trọng trước đó): các con số/tên
 * riêng ("Động cơ của Duyunov", "Slavyanka", "580.000+ nhà đầu tư", "194
 * quốc gia"...) từng bị coi là "không kiểm chứng được" ở đợt build đầu —
 * Founder xác nhận đây là dữ liệu THẬT (nguồn công khai solargroup.pro/vi,
 * đã đối chiếu chéo trong lịch sử dự án) — giờ khôi phục nguyên văn.
 *
 *  1. Logo — ảnh logo thật (`/images/duan-cohoi/logos/solargroup-logo.jpg`).
 *  2. `profile-head` — mô tả + 3 badge (Công nghệ/Năng lượng/Crowdfunding) +
 *     "580.000+ nhà đầu tư tại 194 quốc gia" — literal Founder cấp.
 *  3. `sg-hero` — tiêu đề "Động cơ của Duyunov — Công nghệ Slavyanka" + đoạn
 *     giới thiệu literal (theo `src/lib/v2/data/ecosystem.ts`'s
 *     `heroBody`/`aboutBody` — "bản thiết kế 2.0" Founder từng gửi, đã xác
 *     nhận khớp `milestonesTitle: "Lộ trình dự án"` trùng yêu cầu spec).
 *  4. `stat-row` (5 ô số liệu marketing giữa trang) — ĐÃ BỎ HẲN theo yêu cầu
 *     Founder (số liệu 580K+/194 quốc gia chuyển vào `profile-head` thay vì
 *     hiện dạng stat-box).
 *  5. 8 tab rút còn 4 tab CHỨC NĂNG THẬT: Tổng quan/Dự án con/Công nghệ/
 *     Tài liệu — bỏ Lộ trình (đưa lên cột phải)/Đầu tư/Tin tức/Câu hỏi
 *     thường gặp.
 *     - Tổng quan: "Về SolarGroup" literal + video YouTube (bấm play mới
 *       tải iframe) + "Các dự án con" thật (`getLiveSubProjects`).
 *     - Dự án con: mỗi dự án con 1 "slide" đầy đủ (tên/mô tả/giới thiệu chi
 *       tiết/link đăng ký) — dữ liệu thật từ `ecosystem_subprojects`
 *       (Sovelmash/AeroNova), fallback nội dung từ "bản thiết kế 2.0" khi
 *       Admin chưa điền `fullIntro`. **Lưu ý trung thực:** spec gốc yêu cầu
 *       lấy nội dung từ thư mục Drive `1c9Rm0WCxVA7SprSEIX8xR8d1mt1916iC` —
 *       session này KHÔNG có quyền truy cập thư mục đó (đã thử qua Google
 *       Drive MCP, trả về "not found") nên dùng dữ liệu thật đã có sẵn
 *       trong Supabase thay thế, không bịa nội dung mới.
 *     - Công nghệ: 2 cột, mỗi cột 1 dự án con, cùng nguồn dữ liệu như trên
 *       (cùng lý do chưa truy cập được Drive).
 *     - Tài liệu: link tới thư mục Drive tài liệu SolarGroup Founder cung
 *       cấp + `chrome.documents` thật.
 *  6. Cột phải: "Đánh giá nhanh" → "Lộ trình dự án" (4 giai đoạn, theo "bản
 *     thiết kế 2.0"). "Tài liệu & Báo cáo" → "Tổng quan đầu tư" (4 số liệu
 *     tổng hợp, cùng nguồn "bản thiết kế 2.0"). Bỏ hẳn "Câu hỏi thường
 *     gặp". "Tin tức nổi bật" — bỏ "Xem tất cả →", mỗi bài link thẳng tới
 *     link đăng ký thật (`chrome.links`) thay vì trang chi tiết nội bộ.
 *  7. Đã bỏ MỌI link trỏ ngược Portal 1.0 (đúng NGUYÊN TẮC BẤT BIẾN đầu
 *     file này) — "Xem thêm về SolarGroup →" (about-text), "Xem chi tiết →"
 *     (mỗi thẻ dự án con) không có đích `/v2/*` tương đương nên XOÁ hẳn.
 *
 * Nút "Theo dõi"/"Chia sẻ" ở `.profile-actions` không có hệ thống theo
 * dõi/chia sẻ thật, giữ trơ. Ô tìm kiếm/chuông thông báo giữ trơ.
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useState } from "react";

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
import "./solargroup.css";

/** Video giới thiệu SolarGroup (Founder cấp trực tiếp trong phiên này). */
const SOLARGROUP_INTRO_VIDEO_URL = "https://youtu.be/wOOP3suBf2E?si=vHslFtdhAp8ofnwk";

/** Thư mục tài liệu SolarGroup thật trên Drive (Founder cấp trực tiếp) —
 * dùng cho tab "Tài liệu" và tab "Dự án con"/"Công nghệ" (nguồn dự kiến,
 * hiện chưa truy cập được — xem docblock đầu file). */
const SOLARGROUP_DOCS_FOLDER_URL =
  "https://drive.google.com/drive/folders/1c9Rm0WCxVA7SprSEIX8xR8d1mt1916iC?usp=drive_link";

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
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

const TABS = ["Tổng quan", "Dự án con", "Công nghệ", "Tài liệu"];

/** "Lộ trình dự án" — theo "bản thiết kế 2.0 đã gửi trước đó"
 * (`src/lib/v2/data/ecosystem.ts`'s `solargroup.milestones`). */
const ROADMAP_STAGES = [
  { period: "Giai đoạn 1", title: "Hoàn tất nghiên cứu và đăng ký sáng chế công nghệ Slavyanka", done: true },
  { period: "Giai đoạn 2", title: "Xây dựng trung tâm thiết kế Sovelmash tại Alabushevo", done: true },
  { period: "Giai đoạn 3", title: "Sản xuất thử nghiệm và kiểm định động cơ theo tiêu chuẩn công nghiệp", done: false },
  { period: "Giai đoạn 4", title: "Thương mại hoá và mở rộng sang thị trường quốc tế", done: false },
];

/** "Tổng quan đầu tư" — theo "bản thiết kế 2.0 đã gửi trước đó"
 * (`src/lib/v2/data/ecosystem.ts`'s `solargroup.stats`). */
const INVESTMENT_OVERVIEW = [
  { label: "Dự án con", value: "2" },
  { label: "Giai đoạn lộ trình", value: "4" },
  { label: "Đã hoàn thành", value: "2" },
  { label: "Mô hình", value: "Gọi vốn cộng đồng" },
];

/** 4 điểm nổi bật về công nghệ Slavyanka — literal Founder cấp (nguồn công
 * khai solargroup.pro/vi, đã đối chiếu trước đó trong lịch sử dự án). */
const SOLARGROUP_HIGHLIGHTS = [
  "Giảm tiêu thụ năng lượng lên đến 40%",
  "Giảm chi phí sản xuất động cơ điện lên đến 30%",
  "Tăng độ tin cậy, hệ số làm việc đạt 2,5",
  "Hơn 100.000 động cơ Slavyanka đã được sản xuất",
];

/** Nội dung dự phòng cho "Dự án con"/"Công nghệ" khi `ecosystem_subprojects`
 * chưa có `fullIntro` — lấy từ "bản thiết kế 2.0 đã gửi trước đó"
 * (`src/lib/v2/data/ecosystem.ts`'s `solargroup.pillars`). Chỉ dùng khi
 * chưa truy cập được thư mục Drive nêu ở docblock đầu file. */
const SUBPROJECT_FALLBACK_INTRO: { match: string; text: string }[] = [
  {
    match: "sovelmash",
    text: 'Bộ phận thiết kế và công nghệ kỹ thuật (D&E) tại Technopolis Moscow "Alabushevo", nơi thực hiện nghiên cứu và thử nghiệm động cơ.',
  },
  {
    match: "aeronova",
    text: "Phát triển, sản xuất và vận hành khí cầu thế hệ mới — thực hiện bởi AERONOVA, hướng tới thị trường vận tải hàng hoá đường không chi phí thấp.",
  },
  {
    match: "khí cầu",
    text: "Phát triển, sản xuất và vận hành khí cầu thế hệ mới — thực hiện bởi AERONOVA, hướng tới thị trường vận tải hàng hoá đường không chi phí thấp.",
  },
];

function subProjectIntro(sub: SubProjectRow): string {
  if (sub.fullIntro) return sub.fullIntro;
  if (sub.shortDescription) return sub.shortDescription;
  const fallback = SUBPROJECT_FALLBACK_INTRO.find((f) => sub.name.toLowerCase().includes(f.match));
  return fallback?.text ?? "Thông tin chi tiết sẽ được cập nhật khi có.";
}

const SUB_STYLES = [
  { bg: "linear-gradient(150deg,#1a1400,#3d2a08)", stroke: "#f0c96a", icon: <><rect x="3" y="9" width="18" height="11" rx="1.5" /><path d="M7 9V6a2 2 0 012-2h6a2 2 0 012 2v3M3 14h18" /></> },
  { bg: "linear-gradient(150deg,#0c1a3d,#1a1044)", stroke: "#9fd4ff", icon: <><ellipse cx="12" cy="10" rx="8" ry="5" /><path d="M6 13c0 3 2.5 7 6 8 3.5-1 6-5 6-8" /></> },
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
  void ratings;
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const introVideoEmbedUrl = toYouTubeEmbedUrl(SOLARGROUP_INTRO_VIDEO_URL);
  const registerLink = chrome.links.find((l) => l.visible)?.url ?? "";
  const topArticles = articles.slice(0, 3);
  const visibleDocuments = chrome.documents.filter((d) => d.visible);
  const visibleLinks = chrome.links.filter((l) => l.visible);

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
                  src="/images/duan-cohoi/logos/solargroup-logo.jpg"
                  alt="Logo SolarGroup"
                  className="profile-logo"
                  style={{ objectFit: "cover", padding: 0 }}
                />
                <div className="profile-info">
                  <h1>
                    SolarGroup
                    <div className="verify-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </h1>
                  <p>
                    Công ty đầu tư quốc tế tài trợ dự án &quot;Động cơ của Duyunov&quot; — công nghệ cuộn dây
                    &quot;Slavyanka&quot; và các dự án công nghệ tiên phong khác.
                  </p>
                  <div className="tag-row">
                    <span className="p-tag">Công nghệ</span>
                    <span className="p-tag">Năng lượng</span>
                    <span className="p-tag">Crowdfunding</span>
                    <span className="p-since">580.000+ nhà đầu tư tại 194 quốc gia</span>
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
                  <h2>Động cơ của Duyunov — Công nghệ Slavyanka</h2>
                  <p>
                    Hỗ trợ các sáng tạo công nghệ và thu lợi nhuận từ đó. Dự án thương mại hoá công nghệ cuộn dây
                    Slavyanka cho động cơ điện hiệu suất cao.
                  </p>
                  <div className="hero-btn-row">
                    <a className="btn-primary" href="#du-an-con">
                      Giới thiệu dự án
                    </a>
                    <a className="btn-ghost" href={SOLARGROUP_INTRO_VIDEO_URL} target="_blank" rel="noopener noreferrer">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Xem video giới thiệu
                    </a>
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
                      <h3>Về SolarGroup</h3>
                      <p>
                        SolarGroup là công ty đầu tư quốc tế tổ chức gọi vốn cộng đồng cho dự án &quot;Động cơ của
                        Duyunov&quot;. Nhà đầu tư trở thành đồng sở hữu phần vốn dự án và hưởng lợi nhuận theo tỷ lệ
                        đóng góp khi công nghệ được thương mại hoá.
                      </p>
                      <div className="check-list">
                        {SOLARGROUP_HIGHLIGHTS.map((h) => (
                          <div className="check-item" key={h}>
                            <CheckSvg />
                            {h}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="video-card">
                      {videoPlaying ? (
                        <div style={{ position: "absolute", inset: 0 }}>
                          <iframe
                            src={`${introVideoEmbedUrl}?autoplay=1`}
                            title="Video giới thiệu SolarGroup"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ width: "100%", height: "100%", border: "none" }}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="vtitle">SolarGroup</div>
                          <div className="vsub">Video giới thiệu</div>
                          <button className="play-btn" onClick={() => setVideoPlaying(true)} aria-label="Phát video giới thiệu SolarGroup">
                            <svg viewBox="0 0 24 24" fill="#fff">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
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
                                <p>{subProjectIntro(sub)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : null}

              {tab === 1 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {subProjects.length === 0 ? (
                    <p className="empty-hint">Chưa có dự án con nào được công bố.</p>
                  ) : (
                    subProjects.map((sub, i) => {
                      const style = SUB_STYLES[i % SUB_STYLES.length];
                      const subLinks = sub.links.filter((l) => l.visible);
                      return (
                        <div className="sub-card" key={sub.id}>
                          <div className="sub-thumb" style={{ background: style.bg, height: 120 }}>
                            <div className="ico2">
                              <svg viewBox="0 0 24 24" fill="none" stroke={style.stroke} strokeWidth="1.8">
                                {style.icon}
                              </svg>
                            </div>
                            <div>
                              <h4 style={{ fontSize: 19 }}>{sub.name}</h4>
                              <span>{sub.shortDescription}</span>
                            </div>
                          </div>
                          <div className="sub-body" style={{ padding: "20px 24px" }}>
                            <p style={{ minHeight: "auto", fontSize: 13.5, lineHeight: 1.7 }}>{subProjectIntro(sub)}</p>
                            {subLinks.length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
                                {subLinks.map((l) => (
                                  <div className="fin-row" key={l.id}>
                                    <a className="lbl" href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)" }}>
                                      {l.label}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : null}

              {tab === 2 ? (
                <div className="card">
                  <div className="card-head">
                    <h4>Công nghệ</h4>
                  </div>
                  {subProjects.length === 0 ? (
                    <p className="empty-hint">Chưa có thông tin công nghệ nào được công bố.</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(subProjects.length, 2)}, 1fr)`, gap: 20 }}>
                      {subProjects.map((sub) => (
                        <div key={sub.id}>
                          <h5 style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 8 }}>{sub.name}</h5>
                          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{subProjectIntro(sub)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {tab === 3 ? (
                <div className="card">
                  <div className="card-head">
                    <h4>Tài liệu SolarGroup</h4>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
                    Toàn bộ tài liệu, whitepaper và hướng dẫn của SolarGroup được tổng hợp trong 1 thư mục Drive.
                  </p>
                  <a className="btn-primary" href={SOLARGROUP_DOCS_FOLDER_URL} target="_blank" rel="noopener noreferrer">
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
                  <h4>Lộ trình dự án</h4>
                </div>
                <div className="roadmap">
                  {ROADMAP_STAGES.map((s) => (
                    <div className={s.done ? "rm-item done" : "rm-item"} key={s.period}>
                      <div className="rm-dot">
                        {s.done ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : null}
                      </div>
                      <div className="rm-text">
                        <div className="yr">{s.period}</div>
                        <h6>{s.title}</h6>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Đường link liên kết</h4>
                </div>
                {visibleLinks.length === 0 ? (
                  <p className="empty-hint">Chưa có đường link liên kết nào.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {visibleLinks.map((l) => (
                      <a
                        key={l.id}
                        className="btn-primary"
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ justifyContent: "center", width: "100%", color: "#fff" }}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Tổng quan đầu tư</h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {INVESTMENT_OVERVIEW.map((s) => (
                    <div className="fin-row" key={s.label}>
                      <span className="lbl">{s.label}</span>
                      <span className="val">{s.value}</span>
                    </div>
                  ))}
                </div>
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
                        <span className="time">{registerLink ? "Tham gia ngay" : "SolarGroup"}</span>
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
