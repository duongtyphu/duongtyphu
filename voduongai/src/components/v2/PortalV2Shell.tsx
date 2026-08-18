"use client";

/* =============================================================================
 * PortalV2Shell — sidebar + topbar DÙNG CHUNG cho các trang Portal 2.0 xây ở
 * Bước F (42 trang còn lại). Markup/class/SVG chép NGUYÊN VĂN từ phần
 * `<aside class="sidebar">`/`.topbar` xuất hiện GIỐNG HỆT NHAU ở cả 46 file
 * thiết kế (đã audit `grep -c 'class="sidebar"'` toàn bộ bundle — mỗi file
 * đúng 1 lần, cùng markup) — tách ra đây để không phải chép lại ~150 dòng
 * cho từng trang, KHÔNG đổi 1 ký tự nào so với bản đã chép tay 3 lần trước
 * (`he-tri-thuc`/`hoc-vien-ai`/`ai-workspace`, vẫn giữ bản inline riêng,
 * KHÔNG đổi sang dùng component này — ngoài phạm vi Bước F).
 *
 * Khác biệt PAGE-SPECIFIC giữa các file thiết kế (không cứng trong shell):
 * `search-box` placeholder, số badge chuông, tiêu đề/nội dung box "Nâng cấp
 * Premium" — nhận qua props, giữ đúng nguyên văn từng trang khi build.
 *
 * Trang gọi component này tự bọc `<div className="<prefix>"><div
 * className="app">` bên ngoài — `PortalV2Shell` chỉ render `<aside>` +
 * `<div className="main-col"><div className="topbar">...</div>{children}</div>`,
 * để trang tự truyền `.content` (khác nhau mỗi trang) làm `children`.
 * ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { PORTAL_HREF_MAP } from "@/lib/v2/href-map";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { LocaleProvider, useLocale } from "@/lib/i18n/use-locale";
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_STATUS } from "@/lib/i18n/config";

const SPARKLE_PATH = "M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z";

/** Style dùng chung cho 3 mục trong dropdown hồ sơ — không dựa CSS trang
 * (component này dùng chung cho nhiều tiền tố `.smc`/`.ckos`/`.hva`/`.aiw`...). */
const profileMenuItemStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  alignItems: "center",
  borderRadius: 9,
  border: "none",
  background: "none",
  padding: "8px 8px",
  fontSize: 13,
  fontWeight: 500,
  color: "#111827",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "inherit",
};

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

/**
 * 3 trang nhóm "Companion" (`Companion.html`/`Su menh Companion.html`/
 * `Bo nho ca nhan hoa.html`) hiện sidebar KHÁC — mục "Companion AI" mở rộng
 * thành `.nav-parent` (tĩnh, không click được) + `.nav-sub` (3 mục con)
 * thay vì 1 nút phẳng như các trang khác. Đã audit `Companion.html` xác
 * nhận khác biệt này (không phải suy đoán) — 42 trang còn lại cần kiểm tra
 * CSS/markup từng trang trước khi coi là "giống hệt", KHÔNG mặc định mọi
 * trang dùng đúng 1 khuôn.
 *
 * "Nhật ký hội thoại" (`Nhat ky hoi thoai.html`) và "Chiến lược cá nhân"
 * (`Chien luoc ca nhan.html`) — 2 trong 5 trang ban đầu của nhóm này — đã
 * bị XOÁ HẲN khỏi Portal theo yêu cầu Founder (xem
 * `src/app/v2/nhat-ky-hoi-thoai`/`src/app/v2/chien-luoc-ca-nhan`, cả 2 thư
 * mục đã xoá).
 */
const COMPANION_FAMILY: { htmlFile: string; label: string }[] = [
  { htmlFile: "Companion.html", label: "Trò chuyện cùng Companion" },
  { htmlFile: "Su menh Companion.html", label: "Sứ mệnh Companion" },
  { htmlFile: "Bo nho ca nhan hoa.html", label: "Bộ nhớ & Cá nhân hoá" },
];

