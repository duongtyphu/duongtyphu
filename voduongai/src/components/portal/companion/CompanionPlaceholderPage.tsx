import { CompanionCosmicBackground } from "./CompanionCosmicBackground";
import { CompanionGlassCard } from "./CompanionGlassCard";
import { CompanionGlowButton } from "./CompanionGlowButton";
import { CompanionChapterLabel, CompanionHeading, CompanionQuote } from "./CompanionTypography";

/**
 * Companion Design System™ — placeholder đẹp cho các route con chưa xây nội
 * dung đầy đủ. Không phải trang trắng, không phải "coming soon" khô khan —
 * luôn có tiêu đề, lời nhắn của Companion, một glass card, và nút quay lại.
 */
export function CompanionPlaceholderPage({
  chapterLabel,
  title,
  companionMessage,
}: {
  chapterLabel: string;
  title: string;
  companionMessage: string;
}) {
  return (
    <div className="relative -mx-4 -my-6 min-h-[80vh] md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
        <CompanionChapterLabel>{chapterLabel}</CompanionChapterLabel>
        <CompanionHeading className="mt-4">{title}</CompanionHeading>

        <CompanionGlassCard className="mt-10 w-full text-left">
          <CompanionQuote>&ldquo;{companionMessage}&rdquo;</CompanionQuote>
          <p className="mt-4 text-sm text-slate-400">
            Mình vẫn đang chuẩn bị phần này thật kỹ, để khi cho bạn xem, nó thật sự đáng để đọc.
          </p>
        </CompanionGlassCard>

        <CompanionGlowButton href="/portal/companion" className="mt-10">
          ← Quay lại Companion Home
        </CompanionGlowButton>
      </div>
    </div>
  );
}
