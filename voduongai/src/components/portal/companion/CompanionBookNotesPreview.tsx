/**
 * Companion World™ — bố cục tham chiếu mục ⑤ (cột trái): "Book Notes" thu
 * gọn — vài thẻ chương nhỏ + trạng thái "chưa viết", ghép cột với "Hôm nay
 * Companion nghĩ gì?" bên phải (giữ nguyên component cũ). Chỉ mượn layout
 * 2 cột — nội dung là Book of Companion đã có ở Layer 06, không sao chép
 * từ ảnh tham chiếu.
 */

import Link from "next/link";
import { Lock } from "lucide-react";
import { COMPANION_BOOK_PREVIEW } from "@/data/portal/companion-book-preview";
import { CompanionChapterLabel, CompanionHeading } from "./CompanionTypography";

export function CompanionBookNotesPreview() {
  return (
    <div className="companion-glass-card flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <CompanionChapterLabel>Cuốn sách</CompanionChapterLabel>
          <CompanionHeading className="mt-2 text-xl sm:text-2xl">Book Notes</CompanionHeading>
        </div>
        <Link
          href="/portal/companion/book-notes"
          className="shrink-0 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="companion-book-preview-track mt-6">
        {COMPANION_BOOK_PREVIEW.map((chapter) => {
          const content = (
            <>
              <span className="companion-chapter-label text-[0.6rem]">Chương {chapter.number}</span>
              <p className="mt-2 line-clamp-3 text-sm font-semibold leading-snug text-white">
                {chapter.empty ? "???" : chapter.title}
              </p>
              {chapter.empty && <Lock className="mt-3 h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} />}
            </>
          );

          if (chapter.empty) {
            return (
              <div
                key={chapter.number}
                aria-disabled="true"
                className="companion-book-preview-card companion-book-preview-card--empty"
              >
                {content}
              </div>
            );
          }

          return (
            <Link key={chapter.number} href="/portal/companion/book-notes" className="companion-book-preview-card">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
