import Link from "next/link";
import { Button } from "@/components/portal/ui/Button";
import { LivingCore } from "@/components/LivingCore";
import type { WelcomeState } from "@/lib/portal/warmth-engine";
import { getLifeMomentLine } from "@/lib/portal/life-moments";
import type { HumanFlowState } from "@/lib/portal/human-flow";

/**
 * Portal 4.0 Home Emotional Experience — Hero Reconstruction. Trước đây
 * khối này mở đầu bằng nhãn "Gem Home" (đọc như tên sản phẩm SaaS) rồi
 * mới tới lời chào — giờ Companion (Living Core, cùng biểu tượng dùng ở
 * /portal/companion) hiện diện trước, lời chào ngắn hơn, và không còn
 * nhãn thương hiệu chen giữa Companion và người dùng. Vẫn đúng 1 hành
 * động chính, không có nút thứ 2 cạnh tranh — luật này không đổi.
 */
export function CompanionPresenceBand({
  name,
  welcomeMessage,
  reflectionPrompt,
  state,
  flow,
}: {
  name?: string;
  welcomeMessage: string;
  reflectionPrompt: string;
  state: WelcomeState;
  flow: HumanFlowState;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-7 text-white shadow-token-lg sm:p-10"
      style={{ backgroundImage: "linear-gradient(135deg, #1E293B 0%, #2563EB 50%, #6D28D9 100%)" }}
    >
      {/* AI grid rất nhẹ — gợi "AI Operating System", không phải hoạ tiết trang trí gaming */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex items-start gap-4 sm:gap-5">
        <div className="shrink-0 pt-1">
          <LivingCore size={52} state="idle" />
        </div>
        <div className="min-w-0">
          {name && state !== "first" && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Chào {name}</p>
          )}
          <h1 className="mt-1 max-w-2xl whitespace-pre-line text-xl font-extrabold leading-tight sm:text-3xl">
            {welcomeMessage}
          </h1>
          {state === "comeback" && (
            <p className="mt-2 max-w-xl text-sm text-white/85">{getLifeMomentLine("quietReturn")}</p>
          )}
        </div>
      </div>

      {/* Hôm nay nên làm gì — lý do trước hành động, đúng 1 nút */}
      <div className="relative mt-6 max-w-xl rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <p className="text-sm font-semibold text-white">{flow.nextBestAction}</p>
        <p className="mt-1 text-sm leading-relaxed text-white/80">{flow.reason}</p>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-4">
        <Button href={flow.recommendedRoute} variant="inverse">
          {flow.recommendedCTA} →
        </Button>
        <Link href="/portal/story" className="text-sm italic text-white/70 hover:text-white">
          {reflectionPrompt}
        </Link>
      </div>
    </div>
  );
}
