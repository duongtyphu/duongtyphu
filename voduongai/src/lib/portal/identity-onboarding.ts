// Onboarding sau lần đăng nhập đầu tiên (Identity Hub v1.0) — KHÁC với
// `src/lib/portal/onboarding.ts` (goal/level/dailyTime picker hiển thị dạng
// modal trong Portal, lưu localStorage, dùng để điều hướng cá nhân hoá, đã
// tồn tại từ trước). 2 khái niệm "onboarding" độc lập, không gộp: cái này
// là hồ sơ định danh bắt buộc (server-side, gate trước khi vào Portal), cái
// kia là gợi ý điều hướng tuỳ chọn (localStorage, không bắt buộc, vẫn giữ
// nguyên không đụng tới).
export type InterestId =
  | "hoc-tap"
  | "cong-viec"
  | "kinh-doanh"
  | "affiliate-marketing"
  | "thuong-hieu-ca-nhan";

export const INTEREST_OPTIONS: { id: InterestId; label: string }[] = [
  { id: "hoc-tap", label: "Học tập" },
  { id: "cong-viec", label: "Công việc" },
  { id: "kinh-doanh", label: "Kinh doanh" },
  { id: "affiliate-marketing", label: "Affiliate Marketing" },
  { id: "thuong-hieu-ca-nhan", label: "Thương hiệu cá nhân" },
];