/**
 * Khối "NGÔN NGỮ" trong dropdown hồ sơ — đúng như `PortalUserMenu` (1.0),
 * dùng LẠI THẬT `useLocale()`/`SUPPORTED_LOCALES`/`LOCALE_LABELS`/
 * `LOCALE_STATUS` (không bịa danh sách ngôn ngữ riêng), chỉ khác
 * `LanguageSwitcher.tsx` (1.0) ở PHẦN TRÌNH BÀY: bản 1.0 dùng class
 * Tailwind (`bg-gray-100`, `rounded-lg`...) — không dùng lại được nguyên
 * văn ở đây vì `PortalV2Shell` render trong ~46 tiền tố CSS khác nhau, hầu
 * hết đều áp "Điều chỉnh 6" (revert Tailwind Preflight, xem comment trong
 * từng file `*.css` ở `src/app/v2/*`) — cụ thể `.ckos button, .ckos input...
 * {background-color:revert; border-radius:revert; color:revert; opacity:
 * revert}` là CSS KHÔNG nằm trong `@layer` nào nên LUÔN thắng
 * `@layer utilities` của Tailwind bất kể thứ tự/độ đặc hiệu (bài học đã rút
 * ra khi build Sứ mệnh Companion 2.0) — bọc `<button>` Tailwind-styled vào
 * đây sẽ mất sạch nền/bo góc/opacity ở phần lớn trang. Component riêng này
 * dùng inline style (cùng kỹ thuật `profileMenuItemStyle` phía trên) để an
 * toàn ở MỌI tiền tố, nhưng hành vi/dữ liệu vẫn 100% thật (đổi `locale` lưu
 * localStorage qua đúng `setLocale()`, không phải bản giả).
 */
