import { Gem } from "lucide-react";

export function LoadingState({ label = "Đang tải...", rows = 0 }: { label?: string; rows?: number }) {
  if (rows > 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="gemos-shimmer h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <Gem className="gemos-glow-pulse h-7 w-7 text-[#22D3EE]" />
      <p className="text-sm font-semibold text-white/50">{label}</p>
    </div>
  );
}
