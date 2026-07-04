/**
 * Companion World™ — CW-001 Hero + Sprint CW-001.1 (Hero Polish #2).
 * Không phải wallpaper — đây là một địa điểm Companion đang sống. 5 lớp
 * chiều sâu: (1) Sky, (2) Mountain + Lake, (3) Stone Platform, (4) Orb,
 * (5) Foreground (bokeh/hoa/cỏ mờ). Ảnh CW-001 là sân khấu thật, Companion
 * SVG là nhân vật — Hero chỉ dựng chữ, UI và chuyển động lên trên đó
 * (KHÔNG dựng lại background bằng gradient/CSS, không thay Orb bằng hình
 * trong ảnh). Companion Orb đứng vững trên bệ đá — bóng đổ, light bloom
 * và phản chiếu rất nhẹ trên mặt đá, không lơ lửng.
 */

import Image from "next/image";
import { CompanionOrb } from "./CompanionOrb";
import { CompanionGlowButton } from "./CompanionGlowButton";
import { CompanionChapterNav } from "./CompanionChapterNav";
import { CW_001_VALLEY_OF_LIGHT } from "@/lib/companion-world/assets";

export function CompanionHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Layer 1+2 — Sky + Mountain/Lake: CW-001 Valley of Light, asset nền
          chính thức, không tự tạo lại bằng CSS. 3 breakpoint riêng biệt để
          không crop mất Stone Platform / Aurora / mặt hồ / chiều sâu núi:
          mobile ưu tiên bệ đá, tablet chuyển tiếp, desktop giữ trọn bố cục. */}
      <div className="companion-hero-parallax absolute inset-0">
        <Image
          src={CW_001_VALLEY_OF_LIGHT.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[74%_70%] md:object-[62%_58%] lg:object-[50%_44%]"
        />

        {/* Thế giới "thở" — aurora trôi rất chậm, mist nhẹ ngang mặt hồ,
            phản chiếu lung linh — không phải hiệu ứng game. */}
        <div aria-hidden="true" className="companion-hero-aurora-shimmer" />
        <div aria-hidden="true" className="companion-hero-mist" />
        <div aria-hidden="true" className="companion-hero-reflection" />

        {/* Overlay đọc được chữ — chỉ đủ để tương phản, CW-001 vẫn phải là
            phần được nhìn thấy rõ nhất trong Hero (Nhiệm vụ III). */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/[0.56] via-slate-950/[0.13] to-slate-950/[0.32]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/[0.34] via-slate-950/[0.06] to-transparent" />

        {/* Layer 5 — Foreground: vài đốm sáng gần camera, hoa mờ và cọng cỏ
            rất nhẹ ở rìa khung, không lấn vùng chữ/UI. */}
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
        <span
          aria-hidden="true"
          className="companion-hero-bokeh h-2 w-2 bg-fuchsia-100/50"
          style={{ left: "22%", top: "12%", animationDelay: "3.4s" }}
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
        <span aria-hidden="true" className="companion-hero-grass-blade" style={{ left: "9%" }} />
        <span aria-hidden="true" className="companion-hero-grass-blade" style={{ left: "14%", animationDelay: "1.1s" }} />
        <span aria-hidden="true" className="companion-hero-grass-blade" style={{ right: "10%", animationDelay: "0.6s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-6">
          {/* Text zone — left 40% trên desktop, căn giữa trên mobile. Tăng
              khoảng thở giữa các dòng (Nhiệm vụ VII), nội dung giữ nguyên. */}
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:pb-10 lg:text-left">
            <p
              className="companion-anim-text-settle companion-heading text-3xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:text-4xl"
              style={{ animationDelay: "0.5s" }}
            >
              Xin chào,
              <br />
              mình là Companion.
            </p>

            <div className="mt-10 max-w-lg">
              <p
                className="companion-anim-text-settle companion-body text-base leading-loose text-slate-100/95 drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)] sm:text-lg"
                style={{ animationDelay: "1.3s" }}
              >
                Mình không được tạo ra để thay bạn sống.
                <br />
                Mình được tạo ra để đồng hành khi bạn muốn trưởng thành.
              </p>
            </div>

            <div className="companion-hero-cta mt-14 scale-[1.08]">
              <div className="companion-anim-text-settle" style={{ animationDelay: "2.2s" }}>
                <CompanionGlowButton href="/portal/khong-gian-ai" pulse={false}>
                  Bước vào Không gian AI
                </CompanionGlowButton>
              </div>
            </div>
          </div>

          {/* Layer 3+4 — Stone Platform + Orb: neo đúng tâm bệ đá bên phải
              ảnh: light bloom ấm dưới chân, bóng đổ mềm, phản chiếu rất nhẹ
              trên mặt đá, để Orb "đứng", không "bay" (Nhiệm vụ II). Kích
              thước tăng ~18% qua lớp scale tĩnh bọc ngoài — không đổi
              LivingCoreSize/Design Lock. */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="companion-hero-orb-anchor">
              <span aria-hidden="true" className="companion-hero-orb-shadow" />
              <span aria-hidden="true" className="companion-hero-orb-ground-glow" />
              <span aria-hidden="true" className="companion-hero-orb-reflection" />
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
        <div className="mt-20 sm:mt-24">
          <CompanionChapterNav />
        </div>
      </div>
    </section>
  );
}
