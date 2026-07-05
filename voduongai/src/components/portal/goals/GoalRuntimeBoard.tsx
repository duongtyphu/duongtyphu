"use client";

/**
 * GOAL 001 — Goal Runtime Board.
 *
 * `/portal/goals` — hiển thị phân cấp Goal → Epic → Mission (đọc từ
 * `goal-runtime.ts`, code thật). Bấm vào 1 Mission → vào đúng
 * `/portal/workspace` đã có (Sprint 003 Runtime Flow: Task → Output →
 * Review → Approval → Portfolio) qua `startCompanionWorkspace()` — điểm
 * gọi duy nhất đã khóa, không tạo đường vào Workspace riêng.
 *
 * Landing Page Production chỉ là Goal ĐẦU TIÊN được gieo qua
 * `seedLandingPageProductionGoal()` — trang này không hard-code tên
 * Goal/Mission nào, chỉ đọc dữ liệu từ Goal Runtime.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, Sparkles } from "lucide-react";
import { startCompanionWorkspace } from "@/lib/portal/companion-workspace";
import {
  listGoals,
  listEpics,
  listGoalMissions,
  getGoalProgress,
  getEpicProgress,
  getMissionProgress,
  seedLandingPageProductionGoal,
  launchGoal,
  type GoalRecord,
  type EpicRecord,
  type GoalMissionRecord,
  type MissionStatus,
} from "@/lib/portal/foundation/goal-runtime";
import { getCompanion } from "@/lib/portal/foundation/workforce-registry";

const PRIORITY_LABEL: Record<string, string> = { low: "Thấp", medium: "Trung bình", high: "Cao" };

const STATUS_LABEL: Record<MissionStatus, string> = {
  not_started: "Chưa bắt đầu",
  in_progress: "Đang thực hiện",
  waiting_review: "Chờ Review",
  completed: "Hoàn thành",
};

const STATUS_STYLE: Record<MissionStatus, string> = {
  not_started: "bg-gray-100 text-gray-500",
  in_progress: "bg-blue-100 text-blue-700",
  waiting_review: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
};

function MissionRow({ mission, goalTitle }: { mission: GoalMissionRecord; goalTitle: string }) {
  const router = useRouter();
  const companion = getCompanion(mission.companionEmployeeId);
  const progress = getMissionProgress(mission);

  function handleStart() {
    router.push(
      startCompanionWorkspace({
        module: "khong-gian-ai",
        source: "recommended-workspace",
        itemId: mission.missionId,
        itemType: "workspace",
        title: mission.title,
        userGoal: `${goalTitle} — ${mission.title}`,
        missionId: mission.missionId,
      })
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{mission.title}</p>
          <p className="text-xs text-gray-500">
            {mission.department} · {companion?.position ?? mission.companionEmployeeId} · Owner: {mission.owner}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[mission.status]}`}>
          {STATUS_LABEL[mission.status]} · {progress}%
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600 md:grid-cols-2">
        <p><span className="font-semibold text-gray-800">Input:</span> {mission.input.join("; ") || "—"}</p>
        <p><span className="font-semibold text-gray-800">Output:</span> {mission.output.join("; ") || "—"}</p>
        <p><span className="font-semibold text-gray-800">Deliverables:</span> {mission.deliverables.join("; ") || "—"}</p>
        <p><span className="font-semibold text-gray-800">Definition of Done:</span> {mission.definitionOfDone.join("; ") || "—"}</p>
      </div>

      <button
        type="button"
        onClick={handleStart}
        className="mt-3 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-blue-700"
      >
        {mission.status === "not_started" ? "Bắt đầu Mission" : "Mở Workspace"} <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function DraftGoalCard({ goal, onLaunched }: { goal: GoalRecord; onLaunched: () => void }) {
  function handleLaunch() {
    launchGoal(goal.goalId);
    onLaunched();
  }

  return (
    <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">Draft</span>
          <h2 className="mt-2 text-xl font-extrabold text-gray-900">{goal.title}</h2>
        </div>
      </div>

      {goal.description && <p className="mt-2 text-sm text-gray-600">{goal.description}</p>}

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600 md:grid-cols-3">
        {goal.goalType && <p><span className="font-semibold text-gray-800">Loại:</span> {goal.goalType}</p>}
        {goal.priority && <p><span className="font-semibold text-gray-800">Priority:</span> {PRIORITY_LABEL[goal.priority] ?? goal.priority}</p>}
        {goal.expectedDeliverable && <p><span className="font-semibold text-gray-800">Deliverable:</span> {goal.expectedDeliverable}</p>}
        {goal.dueDate && <p><span className="font-semibold text-gray-800">Due:</span> {goal.dueDate}</p>}
      </div>

      <button
        type="button"
        onClick={handleLaunch}
        className="mt-4 flex items-center gap-1.5 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-amber-700"
      >
        Khởi chạy Goal <ArrowRight className="h-3 w-3" />
      </button>
    </section>
  );
}

function EpicSection({ epic, goal }: { epic: EpicRecord; goal: GoalRecord }) {
  const missions = listGoalMissions(epic.epicId);
  const progress = getEpicProgress(epic.epicId);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Epic: {epic.title}</h2>
        <span className="text-sm font-semibold text-blue-600">{progress}%</span>
      </div>
      <div className="mt-4 space-y-3">
        {missions.map((mission) => (
          <MissionRow key={mission.missionId} mission={mission} goalTitle={goal.title} />
        ))}
      </div>
    </section>
  );
}

export function GoalRuntimeBoard() {
  const [goals, setGoals] = useState<GoalRecord[]>([]);

  useEffect(() => {
    // GOAL 001 — gieo Goal đầu tiên nếu chưa có (idempotent).
    seedLandingPageProductionGoal();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoals(listGoals());
  }, []);

  return (
    <div className="space-y-8 rounded-3xl p-6 md:p-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/portal" className="hover:text-gray-700 transition">Portal</Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-900">Goal Runtime</span>
      </nav>

      <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <Sparkles className="h-4 w-4" />
              Goal Runtime
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-gray-900 md:text-3xl">Goal của bạn</h1>
            <p className="mt-2 text-sm text-gray-500">
              Goal → Epic → Mission → Task → Output → Review → Approval → Portfolio. Mỗi Mission được điều phối bởi 1 AI Companion thật.
            </p>
          </div>
          <Link
            href="/portal/goals/new"
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Tạo Goal mới
          </Link>
        </div>
      </section>

      {goals.length === 0 && (
        <p className="text-sm text-gray-400">Chưa có Goal nào — đang khởi tạo…</p>
      )}

      {goals.map((goal) =>
        goal.status === "draft" ? (
          <DraftGoalCard key={goal.goalId} goal={goal} onLaunched={() => setGoals(listGoals())} />
        ) : (
          <div key={goal.goalId} className="space-y-4">
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-gray-900">Goal: {goal.title}</h2>
                <span className="text-sm font-semibold text-blue-600">{getGoalProgress(goal.goalId)}%</span>
              </div>
            </section>
            {listEpics(goal.goalId).map((epic) => (
              <EpicSection key={epic.epicId} epic={epic} goal={goal} />
            ))}
          </div>
        )
      )}

      <Link href="/portal" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
        <ArrowLeft className="h-4 w-4" /> Quay lại Portal
      </Link>
    </div>
  );
}
