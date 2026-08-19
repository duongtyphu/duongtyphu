"use client";

/* =============================================================================
 * Học viện AI 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/Hoc vien AI.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `hoc-vien-ai.css` (chép nguyên văn, xem đầu file đó).
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh — đều là phần được phép theo lệnh giao ("nối dữ
 * liệu thật đã import + áp cơ chế phân quyền Bước D — không đổi giao diện/
 * layout/màu sắc/font"):
 *
 *  1. "Lộ trình học tập gợi ý" — 4 thẻ dùng đúng 4 giai đoạn thật
 *     (`learning_paths`, DÙNG CHUNG bảng với CKOS). Icon/màu gradient mỗi vị
 *     trí giữ NGUYÊN theo bản thiết kế (bảng không có cột icon/màu — 4 icon
 *     này gắn theo VỊ TRÍ thứ tự, không phải theo dữ liệu, cùng lý do
 *     `CHAPTER_DESTINATIONS` ở Bản đồ hành trình giữ tĩnh). % hoàn thành và
 *     "x/y bài học" là tiến độ THẬT của user (`user_lesson_progress`) — hệ
 *     thống mới nên phần lớn đang 0%, không phải lỗi.
 *  2. "Khóa học nổi bật" — chỉ hiện khoá học THẬT SỰ có nội dung Course
 *     Builder (>=1 bài Published), hiện đúng 1/5 vị trí mẫu (không độn thêm
 *     placeholder cho đủ 5). Bỏ hẳn rating "★ x,x (n)" — không có bảng đánh
 *     giá nào trong hệ thống, không bịa số.
 *  3. "Hành trình học tập" (cột phải) — vòng tròn % + 3 dòng thống kê đầu là
 *     tiến độ thật. BỎ dòng thứ 4 "Điểm kinh nghiệm ... XP" — hệ thống
 *     KHÔNG có cơ chế XP thật (XP chỉ tồn tại trong `src/lib/v2/data/catalog.ts`
 *     — lớp mock data của các trang `/v2/(portal)/*` chưa migrate, không
 *     liên quan trang này).
 *  4. "Lớp học sắp diễn ra" — KHÔNG có bảng lịch học trực tuyến nào trong hệ
 *     thống (khác "Tài liệu phổ biến" CKOS đã xây cơ chế ở Mục 2 — ở đây
 *     hoàn toàn chưa có hạ tầng). Hiện trạng thái rỗng trung thực bằng
 *     `.empty-hint` (cùng class CKOS đã dùng), không bịa lịch học mẫu.
 *  5. KHOÁ PREMIUM (Bước D) — khoá học Course Builder thật duy nhất hiện có
 *     đang Free 100% (`is_free_preview=true` cả 16 bài) nên chưa có gì để
 *     khoá ở UI. Cơ chế server-side (`getAcademyLesson()`, `live-academy.ts`)
 *     đã dựng sẵn đúng như `getCkosDocument()` ở Bước D/E.1, sẵn sàng cho khi
 *     có khoá Premium thật + trang xem bài học (bản thiết kế này chỉ là
 *     trang hub, không có trang xem bài học).
 *  6. Cả "Lộ trình học tập gợi ý" lẫn "Khóa học nổi bật" đều có trạng thái
 *     rỗng trung thực (`.empty-hint`) khi 0 dòng dữ liệu — bản thiết kế
 *     không tính tới trường hợp này vì mẫu luôn có sẵn 4/5 thẻ.
 *
 * CÒN GIỮ NGUYÊN "TRƠ" NHƯ BẢN GỐC (bản mockup cũng không làm gì): 8 tab
 * trong `.tabs-row` chỉ đổi trạng thái active, không đổi nội dung bên dưới
 * (đúng hành vi JS gốc — mockup cũng không có 8 khối nội dung riêng). Ô tìm
 * kiếm, chuông thông báo, mọi CTA không có đích thật (chưa có trang khoá
 * học/xem bài học riêng) giữ `href="#"`. Không tự thêm hành vi.
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AcademyCourse, AcademyPath, AcademyProgress } from "@/lib/portal/live-academy";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";

import "../inter-gf.css";
import "./hoc-vien-ai.css";

/** Đích điều hướng của mockup (tên file `.html`) → route thật trong `/v2`. */
const HREF_MAP: Record<string, string> = {
  "Trang chu Portal.html": "/v2/trang-chu",
  "Companion.html": "/v2/companion",
  "He tri thuc CKOS.html": "/v2/he-tri-thuc",
  "Hoc vien AI.html": "/v2/hoc-vien-ai",
  "AI Workspace.html": "/v2/ai-workspace",
  "Du an Co hoi.html": "/v2/du-an-co-hoi",
  "Premium.html": "/v2/premium",
  "Chuong trinh Affilate.html": "/v2/affiliate",
  "Cong dong AI.html": "/v2/cong-dong-ai",
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

const TABS = [
  "Tổng quan",
  "Khóa học AI cơ bản",
  "Khóa học AI nâng cao",
  "Chuyên đề",
  "Lộ trình",
  "Giảng viên",
  "Tài liệu",
  "Chứng chỉ",
];

/** 4 icon/gradient theo VỊ TRÍ (không có cột icon/màu trong `learning_paths`) — xem chú thích #1 ở đầu file. */
const PATH_STYLES = [
  {
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    fill: "linear-gradient(90deg,#3ecf7e,#189a52)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r=".5" fill="#fff" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    fill: "linear-gradient(90deg,#a08bff,#6d4aff)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
    fill: "linear-gradient(90deg,#ff9d52,#c2660a)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    fill: "linear-gradient(90deg,#4bc4e0,#0e7490)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M4 19h16M7 15l3-4 3 3 5-7" />
      </svg>
    ),
  },
];

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} phút`;
  return `${hours} giờ ${minutes} phút`;
}

export function HocVienClient({
  paths,
  courses,
  progress,
  premium,
}: {
  paths: AcademyPath[];
  courses: AcademyCourse[];
  progress: AcademyProgress;
  premium: PremiumStatus;
}) {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  return (
    <div className="hva">
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
            <button className="nav-item active">
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
            <button className="nav-item" onClick={() => go("Du an Co hoi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
              </svg>
              Dự án &amp; Cơ hội
            </button>
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

          {/* Founder: tài khoản đã Premium không thấy mục nâng cấp ở bất kỳ đâu
              trong portal 2.0 — nguyên tắc site-wide đã áp dụng cho `PortalV2Shell`. */}
          {!premium.isPremium && (
            <div className="promo">
              <div
                className="crown"
                style={{ background: "none", boxShadow: "none", width: 54, height: 54, overflow: "visible" }}
              >
                {CROWN_SPARKLES.map((style, i) => (
                  <svg key={i} className="crown-sparkle" style={style} viewBox="0 0 24 24" fill="currentColor">
                    <path d={SPARKLE_PATH} />
                  </svg>
                ))}
                {/* eslint-disable-next-line @next/next/no-img-element -- ảnh minh hoạ tĩnh
                    của bản thiết kế, kích thước cố định 58.5px; dùng <img> để giữ đúng
                    markup gốc (next/image chèn thêm wrapper làm lệch bố cục). */}
                <img
                  src="/v2-static/assets/icon-premium.png"
                  alt=""
                  style={{ width: 58.5, height: 58.5, objectFit: "contain", position: "relative", zIndex: 1 }}
                />
              </div>
              <h4>Nâng cấp Premium</h4>
              <p>Mở khóa toàn bộ khóa học nâng cao, tài liệu độc quyền và nội thực chiến.</p>
              <button onClick={() => go("Premium.html")}>Nâng cấp ngay</button>
            </div>
          )}
        </aside>

        <div className="main-col">
          <div className="topbar">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input type="text" placeholder="Tìm khoá học, chủ đề, kỹ năng..." />
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
              <div className="page-head">
                <h1>Học viện AI</h1>
                <p>Học bài bản – Thực hành thực tế – Ứng dụng ngay vào công việc và cuộc sống.</p>
              </div>

              <div className="tabs-row">
                {TABS.map((label, i) => (
                  <button key={label} className={i === tab ? "tab active" : "tab"} onClick={() => setTab(i)}>
                    {i === 0 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                      </svg>
                    ) : null}
                    {i === 5 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                      </svg>
                    ) : null}
                    {i === 6 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                      </svg>
                    ) : null}
                    {label}
                  </button>
                ))}
              </div>

              <div className="acad-hero">
                <div className="acad-hero-text">
                  <h2>
                    Học AI đúng hướng
                    <br />
                    Ứng dụng AI hiệu quả
                  </h2>
                  <p>Hệ thống khóa học được thiết kế từ cơ bản đến nâng cao, giúp bạn làm chủ AI và tạo ra giá trị thực tế.</p>
                  <div className="acad-btn-row">
                    <a className="btn-primary" href="#">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Tiếp tục học
                    </a>
                    <a className="btn-ghost" href="#">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                      Lộ trình học tập
                    </a>
                  </div>
                </div>
                <div className="grad-wrap">
                  <div className="grad-glow" />
                  <svg className="grad-svg" width="200" height="170" viewBox="0 0 200 170" fill="none">
                    <g className="orb-icon" style={{ animationDelay: "0s" }}>
                      <circle cx="30" cy="40" r="17" fill="rgba(109,74,255,.25)" stroke="#8b6bff" strokeWidth="1.2" />
                      <path d="M23 38l5 5 8-9" stroke="#c9bdff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <g className="orb-icon" style={{ animationDelay: ".6s" }}>
                      <circle cx="172" cy="42" r="17" fill="rgba(109,74,255,.25)" stroke="#8b6bff" strokeWidth="1.2" />
                      <path d="M165 48l5-14 5 8 4-4" stroke="#c9bdff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <g className="orb-icon" style={{ animationDelay: "1.1s" }}>
                      <circle cx="24" cy="120" r="15" fill="rgba(109,74,255,.25)" stroke="#8b6bff" strokeWidth="1.2" />
                      <path d="M17 116h14M17 121h10M17 126h12" stroke="#c9bdff" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                    <g className="orb-icon" style={{ animationDelay: "1.6s" }}>
                      <circle cx="178" cy="120" r="15" fill="rgba(109,74,255,.25)" stroke="#8b6bff" strokeWidth="1.2" />
                      <path d="M171 126l4-12 4 8 4-16" stroke="#c9bdff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <rect x="52" y="72" width="96" height="66" rx="8" fill="url(#bookGrad)" stroke="#8b6bff" strokeWidth="1.4" />
                    <rect x="52" y="72" width="96" height="14" rx="7" fill="#4a2fb0" />
                    <text x="100" y="115" fontFamily="Inter,sans-serif" fontSize="30" fontWeight="800" fill="#fff" textAnchor="middle">
                      AI
                    </text>
                    <path d="M62 68l38-14 38 14-38 14z" fill="#1a1044" stroke="#8b6bff" strokeWidth="1.4" />
                    <path d="M100 82v10M100 82l30-11M130 71v10c0 4-30 4-30 4" stroke="#c9bdff" strokeWidth="1.2" fill="none" />
                    <circle cx="130" cy="82" r="2.4" fill="#e2b23c" />
                    <path d="M130 84v11l-3-2" stroke="#e2b23c" strokeWidth="1.3" />
                    <defs>
                      <linearGradient id="bookGrad" x1="52" y1="72" x2="148" y2="138">
                        <stop offset="0" stopColor="#4a2fb0" />
                        <stop offset="1" stopColor="#241c56" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div>
                <div className="section-head">
                  <h3>Lộ trình học tập gợi ý</h3>
                  <a href="#">Xem tất cả lộ trình →</a>
                </div>
                {paths.length === 0 ? (
                  <div className="empty-hint" style={{ marginTop: 14 }}>
                    Chưa có lộ trình nào — nội dung sẽ hiện ở đây khi được xuất bản.
                  </div>
                ) : (
                  <div className="path-grid" style={{ marginTop: 14 }}>
                    {paths.map((path, i) => {
                      const style = PATH_STYLES[i % PATH_STYLES.length];
                      const completed = progress.completedByPath[path.slug] ?? 0;
                      const pct = path.lessonCount > 0 ? Math.round((completed / path.lessonCount) * 100) : 0;
                      return (
                        <div className="path-card" key={path.slug}>
                          <div className="top">
                            <div className="ico" style={{ background: style.bg }}>
                              {style.icon}
                            </div>
                            <h5>{path.title}</h5>
                          </div>
                          <p>{path.description}</p>
                          <div className="path-pct">{pct}% hoàn thành</div>
                          <div className="path-track">
                            <div className="path-fill" style={{ width: `${pct}%`, background: style.fill }} />
                          </div>
                          <div className="cnt">
                            {completed}/{path.lessonCount} bài học
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <div className="section-head">
                  <h3>Khóa học nổi bật</h3>
                  <a href="#">Xem tất cả khóa học →</a>
                </div>
                <div className="course-scroll" style={{ marginTop: 14 }}>
                  {courses.length === 0 ? (
                    <div className="empty-hint">Chưa có khoá học nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                  ) : (
                    courses.map((course) => {
                      const completed = progress.completedByCourse[course.id] ?? 0;
                      const pct = course.lessonCount > 0 ? Math.round((completed / course.lessonCount) * 100) : 0;
                      return (
                        <div className="course-card" key={course.id}>
                          <div className="course-thumb" style={{ background: "linear-gradient(160deg,#1a1044,#3d2a8f)" }}>
                            <div className="course-badges">
                              <span className="badge-pill" style={{ background: "#189a52" }}>
                                Miễn phí
                              </span>
                            </div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#9fd4ff" strokeWidth="1.6">
                              <rect x="3" y="3" width="7" height="7" rx="1.5" />
                              <rect x="14" y="3" width="7" height="7" rx="1.5" />
                              <rect x="3" y="14" width="7" height="7" rx="1.5" />
                              <rect x="14" y="14" width="7" height="7" rx="1.5" />
                            </svg>
                          </div>
                          <div className="course-body">
                            <h5>{course.name}</h5>
                            <div className="desc">{course.description}</div>
                            <div className="course-meta">
                              <span>{course.lessonCount} bài học</span>
                            </div>
                            <div className="course-track">
                              <div className="course-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="course-pct">{pct}%</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="feat-strip">
                <div className="feat-item">
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="14" rx="2" />
                      <path d="M8 21h8M12 18v3" />
                    </svg>
                  </div>
                  <div>
                    <h6>Học mọi lúc mọi nơi</h6>
                    <span>Trên mọi thiết bị, chủ động thời gian học.</span>
                  </div>
                </div>
                <div className="feat-item">
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h6>Thực hành thực tế</h6>
                    <span>Bài tập tình huống, dự án thực chiến.</span>
                  </div>
                </div>
                <div className="feat-item">
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  </div>
                  <div>
                    <h6>Giảng viên uy tín</h6>
                    <span>Giảng viên giàu kinh nghiệm thực chiến.</span>
                  </div>
                </div>
                <div className="feat-item">
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                    </svg>
                  </div>
                  <div>
                    <h6>Chứng chỉ hoàn thành</h6>
                    <span>Xác nhận năng lực sau mỗi khoá học.</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Hành trình học tập</h4>
                  <a href="#">Xem chi tiết →</a>
                </div>
                <div className="ring-block">
                  <div className="ring" style={{ background: `conic-gradient(var(--violet) 0% ${progress.percent}%, var(--violet-light) ${progress.percent}% 100%)` }}>
                    <div className="ring-inner">
                      <div className="pct">{progress.percent}%</div>
                      <div className="pct-label">Hoàn thành</div>
                    </div>
                  </div>
                  <div className="stat-lines">
                    <div className="stat-line">
                      Khóa học đã học
                      <b>
                        {progress.startedCourses} / {progress.totalCourses}
                      </b>
                    </div>
                    <div className="stat-line">
                      Bài học đã hoàn thành
                      <b>
                        {progress.completedLessons} / {progress.totalLessons}
                      </b>
                    </div>
                    <div className="stat-line">
                      Thời gian học
                      <b>{formatMinutes(progress.totalMinutes)}</b>
                    </div>
                  </div>
                </div>
                <a className="btn-primary" style={{ width: "100%", justifyContent: "center" }} href="#">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Tiếp tục học
                </a>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Lớp học sắp diễn ra</h4>
                  <a href="#">Xem lịch học →</a>
                </div>
                {/* Chú thích #4 ở đầu file — không có bảng lịch học trực tuyến nào. */}
                <div className="empty-hint">Chưa có lịch học trực tuyến nào — cập nhật khi có.</div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Kỹ năng bạn sẽ đạt được</h4>
                </div>
                <div className="skill-grid">
                  <div className="skill-chip">
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6d4aff" strokeWidth="2">
                        <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
                      </svg>
                    </div>
                    Sử dụng AI hiệu quả
                  </div>
                  <div className="skill-chip">
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6d4aff" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.7 1.7 0 00.3 1.9M4.6 15a1.7 1.7 0 01-.3 1.9M12 2v4M12 18v4" />
                      </svg>
                    </div>
                    Tư duy AI
                  </div>
                  <div className="skill-chip">
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6d4aff" strokeWidth="2">
                        <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
                      </svg>
                    </div>
                    Prompt Engineering
                  </div>
                  <div className="skill-chip">
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6d4aff" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="14" rx="2" />
                        <path d="M8 21h8M12 18v3" />
                      </svg>
                    </div>
                    Tự động hoá
                  </div>
                  <div className="skill-chip">
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6d4aff" strokeWidth="2">
                        <path d="M4 19h16M7 15l3-4 3 3 5-7" />
                      </svg>
                    </div>
                    Phân tích dữ liệu
                  </div>
                  <div className="skill-chip">
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6d4aff" strokeWidth="2">
                        <rect x="4" y="4" width="7" height="7" rx="1.5" />
                        <rect x="13" y="4" width="7" height="7" rx="1.5" />
                        <rect x="4" y="13" width="7" height="7" rx="1.5" />
                        <rect x="13" y="13" width="7" height="7" rx="1.5" />
                      </svg>
                    </div>
                    Xây dựng hệ thống
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

const SPARKLE_PATH = "M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z";

const CROWN_SPARKLES: React.CSSProperties[] = [
  { top: -8, left: -10, width: 12, height: 12, animationDelay: "0s" },
  { top: 4, right: -14, width: 9, height: 9, animationDelay: ".7s" },
  { bottom: -6, left: 6, width: 8, height: 8, animationDelay: "1.4s" },
  { top: 22, left: -16, width: 7, height: 7, animationDelay: ".3s" },
  { bottom: 2, right: -10, width: 8, height: 8, animationDelay: "1s" },
  { top: -14, left: 20, width: 6, height: 6, animationDelay: "1.8s" },
  { bottom: -10, right: 14, width: 7, height: 7, animationDelay: "2.1s" },
  { top: 30, right: 2, width: 6, height: 6, animationDelay: ".5s" },
  { top: -4, left: 36, width: 7, height: 7, animationDelay: "1.1s" },
  { bottom: 20, left: -14, width: 6, height: 6, animationDelay: "1.6s" },
];
