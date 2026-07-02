"use client";

import { ArrowRight } from "lucide-react";
import { KNOWLEDGE_TYPE_LABELS } from "../utils/knowledge-labels";
import type { KnowledgeAsset } from "../types/knowledge.types";
import type { KnowledgeSeedStep } from "../types/knowledge-seed.types";

/**
 * One Next Step™ — luôn chỉ một CTA chính, không hiển thị nhiều lựa chọn
 * cùng lúc. Bấm CTA sẽ đánh dấu bước hiện tại đã hoàn thành.
 */
export function OneNextStepCard({
  step,
  asset,
  onComplete,
}: {
  step: KnowledgeSeedStep;
  asset: KnowledgeAsset | null;
  onComplete: (stepId: string) => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-5">
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-500">
        Bước tiếp theo · {KNOWLEDGE_TYPE_LABELS[step.type]}
      </p>
      <h3 className="mb-2 text-base font-extrabold text-gray-900">{step.title}</h3>
      {asset && <p className="mb-4 text-sm leading-relaxed text-gray-600">{asset.content}</p>}
      <button
        type="button"
        onClick={() => onComplete(step.id)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Đã làm xong bước này
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
