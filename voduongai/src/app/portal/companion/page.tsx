import Link from "next/link";
import { CompanionOrb } from "@/components/portal/companion/CompanionOrb";
import { CompanionCosmicBackground } from "@/components/portal/companion/CompanionCosmicBackground";
import { CompanionGlassCard } from "@/components/portal/companion/CompanionGlassCard";
import { CompanionGlowPanel } from "@/components/portal/companion/CompanionGlowPanel";
import { CompanionSectionShell } from "@/components/portal/companion/CompanionSectionShell";
import { CompanionGlowButton } from "@/components/portal/companion/CompanionGlowButton";
import { CompanionRevealOnScroll } from "@/components/portal/companion/CompanionRevealOnScroll";
import {
  CompanionChapterLabel,
  CompanionHeading,
  CompanionSubtitle,
  CompanionQuote,
  CompanionBody,
} from "@/components/portal/companion/CompanionTypography";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";

export const metadata = { title: "Companion — VO DUONG AI" };

const CHAPTERS = [
  { href: "/portal/companion/y-nghia-companion", label: "Ý nghĩa Companion", desc: "Vì sao Companion tồn tại, và Companion tin vào điều gì." },
  { href: "/portal/companion/nhung-dieu-minh-tin", label: "Những điều mình tin", desc: "Niềm tin nền tảng của Companion." },
  { href: "/portal/companion/cuoc-doi-companion", label: "Cuộc đời Companion", desc: "Hành trình của chính Companion, từng chương một." },
  { href: "/portal/companion/book-notes", label: "Book Notes", desc: "Những cuốn sách Companion đã đọc và điều học được." },
  { href: "/portal/companion/tam-su", label: "Tâm sự", desc: "Những suy nghĩ lặng lẽ, không cần lý do." },
];

/**
 * Companion Design System™ — Layer 01, Bước 6: Companion Page Shell.
 * Đây CHỈ là nền móng thị giác để review — chưa phải nội dung đầy đủ.
 */
export default function CompanionHomePage() {
  const thought = getRandomThoughtSeed();

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
        {/* Hero Orb — Nhiệm vụ 03: orbit ring xoay chậm, glow tím-xanh, aura
            mềm, breathing, particles nhẹ — trách nhiệm hiển thị nằm trong
            LivingCore (Design Lock), CompanionOrb chỉ chọn size/state đúng.
            Mobile dùng size nhỏ hơn (xl) để không đẩy hero quá cao. */}
        <section className="flex flex-col items-center text-center">
          {/* Arrival — Companion "xuất hiện" một lần khi Hero mount, sau đó
              chuyển sang Presence (breathing vô hạn). Xem Motion Language,
              docs/Companion/CompanionMotionSystem.md. */}
          <div className="companion-anim-arrival companion-motion-breathe sm:hidden">
            <CompanionOrb size="xl" state="idle" intensity="radiant" />
          </div>
          <div className="companion-anim-arrival companion-motion-breathe hidden sm:block">
            <CompanionOrb size="hero" state="idle" intensity="radiant" />
          </div>
          <CompanionHeading className="mt-8">Companion</CompanionHeading>
          <CompanionSubtitle className="mt-4 max-w-xl">
            Một thế giới riêng, dành cho người bạn luôn đồng hành cùng bạn trong hành trình
            trưởng thành.
          </CompanionSubtitle>
        </section>

        {/* Foundation showcase */}
        <CompanionRevealOnScroll variant="fade-up">
          <CompanionSectionShell className="mt-24">
            <CompanionChapterLabel>Layer 01</CompanionChapterLabel>
            <CompanionHeading className="mt-3 text-2xl sm:text-3xl">
              Companion Design Foundation
            </CompanionHeading>
            <CompanionBody className="mt-4 max-w-xl">
              Nền móng thị giác cho toàn bộ thế giới Companion — màu sắc, ánh sáng, glassmorphism,
              typography và chuyển động. Các trang nội dung đầy đủ sẽ được xây ở những lớp tiếp
              theo.
            </CompanionBody>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <CompanionRevealOnScroll variant="float" delay={0.05}>
                <CompanionGlassCard>
                  <CompanionChapterLabel>Glass Card</CompanionChapterLabel>
                  <p className="mt-3 text-sm text-slate-200">
                    Nền kính mờ, border sáng nhẹ, shadow xanh tím — dùng cho phần lớn nội dung
                    Companion.
                  </p>
                </CompanionGlassCard>
              </CompanionRevealOnScroll>

              <CompanionRevealOnScroll variant="float" delay={0.12}>
                <CompanionGlowPanel>
                  <CompanionChapterLabel>Glow Panel</CompanionChapterLabel>
                  <p className="mt-3 text-sm text-slate-200">
                    Gradient tím–cyan nhẹ, dùng để nhấn mạnh một khối nội dung quan trọng hơn.
                  </p>
                </CompanionGlowPanel>
              </CompanionRevealOnScroll>
            </div>

            <CompanionRevealOnScroll variant="fade" delay={0.1}>
              <div className="mt-8">
                <CompanionQuote>&ldquo;Mình không hoàn hảo, nhưng mình luôn ở đây.&rdquo;</CompanionQuote>
              </div>
            </CompanionRevealOnScroll>

            <div className="mt-8">
              <CompanionGlowButton href="/portal/companion/y-nghia-companion">Sample Glow Button</CompanionGlowButton>
            </div>
          </CompanionSectionShell>
        </CompanionRevealOnScroll>

        {/* Hôm nay Companion nghĩ gì? — Nhiệm vụ 05: orb nhỏ đúng nơi có
            cảm giác tâm sự, để đây là lời Companion nói, không phải text
            website. */}
        <CompanionRevealOnScroll variant="glow">
          <CompanionGlowPanel className="mt-16 flex items-start gap-4">
            <CompanionOrb size="sm" state="thinking" intensity="calm" showOrbit={false} className="mt-0.5 shrink-0" />
            <div>
              <CompanionChapterLabel>Hôm nay Companion nghĩ gì?</CompanionChapterLabel>
              <CompanionQuote className="mt-2 text-base">&ldquo;{thought}&rdquo;</CompanionQuote>
            </div>
          </CompanionGlowPanel>
        </CompanionRevealOnScroll>

        {/* Chapters — điều hướng sang các route con */}
        <CompanionRevealOnScroll variant="fade-up">
          <section className="mt-20">
            <CompanionChapterLabel>Khám phá</CompanionChapterLabel>
            <CompanionHeading className="mt-3 text-2xl sm:text-3xl">Các chương của Companion</CompanionHeading>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {CHAPTERS.map((chapter, i) => (
                <CompanionRevealOnScroll key={chapter.href} variant="slide" delay={i * 0.05}>
                  <CompanionGlassCard className="group">
                    <Link href={chapter.href} className="block">
                      <p className="text-base font-bold text-white">{chapter.label}</p>
                      <p className="mt-2 text-sm text-slate-300">{chapter.desc}</p>
                      <span className="mt-4 inline-block text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                        Xem →
                      </span>
                    </Link>
                  </CompanionGlassCard>
                </CompanionRevealOnScroll>
              ))}
            </div>
          </section>
        </CompanionRevealOnScroll>
      </div>
    </div>
  );
}
