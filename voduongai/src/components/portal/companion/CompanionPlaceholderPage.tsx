import { CompanionCosmicBackground } from "./CompanionCosmicBackground";
import { CompanionGlassCard } from "./CompanionGlassCard";
import { CompanionGlowButton } from "./CompanionGlowButton";
import { CompanionOrb } from "./CompanionOrb";
import { CompanionChapterLabel, CompanionHeading, CompanionQuote } from "./CompanionTypography";

/**
 * Companion Design System™ — placeholder đẹp cho các route con chưa xây nội
 * dung đầy đủ. Không phải trang trắng, không phải "coming soon" khô khan —
 * luôn có tiêu đề, lời nhắn của Companion, một glass card, và nút quay lại.
 *
 * `showOrb` (Layer 02, Nhiệm vụ 05) — chỉ bật ở đúng những trang có cảm
 * giác "tâm sự" thật sự (ví dụ /tam-su), không dùng tràn lan mọi placeholder.
 */
export function CompanionPlaceholderPage({
  chapterLabel,
  title,
  companionMessage,
  showOrb = false,
}: {
  chapterLabel: string;
  title: string;
  companionMessage: string;
  showOrb?: boolean;
}) {
  return (
    <div className="relative -mx-4 -my-6 min-h-[80vh] md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
        <CompanionChapterLabel>{chapterLabel}</CompanionChapterLabel>
        <CompanionHeading className="mt-4">{title}</CompanionHeading>

        <CompanionGlassCard className="mt-10 w-full text-left">
          {showOrb && (
            <div className="mb-4 flex items-center gap-3">
              <CompanionOrb size="sm" state="listening" intensity="calm" showOrbit={false} />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-300">
                Companion đang tâm sự cùng bạn
              </span>
            </div>
          )}
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
