export function GemProgress({
  percent,
  label,
}: {
  percent: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/60">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="gemos-progress-track">
        <div className="gemos-progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
