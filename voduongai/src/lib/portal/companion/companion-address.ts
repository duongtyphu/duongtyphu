/**
 * Companion Personal Addressing (Sprint — Personal Addressing). Xem
 * `docs/COMPANION_PERSONAL_ADDRESSING.md`.
 *
 * KHÔNG liên quan tới `displayName` ở `companion-identity.ts` — đó là tên
 * hiển thị của CHÍNH Companion ("Người Đồng Hành"). File này nói về việc
 * Companion gọi MỘT CON NGƯỜI bằng gì, nên đặt ở module riêng để không
 * bao giờ nhầm hai khái niệm.
 *
 * Nguyên tắc: không suy luận tên, không lấy tên từ email, không tự ý
 * "đoán" một cái tên người dùng chưa từng cung cấp. Nếu không có gì để
 * gọi, Companion gọi "bạn" — không phải lỗi, đó là sự tôn trọng mặc định.
 */

/**
 * Hình dạng dữ liệu hồ sơ tối thiểu để xác định cách gọi. Hôm nay dữ liệu
 * thật chỉ có `fullName` (cột `full_name` trong Supabase/`members`) —
 * `preferredName`/`displayName` chưa tồn tại trong schema, nhưng để sẵn ở
 * đây để khi schema có thêm field đó, ưu tiên của nó tự động đúng ngay,
 * không cần đổi chữ ký hàm.
 */
export type CompanionAddressProfile = {
  /** Tên người dùng tự chọn để được gọi — ưu tiên cao nhất nếu có trong tương lai. */
  preferredName?: string | null;
  /** Tên hiển thị người dùng tự đặt (không phải tên hiển thị của Companion). */
  displayName?: string | null;
  /** Tên đầy đủ — field thật duy nhất tồn tại trong schema hôm nay. */
  fullName?: string | null;
};

/**
 * NV1 — `getCompanionAddress`: trả về cách gọi một người, theo đúng thứ
 * tự ưu tiên preferredName → displayName → fullName → "bạn". Không bao
 * giờ trả về chuỗi rỗng — luôn có một cách gọi hợp lệ để dùng ngay.
 */
export function getCompanionAddress(profile?: CompanionAddressProfile | null): string {
  const candidates = [profile?.preferredName, profile?.displayName, profile?.fullName];
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed) return trimmed;
  }
  return "bạn";
}

/**
 * NV2 — `shouldUseUserName`: chỉ những khoảnh khắc có ý nghĩa thật mới
 * được dùng tên người dùng. Context không có trong danh sách → không
 * dùng tên (an toàn theo hướng không lạm dụng, không phải hướng ngược lại).
 */
export type CompanionAddressContext =
  | "greeting"
  | "birthday"
  | "return_after_silence"
  | "reflection_letter"
  | "life_moment"
  | "first_footprint"
  | "mirror"
  | "story"
  | "generic_tip"
  | "cta"
  | "error_message";

const MEANINGFUL_ADDRESS_CONTEXTS: ReadonlySet<CompanionAddressContext> = new Set([
  "greeting",
  "birthday",
  "return_after_silence",
  "reflection_letter",
  "life_moment",
  "first_footprint",
  "mirror",
  "story",
]);

export function shouldUseUserName(context: CompanionAddressContext): boolean {
  return MEANINGFUL_ADDRESS_CONTEXTS.has(context);
}

/**
 * Áp dụng cách gọi vào một câu có sẵn, AN TOÀN về ngữ pháp tiếng Việt:
 * không thay thế từ "bạn" nằm giữa câu (rủi ro sai ngữ pháp đã ghi nhận ở
 * `LIFE_MOMENT_LINES`) — chỉ thêm một lời gọi tên ở ĐẦU câu khi điều kiện
 * cho phép, giữ nguyên câu gốc khi không có tên thật hoặc context không
 * cho phép.
 */
export function withPersonalAddress(
  line: string,
  profile: CompanionAddressProfile | null | undefined,
  context: CompanionAddressContext
): string {
  if (!shouldUseUserName(context)) return line;
  const address = getCompanionAddress(profile);
  if (address === "bạn") return line;
  return `${address} ơi, ${line}`;
}
