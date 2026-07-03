/**
 * Companion Design System™ — Layer 06: The Library of Beliefs™ (Nhiệm vụ 03).
 * Mỗi niềm tin là MỘT trang riêng, có không gian riêng — không phải bullet
 * point trong một danh sách. Nhiều khoảng trắng, chữ lớn, cảm giác đang lật
 * qua một trang sách chứ không phải đang lướt một danh sách tính năng.
 */

import type { ReactNode } from "react";
import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";
import { CompanionChapterLabel } from "./CompanionTypography";

export function CompanionBeliefPage({
  index,
  name,
  statement,
  children,
}: {
  index: string;
  name: string;
  statement: string;
  children?: ReactNode;
}) {
  return (
    <CompanionRevealOnScroll variant="page-turn">
      <section className="companion-glass-card flex flex-col gap-6 px-8 py-14 sm:px-12 sm:py-20">
        <CompanionChapterLabel>Niềm tin {index}</CompanionChapterLabel>
        <h2 className="companion-heading text-3xl sm:text-4xl">{name}</h2>
        <p className="companion-quote max-w-xl text-lg leading-loose sm:text-xl">&ldquo;{statement}&rdquo;</p>
        {children && <div className="companion-body max-w-xl text-base leading-relaxed sm:text-lg">{children}</div>}
      </section>
    </CompanionRevealOnScroll>
  );
}
