/**
 * Portal Multilingual Content Model
 * Sprint: Portal Multilingual Foundation
 *
 * LocalizedField<T> là cấu trúc chuẩn cho mọi nội dung Portal / CMS
 * có thể đa ngôn ngữ. vi là bắt buộc. en là optional.
 *
 * Fallback policy: nếu thiếu bản English → trả về vi. Không crash,
 * không undefined, không hiển thị key.
 */

import type { SupportedLocale } from "./config";

/** Chuẩn cho mọi field nội dung có thể đa ngôn ngữ. */
export type LocalizedField<T = string> = {
  vi: T;
  en?: T;
};

/**
 * Giải quyết một LocalizedField về giá trị cụ thể theo locale.
 * Nếu locale là "en" nhưng không có en → fallback về vi.
 * Không bao giờ trả về undefined nếu vi có giá trị.
 */
export function resolveLocalized<T>(field: LocalizedField<T>, locale: SupportedLocale): T {
  if (locale === "en" && field.en !== undefined) return field.en;
  return field.vi;
}

/**
 * Tạo LocalizedField từ một string đơn giản (chỉ có vi, chưa có en).
 * Helper để migrate nội dung cũ sang format mới mà không cần sửa nhiều.
 */
export function vi(text: string): LocalizedField<string> {
  return { vi: text };
}

/**
 * Tạo LocalizedField đầy đủ cả vi và en.
 */
export function bilingual(vietnamese: string, english: string): LocalizedField<string> {
  return { vi: vietnamese, en: english };
}
