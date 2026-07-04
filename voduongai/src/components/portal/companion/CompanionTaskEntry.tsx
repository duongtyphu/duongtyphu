"use client";

/**
 * EPIC 02 — Sprint 02: Connected Learning Ecosystem.
 *
 * Điểm vào duy nhất để người dùng GIAO VIỆC cho Companion — không phải
 * chọn Agent, không phải chatbot. Người dùng chỉ mô tả mục tiêu bằng lời
 * của mình; Companion nhận Context và mở Workspace.
 *
 * Kỹ thuật: gọi `startCompanionWorkspace()` — điểm gọi duy nhất dùng chung
 * với mọi CTA "Thực hành/Giao việc/Dùng ngay cùng Companion" trên toàn
 * Portal (xem docs/CONNECTED_LEARNING_ECOSYSTEM.md), rồi điều hướng sang
 * `/portal/workspace`.
 */

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { PortalModule } from "@/companion/agents/agent.types";
import { startCompanionWorkspace } from "@/lib/portal/companion-workspace";

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
  const inputId = useId();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const goal = value.trim();
    if (!goal) return;
    router.push(startCompanionWorkspace({ module, source: "task-entry", userGoal: goal }));
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
    </form>
  );
}
