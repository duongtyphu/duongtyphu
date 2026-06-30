import { Sparkles } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Portal có thực sự hiểu vì sao tôi thay đổi, không chỉ ghi nhớ tôi đã làm gì?"
 */
export function UnderstandingNoteCard({ note, pattern }: { note: string | null; pattern: string | null }) {
  if (!note && !pattern) return null;

  return (
    <GemCard variant="featured">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#A78BFA]" />
        <h2 className="text-sm font-bold text-gray-900">Mình nhận thấy</h2>
      </div>
      {note && <p className="mt-3 text-sm leading-relaxed text-gray-600">{note}</p>}
      {pattern && <p className={`text-sm leading-relaxed text-gray-600 ${note ? "mt-2" : "mt-3"}`}>{pattern}</p>}
    </GemCard>
  );
}
