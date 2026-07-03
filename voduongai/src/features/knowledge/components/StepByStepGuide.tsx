import { Check } from "lucide-react";

/** Feature 05 — Step by Step Guide: Step 1 → Step 2 → ... → Done, không viết thành đoạn dài. */
export function StepByStepGuide({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-0">
      {steps.map((text, i) => (
        <div key={text} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              {i + 1}
            </span>
            <div className="my-1 h-full w-px bg-gray-200" />
          </div>
          <p className="mb-4 -mt-0.5 text-sm leading-relaxed text-gray-700">{text}</p>
        </div>
      ))}
      <div className="flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-4 w-4" />
        </span>
        <p className="text-sm font-bold text-emerald-600">Done</p>
      </div>
    </div>
  );
}
