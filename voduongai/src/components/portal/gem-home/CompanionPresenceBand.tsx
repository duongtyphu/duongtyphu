import Link from "next/link";
import { Button } from "@/components/portal/ui/Button";
import type { WelcomeState } from "@/lib/portal/warmth-engine";
import { getLifeMomentLine } from "@/lib/portal/life-moments";
import type { HumanFlowState } from "@/lib/portal/human-flow";

/**
 * PORTAL_4_FINAL_PRODUCT_DESIGN.md — mục 1 (Home), khối "Companion Presence
 * Band". Frozen spec: đây LÀ khối đầu tiên và duy nhất chiếm ưu thế thị giác
 * tuyệt đối trên Home — Companion chào trước, dashboard tới sau. Cấu trúc bắt
 * buộc: lời chào + 1 câu lý do + ĐÚNG 1 nút hành động (không có nút thứ 2
 * cạnh tranh). Trước đây đây là 2 component riêng (WelcomeHero 3 nút +
 * NextBestActionCard 1 nút) — hợp nhất theo đúng luật cứng của Final Product
 * Design, không phải một lựa chọn thẩm mỹ.
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
      {state === "comeback" && (
        <p className="relative mt-3 max-w-xl text-sm text-white/85">{getLifeMomentLine("quietReturn")}</p>
      )}

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
