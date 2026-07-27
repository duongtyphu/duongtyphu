import Image from "next/image";
import { Crown } from "lucide-react";
import { LandingPreviewSolarSystem } from "@/components/landing-preview/LandingPreviewSolarSystem";

export function LandingPreviewNetworkFounder() {
  return (
    <section id="instructors" className="scroll-mt-20 bg-white py-14 md:py-16">
      <style>{`
        .landing-preview-quote-shimmer {
          background-image: linear-gradient(100deg, #5B21D6 0%, #C4B5FD 25%, #7C5CFC 50%, #C4B5FD 75%, #5B21D6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: landing-preview-quote-shimmer-move 5s linear infinite;
        }
        @keyframes landing-preview-quote-shimmer-move {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <LandingPreviewSolarSystem />
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-[#ECEDF5] bg-white shadow-[0_4px_24px_rgba(15,23,60,.06)]">
            <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden">
              <Image
                src="/founder.png"
                alt="Võ Đương — Nhà sáng lập VO DUONG AI"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-5 md:p-6">
              <p className="landing-preview-quote-shimmer text-[.98rem] font-extrabold leading-[1.5] md:text-[1.02rem]">
                &ldquo;AI không thay thế bạn, nhưng những người biết sử dụng AI sẽ thay thế bạn&rdquo; — Võ Đương
              </p>
              <p className="mt-2.5 text-[.83rem] leading-[1.6] text-[#5B6B85]">
                Tôi là một nhà đầu tư vào các dự án công nghệ, tôi tin rằng AI sẽ là một trong những kỹ năng sống còn trong thế kỷ 21. Tôi xây dựng VO DUONG AI như một hệ sinh thái cá nhân nơi tập hợp những kiến thức, tài liệu, công cụ và bao gồm những kinh nghiệm mà chính tôi đã từng trải nghiệm mỗi ngày trong công việc và sự nghiệp.
              </p>
              <p className="mt-2 text-[.83rem] leading-[1.6] text-[#5B6B85]">
                Mục tiêu của tôi rất đơn giản: giúp bạn tiếp cận với AI nhanh hơn, dễ hiểu hơn, xây dựng hệ thống online bền vững và từng bước tạo ra tài sản số cho tương lai.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[.83rem] font-bold text-[#0B0F2E]">
                <Crown className="h-4 w-4 shrink-0 text-[#7C5CFC]" strokeWidth={2.5} />
                Nhà sáng lập VÕ ĐƯƠNG AI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
