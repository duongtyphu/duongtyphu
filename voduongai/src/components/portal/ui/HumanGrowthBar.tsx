import { GemProgress } from "@/components/portal/ui/GemProgress";

export type HumanGrowthDimension = {
  key: "knowledge" | "skill" | "career" | "community" | "legacy";
  label: string;
  percent: number;
};

export const DEFAULT_GROWTH_DIMENSIONS: HumanGrowthDimension[] = [
  { key: "knowledge", label: "Tri thức", percent: 35 },
  { key: "skill", label: "Kỹ năng", percent: 20 },
  { key: "career", label: "Sự nghiệp", percent: 15 },
  { key: "community", label: "Cộng đồng", percent: 10 },
  { key: "legacy", label: "Di sản", percent: 5 },
];

export function HumanGrowthBar({
  percent,
  label = "Hành trình tỏa sáng",
}: {
  percent: number;
  label?: string;
}) {
  return <GemProgress percent={percent} label={label} />;
}

export function HumanGrowthIndex({
  dimensions = DEFAULT_GROWTH_DIMENSIONS,
}: {
  dimensions?: HumanGrowthDimension[];
}) {
  return (
    <div className="space-y-4">
      {dimensions.map((d) => (
        <GemProgress key={d.key} percent={d.percent} label={d.label} />
      ))}
    </div>
  );
}
