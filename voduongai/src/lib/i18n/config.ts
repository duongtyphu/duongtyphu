/**
 * Portal Multilingual Foundation — Language Config
 * Sprint: Portal Multilingual Foundation
 * Xem: docs/PORTAL_MULTILINGUAL_FOUNDATION.md
 *
 * Tiếng Việt là ngôn ngữ mặc định và ngôn ngữ chính.
 * English đã được chuẩn bị trong kiến trúc — active khi content sẵn sàng.
 * One Genome — Many Languages.
 */

export const SUPPORTED_LOCALES = ["vi", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "vi";

/** Tiếng Việt active đầy đủ. English active — fallback về vi khi content chưa được dịch. */
export const LOCALE_STATUS: Record<SupportedLocale, "active" | "coming_soon"> = {
  vi: "active",
  en: "active",
};

export const LOCALE_LABELS: Record<SupportedLocale, { native: string; flag: string }> = {
  vi: { native: "Tiếng Việt", flag: "🇻🇳" },
  en: { native: "English", flag: "🇺🇸" },
};

const LOCALE_STORAGE_KEY = "vdai_locale";

export function isSupportedLocale(raw: string): raw is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(raw);
}

/** Đọc locale đã lưu từ localStorage. Trả về null nếu chưa có hoặc không hợp lệ. */
export function getStoredLocale(): SupportedLocale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && isSupportedLocale(raw)) return raw;
  } catch {
    // localStorage unavailable
  }
  return null;
}

/** Lưu locale vào localStorage. */
export function storeLocale(locale: SupportedLocale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage unavailable
  }
}

/**
 * Giải quyết locale cho Portal — theo thứ tự ưu tiên:
 * 1. Explicit preference (localStorage)
 * 2. Browser language (navigator.language)
 * 3. Default: "vi"
 */
export function resolvePortalLocale(): SupportedLocale {
  const stored = getStoredLocale();
  if (stored) return stored;

  if (typeof navigator !== "undefined") {
    const browser = navigator.language.split("-")[0];
    if (isSupportedLocale(browser)) return browser;
  }

  return DEFAULT_LOCALE;
}
