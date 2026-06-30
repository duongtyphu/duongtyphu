"use client";

/**
 * Bridge: Portal locale → Companion Language Resolution.
 * Kết nối useLocale() với resolveCompanionLanguage() mà không tạo dependency
 * ngược (companion-language.ts không biết về Portal i18n layer).
 *
 * Companion Language Policy:
 * - Nếu user chọn Tiếng Việt → Companion nói tiếng Việt.
 * - Nếu user chọn English → Companion dùng English khi có copy.
 * - Nếu thiếu copy English → fallback an toàn, không dịch máy.
 * - Companion Voice giữ: Respect, Warmth, Clarity, Humility, Trust.
 */

import { useLocale } from "./use-locale";
import {
  resolveCompanionLanguage,
  type CompanionLanguageResolution,
} from "@/lib/portal/companion/companion-language";

/**
 * Trả về CompanionLanguageResolution dựa trên locale Portal hiện tại.
 * Dùng trong bất kỳ component nào cần biết Companion đang dùng ngôn ngữ gì.
 */
export function useCompanionLocale(): CompanionLanguageResolution {
  const { locale } = useLocale();

  return resolveCompanionLanguage({
    explicitPreference: locale,
    browserLocale: typeof navigator !== "undefined" ? navigator.language : null,
  });
}
