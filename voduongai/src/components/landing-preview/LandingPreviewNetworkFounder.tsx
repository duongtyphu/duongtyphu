import Image from "next/image";
import { Crown } from "lucide-react";
import { LandingPreviewSolarSystem } from "@/components/landing-preview/LandingPreviewSolarSystem";

export function LandingPreviewNetworkFounder() {
  return (
    <section id="instructors" className="scroll-mt-20 bg-white py-14 md:py-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <LandingPreviewSolarSystem />
          </div>

          <div className="grid items-stretch overflow-hidden rounded-2xl border border-[#ECEDF5] bg-white shadow-[0_4px_24px_rgba(15,23,60,.06)] md:grid-cols-[1fr_1.3fr]">
            <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[320px]">
              <Image
                src="/founder.png"
                alt="Võ Đương — Nhà sáng lập VO DUONG AI"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-5 md:p-6">
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
