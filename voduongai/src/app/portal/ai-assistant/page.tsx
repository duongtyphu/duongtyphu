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
        <span className="h-2 w-2 rounded-full bg-brand-cyan" />
        <div className="max-w-md space-y-3">
          <p className="text-base font-semibold text-gray-900">{firstConversationOpening.greeting}</p>
          <p className="text-sm text-gray-600">{firstConversationOpening.framing}</p>
          <p className="text-sm text-gray-500">{firstConversationOpening.invitation}</p>
        </div>
        <div className="mt-2 w-full max-w-sm rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          {companionOpeners[0]}
        </div>
        <p className="max-w-sm text-xs text-gray-400">
          Companion đang được chuẩn bị để có thể trò chuyện cùng bạn. Trong lúc đó, đây vẫn là một
          không gian dành cho bạn — không cần phải nói gì cả nếu chưa muốn.
        </p>
        <p className="max-w-md border-t border-gray-200 pt-4 text-xs italic text-gray-400">{companionPromise}</p>
        <Button href="/portal" variant="secondary" className="mt-1">
          Tiếp tục hành trình
        </Button>
      </GemCard>
    </div>
  );
}
