import { CheckCircle2 } from "lucide-react";

/** Feature 02 — Learning Outcome: rõ ràng, không chung chung. */
export function LearningOutcome({ items }: { items: string[] }) {
  return (
    <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Sau khi hoàn thành Seed này, bạn sẽ</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
