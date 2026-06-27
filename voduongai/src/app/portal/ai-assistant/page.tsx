import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import { firstConversationOpening, companionOpeners, companionPromise } from "@/lib/portal/companion-conversation";

export const metadata = { title: "Companion", description: "Người đồng hành cho hành trình của bạn." };

export default function AiAssistantPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Companion" description="Không phải một công cụ. Một người đồng hành." />
      <GemCard variant="featured" className="flex flex-col items-center gap-5 py-14 text-center">
        <span className="h-2 w-2 rounded-full bg-[#22D3EE]" />
        <div className="max-w-md space-y-3">
          <p className="text-base font-semibold text-white">{firstConversationOpening.greeting}</p>
          <p className="text-sm text-white/70">{firstConversationOpening.framing}</p>
          <p className="text-sm text-white/55">{firstConversationOpening.invitation}</p>
        </div>
        <div className="mt-2 w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
          {companionOpeners[0]}
        </div>
        <p className="max-w-sm text-xs text-white/40">
          Companion đang được chuẩn bị để có thể trò chuyện cùng bạn. Trong lúc đó, đây vẫn là một
          không gian dành cho bạn — không cần phải nói gì cả nếu chưa muốn.
        </p>
        <p className="max-w-md border-t border-white/10 pt-4 text-xs italic text-white/40">{companionPromise}</p>
        <Button href="/portal" variant="secondary" className="mt-1">
          Về Dashboard
        </Button>
      </GemCard>
    </div>
  );
}
