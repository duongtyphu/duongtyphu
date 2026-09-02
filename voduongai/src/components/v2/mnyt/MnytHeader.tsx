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
  const exploreRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const level = 1 + Math.floor(xp / 100);
  const xpInLevel = xp % 100;
  const ringDashArray = `${((xpInLevel / 100) * RING_C).toFixed(1)} ${RING_C}`;
  const hasFreeze = freezeCount > 0;
  const isVi = lang === "vi";

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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
