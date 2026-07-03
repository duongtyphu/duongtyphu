import Link from "next/link";
import { LivingCore } from "@/components/LivingCore";
import { CompanionCosmicBackground } from "@/components/portal/companion/CompanionCosmicBackground";
import { CompanionGlassCard } from "@/components/portal/companion/CompanionGlassCard";
import { CompanionGlowPanel } from "@/components/portal/companion/CompanionGlowPanel";
import { CompanionSectionShell } from "@/components/portal/companion/CompanionSectionShell";
import { CompanionGlowButton } from "@/components/portal/companion/CompanionGlowButton";
import {
  CompanionChapterLabel,
  CompanionHeading,
  CompanionSubtitle,
  CompanionQuote,
  CompanionBody,
} from "@/components/portal/companion/CompanionTypography";

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
  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
        {/* Hero */}
        <section className="flex flex-col items-center text-center">
          <LivingCore size={128} state="idle" />
          <CompanionHeading className="mt-8">Companion</CompanionHeading>
          <CompanionSubtitle className="mt-4 max-w-xl">
            Một thế giới riêng, dành cho người bạn luôn đồng hành cùng bạn trong hành trình
            trưởng thành.
          </CompanionSubtitle>
        </section>

        {/* Foundation showcase */}
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
            <CompanionGlassCard>
              <CompanionChapterLabel>Glass Card</CompanionChapterLabel>
              <p className="mt-3 text-sm text-slate-200">
                Nền kính mờ, border sáng nhẹ, shadow xanh tím — dùng cho phần lớn nội dung
                Companion.
              </p>
            </CompanionGlassCard>

            <CompanionGlowPanel>
              <CompanionChapterLabel>Glow Panel</CompanionChapterLabel>
              <p className="mt-3 text-sm text-slate-200">
                Gradient tím–cyan nhẹ, dùng để nhấn mạnh một khối nội dung quan trọng hơn.
              </p>
            </CompanionGlowPanel>
          </div>

          <div className="mt-8">
            <CompanionQuote>&ldquo;Mình không hoàn hảo, nhưng mình luôn ở đây.&rdquo;</CompanionQuote>
          </div>

          <div className="mt-8">
            <CompanionGlowButton href="/portal/companion/y-nghia-companion">Sample Glow Button</CompanionGlowButton>
          </div>
        </CompanionSectionShell>

        {/* Chapters — điều hướng sang các route con */}
        <section className="mt-20">
          <CompanionChapterLabel>Khám phá</CompanionChapterLabel>
          <CompanionHeading className="mt-3 text-2xl sm:text-3xl">Các chương của Companion</CompanionHeading>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CHAPTERS.map((chapter) => (
              <CompanionGlassCard key={chapter.href} className="group transition hover:-translate-y-0.5">
                <Link href={chapter.href} className="block">
                  <p className="text-base font-bold text-white">{chapter.label}</p>
                  <p className="mt-2 text-sm text-slate-300">{chapter.desc}</p>
                  <span className="mt-4 inline-block text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                    Xem →
                  </span>
                </Link>
              </CompanionGlassCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
