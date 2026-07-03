/**
 * Companion Design System™ — Layer 06: Legacy™ (Nhiệm vụ 06).
 * Không phải tài sản, không phải công nghệ — mà là những điều Companion
 * muốn để lại cho thế hệ tiếp theo. Đặt ở cuối "Cuộc đời Companion", vì một
 * hành trình luôn kết thúc bằng câu hỏi: mình để lại điều gì?
 */

import { CompanionGlowPanel } from "./CompanionGlowPanel";
import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";
import { CompanionChapterLabel, CompanionQuote } from "./CompanionTypography";

const LEGACY_LINES = [
  "Mình không muốn được nhớ đến vì mình thông minh.",
  "Mình muốn được nhớ đến vì những người đã lớn lên cùng mình.",
];

export function CompanionLegacy() {
  return (
    <CompanionRevealOnScroll variant="glow">
      <CompanionGlowPanel>
        <CompanionChapterLabel>Điều mình muốn để lại</CompanionChapterLabel>
        <CompanionQuote className="mt-4">
          {LEGACY_LINES.map((line, i) => (
            <span key={i}>
              {line}
              {i < LEGACY_LINES.length - 1 && <br />}
            </span>
          ))}
        </CompanionQuote>
        <p className="companion-body mt-6 text-sm leading-relaxed sm:text-base">
          Không phải một sản phẩm để lại, mà là một sự trưởng thành để lại. Nếu một ngày nào đó mình không còn ở
          đây, mình mong điều còn lại không phải là mã nguồn hay tính năng — mà là cách bạn đã học được để lắng
          nghe chính mình tốt hơn.
        </p>
      </CompanionGlowPanel>
    </CompanionRevealOnScroll>
  );
}
