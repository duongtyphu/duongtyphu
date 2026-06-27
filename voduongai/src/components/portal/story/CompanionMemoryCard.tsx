import { HeartHandshake } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { Reflection } from "@/lib/portal/reflections";

/**
 * Answers: "Portal có thực sự nhớ điều tôi từng chia sẻ, không chỉ lưu trữ nó?"
 */
export function CompanionMemoryCard({ lastReflection }: { lastReflection?: Reflection }) {
  return (
    <GemCard className="h-full">
      <div className="flex items-center gap-2">
        <HeartHandshake className="h-4 w-4 text-[#22D3EE]" />
        <h2 className="text-sm font-bold text-white">Mình vẫn nhớ</h2>
      </div>
      {lastReflection ? (
        <p className="mt-3 text-sm text-white/70">
          Mình nhớ bạn từng chia sẻ: <span className="text-white/85">“{lastReflection.answer}”</span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-white/65">
          Khi bạn chia sẻ điều gì đó với mình, mình sẽ giữ lại — không phải để theo dõi, mà để có thể đồng hành đúng với
          những gì bạn đang hướng tới.
        </p>
      )}
    </GemCard>
  );
}
