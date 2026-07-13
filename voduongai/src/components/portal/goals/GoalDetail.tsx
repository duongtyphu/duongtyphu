"use client";

/**
 * GOAL-001 — Goal Creation Runtime — Goal Detail.
 *
 * `/portal/goals/[goalId]` — Goal Information, Current Status, Progress,
 * Timeline (statusHistory thật), Mission (Epic → Mission, tái dùng luồng
 * Task → Output → Review → Approval → Portfolio đã có qua
 * `startCompanionWorkspace()`). Nút "Khởi chạy Goal" chỉ hiện khi Goal
 * còn `status: "draft"` — chuyển Draft → Analyzing → Planning
 * (`launchGoal()`), chưa cần AI/Provider/Mock theo đúng brief PHASE 1.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { startCompanionWorkspace } from "@/lib/portal/companion-workspace";
import { Breadcrumb } from "@/components/portal/ui/Breadcrumb";
import {
  getGoal,
  listEpics,
  listGoalMissions,
  getGoalProgress,
  getEpicProgress,
  getMissionProgress,
  launchGoal,
  type GoalRecord,
  type EpicRecord,
  type GoalMissionRecord,
  type MissionStatus,
} from "@/lib/portal/foundation/goal-runtime";
import { getCompanion } from "@/lib/portal/foundation/workforce-registry";
import { GOAL_STATUS_LABEL, GOAL_STATUS_STYLE } from "./GoalRuntimeBoard";

const MISSION_STATUS_LABEL: Record<MissionStatus, string> = {
  not_started: "Chưa bắt đầu",
  in_progress: "Đang thực hiện",
  waiting_review: "Chờ Đánh giá",
  completed: "Hoàn thành",
};

const MISSION_STATUS_STYLE: Record<MissionStatus, string> = {
  not_started: "bg-gray-100 text-gray-500",
  in_progress: "bg-blue-100 text-blue-700",
  waiting_review: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
};

const PRIORITY_LABEL: Record<string, string> = { low: "Thấp", medium: "Trung bình", high: "Cao" };

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
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${MISSION_STATUS_STYLE[mission.status]}`}>
          {MISSION_STATUS_LABEL[mission.status]} · {progress}%
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600 md:grid-cols-2">
        <p><span className="font-semibold text-gray-800">Input:</span> {mission.input.join("; ") || "—"}</p>
        <p><span className="font-semibold text-gray-800">Kết quả:</span> {mission.output.join("; ") || "—"}</p>
        <p><span className="font-semibold text-gray-800">Deliverables:</span> {mission.deliverables.join("; ") || "—"}</p>
        <p><span className="font-semibold text-gray-800">Definition of Done:</span> {mission.definitionOfDone.join("; ") || "—"}</p>
      </div>

      <button
        type="button"
        onClick={handleStart}
        className="mt-3 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-blue-700"
      >
        {mission.status === "not_started" ? "Bắt đầu Nhiệm vụ" : "Mở Không gian làm việc"} <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function EpicSection({ epic, goal }: { epic: EpicRecord; goal: GoalRecord }) {
  const missions = listGoalMissions(epic.epicId);
  const progress = getEpicProgress(epic.epicId);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Epic: {epic.title}</h3>
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

export function GoalDetail({ goalId }: { goalId: string }) {
  const [goal, setGoal] = useState<GoalRecord | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoal(getGoal(goalId) ?? null);
  }, [goalId]);

  function handleLaunch() {
    launchGoal(goalId);
    setGoal(getGoal(goalId) ?? null);
  }

  if (goal === undefined) return null;

  if (goal === null) {
    return (
      <div className="space-y-4 rounded-3xl p-6 md:p-8">
        <p className="text-sm text-gray-500">Không tìm thấy Mục tiêu này.</p>
        <Link href="/portal/goals" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
          <ArrowLeft className="h-4 w-4" /> Quay lại Bảng Mục tiêu
        </Link>
      </div>
    );
  }

  const epics = listEpics(goal.goalId);
  const progress = getGoalProgress(goal.goalId);

  return (
    <div className="space-y-6 rounded-3xl p-6 md:p-8">
      <Breadcrumb
        items={[
          { label: "Bảng Mục tiêu", href: "/portal/goals" },
          { label: goal.title },
        ]}
      />

      {/* Goal Information + Current Status + Progress */}
      <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">{goal.title}</h1>
            {goal.description && <p className="mt-2 text-sm text-gray-600">{goal.description}</p>}
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${GOAL_STATUS_STYLE[goal.status]}`}>
            {GOAL_STATUS_LABEL[goal.status]}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600 md:grid-cols-4">
          {goal.category && <p><span className="font-semibold text-gray-800">Category:</span> {goal.category}</p>}
          {goal.goalType && <p><span className="font-semibold text-gray-800">Type:</span> {goal.goalType}</p>}
          {goal.priority && <p><span className="font-semibold text-gray-800">Priority:</span> {PRIORITY_LABEL[goal.priority] ?? goal.priority}</p>}
          {goal.expectedDeliverable && <p><span className="font-semibold text-gray-800">Deliverable:</span> {goal.expectedDeliverable}</p>}
          {goal.dueDate && <p><span className="font-semibold text-gray-800">Due:</span> {goal.dueDate}</p>}
          <p><span className="font-semibold text-gray-800">Owner:</span> {goal.createdBy ?? "Owner"}</p>
          <p><span className="font-semibold text-gray-800">Created:</span> {new Date(goal.createdAt).toLocaleDateString("vi-VN")}</p>
          {goal.tags && goal.tags.length > 0 && <p><span className="font-semibold text-gray-800">Tags:</span> {goal.tags.join(", ")}</p>}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-semibold text-blue-600">{progress}%</span>
        </div>

        {goal.status === "draft" && (
          <button
            type="button"
            onClick={handleLaunch}
            className="mt-5 flex items-center gap-1.5 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-amber-700"
          >
            Khởi chạy Mục tiêu <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </section>

      {/* Timeline */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-lg font-bold text-gray-900">Timeline</h2>
        <div className="mt-4 space-y-2">
          {(goal.statusHistory ?? [{ status: goal.status, at: goal.createdAt }]).map((entry, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span className="font-semibold text-gray-800">{GOAL_STATUS_LABEL[entry.status]}</span>
              <span className="text-xs text-gray-400">{new Date(entry.at).toLocaleString("vi-VN")}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mission (Epic -> Mission -> Task -> Output -> Review -> Approval -> Portfolio) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Nhiệm vụ</h2>
        {epics.length === 0 ? (
          <p className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-400 shadow-sm">
            Chưa có Nhiệm vụ nào — sẽ được tạo khi Mục tiêu chuyển sang Đang chạy.
          </p>
        ) : (
          epics.map((epic) => <EpicSection key={epic.epicId} epic={epic} goal={goal} />)
        )}
      </section>

      {/* Output / Review / Portfolio — placeholder cho tới khi Mission chạy qua Workspace */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {["Kết quả", "Đánh giá", "Thành quả"].map((label) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 text-sm text-gray-400 shadow-sm">
            <p className="font-semibold text-gray-700">{label}</p>
            <p className="mt-1 text-xs">Chưa có {label} — xuất hiện khi Nhiệm vụ được thực thi qua Không gian làm việc.</p>
          </div>
        ))}
      </section>

      <Link href="/portal/goals" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
        <ArrowLeft className="h-4 w-4" /> Quay lại Bảng Mục tiêu
      </Link>
    </div>
  );
}
