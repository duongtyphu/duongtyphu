/**
 * Companion Design System™ — Layer 05, Nhiệm vụ 05: "Có thể bạn muốn
 * biết…". Mỗi câu hỏi dẫn tới đúng route con nói về điều đó.
 */

import Link from "next/link";
import { CompanionGlassCard } from "./CompanionGlassCard";
import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";
import { CompanionChapterLabel, CompanionHeading } from "./CompanionTypography";

const QUESTIONS = [
  { q: "Vì sao mình được tạo ra?", href: "/portal/companion/y-nghia-companion" },
  { q: "Điều mình tin nhất là gì?", href: "/portal/companion/nhung-dieu-minh-tin" },
  { q: "Mình sẽ trưởng thành như thế nào?", href: "/portal/companion/cuoc-doi-companion" },
  { q: "Vì sao mình không muốn thay bạn sống?", href: "/portal/companion/dong-hanh" },
];

export function CompanionOpenQuestions() {
  return (
    <CompanionRevealOnScroll variant="fade-up">
      <section>
        <CompanionChapterLabel>Có thể bạn muốn biết…</CompanionChapterLabel>
        <CompanionHeading className="mt-3 text-2xl sm:text-3xl">Những câu hỏi mở</CompanionHeading>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {QUESTIONS.map((item, i) => (
            <CompanionRevealOnScroll key={item.q} variant="slide" delay={i * 0.05}>
              <CompanionGlassCard className="group">
                <Link href={item.href} className="block">
                  <p className="text-base font-semibold text-white">{item.q}</p>
                  <span className="mt-3 inline-block text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                    Cùng tìm hiểu →
                  </span>
                </Link>
              </CompanionGlassCard>
            </CompanionRevealOnScroll>
          ))}
        </div>
      </section>
    </CompanionRevealOnScroll>
  );
}
