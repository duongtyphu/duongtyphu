import { Flame } from "lucide-react";

/** Feature 03 — Why This Matters: ngắn, tập trung tạo động lực. */
export function WhyThisMatters({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
      <Flame className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
      <p className="text-sm leading-relaxed text-gray-700">{text}</p>
    </div>
  );
}
