import { Sparkles } from "lucide-react";

export function CompanionSuggestion({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.05] px-4 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
        <Sparkles className="h-4 w-4 text-violet-400" />
      </div>
      <p className="text-sm leading-relaxed text-gray-700">{message}</p>
    </div>
  );
}
