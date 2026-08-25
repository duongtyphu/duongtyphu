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
 * `search-box` placeholder, tiêu đề/nội dung box "Nâng cấp Premium" — nhận
 * qua props, giữ đúng nguyên văn từng trang khi build. Chuông thông báo
 * (`NotificationBell`) và ô tìm kiếm (`PortalSearchBox`) đọc dữ liệu THẬT
 * (bảng `portal_banners`/API `/api/v1/ckos/search`) — không còn số badge
 * bịa qua prop `notifBadge` (đã bỏ).
 *
 * Trang gọi component này tự bọc `<div className="<prefix>"><div
 * className="app">` bên ngoài — `PortalV2Shell` chỉ render `<aside>` +
 * `<div className="main-col"><div className="topbar">...</div>{children}</div>`,
 * để trang tự truyền `.content` (khác nhau mỗi trang) làm `children`.
 * ========================================================================== */

import { useRouter } from "next/navigation";

import { PORTAL_HREF_MAP } from "@/lib/v2/href-map";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

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

export function PortalV2Shell({
  premium,
  searchPlaceholder,
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

  const go = (htmlFile: string) => {
    const target = PORTAL_HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  /**
   * Nguyên tắc xuyên suốt (yêu cầu Founder): tài khoản CHƯA Premium mới
   * thấy mục nâng cấp; tài khoản ĐÃ Premium không thấy nữa, ở bất kỳ đâu
   * trong portal 2.0. Áp dụng cho cả `.promo` (sidebar) lẫn `.upgrade-btn`
   * (topbar) — 2 nơi duy nhất mời nâng cấp trong chính `PortalV2Shell`.
   */
  const shouldHidePromo = hidePromo || premium.isPremium;

  /**
   * `router.prefetch()` lúc hover/focus — sidebar dùng `<button onClick>`
   * (giữ đúng markup gốc, mockup dùng `<button>` chứ không phải `<a>`),
   * KHÔNG tự động được `next/link` prefetch cho không. Không có bước này,
   * mỗi lần bấm chuyển mục mới BẮT ĐẦU tải (middleware + Server Component
   * fetch dữ liệu) đúng lúc bấm — cảm giác "chuyển mục chậm" Founder báo.
   * Hover/focus xảy ra TRƯỚC click vài trăm ms (di chuột/tab tới nút) —
   * đủ để RSC payload tải sẵn phần lớn, click chỉ còn hiển thị.
   */
  const navItem = (htmlFile: string, label: React.ReactNode, icon: React.ReactNode) => {
    const target = PORTAL_HREF_MAP[htmlFile];
    return (
      <button
        className={htmlFile === activeHtmlFile ? "nav-item active" : "nav-item"}
        onClick={htmlFile === activeHtmlFile ? undefined : () => go(htmlFile)}
        onMouseEnter={target ? () => router.prefetch(target) : undefined}
        onFocus={target ? () => router.prefetch(target) : undefined}
      >
        {icon}
        {label}
      </button>
    );
  };

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
                {COMPANION_FAMILY.map((item) => {
                  const subTarget = PORTAL_HREF_MAP[item.htmlFile];
                  return (
                    <button
                      key={item.htmlFile}
                      className={item.htmlFile === activeHtmlFile ? "nav-item active" : "nav-item"}
                      onClick={item.htmlFile === activeHtmlFile ? undefined : () => go(item.htmlFile)}
                      onMouseEnter={subTarget ? () => router.prefetch(subTarget) : undefined}
                      onFocus={subTarget ? () => router.prefetch(subTarget) : undefined}
                    >
                      {item.label}
                    </button>
                  );
                })}
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
            "Moi ngay mot y tuong.html",
            "Mỗi ngày một ý tưởng",
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1V17a1 1 0 001 1h4a1 1 0 001-1v-.2c0-.8.4-1.6 1-2.1A7 7 0 0012 2z" />
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
            (showSearchBox ? <PortalSearchBox placeholder={searchPlaceholder ?? "Tìm kiếm..."} variant="box" /> : null)}
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
                <NotificationBell />
                <ProfileMenu premium={premium} subtitle={profileSubtitle} />
              </>
            );
            return useTopbarRightWrapper ? <div className="topbar-right">{rightContent}</div> : rightContent;
          })()}
        </div>

        {children}
      </div>
    </>
  );
}
