export function HumanGrowthBar({
  percent,
  label = "Hành trình tỏa sáng",
}: {
  percent: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-white/60">
        <span>{label}</span>
        <span>{Math.round(clamped)}%</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#22D3EE] transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
