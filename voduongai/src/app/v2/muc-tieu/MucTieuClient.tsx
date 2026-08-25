"use client";

/* =============================================================================
 * Bảng Mục tiêu 2.0 — `/v2/muc-tieu` (task #61).
 *
 * Founder yêu cầu (Giai đoạn 2 rework): "Mục tiêu hiện tại" ở `/v2/companion`
 * không được liên kết qua trang portal 1.0 (`/portal/goals`) — thay vào đó
 * tích hợp "Bảng Mục tiêu" lên portal 2.0, thiết kế lại theo phong cách 2.0.
 *
 * Tái dùng NGUYÊN VẸN `goal-runtime.ts` (Phase 40, Supabase-backed thật theo
 * đúng `member_id` đăng nhập) — không viết lại tầng dữ liệu, chỉ thiết kế lại
 * UI. Hành vi 100% khớp `GoalRuntimeBoard.tsx`/`GoalCreateForm.tsx` (1.0):
 * `hydrateGoalRuntime()` trước khi đọc, `seedLandingPageProductionGoal()`
 * idempotent, `createGoalDraft()` cho form tạo mới (inline, không tách route
 * `/moi` riêng — giảm 1 lượt điều hướng, cùng dữ liệu/logic).
 *
 * Trang tự chứa sidebar/topbar riêng (như `companion`/`hoc-vien-ai`) —
 * KHÔNG có mockup Claude Design gốc cho trang này nên không áp dụng "6 điều
 * chỉnh kỹ thuật" của các trang chuyển 1:1 — chỉ tái dùng token/class có sẵn
 * của `companion.css` (cùng họ Companion) qua `<div className="comp">`.
 */

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import {
  listGoals,
  getGoalProgress,
  seedLandingPageProductionGoal,
  computeGoalDashboardSummary,
  hydrateGoalRuntime,
  createGoalDraft,
  type GoalRecord,
  type GoalPriority,
} from "@/lib/portal/foundation/goal-runtime";

import "../companion/companion.css";
import "./muc-tieu.css";

const STATUS_LABEL: Record<GoalRecord["status"], string> = {
  draft: "Bản nháp",
  ready_for_analysis: "Đang phân tích",
  active: "Đang chạy",
  completed: "Hoàn thành",
  archived: "Lưu trữ",
};

const PRIORITY_LABEL: Record<GoalPriority, string> = { low: "Thấp", medium: "Trung bình", high: "Cao" };

export function MucTieuClient({ premium }: { premium: PremiumStatus }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [goals, setGoals] = useState<GoalRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      await hydrateGoalRuntime();
      seedLandingPageProductionGoal();
      setGoals(listGoals());
      setReady(true);
    })();
  }, []);

  const summary = computeGoalDashboardSummary();

  function go(htmlOrPath: string) {
    if (htmlOrPath.startsWith("/")) router.push(htmlOrPath);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Tiêu đề mục tiêu là bắt buộc.");
      return;
    }
    const goal = createGoalDraft({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    });
    router.push(`/v2/muc-tieu/${goal.goalId}`);
  }

  return (
    <div className="comp">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          showSearchBox={false}
          promoTitle="Nâng cấp Premium"
          promoText="Mở khoá toàn bộ Học viện AI và CKOS."
          activeHtmlFile="Companion.html"
          companionExpanded
          useTopbarRightWrapper={false}
        >
          <div className="content">
            <div className="center-col">
              <div className="page-head">
                <div>
                  <div className="breadcrumb-row">
                    <a onClick={() => go("/v2/companion")}>Companion AI</a>
                    <span className="sep">/</span>
                    <span className="current">Bảng Mục tiêu</span>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>Mục tiêu của bạn</h2>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                    Mỗi mục tiêu là 1 hành trình riêng: Bản nháp → Đang phân tích → Đang chạy → Hoàn thành.
                  </p>
                </div>
                <button type="button" className="btn-violet" onClick={() => setShowForm((v) => !v)}>
                  {showForm ? "Đóng" : "+ Tạo mục tiêu mới"}
                </button>
              </div>

              <div className="summary-grid">
                <div className="summary-tile">
                  <div className="num">{summary.total}</div>
                  <div className="lbl">Tổng mục tiêu</div>
                </div>
                <div className="summary-tile">
                  <div className="num">{summary.draft}</div>
                  <div className="lbl">Bản nháp</div>
                </div>
                <div className="summary-tile">
                  <div className="num">{summary.running}</div>
                  <div className="lbl">Đang chạy</div>
                </div>
                <div className="summary-tile">
                  <div className="num">{summary.completed}</div>
                  <div className="lbl">Hoàn thành</div>
                </div>
                <div className="summary-tile">
                  <div className="num">{summary.archived}</div>
                  <div className="lbl">Lưu trữ</div>
                </div>
              </div>

              {showForm ? (
                <div className="card" style={{ marginTop: 16 }}>
                  <div className="card-head">
                    <h4>Tạo mục tiêu mới</h4>
                  </div>
                  <form onSubmit={handleSubmit} className="goal-form">
                    <div>
                      <label>Tiêu đề mục tiêu *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Vd: Ra mắt kênh YouTube dạy AI"
                      />
                    </div>
                    <div>
                      <label>Mô tả (tuỳ chọn)</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                    </div>
                    <div className="goal-form-row">
                      <div>
                        <label>Mức ưu tiên</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value as GoalPriority)}>
                          <option value="low">Thấp</option>
                          <option value="medium">Trung bình</option>
                          <option value="high">Cao</option>
                        </select>
                      </div>
                      <div>
                        <label>Hạn hoàn thành (tuỳ chọn)</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                      </div>
                    </div>
                    {error ? <p style={{ color: "#d6336c", fontSize: 12.5, fontWeight: 700 }}>{error}</p> : null}
                    <div className="goal-form-actions">
                      <button type="submit" className="btn-violet">
                        Tạo mục tiêu
                      </button>
                      <button type="button" className="btn-text" onClick={() => setShowForm(false)}>
                        Huỷ
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              <div className="goal-list" style={{ marginTop: 18 }}>
                {!ready ? (
                  <div className="empty-hint">Đang tải mục tiêu của bạn…</div>
                ) : goals.length === 0 ? (
                  <div className="empty-hint">Chưa có mục tiêu nào — bấm &quot;+ Tạo mục tiêu mới&quot; để bắt đầu.</div>
                ) : (
                  goals.map((goal) => {
                    const progress = getGoalProgress(goal.goalId);
                    return (
                      <a key={goal.goalId} className="goal-item" onClick={() => go(`/v2/muc-tieu/${goal.goalId}`)}>
                        <div className="goal-item-head">
                          <h3>{goal.title}</h3>
                          <span className={`status-pill ${goal.status}`}>{STATUS_LABEL[goal.status]}</span>
                        </div>
                        {goal.description ? (
                          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>{goal.description}</p>
                        ) : null}
                        <div className="goal-item-meta">
                          {goal.priority ? (
                            <span>
                              Ưu tiên: <b>{PRIORITY_LABEL[goal.priority] ?? goal.priority}</b>
                            </span>
                          ) : null}
                          <span>
                            Tiến độ: <b>{progress}%</b>
                          </span>
                          {goal.dueDate ? (
                            <span>
                              Hạn: <b>{goal.dueDate}</b>
                            </span>
                          ) : null}
                          <span>Tạo lúc: {new Date(goal.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="goal-progress-track" style={{ marginTop: 10 }}>
                          <div className="goal-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
