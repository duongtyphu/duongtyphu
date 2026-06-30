/**
 * Companion Language Resolution (Sprint 22.7 — "The Multilingual Companion").
 * Xem `docs/THE_MULTILINGUAL_COMPANION.md`.
 *
 * Mục tiêu: giải quyết ngôn ngữ Companion nên dùng cho một người dùng
 * cụ thể, theo đúng Language Resolution Policy đã định nghĩa. KHÔNG phải
 * một translation engine, KHÔNG phải một i18n framework — chỉ là một quy
 * tắc ưu tiên rõ ràng, rule-based, fallback an toàn về tiếng Việt.
 *
 * Hôm nay chỉ có 2 ngôn ngữ được hỗ trợ đầy đủ (vi / en) — các ngôn ngữ
 * khác fallback về "vi" với `confidence: "low"` và
 * `shouldAskClarification: true` (Companion thừa nhận giới hạn, không giả
 * vờ hiểu). Mở rộng thêm ngôn ngữ = thêm vào `SUPPORTED_LANGUAGE_CODES`
 * và viết copy tương ứng — không cần sửa kiến trúc này.
 *
 * Rule-based thuần — không AI, không gọi mạng, không DB mới. Dữ liệu
 * nguồn có thể đến từ nhiều nơi (localStorage, Supabase profile, browser
 * API), nhưng logic giải quyết ở đây không biết và không cần biết nguồn
 * đó lưu ở đâu.
 */

/**
 * Các ngôn ngữ Companion hỗ trợ đầy đủ hôm nay. Thêm vào đây khi đã
 * có copy thật cho ngôn ngữ đó — không thêm trước khi có copy.
 */
export const SUPPORTED_LANGUAGE_CODES = ["vi", "en"] as const;
export type CompanionLanguageCode = (typeof SUPPORTED_LANGUAGE_CODES)[number];

/** Tất cả ngôn ngữ có thể được pass vào từ browser/profile — rộng hơn `CompanionLanguageCode`. */
export type RawLocale = string;

/**
 * Context để xác định ngôn ngữ. Tất cả field đều optional — không bao
 * giờ ép caller phải có đủ để gọi hàm này; thiếu field nào fallback xuống
 * field tiếp theo theo thứ tự ưu tiên.
 *
 * Hôm nay `explicitPreference` và `profileLocale` chưa có field tương ứng
 * trong Supabase schema (`members`) — để sẵn ở đây để khi schema có thêm,
 * caller chỉ cần pass value vào, không phải sửa logic. Đây là cùng kỹ
 * thuật đã dùng ở `CompanionAddressProfile` cho `preferredName`.
 */
export type CompanionLanguageContext = {
  /** Ngôn ngữ người dùng đã chủ động chọn trong Settings — ưu tiên cao nhất. */
  explicitPreference?: string | null;
  /** Locale trong Supabase profile — ưu tiên thứ hai. Ví dụ: "vi-VN", "en-US". */
  profileLocale?: string | null;
  /** `navigator.language` từ browser — ưu tiên thứ ba. */
  browserLocale?: string | null;
};

/** Nguồn nào đã quyết định ngôn ngữ — để caller hiểu và có thể log/debug. */
export type CompanionLanguageSource =
  | "explicit_preference"
  | "profile_locale"
  | "browser_locale"
  | "default";

/** Mức độ chắc chắn. "high" = nguồn đáng tin nhất; "low" = chỉ là default. */
export type CompanionLanguageConfidence = "high" | "medium" | "low";

export type CompanionLanguageResolution = {
  languageCode: CompanionLanguageCode;
  confidence: CompanionLanguageConfidence;
  source: CompanionLanguageSource;
  /**
   * `true` khi nguồn là "default" (không có tín hiệu rõ ràng) VÀ ngôn
   * ngữ đã chọn khác với locale browser — tức là khả năng cao Companion
   * đang nói sai ngôn ngữ. Caller có thể dùng để hỏi người dùng một lần
   * theo cách nhẹ nhàng, không áp đặt. Không nên hỏi mỗi lần — chỉ khi
   * đây là session đầu tiên hoặc khi người dùng chủ động đặt câu hỏi
   * bằng ngôn ngữ khác.
   */
  shouldAskClarification: boolean;
};

/**
 * Trích xuất BCP 47 language tag gốc từ một locale string:
 * "vi-VN" → "vi", "en-US" → "en", "zh-TW" → "zh".
 * Trả về null nếu input không phải locale hợp lệ.
 */
function extractLanguageTag(locale: string | null | undefined): string | null {
  if (!locale) return null;
  const tag = locale.trim().split(/[-_]/)[0].toLowerCase();
  return tag.length >= 2 ? tag : null;
}

/**
 * Kiểm tra một raw language tag có trong danh sách hỗ trợ không — nếu
 * không, trả về null thay vì ép vào một ngôn ngữ không có copy thật.
 */
function toSupportedCode(tag: string | null): CompanionLanguageCode | null {
  if (!tag) return null;
  return (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(tag)
    ? (tag as CompanionLanguageCode)
    : null;
}

/**
 * Giải quyết ngôn ngữ Companion nên dùng theo thứ tự ưu tiên:
 *
 * 1. `explicitPreference` — người dùng đã chủ động chọn → tin tưởng ngay
 * 2. `profileLocale` — từ Supabase profile → tin tưởng nhưng ít hơn
 * 3. `browserLocale` — `navigator.language` → có thể phản ánh ý định
 * 4. Default: "vi" — ngôn ngữ mặc định của VO DUONG AI
 *
 * Không suy đoán dựa trên IP, quốc tịch, tên người dùng hay bất kỳ
 * thông tin ngầm nào — đúng nguyên tắc "Culture-aware, not
 * culture-stereotyping" (`THE_MULTILINGUAL_COMPANION.md`).
 */
export function resolveCompanionLanguage(
  context: CompanionLanguageContext
): CompanionLanguageResolution {
  // 1. Explicit preference — nguồn đáng tin nhất
  const fromExplicit = toSupportedCode(extractLanguageTag(context.explicitPreference));
  if (fromExplicit) {
    return {
      languageCode: fromExplicit,
      confidence: "high",
      source: "explicit_preference",
      shouldAskClarification: false,
    };
  }

  // 2. Profile locale (Supabase)
  const fromProfile = toSupportedCode(extractLanguageTag(context.profileLocale));
  if (fromProfile) {
    return {
      languageCode: fromProfile,
      confidence: "medium",
      source: "profile_locale",
      shouldAskClarification: false,
    };
  }

  // 3. Browser locale
  const browserTag = extractLanguageTag(context.browserLocale);
  const fromBrowser = toSupportedCode(browserTag);
  if (fromBrowser) {
    return {
      languageCode: fromBrowser,
      confidence: "medium",
      source: "browser_locale",
      // Nếu browser nói "en" nhưng không có explicit confirmation → hỏi
      // khi đây là lần đầu. Caller tự quyết có hỏi không — không hỏi mọi lần.
      shouldAskClarification: fromBrowser !== "vi",
    };
  }

  // 4. Default: "vi" — ngôn ngữ mặc định VO DUONG AI
  // shouldAskClarification = true khi browser hint sang ngôn ngữ khác
  // (không được hỗ trợ đầy đủ) → Companion biết mình có thể đang nói
  // sai ngôn ngữ và nên hỏi nhẹ nhàng một lần.
  const browserHintsDifferent = browserTag !== null && browserTag !== "vi";
  return {
    languageCode: "vi",
    confidence: "low",
    source: "default",
    shouldAskClarification: browserHintsDifferent,
  };
}
