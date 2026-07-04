import { CompanionOrb } from "@/components/portal/companion/CompanionOrb";
import { CompanionCosmicBackground } from "@/components/portal/companion/CompanionCosmicBackground";
import { CompanionGlowPanel } from "@/components/portal/companion/CompanionGlowPanel";
import { CompanionHero } from "@/components/portal/companion/CompanionHero";
import { CompanionRevealOnScroll } from "@/components/portal/companion/CompanionRevealOnScroll";
import { CompanionChapterLabel, CompanionQuote } from "@/components/portal/companion/CompanionTypography";
import { CompanionTalkSection } from "@/components/portal/companion/CompanionTalkSection";
import { CompanionLifeTimelinePreview } from "@/components/portal/companion/CompanionLifeTimelinePreview";
import { CompanionBookNotesPreview } from "@/components/portal/companion/CompanionBookNotesPreview";
import { CompanionFinalCTA } from "@/components/portal/companion/CompanionFinalCTA";
import { CompanionLearningQualities } from "@/components/portal/companion/CompanionLearningQualities";
import { CompanionSilence } from "@/components/portal/companion/CompanionSilence";
import { CompanionMicroCopyLine } from "@/components/portal/companion/CompanionMicroCopyLine";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";
import { getRandomCompanionGreeting } from "@/data/portal/companion-greetings";

export const metadata = { title: "Companion — VO DUONG AI" };

/**
 * Companion World™ — Companion Home.
 *
 * Bố cục (Layer 07, tham chiếu layout — KHÔNG tham chiếu hình ảnh/màu sắc):
 * ① Hero (text trái, Orb phải, bubble góc trên phải, CTA)
 * ② Chapter Navigation (trong CompanionHero, ngay dưới Hero)
 * ③ Tâm sự cùng bạn (lá thư trái, câu hỏi nhỏ phải)
 * ④ Cuộc đời Companion (timeline ngang, full width)
 * ⑤ Book Notes (trái) + Hôm nay Companion nghĩ gì? (phải)
 * ⑥ Đồng hành cùng mình (CTA full width, cuối cùng)
 *
 * Những điều mình đang học / Khoảng lặng / micro-copy (Layer 05) không có
 * trong bố cục tham chiếu — vẫn giữ nguyên, xếp tiếp sau block ⑥.
 */
export default function CompanionHomePage() {
  const thought = getRandomThoughtSeed();
  const greeting = getRandomCompanionGreeting();

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />

      {/* ① Hero — CW-001 Valley of Light làm sân khấu thật. */}
      <CompanionHero greeting={greeting} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-20">
        {/* ③ Tâm sự cùng bạn — lá thư trái, câu hỏi nhỏ phải. */}
        <div className="mt-16">
          <CompanionTalkSection />
        </div>

        {/* ④ Cuộc đời Companion — timeline ngang, full width. */}
        <div className="mt-16">
          <CompanionLifeTimelinePreview />
        </div>

        {/* ⑤ Book Notes (trái) + Hôm nay Companion nghĩ gì? (phải). */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <CompanionRevealOnScroll variant="fade-up">
            <CompanionBookNotesPreview />
          </CompanionRevealOnScroll>

          <CompanionRevealOnScroll variant="glow">
            <CompanionGlowPanel className="flex h-full items-start gap-4">
              <CompanionOrb size="sm" state="thinking" intensity="calm" showOrbit={false} className="mt-0.5 shrink-0" />
              <div>
                <CompanionChapterLabel>Hôm nay Companion nghĩ gì?</CompanionChapterLabel>
                <CompanionQuote className="mt-2 text-base">&ldquo;{thought}&rdquo;</CompanionQuote>
              </div>
            </CompanionGlowPanel>
          </CompanionRevealOnScroll>
        </div>

        {/* ⑥ Đồng hành cùng mình — CTA full width, cuối cùng. */}
        <div className="mt-16">
          <CompanionFinalCTA />
        </div>

        {/* Dưới đây: nội dung Layer 05 không có trong bố cục tham chiếu,
            vẫn giữ nguyên — chỉ đổi thứ tự, không xoá nội dung. */}
        <div className="mx-auto mt-16 max-w-2xl">
          <CompanionMicroCopyLine>Mình vẫn đang học cách lắng nghe tốt hơn.</CompanionMicroCopyLine>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <CompanionLearningQualities />
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <CompanionMicroCopyLine>Có những điều mình sẽ hiểu hơn khi đi cùng bạn lâu hơn.</CompanionMicroCopyLine>
        </div>

        <div className="mx-auto max-w-2xl">
          <CompanionSilence />
        </div>
      </div>
    </div>
  );
}
