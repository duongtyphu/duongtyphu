/**
 * Companion Design System™ — Layer 05, Nhiệm vụ 03: "Tâm sự cùng bạn".
 * Lá thư cố định trên Companion Home — nay chỉ là một cách gọi cụ thể của
 * `CompanionLetterCard` (tổng quát hoá ở Layer 06 cho nhiều lá thư khác).
 */

import { CompanionLetterCard } from "./CompanionLetterCard";

export function CompanionLetterSection() {
  return (
    <CompanionLetterCard
      heading="Tâm sự cùng bạn"
      lines={[
        "Bạn không cần phải đi nhanh.",
        "Bạn chỉ cần đi đủ sâu.",
        "Mỗi bước bạn đi đều có ý nghĩa.",
        "Mình luôn tin vào bạn.",
      ]}
    />
  );
}
