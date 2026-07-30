import Link from "next/link";
import { ArrowRight, Hourglass } from "lucide-react";

/**
 * KIẾN TRÚC ADMIN V2.0 — trang dùng chung cho MỌI module `comingSoon: true`
 * trong `src/lib/admin/nav.ts`. Đây KHÔNG phải link chết và KHÔNG phải CRUD
 * giả — mỗi trang mô tả trung thực phạm vi dự kiến + trạng thái hiện tại,
 * không hiển thị số liệu/dữ liệu bịa (đúng nguyên tắc "Không triển khai
 * hàng loạt CRUD giả cho những module chưa tồn tại").
 */
export function WorkspacePlaceholder({
  title,
  description,
  scope,
  note,
  relatedLink,
}: {
  title: string;
  description: string;
  /** Danh sách việc dự kiến sẽ làm khi module này được triển khai thật. */
  scope: string[];
  /** Ghi chú thêm — ví dụ lý do chưa làm, hoặc bảng dữ liệu liên quan đã có
   * sẵn nhưng chưa nối UI. */
  note?: string;
  /** Trỏ sang 1 module thật đã có sẵn đang sở hữu 1 phần dữ liệu liên quan
   * (tránh Founder tưởng chưa quản lý được gì). */
  relatedLink?: { label: string; href: string };
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <Hourglass className="h-4.5 w-4.5" />
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">
          Sắp triển khai
        </span>
      </div>

      <h1 className="text-xl font-extrabold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Phạm vi dự kiến</h2>
        <ul className="mt-3 space-y-2">
          {scope.map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      {note && (
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-gray-700">
          {note}
        </div>
      )}

      {relatedLink && (
        <Link
          href={relatedLink.href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
        >
          {relatedLink.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
