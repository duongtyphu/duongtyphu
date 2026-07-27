import Image from "next/image";
import { LandingPreviewSolarSystem } from "@/components/landing-preview/LandingPreviewSolarSystem";

export function LandingPreviewNetworkFounder() {
  return (
    <section id="instructors" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid items-stretch gap-10 md:grid-cols-2">
          <div className="flex items-center justify-center rounded-2xl border border-[#ECEDF5] bg-white p-8 shadow-[0_4px_24px_rgba(15,23,60,.06)]">
            <LandingPreviewSolarSystem />
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-[#ECEDF5] bg-white shadow-[0_4px_24px_rgba(15,23,60,.06)]">
            <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden">
              <Image
                src="/founder.png"
                alt="Võ Đương — Nhà sáng lập VO DUONG AI"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-6 md:p-7">
              <h3 className="text-[1.05rem] font-extrabold leading-[1.4] text-[#0B0F2E]">
                &ldquo;AI không thay thế bạn, nhưng những người biết sử dụng AI sẽ thay thế bạn&rdquo;
              </h3>
              <div className="mt-2 text-[.9rem] font-bold text-[#5b21c9]">— Võ Đương</div>
              <p className="mt-3 text-[.85rem] leading-[1.65] text-[#5B6B85]">
                Tôi là một nhà đầu tư vào các dự án công nghệ, tôi tin rằng AI sẽ là một trong những kỹ năng sống còn trong thế kỷ 21. Tôi xây dựng VO DUONG AI như một hệ sinh thái cá nhân nơi tập hợp những kiến thức, tài liệu, công cụ và bao gồm những kinh nghiệm mà chính tôi đã từng trải nghiệm mỗi ngày trong công việc và sự nghiệp.
              </p>
              <p className="mt-2.5 text-[.85rem] leading-[1.65] text-[#5B6B85]">
                Mục tiêu của tôi rất đơn giản: giúp bạn tiếp cận với AI nhanh hơn, dễ hiểu hơn, xây dựng hệ thống online bền vững và từng bước tạo ra tài sản số cho tương lai.
              </p>
              <div className="mt-3 text-[.85rem] font-bold text-[#0B0F2E]">— Nhà sáng lập VÕ ĐƯƠNG AI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
