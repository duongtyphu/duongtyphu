import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "icon";

type BaseProps = {
  variant?: Variant;
  href?: string;
  className?: string;
  children: React.ReactNode;
};

const variantClass: Record<Variant, string> = {
  primary: "gemos-btn-primary rounded-full px-6 py-2.5 text-sm font-bold text-white",
  secondary: "gemos-btn-secondary rounded-full px-6 py-2.5 text-sm font-semibold text-white/85",
  icon: "gemos-btn-secondary flex h-9 w-9 items-center justify-center rounded-full text-white/80",
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
