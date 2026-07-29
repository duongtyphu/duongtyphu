/**
 * Route nào ngoài "/" cũng phải theo đúng theme sáng/tối người dùng đã
 * chọn (cookie `vdai-landing-theme`, xem `LandingThemeProvider`) thay vì
 * luôn cố định tối. Trước đây CHỈ "/" đọc theme — Header/Footer/nội dung
 * trang khác luôn hiển thị tối bất kể theme, đúng nguyên do khi bấm
 * "Đăng nhập"/"Đăng ký" từ trang chủ đang ở chế độ sáng, trang đích lại
 * đổi sang tối.
 *
 * Chỉ thêm route vào đây khi trang đó THẬT SỰ đã tự render 2 biến thể
 * sáng/tối (đọc `useLandingTheme()`/cookie theme) — thêm route chưa làm
 * theme-aware vào đây sẽ khiến Header/Footer đổi màu nhưng nội dung
 * trang vẫn tối, gây lệch tông chứ không sửa được gì.
 */
export const THEME_AWARE_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
] as const;

export function isThemeAwareRoute(pathname: string | null): boolean {
  return pathname !== null && (THEME_AWARE_ROUTES as readonly string[]).includes(pathname);
}
