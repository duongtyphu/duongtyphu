import Image from "next/image";
import { Crown, Orbit } from "lucide-react";
import { LandingPreviewSolarSystem } from "@/components/landing-preview/LandingPreviewSolarSystem";

/**
 * "Hệ sinh thái của tôi" section — content ported from the new landing
 * preview (LandingPreviewNetworkFounder): the solar-system ecosystem
 * diagram + the founder card, replacing the old page's solar diagram and
 * the entire former FounderStory section (image, "Tại sao tôi xây...",
 * "Đại diện Quốc gia..."). Section background follows the same
 * theme-aware pattern as the rest of the page so the background stays one
 * continuous, unbroken sweep.
 */
export function Ecosystem({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <section className={`overflow-hidden py-12 md:py-16 ${isLight ? "bg-[#F6F7F9] text-[#0F172A]" : "text-white"}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5B21D6]">
            <Orbit className="h-3.5 w-3.5" strokeWidth={2.25} />
            Hệ sinh thái của tôi
          </span>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <LandingPreviewSolarSystem />
          </div>

          <div className="mx-auto flex w-full flex-col overflow-hidden rounded-2xl border border-[#ECEDF5] bg-white shadow-[0_4px_24px_rgba(15,23,60,.06)] md:w-[95%]">
            <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden">
              <Image
                src="/founder.png"
                alt="Võ Đương — Nhà sáng lập VO DUONG AI"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-5 md:p-6">
              <p className="text-[.98rem] font-extrabold leading-[1.5] md:text-[1.02rem]">
                <span className="text-[#0B0F2E]">
                  &ldquo;AI không thay thế bạn, nhưng những người biết sử dụng AI sẽ thay thế bạn&rdquo;
                </span>{" "}
                <span className="text-[#5B21D6]">— Võ Đương</span>
              </p>
              <p className="mt-2.5 text-[.83rem] leading-[1.6] text-[#5B6B85]">
                Tôi là một nhà đầu tư vào các dự án công nghệ, tôi tin rằng AI sẽ là một trong những kỹ năng sống còn trong thế kỷ 21. Tôi xây dựng VO DUONG AI như một hệ sinh thái cá nhân nơi tập hợp những kiến thức, tài liệu, công cụ và bao gồm những kinh nghiệm mà chính tôi đã từng trải nghiệm mỗi ngày trong công việc và sự nghiệp.
              </p>
              <p className="mt-2 text-[.83rem] leading-[1.6] text-[#5B6B85]">
                Mục tiêu của tôi rất đơn giản: giúp bạn tiếp cận với AI nhanh hơn, dễ hiểu hơn, xây dựng hệ thống online bền vững và từng bước tạo ra tài sản số cho tương lai.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[.83rem] font-bold text-[#5B21D6]">
                <Crown className="h-4 w-4 shrink-0 text-[#5B21D6]" strokeWidth={2.5} />
                Nhà sáng lập VÕ ĐƯƠNG AI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
