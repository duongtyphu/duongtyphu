import type { ReactNode } from "react";

// Chuẩn hoá tiêu đề section trong content area (Portal 3.0 P.2) — trước đây
// mỗi trang tự viết `<h2 className="text-xl font-bold text-gray-900">` (hoặc
// biến thể `mb-4 text-xl font-bold`, `text-sm font-bold uppercase tracking-wider`)
// rải rác, không có nguồn chuẩn. Không thay thế PageHeader (dùng cho hero cấp
// trang) — đây là tiêu đề cấp section bên trong nội dung.
export function SectionHeader({
  title,
  eyebrow,
  description,
  action,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="space-y-0.5">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{eyebrow}</p>
        ) : null}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description ? <p className="text-sm text-gray-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
