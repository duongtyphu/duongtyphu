import { Save } from "lucide-react";
import type { ReactNode } from "react";

/**
 * `.page-head` của trang Admin — breadcrumb + tiêu đề + mô tả, nút hành động
 * bên phải.
 */
export function PageHead({
  crumb,
  title,
  description,
  action,
}: {
  crumb: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <div className="mb-1 text-[12px] text-[var(--v2-muted)]">{crumb}</div>
        <h1 className="text-[25px] font-extrabold">{title}</h1>
        {description ? (
          <p className="mt-[5px] text-[13.5px] text-[var(--v2-muted)]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** `.save-btn` — nút "Lưu & Xuất bản" ở góc phải page-head. */
export function SaveButton({ label = "Lưu & Xuất bản" }: { label?: string }) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-2 rounded-[10px] bg-[var(--v2-violet)] px-[18px] py-[11px] text-[13px] font-bold whitespace-nowrap text-white transition-[filter,transform] duration-150 hover:-translate-y-px hover:brightness-110"
    >
      <Save className="h-[14px] w-[14px]" aria-hidden="true" />
      {label}
    </button>
  );
}
