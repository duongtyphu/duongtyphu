"use client";

/**
 * EPIC 02 — Sprint 04: Companion Work Session UI (Nhiệm vụ 02/03).
 *
 * Hiển thị Companion "đang làm việc" — không phải danh sách Agent để chọn.
 * Agent chỉ xuất hiện như đội ngũ Companion đã tự mời (Nhiệm vụ 03 — Team
 * Experience). Mọi kết quả/bước tiếp theo đều đi qua Companion, không có
 * Agent nào "nói trực tiếp" với người dùng ở đây.
 */

import { Check, Circle, Loader2 } from "lucide-react";
import type { CompanionWorkSession } from "@/companion/work-session/work-session.types";

const WORKING_STATUSES = new Set(["THINKING", "PLANNING", "INVITING_AGENT", "WAITING_AGENT", "SYNTHESIZING"]);

export function CompanionWorkSessionPanel({
  session,
  onCelebrate,
}: {
  session: CompanionWorkSession;
  onCelebrate: () => void;
}) {
  const latestMessage = session.companionMessages.at(-1)?.text;
  const isWorking = WORKING_STATUSES.has(session.currentStatus);
  const isReady = session.currentStatus === "READY";
  const isCelebrating = session.currentStatus === "CELEBRATING";

  return (
    <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
        {isWorking && <Loader2 className="h-3 w-3 animate-spin" />}
        Companion đang làm việc cùng bạn
      </p>

      <p className="mt-1.5 text-xs font-semibold leading-snug text-gray-800">Mục tiêu: {session.userGoal}</p>

      <ul className="mt-2 space-y-1">
        {session.plan.map((step) => (
          <li key={step.id} className="flex items-center gap-1.5 text-[11px] text-gray-500">
            {step.status === "done" ? (
              <Check className="h-3 w-3 shrink-0 text-emerald-500" />
            ) : step.status === "active" ? (
              <Loader2 className="h-3 w-3 shrink-0 animate-spin text-blue-400" />
            ) : (
              <Circle className="h-3 w-3 shrink-0 text-gray-300" />
            )}
            {step.label}
          </li>
        ))}
      </ul>

      {session.selectedSpecialists.length > 0 && (
        <div className="mt-2.5 border-t border-gray-200 pt-2.5">
          <p className="text-[11px] text-gray-500">
            Để hoàn thành việc này, mình sẽ mời các chuyên gia sau hỗ trợ chúng ta:
          </p>
          <ul className="mt-1 space-y-0.5">
            {session.selectedSpecialists.map((agent) => (
              <li key={agent.id} className="text-[11px] text-gray-400">
                <span className="font-semibold text-gray-600">{agent.name.replace(/^AI /, "")}</span> — {agent.role}
              </li>
            ))}
          </ul>
        </div>
      )}

      {latestMessage && (
        <p className="mt-2.5 border-t border-gray-200 pt-2.5 text-xs italic leading-relaxed text-gray-600">
          &ldquo;{latestMessage}&rdquo;
        </p>
      )}

      {isReady && (
        <button
          type="button"
          onClick={onCelebrate}
          className="mt-2.5 w-full rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
        >
          Mình đã thử rồi
        </button>
      )}

      {isCelebrating && (
        <p className="mt-2.5 border-t border-gray-200 pt-2.5 text-xs font-semibold text-emerald-600">
          🌱 Ghi nhận rồi — tiếp tục hành trình khi bạn sẵn sàng.
        </p>
      )}
    </div>
  );
}
