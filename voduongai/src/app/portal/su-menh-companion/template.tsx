/**
 * Companion Design System™ — Layer 03, Nhiệm vụ 07: Transition System.
 * Next.js `template.tsx` tạo lại instance mới mỗi lần điều hướng trong
 * đúng segment này — dùng nó để mọi trang /portal/companion/* mount bằng
 * một fade+blur nhẹ (companion-route-enter), không nháy trắng, không đổi
 * màu đột ngột. Không phải layout — không đổi cấu trúc route nào.
 */
export default function CompanionTemplate({ children }: { children: React.ReactNode }) {
  return <div className="companion-route-enter">{children}</div>;
}
