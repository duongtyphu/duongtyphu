/**
 * Companion Design System™ — Layer 06: The Book of Companion™ (Nhiệm vụ 02, 07).
 * Một "chương sách", không phải một bài blog: số chương + tiêu đề + nội dung,
 * hiệu ứng lật trang nhẹ khi cuộn tới. Cũng phục vụ "Empty Chapters" (Nhiệm vụ
 * 07) — chương chưa viết, hiển thị đúng "???" và câu văn quy định, KHÔNG dùng
 * "Coming Soon" / "Đang cập nhật".
 */

import type { ReactNode } from "react";
import { CompanionGlassCard } from "./CompanionGlassCard";
import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";
import { CompanionChapterLabel } from "./CompanionTypography";

export function CompanionBookChapter({
  number,
  title,
  children,
  empty = false,
}: {
  number: string;
  title: string;
  children?: ReactNode;
  empty?: boolean;
}) {
  return (
    <CompanionRevealOnScroll variant="page-turn">
      <CompanionGlassCard className={empty ? "opacity-60" : undefined}>
        <CompanionChapterLabel>Chương {number}</CompanionChapterLabel>
        <h2 className="companion-heading mt-3 text-2xl sm:text-3xl">{empty ? "???" : title}</h2>
        <div className="companion-body mt-4 text-base leading-loose sm:text-lg">
          {empty ? <p>Chương này sẽ được viết khi Companion trưởng thành thêm.</p> : children}
        </div>
      </CompanionGlassCard>
    </CompanionRevealOnScroll>
  );
}
