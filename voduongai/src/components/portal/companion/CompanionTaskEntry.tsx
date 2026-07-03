"use client";

/**
 * EPIC 02 — Sprint 04 bổ sung: Companion Task Entry.
 *
 * Điểm vào duy nhất để người dùng GIAO VIỆC cho Companion — không phải
 * chọn Agent, không phải chatbot. Người dùng chỉ mô tả mục tiêu bằng lời
 * của mình; Companion tự hiểu mục tiêu, lập kế hoạch, chọn AI Specialist
 * và mở Work Session (xem `CompanionFirstRule.md`).
 *
 * Kỹ thuật: chỉ gọi `pushCompanionIntent()` — tái dùng nguyên vẹn
 * orchestrator/work-session engine đã có, không thêm logic chọn Agent mới.
 */

import { useId, useState } from "react";
import { Sparkles } from "lucide-react";
import type { PortalModule } from "@/companion/agents/agent.types";
import { pushCompanionIntent } from "@/lib/portal/companion/orchestrator-intent";

export function CompanionTaskEntry({
  module,
  heading,
  placeholder,
  submitLabel = "Giao việc cho Companion",
}: {
  module: PortalModule;
  heading: string;
  placeholder: string;
  submitLabel?: string;
}) {
  const [value, setValue] = useState("");
  const [justSent, setJustSent] = useState(false);
  const inputId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const goal = value.trim();
    if (!goal) return;
    pushCompanionIntent({ module, userGoal: goal });
    setValue("");
    setJustSent(true);
    setTimeout(() => setJustSent(false), 4000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4"
    >
      <label htmlFor={inputId} className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue-600">
        <Sparkles className="h-3.5 w-3.5" />
        {heading}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="shrink-0 rounded-xl gradient-surface px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </div>
      {justSent && (
        <p className="mt-2 text-xs text-blue-600">
          Companion đã nhận việc — mở biểu tượng Companion ở góc màn hình để xem mình đang làm gì.
        </p>
      )}
    </form>
  );
}
