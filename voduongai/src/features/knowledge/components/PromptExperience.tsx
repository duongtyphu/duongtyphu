"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

/** Feature 06 — Prompt Experience: Copy, Expand, ví dụ Input/Output, Prompt Tips. */
export function PromptExperience({
  prompt,
  tips,
  exampleInput,
  exampleOutput,
}: {
  prompt: string;
  tips: string[];
  exampleInput: string;
  exampleOutput: string;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — im lặng, không vỡ UI
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Prompt</h2>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Đã copy" : "Copy"}
        </button>
      </div>

      <p className="rounded-lg bg-gray-50 p-3 font-mono text-xs leading-relaxed text-gray-700">{prompt}</p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1 text-xs font-semibold text-blue-600"
      >
        {expanded ? "Thu gọn" : "Xem ví dụ & mẹo dùng prompt"}
        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-gray-100 pt-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Ví dụ Input</p>
              <p className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">{exampleInput}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Ví dụ Kết quả</p>
              <p className="rounded-lg bg-blue-50 p-3 text-xs text-gray-700">{exampleOutput}</p>
            </div>
          </div>

          {tips.length > 0 && (
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                <Lightbulb className="h-3 w-3" />
                Prompt Tips
              </p>
              <ul className="list-disc space-y-1 pl-5 text-xs text-gray-600">
                {tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
