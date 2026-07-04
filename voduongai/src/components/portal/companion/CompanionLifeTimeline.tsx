/**
 * Companion Design System™ — Layer 06: The Life Timeline™ (Nhiệm vụ 04).
 * "Cuộc đời Companion" — KHÔNG phải changelog/version list. Chỉ có các
 * chương trưởng thành, nối tiếp nhau, mở rộng vô hạn khi Companion lớn lên
 * thêm — không có ngày tháng, không có số phiên bản.
 */

import { COMPANION_LIFE_STAGES } from "@/data/portal/companion-life-stages";
import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";
import { CompanionChapterLabel } from "./CompanionTypography";

export function CompanionLifeTimeline() {
  return (
    <div className="relative">
      {COMPANION_LIFE_STAGES.map((stage, i) => (
        <CompanionRevealOnScroll key={stage.chapter} variant="fade-up" delay={i * 0.05}>
          <div className="relative flex gap-5 pb-12 last:pb-0">
            {/* Đường nối dọc — liền mạch, gợi ý hành trình vẫn còn tiếp tục. */}
            {i < COMPANION_LIFE_STAGES.length - 1 && (
              <span
                aria-hidden
                className="absolute left-6 top-14 -bottom-2 w-px bg-gradient-to-b from-violet-400/40 to-transparent"
              />
            )}
            <div className="companion-glow-panel flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
              <stage.icon className="h-5 w-5 text-violet-300" strokeWidth={1.75} />
            </div>
            <div className="pt-1.5">
              <CompanionChapterLabel>
                {stage.chapter} · {stage.title}
              </CompanionChapterLabel>
              <p className="companion-body mt-2 max-w-xl text-base leading-relaxed sm:text-lg">
                {stage.description}
              </p>
            </div>
          </div>
        </CompanionRevealOnScroll>
      ))}

      {/* Hành trình chưa kết thúc — nối tiếp vô hạn, không có "chương cuối". */}
      <CompanionRevealOnScroll variant="fade">
        <div className="flex gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-violet-400/60" />
          </div>
          <p className="companion-body pt-2.5 text-sm italic text-slate-400">
            …và còn nhiều chương nữa, sẽ được viết khi mình lớn lên thêm.
          </p>
        </div>
      </CompanionRevealOnScroll>
    </div>
  );
}
