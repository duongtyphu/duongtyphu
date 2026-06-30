import { HeartHandshake } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { Reflection } from "@/lib/portal/reflections";
import { buildInsightMemoryLine } from "@/lib/portal/human-understanding";

/**
 * Answers: "Portal có thực sự nhớ vì sao tôi thay đổi, không chỉ trích lại nguyên văn tôi đã viết?"
 */
export function CompanionMemoryCard({ reflections }: { reflections: Reflection[] }) {
  return (
    <GemCard className="h-full">
      <div className="flex items-center gap-2">
        <HeartHandshake className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-bold text-gray-900">Mình vẫn nhớ</h2>
      </div>
      <p className="mt-3 text-sm text-gray-600">{buildInsightMemoryLine(reflections)}</p>
    </GemCard>
  );
}
