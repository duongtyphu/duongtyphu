import Link from "next/link";
import { ArrowRight, type LucideIcon, Inbox } from "lucide-react";

/**
 * ADM-V2-01 — Empty State chuyên nghiệp cho module ĐÃ CHÍNH THỨC thuộc kiến
 * trúc Admin nhưng hiện chưa có dữ liệu/hạ tầng để hiển thị nội dung thật.
 * KHÁC `WorkspacePlaceholder` (Hourglass + badge "Sắp triển khai" — dùng cho
 * module CHƯA triển khai) — component này dùng cho module ĐÃ triển khai
 * (route thật, layout thật, phân quyền thật) nhưng đang honestly rỗng, theo
 * đúng yêu cầu: "Nếu chưa có dữ liệu, dùng Empty State chuyên nghiệp với mô
 * tả rõ và hành động phù hợp, không dùng badge 'Sắp ra mắt'".
 */
export function AdminEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-400">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-sm font-bold text-gray-900">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-gray-500">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
        >
          {action.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
