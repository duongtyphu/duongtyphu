"use client";

/* =============================================================================
 * Bảng Mục tiêu 2.0 — chi tiết 1 mục tiêu, `/v2/muc-tieu/[goalId]` (task #61).
 *
 * Tái dùng NGUYÊN VẸN logic `GoalDetail.tsx` (1.0) — chỉ thiết kế lại giao
 * diện theo 2.0 (`.comp`/`companion.css`). "Bắt đầu Nhiệm vụ" vẫn gọi
 * `startCompanionWorkspace()` (đưa vào `/portal/workspace`, engine Task →
 * Output → Review → Approval → Portfolio thật — CHƯA có bản 2.0 tương
 * đương, ngoài phạm vi task #61) — đây là hành động SÂU, chỉ chạm tới sau
 * khi đã vào chi tiết 1 Mission cụ thể, khác với yêu cầu gốc của Founder
 * (thẻ "Mục tiêu hiện tại" ở `/v2/companion` không còn trỏ thẳng ra
 * `/portal/goals`).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { startCompanionWorkspace } from "@/lib/portal/companion-workspace";
import {
  getGoal,
  listEpics,
  listGoalMissions,
  getGoalProgress,
  getEpicProgress,
  getMissionProgress,
  launchGoal,
  hydrateGoalRuntime,
  type GoalRecord,
  type EpicRecord,
  type GoalMissionRecord,
  type MissionStatus,
} from "@/lib/portal/foundation/goal-runtime";
import { getCompanion } from "@/lib/portal/foundation/workforce-registry";

import "../../companion/companion.css";
import "../muc-tieu.css";

const STATUS_LABEL: Record<GoalRecord["status"], string> = {
  draft: "Bản nháp",
  ready_for_analysis: "Đang phân tích",
  active: "Đang chạy",
  completed: "Hoàn thành",
  archived: "Lưu trữ",
};

const MISSION_STATUS_LABEL: Record<MissionStatus, string> = {
  not_started: "Chưa bắt đầu",
  in_progress: "Đang thực hiện",
  waiting_review: "Chờ đánh giá",
  completed: "Hoàn thành",
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
    <div className="mission-row">
      <div className="mission-row-head">
        <div>
          <p>{mission.title}</p>
          <div className="mission-meta">
            {mission.department} · {companion?.position ?? mission.companionEmployeeId} · Owner: {mission.owner}
          </div>
        </div>
        <span className={`status-pill ${mission.status === "in_progress" ? "active" : mission.status === "completed" ? "completed" : "draft"}`}>
          {MISSION_STATUS_LABEL[mission.status]} · {progress}%
        </span>
      </div>
      <div className="mission-fields">
        <p>
          <b>Input:</b> {mission.input.join("; ") || "—"}
        </p>
        <p>
          <b>Kết quả:</b> {mission.output.join("; ") || "—"}
        </p>
        <p>
          <b>Sản phẩm:</b> {mission.deliverables.join("; ") || "—"}
        </p>
        <p>
          <b>Tiêu chí hoàn thành:</b> {mission.definitionOfDone.join("; ") || "—"}
        </p>
      </div>
      <button type="button" className="btn-violet" style={{ marginTop: 10, fontSize: 12 }} onClick={handleStart}>
        {mission.status === "not_started" ? "Bắt đầu nhiệm vụ" : "Mở không gian làm việc"}
      </button>
    </div>
  );
}

function EpicBlock({ epic, goal }: { epic: EpicRecord; goal: GoalRecord }) {
  const missions = listGoalMissions(epic.epicId);
  const progress = getEpicProgress(epic.epicId);
  return (
    <div className="epic-block">
      <div className="epic-block-head">
        <h4>{epic.title}</h4>
        <span style={{ color: "var(--violet)", fontWeight: 800, fontSize: 13 }}>{progress}%</span>
      </div>
      {missions.map((m) => (
        <MissionRow key={m.missionId} mission={m} goalTitle={goal.title} />
      ))}
    </div>
  );
}

export function GoalDetailClient({ premium, goalId }: { premium: PremiumStatus; goalId: string }) {
  const router = useRouter();
  const [goal, setGoal] = useState<GoalRecord | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      await hydrateGoalRuntime();
      setGoal(getGoal(goalId) ?? null);
    })();
  }, [goalId]);

  function handleLaunch() {
    launchGoal(goalId);
    setGoal(getGoal(goalId) ?? null);
  }

  function go(path: string) {
    router.push(path);
  }

  const body = (() => {
    if (goal === undefined) return <div className="empty-hint">Đang tải…</div>;
    if (goal === null) return <div className="empty-hint">Không tìm thấy mục tiêu này.</div>;

    const epics = listEpics(goal.goalId);
    const progress = getGoalProgress(goal.goalId);

    return (
      <>
        <div className="card">
          <div className="goal-detail-head">
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 800 }}>{goal.title}</h2>
              {goal.description ? <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>{goal.description}</p> : null}
            </div>
            <span className={`status-pill ${goal.status}`}>{STATUS_LABEL[goal.status]}</span>
          </div>
          <div className="goal-detail-fields">
            {goal.priority ? (
              <p>
                <b>Ưu tiên</b> {PRIORITY_LABEL[goal.priority] ?? goal.priority}
              </p>
            ) : null}
            {goal.expectedDeliverable ? (
              <p>
                <b>Sản phẩm kỳ vọng</b> {goal.expectedDeliverable}
              </p>
            ) : null}
            {goal.dueDate ? (
              <p>
                <b>Hạn hoàn thành</b> {goal.dueDate}
              </p>
            ) : null}
            <p>
              <b>Tạo lúc</b> {new Date(goal.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div className="goal-progress-track" style={{ marginTop: 14 }}>
            <div className="goal-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{progress}% hoàn thành</p>

          {goal.status === "draft" ? (
            <button type="button" className="btn-violet" style={{ marginTop: 14 }} onClick={handleLaunch}>
              Khởi chạy mục tiêu
            </button>
          ) : null}
        </div>

        {goal.statusHistory && goal.statusHistory.length > 0 ? (
          <div className="card" style={{ marginTop: 14 }}>
            <div className="card-head">
              <h4>Dòng thời gian</h4>
            </div>
            {goal.statusHistory.map((entry, i) => (
              <div className="timeline-row" key={i}>
                <span className="timeline-dot" />
                <span style={{ fontWeight: 700 }}>{STATUS_LABEL[entry.status]}</span>
                <span className="timeline-time">{new Date(entry.at).toLocaleString("vi-VN")}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="card" style={{ marginTop: 14 }}>
          <div className="card-head">
            <h4>Nhiệm vụ</h4>
          </div>
          {epics.length === 0 ? (
            <div className="empty-hint">Chưa có nhiệm vụ nào — sẽ được tạo khi mục tiêu chuyển sang Đang chạy.</div>
          ) : (
            epics.map((epic) => <EpicBlock key={epic.epicId} epic={epic} goal={goal} />)
          )}
        </div>
      </>
    );
  })();

  return (
    <div className="comp">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          showSearchBox={false}
          promoTitle="Nâng cấp Premium"
          promoText="Mở khoá toàn bộ Học viện AI, CKOS và AI Workspace."
          activeHtmlFile="Companion.html"
          companionExpanded
          useTopbarRightWrapper={false}
        >
          <div className="content">
            <div className="center-col">
              <div className="breadcrumb-row">
                <a onClick={() => go("/v2/companion")}>Companion AI</a>
                <span className="sep">/</span>
                <a onClick={() => go("/v2/muc-tieu")}>Bảng Mục tiêu</a>
                <span className="sep">/</span>
                <span className="current">{goal?.title ?? "Chi tiết"}</span>
              </div>
              {body}
            </div>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
