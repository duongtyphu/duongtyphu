"use client";

/**
 * Locale context cho Portal.
 * Lưu trữ locale trong localStorage. Không cần server-side — locale
 * là preference của client, không ảnh hưởng đến SEO (nội dung luôn có vi).
 *
 * Pattern: Provider bọc ngoài PortalShell, hook dùng trong bất kỳ component nào.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  getStoredLocale,
  resolvePortalLocale,
  storeLocale,
  type SupportedLocale,
} from "./config";
import { vi } from "./locales/vi";
import { en } from "./locales/en";
import type { PortalTranslations } from "./locales/vi";

type LocaleContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: PortalTranslations;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: vi,
});

function getTranslations(locale: SupportedLocale): PortalTranslations {
  if (locale === "en") return en as unknown as PortalTranslations;
  return vi;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // SSR-safe: bắt đầu với default, sync từ localStorage sau khi mount.
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    const resolved = resolvePortalLocale();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (resolved !== DEFAULT_LOCALE) setLocaleState(resolved);
  }, []);

  const setLocale = useCallback((next: SupportedLocale) => {
    storeLocale(next);
    setLocaleState(next);
  }, []);

  const t = getTranslations(locale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Hook chính để dùng locale + translations bất cứ đâu trong Portal. */
export function useLocale() {
  return useContext(LocaleContext);
}

/** Hook chỉ lấy translator — tiện khi không cần locale value. */
export function useT() {
  return useContext(LocaleContext).t;
}
