import { Bot } from "lucide-react";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";

export const metadata = { title: "AI Assistant", description: "Trợ lý AI đồng hành cùng hành trình tỏa sáng của bạn." };

export default function AiAssistantPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Assistant"
        description="Một người đồng hành AI riêng cho hành trình của bạn — đang được mài giũa."
      />
      <GemCard variant="featured" className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#22D3EE]/20 text-[#22D3EE]">
          <Bot className="h-5 w-5" />
        </div>
        <h3 className="text-base font-bold text-white">Khu vực này đang được xây dựng</h3>
        <p className="max-w-sm text-sm text-white/55">
          AI Assistant cá nhân sẽ sớm đồng hành cùng bạn trong từng bước của hành trình mài giũa
          phiên bản tốt hơn của chính mình.
        </p>
        <Button href="/portal" variant="primary" className="mt-1">
          Về Dashboard
        </Button>
      </GemCard>
    </div>
  );
}
