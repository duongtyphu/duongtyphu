"use client";

export function MiniBarChart({
  data,
  dataKey,
  labelKey = "day",
  color = "#2563EB",
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  labelKey?: string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => Number(d[dataKey])), 1);
  return (
    <div className="flex h-32 items-end gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${Math.max((Number(d[dataKey]) / max) * 100, 4)}%`,
              backgroundColor: color,
              opacity: 0.85,
            }}
          />
          <span className="text-[10px] text-white/40">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}
