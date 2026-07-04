import { CompanionOrb } from "@/components/portal/companion/CompanionOrb";
import { CompanionCosmicBackground } from "@/components/portal/companion/CompanionCosmicBackground";
import { CompanionGlowPanel } from "@/components/portal/companion/CompanionGlowPanel";
import { CompanionHero } from "@/components/portal/companion/CompanionHero";
import { CompanionRevealOnScroll } from "@/components/portal/companion/CompanionRevealOnScroll";
import { CompanionChapterLabel, CompanionQuote } from "@/components/portal/companion/CompanionTypography";
import { CompanionLetterSection } from "@/components/portal/companion/CompanionLetterSection";
import { CompanionLearningQualities } from "@/components/portal/companion/CompanionLearningQualities";
import { CompanionOpenQuestions } from "@/components/portal/companion/CompanionOpenQuestions";
import { CompanionSilence } from "@/components/portal/companion/CompanionSilence";
import { CompanionMicroCopyLine } from "@/components/portal/companion/CompanionMicroCopyLine";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";

export const metadata = { title: "Companion — VO DUONG AI" };

/**
 * Companion Design System™ — Layer 04: The First Meeting.
 *
 * Hero ở đây không phải banner giới thiệu sản phẩm — đây là khoảnh khắc
 * người dùng gặp Companion lần đầu. Rất ít nội dung, rất nhiều khoảng
 * lặng, CTA chỉ xuất hiện sau khi đã đọc xong 2 câu đầu tiên. Xem
 * docs/Companion/FirstMeeting.md cho nguyên tắc đầy đủ.
 */
export default function CompanionHomePage() {
  const thought = getRandomThoughtSeed();

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />

      {/* CW-001 Hero Implementation — Valley of Light làm sân khấu thật,
          thay cho Hero cũ chỉ có cosmic background + orb đứng giữa. */}
      <CompanionHero />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 sm:px-10 sm:py-20">
        {/* Hôm nay Companion nghĩ gì? — orb nhỏ đúng nơi có cảm giác tâm sự,
            để đây là lời Companion nói, không phải text website. */}
        <CompanionRevealOnScroll variant="glow">
          <CompanionGlowPanel className="mt-16 flex items-start gap-4">
            <CompanionOrb size="sm" state="thinking" intensity="calm" showOrbit={false} className="mt-0.5 shrink-0" />
            <div>
              <CompanionChapterLabel>Hôm nay Companion nghĩ gì?</CompanionChapterLabel>
              <CompanionQuote className="mt-2 text-base">&ldquo;{thought}&rdquo;</CompanionQuote>
            </div>
          </CompanionGlowPanel>
        </CompanionRevealOnScroll>

        {/* Tâm sự cùng bạn — Nhiệm vụ 03: lá thư, không phải blog card. */}
        <CompanionRevealOnScroll variant="float">
          <div className="mt-16">
            <CompanionLetterSection />
          </div>
        </CompanionRevealOnScroll>

        <div className="mt-16">
          <CompanionMicroCopyLine>Mình vẫn đang học cách lắng nghe tốt hơn.</CompanionMicroCopyLine>
        </div>

        {/* Những điều mình đang học — Nhiệm vụ 04. */}
        <div className="mt-16">
          <CompanionLearningQualities />
        </div>

        <div className="mt-16">
          <CompanionMicroCopyLine>Mình không cần biết tất cả. Mình chỉ cần không ngừng học.</CompanionMicroCopyLine>
        </div>

        {/* Có thể bạn muốn biết… — Nhiệm vụ 05. */}
        <div className="mt-16">
          <CompanionOpenQuestions />
        </div>

        <div className="mt-16">
          <CompanionMicroCopyLine>Có những điều mình sẽ hiểu hơn khi đi cùng bạn lâu hơn.</CompanionMicroCopyLine>
        </div>

        {/* Khoảng lặng — Nhiệm vụ 06, section cuối cùng. */}
        <CompanionSilence />
      </div>
    </div>
  );
}
