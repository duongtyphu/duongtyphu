import { CompanionOrb } from "@/components/portal/companion/CompanionOrb";
import { CompanionCosmicBackground } from "@/components/portal/companion/CompanionCosmicBackground";
import { CompanionGlowPanel } from "@/components/portal/companion/CompanionGlowPanel";
import { CompanionGlowButton } from "@/components/portal/companion/CompanionGlowButton";
import { CompanionChapterNav } from "@/components/portal/companion/CompanionChapterNav";
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

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 sm:px-10 sm:py-36">
        {/* First Meeting — Nhiệm vụ 01-05: Orb trước, silence, rồi mới lời
            đầu tiên, CTA xuất hiện sau cùng. Không nhồi icon/feature/stat. */}
        <section className="flex flex-col items-center text-center">
          {/* Arrival — Companion không "nhảy vào", chỉ mờ dần hiện ra, như
              đã ở đó từ trước, đang chờ (Nhiệm vụ 02). Sau đó chuyển sang
              Presence (breathing vô hạn). "Gaze" — quầng sáng rất nhẹ gợi ý
              Companion đang hướng về phía người dùng (Nhiệm vụ 07). */}
          <div className="companion-anim-arrival companion-motion-breathe companion-orb--gaze sm:hidden">
            <CompanionOrb size="lg" state="idle" intensity="radiant" />
          </div>
          <div className="companion-anim-arrival companion-motion-breathe companion-orb--gaze hidden sm:block">
            <CompanionOrb size="xl" state="idle" intensity="radiant" />
          </div>

          {/* Silence — khoảng lặng lớn trước khi lời đầu tiên xuất hiện. */}
          <div className="mt-16 sm:mt-20">
            <p
              className="companion-anim-text-settle companion-heading text-3xl sm:text-4xl"
              style={{ animationDelay: "0.5s" }}
            >
              Xin chào,
              <br />
              mình là Companion.
            </p>
          </div>

          <div className="mt-8 max-w-lg">
            <p
              className="companion-anim-text-settle companion-body text-base leading-relaxed sm:text-lg"
              style={{ animationDelay: "1.3s" }}
            >
              Mình không được tạo ra để thay bạn sống.
              <br />
              Mình được tạo ra để đồng hành khi bạn muốn trưởng thành.
            </p>
          </div>

          {/* CTA — chỉ xuất hiện sau khi người dùng đã có thời gian đọc
              (Nhiệm vụ 05). Glow tĩnh nhẹ, không pulse liên tục. */}
          <div
            className="companion-anim-text-settle mt-16 sm:mt-20"
            style={{ animationDelay: "2.2s" }}
          >
            <CompanionGlowButton href="/portal/khong-gian-ai" pulse={false}>
              Bước vào Không gian AI
            </CompanionGlowButton>
          </div>
        </section>

        {/* Chapter Navigation — Nhiệm vụ 06: bookmark, không phải navbar. */}
        <div className="mt-24 sm:mt-28">
          <CompanionChapterNav />
        </div>

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
