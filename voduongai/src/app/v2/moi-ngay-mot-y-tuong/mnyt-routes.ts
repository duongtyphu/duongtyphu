/**
 * Bản đồ route thật cho 10 view "Mỗi ngày một ý tưởng" — README khuyến nghị
 * "A real implementation should give each view a route" (mockup gốc chỉ có
 * 1 state key `view`, không có URL routing). Namespace `/v2/moi-ngay-mot-y-tuong/*`.
 */
export const MNYT_BASE = "/v2/moi-ngay-mot-y-tuong";

export const MNYT_ROUTES = {
  home: MNYT_BASE,
  archive: `${MNYT_BASE}/kho-y-tuong`,
  path: `${MNYT_BASE}/lo-trinh`,
  glossary: `${MNYT_BASE}/tu-dien`,
  badges: `${MNYT_BASE}/huy-hieu`,
  calendar: `${MNYT_BASE}/lich`,
  profile: `${MNYT_BASE}/ho-so`,
  flashcard: `${MNYT_BASE}/the-lat`,
  fields: `${MNYT_BASE}/linh-vuc`,
  notebook: `${MNYT_BASE}/so-tay-y-tuong`,
} as const;

export function mnytDetailHref(topicId: string): string {
  return `${MNYT_BASE}/y-tuong/${topicId}`;
}
