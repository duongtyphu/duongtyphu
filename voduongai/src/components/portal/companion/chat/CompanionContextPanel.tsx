"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listGoals, listEpics, listGoalMissions, type GoalRecord, type GoalMissionRecord } from "@/lib/portal/foundation/goal-runtime";
import { listAllSessions, type WorkspaceSessionRecord } from "@/lib/portal/foundation/workspace-session-store";
import { MODULE_LABELS } from "@/companion/agents/module-agent-map";
import { useReflections } from "@/lib/portal/reflections";

/**
 * Context Panel (EPIC-UX-002) — cột phải Desktop, "Hôm nay: Mục tiêu/Đang
 * học/Gợi ý/Ghi chú". Dữ liệu THẬT của người dùng đang đăng nhập, đọc từ
 * đúng 3 nguồn đã có sẵn trong dự án (không tạo bảng/API mới):
 *
 * - Mục tiêu — Goal Runtime (`goal-runtime.ts`, localStorage per-browser,
 *   cùng nguồn `/portal/goals` đang dùng): mục tiêu đang chạy gần nhất.
 * - Đang học — WorkspaceSession (`workspace-session-store.ts`, cùng nguồn
 *   `growth-view.ts`/Nhật ký học tập đang dùng): phiên chưa hoàn thành gần
 *   nhất.
 * - Gợi ý — Nhiệm vụ (Mission) chưa bắt đầu đầu tiên trong Mục tiêu đang
 *   chạy gần nhất — suy ra trực tiếp từ đúng dữ liệu Mục tiêu ở trên,
 *   không bịa gợi ý AI nào.
 * - Ghi chú — `useReflections()` (`reflections.ts`, Supabase bảng
 *   `reflections`, cùng hook `/portal/story` đang dùng thật): suy ngẫm mới
 *   nhất người dùng đã viết.
 *
 * Chỉ dùng cho `variant="full"` (`/portal/companion`), ẩn hẳn trên Mobile
 * và trên panel nổi (`variant="compact"`, quá hẹp để chứa cột thứ 3) — xem
 * `CompanionChatShell.tsx`.
 */

function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trimEnd()}…` : trimmed;
}

export function CompanionContextPanel() {
  const [activeGoal, setActiveGoal] = useState<GoalRecord | null | undefined>(undefined);
  const [inProgressSession, setInProgressSession] = useState<WorkspaceSessionRecord | null | undefined>(undefined);
  const [suggestedMission, setSuggestedMission] = useState<GoalMissionRecord | null | undefined>(undefined);
  const { reflections, ready: reflectionsReady } = useReflections();

  useEffect(() => {
    const goals = listGoals()
      .filter((g) => g.status === "active" || g.status === "ready_for_analysis")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const goal = goals[0] ?? null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc localStorage chỉ có ở client sau mount
    setActiveGoal(goal);

    if (goal) {
      const missions = listEpics(goal.goalId).flatMap((e) => listGoalMissions(e.epicId));
      setSuggestedMission(missions.find((m) => m.status === "not_started") ?? null);
    } else {
      setSuggestedMission(null);
    }

    const sessions = listAllSessions()
      .filter((s) => s.status !== "completed")
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    setInProgressSession(sessions[0] ?? null);
  }, []);

  const latestReflection = reflections[0];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-4">
      <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Hôm nay</p>
      <div className="mt-3 space-y-3">
        <div className="rounded-2xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none" aria-hidden="true">
              🎯
            </span>
            <span className="text-sm font-semibold text-gray-800">Mục tiêu</span>
          </div>
          {activeGoal === undefined ? null : activeGoal ? (
            <Link href={`/portal/goals/${activeGoal.goalId}`} className="mt-1.5 block text-xs leading-relaxed text-gray-600 hover:text-blue-600">
              {truncate(activeGoal.title, 80)}
            </Link>
          ) : (
            <p className="mt-1.5 text-xs leading-relaxed text-gray-400">Chưa có mục tiêu nào được thiết lập.</p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none" aria-hidden="true">
              📚
            </span>
            <span className="text-sm font-semibold text-gray-800">Đang học</span>
          </div>
          {inProgressSession === undefined ? null : inProgressSession ? (
            <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
              {truncate(
                inProgressSession.context.userGoal ?? inProgressSession.context.title ?? inProgressSession.context.source,
                80
              )}
              <span className="text-gray-400"> · {MODULE_LABELS[inProgressSession.context.module] ?? inProgressSession.context.module}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-xs leading-relaxed text-gray-400">Chưa có nội dung nào đang học.</p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none" aria-hidden="true">
              ⭐
            </span>
            <span className="text-sm font-semibold text-gray-800">Gợi ý</span>
          </div>
          {suggestedMission === undefined ? null : suggestedMission ? (
            <p className="mt-1.5 text-xs leading-relaxed text-gray-600">Bắt đầu nhiệm vụ tiếp theo: {truncate(suggestedMission.title, 70)}</p>
          ) : (
            <p className="mt-1.5 text-xs leading-relaxed text-gray-400">Chưa có gợi ý nào.</p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none" aria-hidden="true">
              📝
            </span>
            <span className="text-sm font-semibold text-gray-800">Ghi chú</span>
          </div>
          {!reflectionsReady ? null : latestReflection ? (
            <Link href="/portal/mirror" className="mt-1.5 block text-xs leading-relaxed text-gray-600 hover:text-blue-600">
              {truncate(latestReflection.answer, 90)}
            </Link>
          ) : (
            <p className="mt-1.5 text-xs leading-relaxed text-gray-400">Chưa có ghi chú nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
