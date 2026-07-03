"use client";

/**
 * Sprint A.2 — Connect Orchestrator to Real User Actions. "Phân tích dự án" /
 * "Lập kế hoạch áp dụng" gửi projectName/opportunityType/riskContext thật vào
 * Companion Orchestrator — không gọi AI, chỉ đổi userGoal/currentContext.
 */

import { pushCompanionIntent } from "@/lib/portal/companion/orchestrator-intent";

export function OpportunityAgentActions({
  projectName,
  opportunityType,
  riskContext,
}: {
  projectName: string;
  opportunityType: string;
  riskContext: string;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() =>
          pushCompanionIntent({
            module: "opportunities",
            userGoal: `phân tích dự án ${projectName}`,
            currentContext: `Loại cơ hội: ${opportunityType}. ${riskContext}`,
          })
        }
        className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
      >
        Phân tích dự án
      </button>
      <button
        type="button"
        onClick={() =>
          pushCompanionIntent({
            module: "opportunities",
            userGoal: `lập kế hoạch áp dụng ${projectName}`,
            currentContext: `Loại cơ hội: ${opportunityType}. ${riskContext}`,
          })
        }
        className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
      >
        Lập kế hoạch áp dụng
      </button>
    </div>
  );
}
