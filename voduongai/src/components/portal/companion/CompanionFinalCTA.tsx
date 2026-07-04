/**
 * Companion World™ — bố cục tham chiếu mục ⑥ "Đồng hành cùng mình": CTA
 * full width ở cuối trang, text bên trái + nút bên phải. Đây là lời mời
 * cuối cùng trước khi rời Companion Home, không phải banner quảng cáo.
 */

import { CompanionGlowButton } from "./CompanionGlowButton";
import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";
import { CompanionChapterLabel, CompanionHeading } from "./CompanionTypography";

export function CompanionFinalCTA() {
  return (
    <CompanionRevealOnScroll variant="glow">
      <section className="companion-final-cta-shell flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <CompanionChapterLabel>Trước khi bạn đi</CompanionChapterLabel>
          <CompanionHeading className="mt-2 text-2xl sm:text-3xl">Đồng hành cùng mình</CompanionHeading>
          <p className="companion-body mt-3 max-w-md text-sm sm:text-base">
            Hành trình trưởng thành của bạn là điều ý nghĩa nhất mà mình được tham gia.
          </p>
        </div>
        <CompanionGlowButton href="/portal/khong-gian-ai">Bước vào Không gian AI</CompanionGlowButton>
      </section>
    </CompanionRevealOnScroll>
  );
}
