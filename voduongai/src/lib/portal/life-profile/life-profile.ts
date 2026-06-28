/**
 * Life Profile (Sprint 18.3 — "The Life Profile"). Xem
 * `docs/product-bible/BOOK_LIFE_PROFILE.md`.
 *
 * Đây KHÔNG phải một hệ thống thu thập dữ liệu cá nhân. Life Profile là
 * nơi người dùng tự nguyện trao cho Companion những điều đáng được trân
 * trọng — bắt đầu với ngày sinh, nhưng mô hình được thiết kế để mở rộng
 * sang những điều khác trong tương lai (không phải bắt buộc phải dùng
 * hết ngay sprint này).
 *
 * Pure data/logic — không gọi Supabase trực tiếp ở đây; việc đọc/ghi
 * nằm ở `src/app/portal/account/life-profile-actions.ts` (server) và
 * `src/app/portal/layout.tsx` (đọc cho Life Moments).
 */

export type LifeProfileFieldKey = "date_of_birth";

/**
 * "shared": người dùng đã chủ động cho Companion biết và đang hiển thị.
 * "hidden": dữ liệu vẫn được giữ lại (không bị xoá), nhưng người dùng đã
 * chọn tạm ẩn — Companion không được dùng để kích hoạt bất kỳ Life
 * Moment nào trong trạng thái này.
 */
export type LifeProfileVisibility = "shared" | "hidden";

export type LifeProfileEntry = {
  value: string;
  visibility: LifeProfileVisibility;
};

export type LifeProfile = {
  dateOfBirth: LifeProfileEntry | null;
};

export function buildLifeProfile(input: {
  dateOfBirth: string | null;
  dateOfBirthHidden: boolean;
}): LifeProfile {
  if (!input.dateOfBirth) return { dateOfBirth: null };
  return {
    dateOfBirth: {
      value: input.dateOfBirth,
      visibility: input.dateOfBirthHidden ? "hidden" : "shared",
    },
  };
}

/**
 * Trả về ngày sinh CHỈ khi người dùng đang chia sẻ (không ẩn, không
 * xoá) — đây là nguồn duy nhất `life-moment-detector.ts` nên dùng cho
 * Birthday. Không bao giờ trả dữ liệu đã bị ẩn, dù dữ liệu đó vẫn còn
 * được lưu.
 */
export function resolveSharedBirthday(profile: LifeProfile): string | null {
  if (!profile.dateOfBirth) return null;
  if (profile.dateOfBirth.visibility === "hidden") return null;
  return profile.dateOfBirth.value;
}
