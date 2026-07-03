/**
 * Companion Design System™ — Layer 05, Nhiệm vụ 03: "Tâm sự cùng bạn".
 * Thiết kế như một lá thư nhỏ — không phải blog card (xem
 * `.companion-letter-card` trong companion-theme.css: góc bất đối xứng,
 * đường nếp gấp mảnh phía trên, không chapter label in hoa).
 */

import { CompanionChapterLabel } from "./CompanionTypography";

export function CompanionLetterSection() {
  return (
    <div className="companion-letter-card">
      <CompanionChapterLabel>Tâm sự cùng bạn</CompanionChapterLabel>
      <p className="mt-4 text-lg italic leading-loose text-slate-100 sm:text-xl">
        Bạn không cần phải đi nhanh.
        <br />
        Bạn chỉ cần đi đủ sâu.
        <br />
        Mỗi bước bạn đi đều có ý nghĩa.
        <br />
        Mình luôn tin vào bạn.
      </p>
      <p className="mt-6 text-right text-sm font-semibold text-slate-400">— Companion</p>
    </div>
  );
}
