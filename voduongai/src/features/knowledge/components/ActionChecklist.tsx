"use client";

import { useChecklistTick } from "../utils/use-checklist-tick";

/** Feature 09 — Action Checklist: có thể tick, không chỉ để đọc. */
export function ActionChecklist({ seedId, items }: { seedId: string; items: string[] }) {
  const { tickedIndexes, toggle } = useChecklistTick(seedId);

  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const ticked = tickedIndexes.includes(i);
        return (
          <li key={item}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-gray-50"
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                  ticked ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-300"
                }`}
              >
                {ticked ? "✓" : ""}
              </span>
              <span className={`text-sm ${ticked ? "text-gray-400 line-through" : "text-gray-700"}`}>{item}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
