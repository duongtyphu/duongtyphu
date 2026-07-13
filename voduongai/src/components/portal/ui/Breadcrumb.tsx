import Link from "next/link";

/**
 * PORTAL UI CONSISTENCY (Sprint 6) — breadcrumb chuẩn hoá cho toàn Portal.
 *
 * Trước đây mỗi trang tự viết một `function Breadcrumb` hoặc `<nav>` rời
 * rạc (aiworkspace/[slug], duan-cohoi/[ecosystemSlug] x2, aiworkspace/
 * bai-viet/[slug], GoalDetail) — cùng vai trò, khác nhau ở gap/wrap/hover
 * color một cách không chủ đích. Component này là nguồn chuẩn duy nhất;
 * `className` cho phép mỗi trang chỉnh khoảng cách dưới (mb-*) theo layout
 * riêng mà không cần viết lại markup.
 *
 * Không thay đổi danh sách item của từng trang (Information Architecture
 * giữ nguyên) — chỉ thống nhất cách hiển thị.
 */
export function Breadcrumb({
  items,
  className = "mb-6",
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav className={`flex flex-wrap items-center gap-1.5 text-sm text-gray-500 ${className}`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-300">/</span>}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-blue-600">
              {item.label}
            </Link>
          ) : (
            <span className="line-clamp-1 font-medium text-gray-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
