"use client";

/**
 * Header "Mỗi ngày một ý tưởng" — 1:1 với `<header>` gốc (mockup dòng
 * 29-92): logo/orb xoay, 3 nav-link trực tiếp (Trang chủ/Kho ý tưởng/Từ
 * điển), dropdown "Khám phá" (Lĩnh vực/Lộ trình/Hồ sơ/Lịch/Huy hiệu/Gửi ý
 * tưởng), streak pill, freeze pill (khi có), level ring (SVG progress theo
 * XP trong level hiện tại — `level = 1 + floor(xp/100)`, đúng công thức
 * mockup), nút cài đặt + dropdown (ngôn ngữ/âm thanh/nhắc nhở).
 *
 * Route thật thay cho state `view` của mockup (xem `mnyt-routes.ts`) —
 * `usePathname()` quyết định `aria-current`.
 *
 * BUG MOBILE ĐÃ SỬA — `.mnyt-nav` (3 link trực tiếp + dropdown "Khám phá",
 * 6 đích khác) trước đó chỉ có `display:none` dưới 720px
 * (`moi-ngay-mot-y-tuong.css`), KHÔNG có thay thế nào — mọi đích trong đó
 * (Kho ý tưởng/Từ điển/Lĩnh vực/Lộ trình/Hồ sơ/Lịch/Huy hiệu/Gửi ý tưởng)
 * hoàn toàn không thể điều hướng tới được trên di động (chỉ còn Trang chủ
 * qua logo và Hồ sơ qua streak-pill/level-ring). Đã thêm
 * `.mnyt-mobilemenu-wrap` — 1 nút hamburger + dropdown gộp đủ 8 đích, chỉ
 * hiện dưới 720px (đối xứng đúng breakpoint `.mnyt-nav` đã ẩn), tái dùng
 * NGUYÊN class `.mnyt-dropdown`/`.mnyt-dropdown-item`/`.mnyt-dropdown-sep`
 * đã có sẵn cho dropdown "Khám phá" — không tạo bộ style mới.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { MNYT_ROUTES } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";

export type MnytHeaderProps = {
  streak: number;
  freezeCount: number;
  xp: number;
  badgeCount: number;
  soundOn: boolean;
  reminderOn: boolean;
  lang: "vi" | "en";
  onToggleSound: () => void;
  onToggleReminder: () => void;
  onToggleLang: () => void;
  onOpenSubmit: () => void;
};

const RING_R = 16;
const RING_C = +(2 * Math.PI * RING_R).toFixed(1);

export function MnytHeader({
  streak,
  freezeCount,
  xp,
  badgeCount,
  soundOn,
  reminderOn,
  lang,
  onToggleSound,
  onToggleReminder,
  onToggleLang,
  onOpenSubmit,
}: MnytHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [exploreOpen, setExploreOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const level = 1 + Math.floor(xp / 100);
  const xpInLevel = xp % 100;
  const ringDashArray = `${((xpInLevel / 100) * RING_C).toFixed(1)} ${RING_C}`;
  const hasFreeze = freezeCount > 0;
  const isVi = lang === "vi";

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) setMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Mockup gốc (`_onKeyDown`, dòng 1964): Escape đóng `showSettingsMenu`
  // đang mở — áp dụng tương tự cho dropdown "Khám phá".
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape" && e.key !== "Esc") return;
      if (exploreOpen) setExploreOpen(false);
      if (settingsOpen) setSettingsOpen(false);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exploreOpen, settingsOpen, mobileMenuOpen]);

  // Đóng menu mobile ngay sau khi điều hướng sang route khác (bấm 1 mục
  // trong dropdown) — tự khớp vì mọi item đều là <Link>, không có onClick
  // riêng để tự đóng. Cập nhật state khi render (không phải trong effect)
  // theo đúng pattern React khuyến nghị cho "adjust state on prop change".
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  return (
    <header className="mnyt-header">
      <Link href={MNYT_ROUTES.home} className="mnyt-brand">
        <span className="mnyt-brand-orb" aria-hidden>
          <span className="mnyt-brand-orb-core" />
          <span className="mnyt-brand-orb-ring" />
        </span>
        <span>
          <span className="mnyt-brand-name" style={{ display: "block" }}>
            Mỗi Ngày 1 Ý Tưởng
          </span>
          <span className="mnyt-brand-tagline" style={{ display: "block" }}>
            AI mỗi ngày, tiến bộ mỗi ngày
          </span>
        </span>
      </Link>

      <nav aria-label={isVi ? "Điều hướng chính" : "Main navigation"} className="mnyt-nav">
        <Link href={MNYT_ROUTES.home} aria-current={pathname === MNYT_ROUTES.home ? "page" : undefined} className="mnyt-nav-link">
          {isVi ? "Trang chủ" : "Home"}
        </Link>
        <Link
          href={MNYT_ROUTES.archive}
          aria-current={pathname === MNYT_ROUTES.archive ? "page" : undefined}
          className="mnyt-nav-link"
        >
          {isVi ? "Kho ý tưởng" : "Idea library"}
        </Link>
        <Link
          href={MNYT_ROUTES.glossary}
          aria-current={pathname === MNYT_ROUTES.glossary ? "page" : undefined}
          className="mnyt-nav-link"
        >
          {isVi ? "Từ điển" : "Glossary"}
        </Link>
        <div className="mnyt-explore-wrap" ref={exploreRef}>
          <button
            type="button"
            className="mnyt-explore-btn"
            onClick={() => setExploreOpen((v) => !v)}
            aria-expanded={exploreOpen}
          >
            {isVi ? "Khám phá" : "Explore"} <span style={{ fontSize: 9, opacity: 0.7 }}>▾</span>
          </button>
          {exploreOpen && (
            <div className="mnyt-dropdown" role="menu">
              <button type="button" className="mnyt-dropdown-item" onClick={() => router.push(MNYT_ROUTES.fields)}>
                {isVi ? "Lĩnh vực" : "Fields"}
              </button>
              <button type="button" className="mnyt-dropdown-item" onClick={() => router.push(MNYT_ROUTES.path)}>
                {isVi ? "Lộ trình" : "Path"}
              </button>
              <button type="button" className="mnyt-dropdown-item" onClick={() => router.push(MNYT_ROUTES.profile)}>
                {isVi ? "Hồ sơ" : "Profile"}
              </button>
              <button type="button" className="mnyt-dropdown-item" onClick={() => router.push(MNYT_ROUTES.calendar)}>
                {isVi ? "Lịch học" : "Calendar"}
              </button>
              <button type="button" className="mnyt-dropdown-item" onClick={() => router.push(MNYT_ROUTES.badges)}>
                {isVi ? "Huy hiệu" : "Badges"} ({badgeCount})
              </button>
              <div className="mnyt-dropdown-sep" />
              <button type="button" className="mnyt-dropdown-item accent" onClick={onOpenSubmit}>
                {isVi ? "Gửi ý tưởng của bạn" : "Submit your idea"}
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="mnyt-header-right">
        <div className="mnyt-mobilemenu-wrap" ref={mobileMenuRef}>
          <button
            type="button"
            className="mnyt-mobilemenu-btn"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label={isVi ? "Menu điều hướng" : "Navigation menu"}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          {mobileMenuOpen && (
            <div className="mnyt-dropdown mnyt-mobilemenu-dropdown" role="menu">
              <Link href={MNYT_ROUTES.home} className="mnyt-dropdown-item" role="menuitem">
                {isVi ? "Trang chủ" : "Home"}
              </Link>
              <Link href={MNYT_ROUTES.archive} className="mnyt-dropdown-item" role="menuitem">
                {isVi ? "Kho ý tưởng" : "Idea library"}
              </Link>
              <Link href={MNYT_ROUTES.glossary} className="mnyt-dropdown-item" role="menuitem">
                {isVi ? "Từ điển" : "Glossary"}
              </Link>
              <Link href={MNYT_ROUTES.fields} className="mnyt-dropdown-item" role="menuitem">
                {isVi ? "Lĩnh vực" : "Fields"}
              </Link>
              <Link href={MNYT_ROUTES.path} className="mnyt-dropdown-item" role="menuitem">
                {isVi ? "Lộ trình" : "Path"}
              </Link>
              <Link href={MNYT_ROUTES.profile} className="mnyt-dropdown-item" role="menuitem">
                {isVi ? "Hồ sơ" : "Profile"}
              </Link>
              <Link href={MNYT_ROUTES.calendar} className="mnyt-dropdown-item" role="menuitem">
                {isVi ? "Lịch học" : "Calendar"}
              </Link>
              <Link href={MNYT_ROUTES.badges} className="mnyt-dropdown-item" role="menuitem">
                {isVi ? "Huy hiệu" : "Badges"} ({badgeCount})
              </Link>
              <div className="mnyt-dropdown-sep" />
              <button
                type="button"
                className="mnyt-dropdown-item accent"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSubmit();
                }}
              >
                {isVi ? "Gửi ý tưởng của bạn" : "Submit your idea"}
              </button>
            </div>
          )}
        </div>
        <Link href={MNYT_ROUTES.profile} className="mnyt-streak-pill">
          <span className="mnyt-streak-dot" aria-hidden />
          <span>
            {streak} {isVi ? "ngày" : "days"}
          </span>
        </Link>
        {hasFreeze && (
          <div className="mnyt-freeze-pill" title={isVi ? "Lượt đóng băng chuỗi ngày" : "Streak freeze"}>
            <span style={{ fontSize: 12 }}>🧊</span>
            <span>{freezeCount}</span>
          </div>
        )}
        <Link href={MNYT_ROUTES.profile} className="mnyt-level-ring" title={`${isVi ? "Cấp độ" : "Level"} ${level}`}>
          <svg width="40" height="40" aria-hidden>
            <circle cx="20" cy="20" r={RING_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle
              cx="20"
              cy="20"
              r={RING_R}
              fill="none"
              stroke="url(#mnytRingGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={ringDashArray}
            />
            <defs>
              <linearGradient id="mnytRingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <span className="mnyt-level-ring-core">{level}</span>
        </Link>
        <div ref={settingsRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="mnyt-settings-btn"
            aria-label={isVi ? "Cài đặt" : "Settings"}
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((v) => !v)}
          >
            ⚙
          </button>
          {settingsOpen && (
            <div className="mnyt-settings-dropdown" role="menu">
              <button type="button" className="mnyt-settings-item" onClick={onToggleLang}>
                {isVi ? "🌐 English" : "🌐 Tiếng Việt"}
              </button>
              <button type="button" className="mnyt-settings-item" onClick={onToggleSound}>
                {soundOn ? (isVi ? "🔊 Tắt âm thanh" : "🔊 Sound off") : isVi ? "🔇 Bật âm thanh" : "🔇 Sound on"}
              </button>
              <button type="button" className="mnyt-settings-item" onClick={onToggleReminder}>
                {reminderOn ? (isVi ? "🔔 Tắt nhắc nhở" : "🔔 Reminders off") : isVi ? "🔕 Bật nhắc nhở" : "🔕 Reminders on"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
