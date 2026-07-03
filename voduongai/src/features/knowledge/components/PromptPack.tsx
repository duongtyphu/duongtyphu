"use client";

import { useState } from "react";
import { Copy, Check, Package } from "lucide-react";

/** Prompt Pack — tối thiểu 5 prompt thật, mỗi prompt copy được ngay, chuẩn bị cho download sau này. */
export function PromptPack({ prompts, packLabel }: { prompts: string[]; packLabel: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleCopy(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((v) => (v === index ? null : v)), 1500);
    } catch {
      // clipboard unavailable — im lặng, không vỡ UI
    }
  }

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Package className="h-3.5 w-3.5" />
        {packLabel} · {prompts.length} prompt
      </p>
      <div className="space-y-2">
        {prompts.map((prompt, i) => (
          <div key={prompt} className="flex items-start gap-2 rounded-lg bg-gray-50 p-3">
            <p className="min-w-0 flex-1 font-mono text-xs leading-relaxed text-gray-700">{prompt}</p>
            <button
              type="button"
              onClick={() => handleCopy(prompt, i)}
              aria-label={`Copy prompt ${i + 1}`}
              className="shrink-0 rounded-md border border-gray-200 p-1.5 text-gray-500 transition hover:border-blue-300 hover:text-blue-600"
            >
              {copiedIndex === i ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
