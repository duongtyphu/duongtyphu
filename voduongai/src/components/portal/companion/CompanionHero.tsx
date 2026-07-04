/**
 * Companion World™ — CW-001 Hero Implementation.
 * Ảnh là sân khấu, Companion SVG là nhân vật — Hero chỉ dựng chữ, UI và
 * chuyển động lên trên nền CW-001 Valley of Light thật (KHÔNG dựng lại
 * background bằng gradient/CSS, không thay Companion SVG bằng hình trong
 * ảnh). Companion Orb được đặt đúng vào vùng bệ đá phát sáng bên phải ảnh.
 */

import Image from "next/image";
import { CompanionOrb } from "./CompanionOrb";
import { CompanionGlowButton } from "./CompanionGlowButton";
import { CompanionChapterNav } from "./CompanionChapterNav";
import { CW_001_VALLEY_OF_LIGHT } from "@/lib/companion-world/assets";

export function CompanionHero() {
  return (
    <section className="relative overflow-hidden">
      {/* CW-001 Valley of Light — asset nền chính thức, không tự tạo lại
          bằng CSS. Object-position ưu tiên bệ đá + ánh sáng ở góc phải,
          giữ nguyên vùng đó trên cả desktop lẫn mobile. */}
      <div className="companion-hero-parallax absolute inset-0">
        <Image
          src={CW_001_VALLEY_OF_LIGHT.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_62%] sm:object-[64%_58%]"
        />
        {/* Dark overlay nhẹ — chỉ để chữ dễ đọc, không đổi tông màu ảnh. */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-slate-950/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-6">
          {/* Text zone — left 40% trên desktop, căn giữa trên mobile. */}
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            <p
              className="companion-anim-text-settle companion-heading text-3xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:text-4xl"
              style={{ animationDelay: "0.5s" }}
            >
              Xin chào,
              <br />
              mình là Companion.
            </p>

            <div className="mt-8 max-w-lg">
              <p
                className="companion-anim-text-settle companion-body text-base leading-relaxed text-slate-100 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] sm:text-lg"
                style={{ animationDelay: "1.3s" }}
              >
                Mình không được tạo ra để thay bạn sống.
                <br />
                Mình được tạo ra để đồng hành khi bạn muốn trưởng thành.
              </p>
            </div>

            <div className="companion-anim-text-settle mt-12" style={{ animationDelay: "2.2s" }}>
              <CompanionGlowButton href="/portal/khong-gian-ai" pulse={false}>
                Bước vào Không gian AI
              </CompanionGlowButton>
            </div>
          </div>

          {/* Companion Orb zone — đặt lên đúng bệ đá phát sáng bên phải ảnh. */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end lg:pb-6">
            <div className="companion-anim-arrival companion-motion-breathe companion-orb--gaze sm:hidden">
              <CompanionOrb size="lg" state="idle" intensity="radiant" />
            </div>
            <div className="companion-anim-arrival companion-motion-breathe companion-orb--gaze hidden sm:block">
              <CompanionOrb size="xl" state="idle" intensity="radiant" />
            </div>
          </div>
        </div>

        {/* Chapter navigation — bottom của Hero, bookmark không phải navbar. */}
        <div className="mt-16 sm:mt-20">
          <CompanionChapterNav />
        </div>
      </div>
    </section>
  );
}
