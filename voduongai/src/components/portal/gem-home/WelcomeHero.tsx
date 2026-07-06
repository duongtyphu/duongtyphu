import Link from "next/link";
import { Button } from "@/components/portal/ui/Button";
import type { WelcomeState } from "@/lib/portal/warmth-engine";
import { getLifeMomentLine } from "@/lib/portal/life-moments";

/**
 * Answers: "Người dùng có cảm thấy đây là một nơi để trở về, không chỉ là một dashboard?"
 *
 * Product Transformation Wave 1: chuyển từ GemCard trắng nhỏ sang một hero
 * band gradient toàn chiều rộng (cùng ngôn ngữ với PillarHero ở CKOS/Academy/
 * Projects/Premium) — đây là điểm chạm đầu tiên của Dashboard, cần tạo cảm
 * giác "AI Operating System" ngay khi mở trang, không phải một card nhỏ lẫn
 * trong danh sách. Toàn bộ nội dung thật (tên, welcomeMessage, reflectionPrompt,
 * state) giữ nguyên logic — chỉ đổi khung hình.
 */
export function WelcomeHero({
  name,
  welcomeMessage,
  reflectionPrompt,
  state,
}: {
  name?: string;
  welcomeMessage: string;
  reflectionPrompt: string;
  state: WelcomeState;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-7 text-white shadow-token-lg sm:p-10"
      style={{ backgroundImage: "linear-gradient(135deg, #2563EB 0%, #5B8CFF 45%, #7C3AED 100%)" }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-white/70">
        Gem Home{name && state !== "first" ? ` · ${name}` : ""}
      </p>
      <h1 className="relative mt-3 max-w-2xl whitespace-pre-line text-2xl font-extrabold leading-tight sm:text-4xl">
        {welcomeMessage}
      </h1>
      <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
        Đây không phải nơi chứa nội dung — đây là nơi bạn được mài giũa: nhìn thấy, hiểu, thực hành,
        kiến tạo, chia sẻ, phản chiếu, tiến hoá và để lại di sản.
      </p>
      <Link href="/portal/story" className="relative mt-3 block max-w-xl text-sm italic text-white/70 hover:text-white">
        {reflectionPrompt}
      </Link>
      {state === "comeback" && (
        <p className="relative mt-3 max-w-xl text-sm text-white/85">{getLifeMomentLine("quietReturn")}</p>
      )}
      <div className="relative mt-6 flex flex-wrap gap-3">
        <Button href="/portal/hanhtrinhcuatoi" variant="inverse">
          Tiếp tục hành trình →
        </Button>
        <Button href="/portal/roadmap" variant="inverse-ghost">
          Xem lộ trình
        </Button>
        <Button href="/portal/story" variant="inverse-ghost">
          My Story
        </Button>
      </div>
    </div>
  );
}
