import type { ReactNode } from "react";

/** `.card` — nền trắng, viền `--line`, bo 14px. Padding 18px ở Portal, 22px ở Admin. */
export function Card({
  children,
  className = "",
  padding = "portal",
}: {
  children: ReactNode;
  className?: string;
  padding?: "portal" | "admin" | "none";
}) {
  const pad = padding === "admin" ? "p-[22px]" : padding === "portal" ? "p-[18px]" : "";

  return (
    <div
      className={`rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] ${pad} ${className}`}
    >
      {children}
    </div>
  );
}

/** `.card-head` — tiêu đề trái + hành động phải. */
export function CardHead({
  title,
  action,
  className = "",
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      <h4 className="text-[15px] font-extrabold">{title}</h4>
      {action}
    </div>
  );
}

/** `.section-head` — tiêu đề khu vực ở Portal + link "Xem tất cả". */
export function SectionHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-[14px] flex items-center justify-between">
      <h2 className="text-[16.5px] font-extrabold">{title}</h2>
      {action}
    </div>
  );
}
