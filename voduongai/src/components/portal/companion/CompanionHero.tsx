/**
 * Companion World™ — CW-001 Hero Implementation + Hero Polish Sprint.
 * Ảnh là sân khấu, Companion SVG là nhân vật — Hero chỉ dựng chữ, UI và
 * chuyển động lên trên nền CW-001 Valley of Light thật (KHÔNG dựng lại
 * background bằng gradient/CSS, không thay Companion SVG bằng hình trong
 * ảnh). Companion Orb đứng vững trên bệ đá phát sáng bên phải ảnh — có
 * bóng đổ + quầng sáng dưới chân, không lơ lửng. Thế giới "thở" qua vài
 * lớp motion rất nhẹ (aurora/mist/reflection/foreground bokeh) thay vì
 * đứng yên như một tấm wallpaper.
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
          bằng CSS. Desktop giữ trọn bố cục (núi/hồ/aurora); mobile ưu tiên
          giữ bệ đá — theo đúng breakpoint mà layout bên dưới đổi cột. */}
      <div className="companion-hero-parallax absolute inset-0">
        <Image
          src={CW_001_VALLEY_OF_LIGHT.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_68%] lg:object-[50%_46%]"
        />

        {/* Thế giới "thở" — aurora trôi rất chậm, mist nhẹ ngang mặt hồ,
            phản chiếu lung linh — không phải hiệu ứng game. */}
        <div aria-hidden="true" className="companion-hero-aurora-shimmer" />
        <div aria-hidden="true" className="companion-hero-mist" />
        <div aria-hidden="true" className="companion-hero-reflection" />

        {/* Overlay đọc được chữ — giảm nhẹ so với bản đầu để CW-001 hiện rõ
            hơn (aurora/núi/hồ/hoa), vẫn đủ tương phản cho text bên trên. */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/[0.68] via-slate-950/[0.18] to-slate-950/[0.42]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/[0.42] via-slate-950/[0.08] to-transparent" />

        {/* Foreground depth layer — vài đốm sáng gần camera + hoa mờ góc
            khung, chỉ ở rìa, không lấn vùng chữ (Nhiệm vụ 03). */}
        <span
          aria-hidden="true"
          className="companion-hero-bokeh h-3 w-3 bg-violet-200/70"
          style={{ left: "6%", top: "22%", animationDelay: "0s" }}
        />
        <span
          aria-hidden="true"
          className="companion-hero-bokeh h-2 w-2 bg-cyan-100/60"
          style={{ left: "12%", top: "62%", animationDelay: "1.4s" }}
        />
        <span
          aria-hidden="true"
          className="companion-hero-bokeh h-4 w-4 bg-amber-100/50"
          style={{ right: "8%", top: "18%", animationDelay: "2.6s" }}
        />
        <div
          aria-hidden="true"
          className="companion-hero-foliage-blur bg-violet-950/70"
          style={{ left: "-4%", width: "34%" }}
        />
        <div
          aria-hidden="true"
          className="companion-hero-foliage-blur bg-slate-950/60"
          style={{ right: "-4%", width: "28%" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-6">
          {/* Text zone — left 40% trên desktop, căn giữa trên mobile. */}
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:pb-10 lg:text-left">
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

          {/* Companion Orb zone — neo đúng vào bệ đá bên phải ảnh: quầng
              sáng ấm + bóng đổ mềm dưới chân, để Orb "đứng", không "bay"
              (Nhiệm vụ 01). Kích thước tăng ~18% qua lớp scale tĩnh bọc
              ngoài — không đổi LivingCoreSize/Design Lock. */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="companion-hero-orb-anchor">
              <span aria-hidden="true" className="companion-hero-orb-shadow" />
              <span aria-hidden="true" className="companion-hero-orb-ground-glow" />
              <div className="scale-[1.18]">
                <div className="companion-anim-arrival companion-motion-breathe companion-orb--gaze sm:hidden">
                  <CompanionOrb size="lg" state="idle" intensity="radiant" />
                </div>
                <div className="companion-anim-arrival companion-motion-breathe companion-orb--gaze hidden sm:block">
                  <CompanionOrb size="xl" state="idle" intensity="radiant" />
                </div>
              </div>
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
