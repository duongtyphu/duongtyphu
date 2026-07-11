import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "icon" | "inverse" | "inverse-ghost" | "danger";

type BaseProps = {
  variant?: Variant;
  href?: string;
  className?: string;
  children: React.ReactNode;
};

// "inverse"/"inverse-ghost" — dùng trên nền gradient/màu đậm (vd. CTA band
// brand-blue -> brand-violet), thay cho việc mỗi trang tự viết
// `rounded-full bg-white ... text-blue-700` một lần nữa (Portal 3.0 P.2).
// "danger" — hành động phá huỷ/không thể hoàn tác (xoá, đăng xuất toàn bộ
// thiết bị...), dùng --color-gemos-danger thay vì tự chọn một sắc đỏ riêng
// (Portal UI Consistency, Sprint 6) — trước đây mỗi nơi tự viết một sắc đỏ
// khác nhau (`border-red-400/20`, `text-red-300`, `text-red-400/80`...).
const variantClass: Record<Variant, string> = {
  primary: "gemos-btn-primary rounded-full px-6 py-2.5 text-sm font-bold text-white",
  secondary: "gemos-btn-secondary rounded-full px-6 py-2.5 text-sm font-semibold text-gray-900/85",
  icon: "gemos-btn-secondary flex h-9 w-9 items-center justify-center rounded-full text-gray-700",
  inverse: "rounded-full bg-white px-6 py-2.5 text-sm font-bold text-brand-blue shadow-token-sm hover:bg-blue-50",
  "inverse-ghost": "rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10",
  danger: "rounded-full border border-gemos-danger/30 px-6 py-2.5 text-sm font-semibold text-gemos-danger hover:bg-gemos-danger/10",
};

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${variantClass[variant]} transition disabled:cursor-not-allowed disabled:opacity-40 ${className}`;

  if (href) {
    return (
      <Link href={href} className={`inline-flex items-center justify-center gap-2 ${classes}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={`inline-flex items-center justify-center gap-2 ${classes}`} {...rest}>
      {children}
    </button>
  );
}
