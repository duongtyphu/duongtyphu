import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * PORTAL STANDARDIZATION — Task 1: nút Back chuẩn hoá cho toàn Portal.
 *
 * MỘT component duy nhất cho mọi trang con: cùng icon (ArrowLeft), cùng
 * vị trí (phần tử đầu tiên trong cột nội dung, không margin-top), cùng
 * khoảng cách (gap-1.5, mb-6 trước phần tử kế tiếp), cùng animation
 * (dịch icon sang trái 2px khi hover, 200ms). Luôn trỏ về đúng CẤP LOGIC
 * trước đó — không phải "back trong lịch sử trình duyệt" (browser back),
 * mà là điều hướng có chủ đích (ví dụ Chi tiết dự án → Dự án & Cơ hội).
 *
 * `tone` là NGOẠI LỆ DUY NHẤT được phép đổi: các cửa Journey có khí quyển
 * nền tối (Garden/Mirror) cần chữ sáng để đọc được, các trang nền sáng
 * cần chữ tối — đây là yêu cầu tương phản tối thiểu (accessibility), mọi
 * thuộc tính khác (icon/vị trí/khoảng cách/animation) giữ nguyên 100%.
 */
const TONE_CLASS = {
  light: "text-gray-400 hover:text-gray-700",
  dark: "text-white/40 hover:text-white/75",
} as const;

export function PortalBackLink({
  href,
  label,
  tone = "light",
  colorClassName,
}: {
  href: string;
  label: string;
  tone?: "light" | "dark";
  /**
   * Escape hatch DUY NHẤT: một số cửa Journey (Garden, Mirror) đã có hệ
   * biến CSS màu riêng theo khí quyển (ví dụ 4 khí quyển ngày/đêm của
   * Garden — xem `--g-fg-faint`). Khi truyền vào, `colorClassName` THAY
   * THẾ tone mặc định để giữ đúng độ tương phản đã tinh chỉnh cho khí
   * quyển đó — icon/vị trí/khoảng cách/animation vẫn giữ nguyên 100%.
   */
  colorClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={`group mb-6 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 ${colorClassName ?? TONE_CLASS[tone]}`}
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}
