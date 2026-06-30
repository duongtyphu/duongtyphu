export function JourneyStep({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all ${
            s === step
              ? "w-10 bg-gradient-to-r from-[#2563EB] to-[#22D3EE]"
              : s < step
                ? "w-6 bg-[#22D3EE]/60"
                : "w-6 bg-gray-100"
          }`}
        />
      ))}
    </div>
  );
}
