"use client";

/* =============================================================================
 * AdminV2Shell — sidebar (5 nhóm, 24 mục) + topbar DÙNG CHUNG cho toàn bộ 25
 * trang `/v2/admin/*` xây ở Bước F. Markup/class/SVG chép NGUYÊN VĂN từ
 * `Admin Dashboard.html` (`<aside class="sidebar">`/`.topbar`) — đã đối
 * chiếu cấu trúc giống hệt xuất hiện ở mọi file `Admin *.html` khác trong
 * bundle (5 `.side-label`: Tổng quan/Landing Page/Nội dung Portal/Tiện ích
 * nhanh/Quản trị hệ thống, đúng 24 `nav-item` + 1 `back-portal`).
 *
 * Khác PORTAL: không có box "Nâng cấp Premium" (thay bằng `.admin-pill`
 * "ADMIN PANEL" tĩnh + link "Quay lại Portal" cuối sidebar); topbar không có
 * `.upgrade-btn` (thay bằng `.env-tag` "Production" tĩnh); `.profile` luôn
 * "Võ Dương"/"Super Admin" (không có khái niệm Free/Premium ở Admin).
 * ========================================================================== */

import { useRouter } from "next/navigation";

import { ADMIN_HREF_MAP } from "@/lib/v2/href-map";

export function AdminV2Shell({
  searchPlaceholder,
  notifBadge = 5,
  activeHtmlFile,
  children,
}: {
  searchPlaceholder: string;
  notifBadge?: number;
  /** Tên file `Admin *.html` gốc của trang đang render — dùng để đánh dấu `nav-item active`. */
  activeHtmlFile: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const go = (htmlFile: string) => {
    const target = ADMIN_HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const navItem = (htmlFile: string, label: React.ReactNode, icon: React.ReactNode) => (
    <button
      className={htmlFile === activeHtmlFile ? "nav-item active" : "nav-item"}
      onClick={htmlFile === activeHtmlFile ? undefined : () => go(htmlFile)}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <>
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
        <div className="admin-pill">ADMIN PANEL</div>

        <div className="side-label">Tổng quan</div>
        <nav className="main">
          {navItem(
            "Admin Dashboard.html",
            "Dashboard",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>,
          )}
          {navItem(
            "Admin Quan ly Menu.html",
            "Quản lý Menu",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>,
          )}
          {navItem(
            "Admin Bao cao Analytics.html",
            <>Báo cáo &amp; Analytics</>,
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M7 15l4-5 3 3 5-7" />
            </svg>,
          )}
          {navItem(
            "Admin Thu vien Media.html",
            "Thư viện Media",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>,
          )}
        </nav>

        <div className="side-label">Landing Page</div>
        <nav className="main">
          {navItem(
            "Admin Landing Page.html",
            "Landing Page",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 9h18" />
              <circle cx="6.3" cy="6.5" r=".6" fill="currentColor" stroke="none" />
              <circle cx="8.6" cy="6.5" r=".6" fill="currentColor" stroke="none" />
            </svg>,
          )}
          {navItem(
            "Admin Trang Phap ly.html",
            "Trang Pháp lý",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l8 3v5c0 5.5-3.5 9-8 11-4.5-2-8-5.5-8-11V6z" />
              <path d="M9.5 12l1.8 1.8L15 10" />
            </svg>,
          )}
        </nav>

        <div className="side-label">Nội dung Portal</div>
        <nav className="main">
          {navItem(
            "Admin Trang chu.html",
            "Trang chủ",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10l9-7 9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>,
          )}
          {navItem(
            "Admin Companion.html",
            "Companion AI",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>,
          )}
          {navItem(
            "Admin He tri thuc.html",
            "Hệ tri thức (CKOS)",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h6v16H4zM14 4h6v16h-6z" />
            </svg>,
          )}
          {navItem(
            "Admin Hoc vien AI.html",
            "Học viện AI",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10L12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
            </svg>,
          )}
          {navItem(
            "Admin AI Workspace.html",
            "AI Workspace",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="14" rx="2" />
              <path d="M8 21h8M12 18v3" />
            </svg>,
          )}
          {navItem(
            "Admin Du an Co hoi.html",
            <>Dự án &amp; Cơ hội</>,
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7l9-4 9 4-9 4-9-4z" />
              <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
            </svg>,
          )}
          {navItem(
            "Admin Premium.html",
            "Premium",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
            </svg>,
          )}
          {navItem(
            "Admin Chuong trinh Affilate.html",
            "Chương trình Affilate",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
            </svg>,
          )}
          {navItem(
            "Admin Cong dong AI.html",
            "Cộng đồng AI",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="3" />
              <circle cx="17" cy="9" r="3" />
              <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
            </svg>,
          )}
        </nav>

        <div className="side-label">Tiện ích nhanh</div>
        <nav className="main">
          {navItem(
            "Admin Nhat ky hoc tap.html",
            "Nhật ký học tập",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
            </svg>,
          )}
          {navItem(
            "Admin Hanh trinh cua toi.html",
            "Hành trình của tôi",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>,
          )}
          {navItem(
            "Admin Khu vuon cua ban.html",
            "Khu vườn của bạn",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
            </svg>,
          )}
        </nav>

        <div className="side-label">Quản trị hệ thống</div>
        <nav className="main">
          {navItem(
            "Admin Nguoi dung.html",
            "Người dùng",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="8" r="3.5" />
              <path d="M2.5 20c0-3.6 3-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
              <circle cx="18" cy="9" r="2.7" />
              <path d="M15.5 13.8a5.6 5.6 0 015.5 5.5" />
            </svg>,
          )}
          {navItem(
            "Admin Thanh toan Giao dich.html",
            <>Thanh toán &amp; Giao dịch</>,
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="13" rx="2" />
              <path d="M2 10h20" />
              <path d="M6 15h4" />
            </svg>,
          )}
          {navItem(
            "Admin Thong bao.html",
            "Thông báo",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 01-3.4 0" />
            </svg>,
          )}
          {navItem(
            "Admin Tich hop API.html",
            <>Tích hợp &amp; API</>,
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 3H4a1 1 0 00-1 1v5M15 3h5a1 1 0 011 1v5M9 21H4a1 1 0 01-1-1v-5M15 21h5a1 1 0 001-1v-5" />
              <path d="M7 12a5 5 0 015-5M17 12a5 5 0 01-5 5" />
            </svg>,
          )}
          {navItem(
            "Admin Ho tro Ticket.html",
            <>Hỗ trợ &amp; Ticket</>,
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
            </svg>,
          )}
          {navItem(
            "Admin Cau hinh he thong.html",
            "Cấu hình hệ thống",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1h.2a2 2 0 110 4h-.2a1.7 1.7 0 00-1.5 1z" />
            </svg>,
          )}
        </nav>

        <a className="back-portal" onClick={() => go("Trang chu Portal.html")} style={{ cursor: "pointer" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Quay lại Portal
        </a>
      </aside>

      <div className="main-col">
        <div className="topbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input type="text" placeholder={searchPlaceholder} />
            <kbd>⌘ K</kbd>
          </div>
          <div className="topbar-right">
            <div className="env-tag">
              <span className="dot" />
              Production
            </div>
            <button className="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 01-3.4 0" />
              </svg>
              {notifBadge > 0 ? <span className="badge">{notifBadge}</span> : null}
            </button>
            <div className="profile">
              <div className="avatar">VD</div>
              <div>
                <div className="who">Võ Dương</div>
                <span className="plan">Super Admin</span>
              </div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}
