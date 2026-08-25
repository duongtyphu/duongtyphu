"use client";

/* =============================================================================
 * ProfileMenu — dropdown hồ sơ THẬT (tên/email/Cài đặt tài khoản/Về website
 * chính/Đăng xuất/đổi ngôn ngữ), tách ra từ `PortalV2Shell.tsx` để dùng
 * chung cho CẢ 2 nhóm trang portal 2.0:
 *   1. 9 trang dùng `PortalV2Shell` (qua chính shell đó, đã refactor để gọi
 *      component này thay vì tự viết lại).
 *   2. 10 trang tự chép tay sidebar/topbar riêng (`trang-chu`/`he-tri-thuc`/
 *      `hoc-vien-ai`/`ai-workspace`/`du-an-co-hoi` + 5 trang con) — render
 *      trực tiếp `<ProfileMenu premium={premium} subtitle={...} />` bên
 *      trong đúng vị trí `.profile` cũ của từng trang.
 *
 * Tự bọc `<LocaleProvider>` NGAY TẠI ĐÂY (không phải ở shell/trang gọi) —
 * phạm vi vừa đủ cho khối "NGÔN NGỮ" trong dropdown đọc/ghi `useLocale()`
 * thật, không lan ra phần còn lại của trang.
 * ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { PremiumStatus } from "@/lib/v2/premium-access";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { LocaleProvider, useLocale } from "@/lib/i18n/use-locale";
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_STATUS } from "@/lib/i18n/config";

/** Style dùng chung cho 3 mục trong dropdown hồ sơ — không dựa CSS trang
 * (component này dùng chung cho nhiều tiền tố `.smc`/`.ckos`/`.hva`/`.aiw`/
 * `.tcp`/`.aiw`/`.dac`...). */
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

/**
 * Khối "NGÔN NGỮ" trong dropdown hồ sơ — đúng như `PortalUserMenu` (1.0),
 * dùng LẠI THẬT `useLocale()`/`SUPPORTED_LOCALES`/`LOCALE_LABELS`/
 * `LOCALE_STATUS` (không bịa danh sách ngôn ngữ riêng), chỉ khác
 * `LanguageSwitcher.tsx` (1.0) ở PHẦN TRÌNH BÀY — dùng inline style (cùng
 * kỹ thuật `profileMenuItemStyle` phía trên) để an toàn ở MỌI tiền tố CSS
 * (Cascade Layers: unlayered CSS trong từng file `*.css` của trang luôn
 * thắng `@layer utilities` của Tailwind, nên không dùng class Tailwind ở
 * đây), nhưng hành vi/dữ liệu vẫn 100% thật (đổi `locale` lưu localStorage
 * qua đúng `setLocale()`, không phải bản giả).
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

export function ProfileMenu({
  premium,
  subtitle,
}: {
  premium: PremiumStatus;
  /** Ghi đè dòng phụ dưới tên (mặc định "Free"/"Premium") — vd nhóm Companion dùng "Lv.7 · 2,450 XP". */
  subtitle?: React.ReactNode;
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

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const displayName = premium.fullName || premium.email || "Tài khoản";
  const initial = (premium.fullName || premium.email || "?").trim().charAt(0).toUpperCase();

  return (
    <LocaleProvider>
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
            <span className="plan">{subtitle ?? (premium.isPremium ? "Premium" : "Free")}</span>
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
                  router.push("/v2/tai-khoan");
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
    </LocaleProvider>
  );
}
