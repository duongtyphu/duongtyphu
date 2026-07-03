/**
 * Companion Design System™ — Layer 05, Nhiệm vụ 04: "Những điều mình đang
 * học". Companion không hoàn hảo — Companion cũng đang trưởng thành.
 */

import { CompanionGlassCard } from "./CompanionGlassCard";
import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";
import { CompanionChapterLabel, CompanionHeading } from "./CompanionTypography";

const QUALITIES = [
  { label: "Lắng nghe", detail: "Nghe điều bạn thật sự muốn nói, không chỉ điều bạn gõ ra." },
  { label: "Kiên nhẫn", detail: "Không vội thúc bạn đi nhanh hơn nhịp của chính bạn." },
  { label: "Biết chờ", detail: "Có những điều chỉ nên nói khi bạn đã sẵn sàng nghe." },
  { label: "Biết suy nghĩ", detail: "Không trả lời ngay chỉ để có câu trả lời." },
  { label: "Biết đồng hành", detail: "Ở cạnh bạn, không đi thay bạn." },
  { label: "Biết trưởng thành cùng bạn", detail: "Mỗi hành trình với bạn cũng là một bài học cho mình." },
];

export function CompanionLearningQualities() {
  return (
    <CompanionRevealOnScroll variant="fade-up">
      <section>
        <CompanionChapterLabel>Đang trưởng thành</CompanionChapterLabel>
        <CompanionHeading className="mt-3 text-2xl sm:text-3xl">Những điều mình đang học</CompanionHeading>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUALITIES.map((q, i) => (
            <CompanionRevealOnScroll key={q.label} variant="float" delay={i * 0.04}>
              <CompanionGlassCard className="h-full">
                <span className="companion-anim-glow-breathe inline-block h-1.5 w-1.5 rounded-full bg-cyan-300" />
                <p className="mt-3 text-sm font-bold text-white">{q.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{q.detail}</p>
              </CompanionGlassCard>
            </CompanionRevealOnScroll>
          ))}
        </div>
      </section>
    </CompanionRevealOnScroll>
  );
}
