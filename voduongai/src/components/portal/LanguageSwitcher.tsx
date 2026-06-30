"use client";

import { Globe } from "lucide-react";
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_STATUS, type SupportedLocale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/use-locale";

type Props = {
  onSelect?: () => void;
};

export function LanguageSwitcher({ onSelect }: Props) {
  const { locale, setLocale, t } = useLocale();

  function handleSelect(next: SupportedLocale) {
    setLocale(next);
    onSelect?.();
  }

  return (
    <div>
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Globe className="h-4 w-4 text-white/60" />
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          {t.language.label}
        </span>
      </div>
      <div className="space-y-0.5">
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
              onClick={() => status === "active" && handleSelect(code)}
              disabled={status === "coming_soon"}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition
                ${active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"}
                ${status === "coming_soon" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              `}
            >
              <span className="text-base leading-none">{flag}</span>
              <span className="flex-1 text-left">{native}</span>
              {active && (
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
              )}
              {status === "coming_soon" && (
                <span className="text-[10px] text-white/40">{t.language.comingSoon}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
