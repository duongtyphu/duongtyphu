"use client";

/**
 * GOAL-001 — Goal Creation Runtime — Bảng Mục tiêu.
 *
 * `/portal/goals` — Goal là First-Class Object: Dashboard hiển thị Total/
 * Draft/Running/Completed/Archived (đếm thật qua `computeGoalDashboardSummary()`)
 * + danh sách Goal Card gọn (Title/Status/Priority/Progress/Created Date/
 * Owner), bấm vào mở `/portal/goals/[goalId]` (Goal Detail). Không hard-code
 * Goal nào — Landing Page Production chỉ là Goal ĐẦU TIÊN gieo qua
 * `seedLandingPageProductionGoal()`.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import {
  listGoals,
  getGoalProgress,
  seedLandingPageProductionGoal,
  computeGoalDashboardSummary,
  type GoalRecord,
  type GoalStatus,
} from "@/lib/portal/foundation/goal-runtime";

const PRIORITY_LABEL: Record<string, string> = { low: "Thấp", medium: "Trung bình", high: "Cao" };

export const GOAL_STATUS_LABEL: Record<GoalStatus, string> = {
  draft: "Bản nháp",
  ready_for_analysis: "READY_FOR_ANALYSIS",
  active: "Đang chạy",
  completed: "Hoàn thành",
  archived: "Lưu trữ",
};

export const GOAL_STATUS_STYLE: Record<GoalStatus, string> = {
  draft: "bg-gray-100 text-gray-500",
  ready_for_analysis: "bg-amber-100 text-amber-700",
  active: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-400",
};

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  );
}

function GoalCard({ goal }: { goal: GoalRecord }) {
  const progress = getGoalProgress(goal.goalId);
  return (
    <Link
      href={`/portal/goals/${goal.goalId}`}
      className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900">{goal.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${GOAL_STATUS_STYLE[goal.status]}`}>
          {GOAL_STATUS_LABEL[goal.status]}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        {goal.priority && <span>Priority: <span className="font-semibold text-gray-700">{PRIORITY_LABEL[goal.priority] ?? goal.priority}</span></span>}
        <span>Progress: <span className="font-semibold text-gray-700">{progress}%</span></span>
        <span>Owner: <span className="font-semibold text-gray-700">{goal.createdBy ?? "Owner"}</span></span>
        <span>Created: <span className="font-semibold text-gray-700">{new Date(goal.createdAt).toLocaleDateString("vi-VN")}</span></span>
      </div>
    </Link>
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

  const summary = computeGoalDashboardSummary();

  return (
    <div className="space-y-8 rounded-3xl p-6 md:p-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/portal" className="hover:text-gray-700 transition">Học viện</Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-900">Bảng Mục tiêu</span>
      </nav>

      <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <Sparkles className="h-4 w-4" />
              Bảng Mục tiêu
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-gray-900 md:text-3xl">Mục tiêu của bạn</h1>
            <p className="mt-2 text-sm text-gray-500">
              Mỗi Mục tiêu là 1 đối tượng độc lập: Draft → Analyzing → Planning → Đang chạy → Hoàn thành.
            </p>
          </div>
          <Link
            href="/portal/goals/new"
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Tạo Mục tiêu mới
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          <SummaryTile label="Tổng Mục tiêu" value={summary.total} />
          <SummaryTile label="Draft" value={summary.draft} />
          <SummaryTile label="Running" value={summary.running} />
          <SummaryTile label="Completed" value={summary.completed} />
          <SummaryTile label="Archived" value={summary.archived} />
        </div>
      </section>

      {goals.length === 0 && (
        <p className="text-sm text-gray-400">Chưa có Mục tiêu nào — đang khởi tạo…</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard key={goal.goalId} goal={goal} />
        ))}
      </div>

      <Link href="/portal" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
        <ArrowLeft className="h-4 w-4" /> Quay lại Học viện
      </Link>
    </div>
  );
}
