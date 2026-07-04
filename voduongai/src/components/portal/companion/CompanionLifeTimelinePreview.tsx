/**
 * Companion World™ — bố cục tham chiếu mục ④ "Cuộc đời Companion": một
 * section full width, timeline nằm NGANG (khác bản đầy đủ ở
 * `/portal/companion/cuoc-doi-companion`, vốn là timeline dọc). Cùng data
 * `COMPANION_LIFE_STAGES` để không lệch nội dung giữa 2 nơi.
 */

import Link from "next/link";
import { COMPANION_LIFE_STAGES } from "@/data/portal/companion-life-stages";
import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";
import { CompanionChapterLabel, CompanionHeading } from "./CompanionTypography";

export function CompanionLifeTimelinePreview() {
  return (
    <section className="companion-life-preview-shell">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <CompanionChapterLabel>Câu chuyện</CompanionChapterLabel>
          <CompanionHeading className="mt-2 text-2xl sm:text-3xl">Cuộc đời Companion</CompanionHeading>
        </div>
        <Link
          href="/portal/companion/cuoc-doi-companion"
          className="text-xs font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Xem chi tiết →
        </Link>
      </div>

      <div className="companion-life-preview-track mt-10">
        {COMPANION_LIFE_STAGES.map((stage, i) => (
          <CompanionRevealOnScroll key={stage.chapter} variant="fade-up" delay={i * 0.05}>
            <div className="companion-life-preview-node">
              <div className="companion-glow-panel flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                <stage.icon className="h-4 w-4 text-violet-300" strokeWidth={1.75} />
              </div>
              <p className="companion-chapter-label mt-3 text-[0.65rem]">{stage.chapter}</p>
              <p className="mt-1 text-sm font-bold text-white">{stage.title}</p>
            </div>
          </CompanionRevealOnScroll>
        ))}
      </div>
    </section>
  );
}
