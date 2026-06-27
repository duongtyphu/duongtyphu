import Link from "next/link";
import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { WelcomeState } from "@/lib/portal/warmth-engine";
import { getLifeMomentLine } from "@/lib/portal/life-moments";

/**
 * Answers: "Người dùng có cảm thấy đây là một nơi để trở về, không chỉ là một dashboard?"
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
    <GemCard variant="featured" className="!p-7 sm:!p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE]">
        Gem Home{name && state !== "first" ? ` · ${name}` : ""}
      </p>
      <h1 className="mt-2 whitespace-pre-line text-xl font-extrabold text-white sm:text-2xl">{welcomeMessage}</h1>
      <Link href="/portal/story" className="mt-3 block max-w-xl text-sm italic text-white/55 hover:text-white/75">
        {reflectionPrompt}
      </Link>
      {state === "comeback" && (
        <p className="mt-3 max-w-xl text-sm text-white/65">{getLifeMomentLine("quietReturn")}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href="/portal/journey" variant="primary">
          Tiếp tục hành trình →
        </Button>
        <Button href="/portal/roadmap" variant="secondary">
          Xem lộ trình
        </Button>
        <Button href="/portal/story" variant="secondary">
          My Story
        </Button>
      </div>
    </GemCard>
  );
}