function ProfileLanguageMenu({ onSelect }: { onSelect: () => void }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #E5E7EB" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6B7280" }}>
          {t.language.label}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {SUPPORTED_LOCALES.map((code) => {
          const { native, flag } = LOCALE_LABELS[code];
          const status = LOCALE_STATUS[code];
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              role="menuitem"
              aria-current={active ? "true" : undefined}
              disabled={status === "coming_soon"}
              onClick={() => {
                if (status !== "active") return;
                setLocale(code);
                onSelect();
              }}
              style={{
                ...profileMenuItemStyle,
                justifyContent: "space-between",
                background: active ? "#F3F4F6" : "none",
                opacity: status === "coming_soon" ? 0.5 : 1,
                cursor: status === "coming_soon" ? "not-allowed" : "pointer",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>{flag}</span>
                {native}
              </span>
              {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F97316", flexShrink: 0 }} />}
              {status === "coming_soon" && <span style={{ fontSize: 10, color: "#9CA3AF" }}>{t.language.comingSoon}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PortalV2Shell({
  premium,
  searchPlaceholder,
  notifBadge = 3,
  promoTitle = "Nâng cấp Premium",
  promoText,
  activeHtmlFile,
  companionExpanded = false,
  showSearchBox = true,
  customSearch,
  useTopbarRightWrapper = true,
  profileSubtitle,
  promoVisual,
  promoButtonLabel = "Nâng cấp ngay",
  promoButtonTarget = "Premium.html",
  hidePromo = false,
  children,
}: {
  premium: PremiumStatus;
  /** `undefined` khi `showSearchBox=false` (trang không có ô tìm kiếm, vd nhóm Companion). */
  searchPlaceholder?: string;
  notifBadge?: number;
  promoTitle?: string;
  promoText: string;
  /** Tên file `.html` gốc của trang đang render (khớp key `PORTAL_HREF_MAP`) — dùng để đánh dấu `nav-item active`. */
  activeHtmlFile: string;
  /** `true` khi đang ở 1 trong 5 trang nhóm Companion — đổi nút "Companion AI" phẳng thành submenu mở rộng. */
  companionExpanded?: boolean;
  showSearchBox?: boolean;
  /**
   * Ghi đè toàn bộ khối tìm kiếm (khi trang dùng markup khác `.search-box`
   * chuẩn — vd `Su menh Companion.html` dùng class `.search`, không có
   * `<kbd>` — đã audit xác nhận khác biệt thật, không phải mọi trang cùng 1
   * khuôn `.search-box`). Khi truyền, bỏ qua `showSearchBox`/`searchPlaceholder`.
   */
  customSearch?: React.ReactNode;
  /**
   * `.topbar-right` (bọc upgrade-btn/icon-btn/profile, `margin-left:auto`)
   * chỉ tồn tại ở 1 SỐ trang (đã audit: `AI Workspace.html`/`Hoc vien
   * AI.html`/`He tri thuc CKOS.html` có; `Companion.html`/`Su menh
   * Companion.html` KHÔNG — topbar của chúng để 3 phần tử là con trực tiếp,
   * tự canh phải qua `justify-content:flex-end` hoặc `.search{flex:1}` đẩy
   * sang phải). Mặc định `true` (khuôn phổ biến hơn) — đặt `false` khi trang
   * xác nhận không có class này trong `<style>` gốc.
   */
  useTopbarRightWrapper?: boolean;
  /** Ghi đè dòng phụ dưới tên trong `.profile` (mặc định "Free"/"Premium") — vd nhóm Companion dùng "Lv.7 · 2,450 XP". */
  profileSubtitle?: React.ReactNode;
  /**
   * Ghi đè khối `.crown` (ảnh viên kim cương + sparkle) trong `.promo` —
   * mặc định `undefined` (giữ crown chuẩn). `Hanh trinh cua toi.html` là
   * trang ĐẦU TIÊN dùng minh hoạ khác (đồi núi leo dốc thay viên kim
   * cương) — đã audit xác nhận khác biệt thật, không phải mọi trang cùng 1
   * khối `.crown`.
   */
  promoVisual?: React.ReactNode;
  /** Nhãn nút cuối `.promo` — mặc định "Nâng cấp ngay". */
  promoButtonLabel?: string;
  /** `htmlFile` (khoá `PORTAL_HREF_MAP`) nút `.promo` điều hướng tới — mặc định `"Premium.html"`. */
  promoButtonTarget?: string;
  /**
   * Ẩn hẳn khối `.promo` — mặc định `false`. Trang gọi có thể tự truyền
   * `true` cho lý do riêng (vd `/v2/premium` khi `premium.isPremium`, đúng
   * hành vi JS gốc của `Premium.html`). NGOÀI RA, theo yêu cầu Founder
   * "tài khoản đã mua Premium thì không hiển thị mục nâng cấp ở bất kỳ đâu
   * trong portal 2.0 — nguyên tắc xuyên suốt", `PortalV2Shell` tự ẩn khối
   * này bất cứ khi nào `premium.isPremium` đúng (xem `shouldHidePromo`
   * bên dưới) — `hidePromo` chỉ còn cần cho trường hợp muốn ẩn dù chưa
   * Premium (hiện chưa có trang nào dùng vậy).
   */
  hidePromo?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const go = (htmlFile: string) => {
    const target = PORTAL_HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  /**
   * Nguyên tắc xuyên suốt (yêu cầu Founder): tài khoản CHƯA Premium mới
   * thấy mục nâng cấp; tài khoản ĐÃ Premium không thấy nữa, ở bất kỳ đâu
   * trong portal 2.0. Áp dụng cho cả `.promo` (sidebar) lẫn `.upgrade-btn`
   * (topbar) — 2 nơi duy nhất mời nâng cấp trong chính `PortalV2Shell`.
   */
  const shouldHidePromo = hidePromo || premium.isPremium;

  const displayName = premium.fullName || premium.email || "Tài khoản";
  const initial = (premium.fullName || premium.email || "?").trim().charAt(0).toUpperCase();

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
    // `LocaleProvider` bọc ở đây (không phải cấp `/v2/layout.tsx`) — phạm vi
    // đủ cho `ProfileLanguageMenu` (dropdown hồ sơ) đọc/ghi `useLocale()`
    // thật, không lan ra `/v2/admin` (dùng shell khác, không có mục ngôn
    // ngữ này). Không render thêm phần tử DOM nào (xem `LocaleProvider`).
    <LocaleProvider>
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
          {navItem(
            "Trang chu Portal.html",
            "Trang chủ",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10l9-7 9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>,
          )}
          {companionExpanded ? (
            <>
              <button className="nav-item nav-parent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
                Companion AI
              </button>
              <div className="nav-sub">
                {COMPANION_FAMILY.map((item) => (
                  <button
                    key={item.htmlFile}
                    className={item.htmlFile === activeHtmlFile ? "nav-item active" : "nav-item"}
                    onClick={item.htmlFile === activeHtmlFile ? undefined : () => go(item.htmlFile)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            navItem(
              "Companion.html",
              "Companion AI",
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>,
            )
          )}
          {navItem(
            "He tri thuc CKOS.html",
            "Hệ tri thức (CKOS)",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h6v16H4zM14 4h6v16h-6z" />
            </svg>,
          )}
          {navItem(
            "Hoc vien AI.html",
            "Học viện AI",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10L12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
            </svg>,
          )}
          {navItem(
            "AI Workspace.html",
            "AI Workspace",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="14" rx="2" />
              <path d="M8 21h8M12 18v3" />
            </svg>,
          )}
          {navItem(
            "Du an Co hoi.html",
            <>Dự án &amp; Cơ hội</>,
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7l9-4 9 4-9 4-9-4z" />
              <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
            </svg>,
          )}
          {navItem(
            "Premium.html",
            "Premium",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
            </svg>,
          )}
          {navItem(
            "Chuong trinh Affilate.html",
            "Chương trình Affilate",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
            </svg>,
          )}
          {navItem(
            "Cong dong AI.html",
            "Cộng đồng AI",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="3" />
              <circle cx="17" cy="9" r="3" />
              <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
            </svg>,
          )}
        </nav>

        <nav className="main">
          {navItem(
            "Nhat ky hoc tap.html",
            "Nhật ký học tập",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
            </svg>,
          )}
          {navItem(
            "Hanh trinh cua toi.html",
            "Hành trình của tôi",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>,
          )}
          {navItem(
            "Khu vuon cua ban.html",
            "Khu vườn của bạn",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
            </svg>,
          )}
        </nav>

        <div className="promo" style={shouldHidePromo ? { display: "none" } : undefined}>
          {promoVisual ?? (
            <div className="crown" style={{ background: "none", boxShadow: "none", width: 54, height: 54, overflow: "visible" }}>
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
          )}
          <h4>{promoTitle}</h4>
          <p>{promoText}</p>
          <button onClick={() => go(promoButtonTarget)}>{promoButtonLabel}</button>
        </div>
      </aside>

      <div className="main-col">
        <div className="topbar">
          {customSearch ??
            (showSearchBox ? (
              <div className="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input type="text" placeholder={searchPlaceholder} />
                <kbd>⌘ K</kbd>
              </div>
            ) : null)}
          {(() => {
            const rightContent = (
              <>
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
                  {notifBadge > 0 ? <span className="badge">{notifBadge}</span> : null}
                </button>
                <div ref={profileRef} style={{ position: "relative" }}>
                  <div
                    className="profile"
                    role="button"
                    tabIndex={0}
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    onClick={() => setProfileOpen((v) => !v)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setProfileOpen((v) => !v);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="avatar">{initial}</div>
                    <div>
                      <div className="who">{displayName}</div>
                      <span className="plan">{profileSubtitle ?? (premium.isPremium ? "Premium" : "Free")}</span>
                    </div>
                  </div>

                  {profileOpen && (
                    <div
                      role="menu"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 8px)",
                        zIndex: 50,
                        width: 240,
                        borderRadius: 16,
                        border: "1px solid #E5E7EB",
                        background: "#fff",
                        padding: 12,
                        boxShadow: "0 20px 40px rgba(15,23,42,.15)",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          padding: "0 4px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#111827",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {premium.fullName || "Học viên"}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          padding: "0 4px",
                          fontSize: 12,
                          color: "#6B7280",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {premium.email || "Chưa đăng nhập"}
                      </p>

                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #E5E7EB" }}>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push("/portal/account");
                          }}
                          style={profileMenuItemStyle}
                        >
                          Cài đặt tài khoản
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push("/");
                          }}
                          style={profileMenuItemStyle}
                        >
                          Về website chính
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setProfileOpen(false);
                            void handleLogout();
                          }}
                          style={{ ...profileMenuItemStyle, color: "#DC2626" }}
                        >
                          Đăng xuất
                        </button>
                      </div>

                      <ProfileLanguageMenu onSelect={() => setProfileOpen(false)} />
                    </div>
                  )}
                </div>
              </>
            );
            return useTopbarRightWrapper ? <div className="topbar-right">{rightContent}</div> : rightContent;
          })()}
        </div>

        {children}
      </div>
    </LocaleProvider>
  );
}
