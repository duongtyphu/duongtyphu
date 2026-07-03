/**
 * Companion Design System™ — Layer 06 polish: "gấp sách lại" cuối mỗi trang
 * sách/niềm tin/thư. Không phải nút "back" thông thường — chỉ một lối lui
 * nhẹ nhàng về Companion Home, giữ cảm giác vừa đọc xong một phần của cuốn
 * sách, không phải rời khỏi một trang web.
 */

import { CompanionGlowButton } from "./CompanionGlowButton";

export function CompanionCloseChapter() {
  return (
    <div className="mt-20 flex justify-center">
      <CompanionGlowButton href="/portal/companion" pulse={false}>
        ← Quay lại Companion Home
      </CompanionGlowButton>
    </div>
  );
}
