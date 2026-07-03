/**
 * Companion Design System™ — Layer 05, Nhiệm vụ 06: "Khoảng lặng".
 * Tối giản có chủ đích — không glass card, không glow, không hiệu ứng
 * nào ngoài fade rất nhẹ. Nhiều khoảng trống hơn bất kỳ section nào khác.
 */

import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";

export function CompanionSilence() {
  return (
    <CompanionRevealOnScroll variant="fade">
      <section className="py-16 text-center sm:py-24">
        <p className="text-3xl text-slate-500">…</p>
        <p className="companion-body mx-auto mt-8 max-w-xs text-base leading-loose">
          Đôi khi,
          <br />
          không cần nói thêm điều gì.
          <br />
          Mình vẫn ở đây.
        </p>
      </section>
    </CompanionRevealOnScroll>
  );
}
