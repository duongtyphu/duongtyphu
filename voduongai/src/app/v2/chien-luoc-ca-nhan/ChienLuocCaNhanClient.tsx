"use client";

/* =============================================================================
 * Chiến lược cá nhân 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/Chien luoc ca nhan.html`.
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh:
 *
 *  1. "goal-grid" (4 thẻ mục tiêu) — dữ liệu THẬT từ `goal-runtime.ts`
 *     (`listGoals()`/`getGoalProgress()`, cùng nguồn `/portal/goals` đã
 *     dùng ở `/v2/companion`/`/v2/bo-nho-ca-nhan-hoa`). `GoalRecord` có sẵn
 *     `dueDate`/`priority`/`status` thật — dùng đúng, không bịa. Badge
 *     trạng thái map `status==="active"` → "Đang thực hiện" (tím), còn lại
 *     → "Lên kế hoạch" (xám) — khớp đúng 2 biến thể màu bản thiết kế có
 *     sẵn, không tự thêm màu mới.
 *  2. "Lộ trình chiến lược tổng thể" (timeline 5 giai đoạn theo quý),
 *     "Bản đồ chiến lược" (vision-map 5 nhánh), "Kế hoạch hành động ưu
 *     tiên" (bảng action item), "Nguyên tắc chiến lược của tôi", "Ghi chú
 *     nhanh" — bản thiết kế minh hoạ bằng 1 kịch bản chiến lược kinh doanh
 *     CỤ THỂ (KOL, ebook, workshop, landing page khoá học...) — KHÔNG có hệ
 *     thống lập kế hoạch/roadmap/ghi chú chiến lược nào trong dự án (khác
 *     Goal Runtime — đó chỉ là goal/epic/mission, không có các khái niệm
 *     "giai đoạn theo quý"/"bản đồ tầm nhìn"/"nguyên tắc"/"ghi chú"). Xây
 *     mới toàn bộ hệ thống này là 1 tính năng lớn, ngoài phạm vi "chuyển 1:1
 *     trang + nối dữ liệu có sẵn" — hiện trạng thái rỗng trung thực cho cả
 *     5 khối, không bịa nội dung minh hoạ.
 *  3. "Tiến độ tổng thể" (donut 51%/29%/20%) — tính THẬT từ tỉ lệ trạng thái
 *     goal thật (`completed`/`active`/còn lại) thay vì số cố định.
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { GoalRecord } from "@/lib/portal/foundation/goal-runtime";
import { getGoalProgress, listGoals } from "@/lib/portal/foundation/goal-runtime";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import "../inter-gf.css";
import "./chien-luoc-ca-nhan.css";

const GOAL_STYLE = [
  { bg: "linear-gradient(145deg,#b18bff,#7c3aed)", icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r=".5" fill="#fff" /></> },
  { bg: "linear-gradient(145deg,#3ecf7e,#189a52)", icon: <path d="M4 19h16M7 15l3-4 3 3 5-7" /> },
  { bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)", icon: <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" /> },
  { bg: "linear-gradient(145deg,#ff9d52,#c2660a)", icon: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="3" /><path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" /></> },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function ChienLuocCaNhanClient({ premium }: { premium: PremiumStatus }) {
  const router = useRouter();
  const go = (path: string) => router.push(path);

  const [goals, setGoals] = useState<GoalRecord[]>([]);
  useEffect(() => {
    // Đọc localStorage chỉ có ở client sau mount (cùng pattern các trang Companion khác).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoals(listGoals());
  }, []);

  const completed = goals.filter((g) => g.status === "completed").length;
  const active = goals.filter((g) => g.status === "active").length;
  const other = goals.length - completed - active;
  const pct = (n: number) => (goals.length > 0 ? Math.round((n / goals.length) * 100) : 0);
  const donutStyle =
    goals.length > 0
      ? {
          background: `conic-gradient(var(--violet) 0% ${pct(completed)}%, var(--green) ${pct(completed)}% ${pct(completed) + pct(active)}%, var(--gold) ${pct(completed) + pct(active)}% 100%)`,
        }
      : { background: "var(--line)" };

  return (
    <div className="clc">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          useTopbarRightWrapper={false}
          promoText="Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện."
          activeHtmlFile="Chien luoc ca nhan.html"
          companionExpanded
          customSearch={
            <div className="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input type="text" placeholder="Tìm kiếm kiến thức, công cụ, prompt, bài học..." />
            </div>
          }
        >
          <div className="content">
            <div className="center-col">
              <div className="page-head">
                <div className="page-head-text">
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="12" cy="12" r=".5" fill="#fff" />
                    </svg>
                  </div>
                  <div>
                    <h1>Chiến lược cá nhân</h1>
                    <p>Xây dựng chiến lược rõ ràng, từng bước đạt mục tiêu và tạo ra giá trị bền vững.</p>
                  </div>
                </div>
                <button className="new-strategy-btn" onClick={() => go("/portal/goals/new")}>
                  + Tạo mục tiêu mới
                </button>
              </div>

              {goals.length === 0 ? (
                <div className="empty-hint">
                  Chưa có mục tiêu nào —{" "}
                  <a onClick={() => go("/portal/goals/new")} style={{ cursor: "pointer" }}>
                    tạo mục tiêu đầu tiên
                  </a>
                  .
                </div>
              ) : (
                <div className="goal-grid">
                  {goals.slice(0, 4).map((g, i) => {
                    const style = GOAL_STYLE[i % GOAL_STYLE.length];
                    const goalPct = getGoalProgress(g.goalId);
                    const isActive = g.status === "active";
                    return (
                      <div className="goal-card" key={g.goalId}>
                        <div className="ico" style={{ background: style.bg }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                            {style.icon}
                          </svg>
                        </div>
                        <h5>{g.title}</h5>
                        <div className="goal-pct">{goalPct}%</div>
                        <div className="goal-track">
                          <div className="goal-fill" style={{ width: `${goalPct}%` }} />
                        </div>
                        <div className="goal-foot">
                          <span>{g.dueDate ? `Hạn: ${formatDate(g.dueDate)}` : "Chưa đặt hạn"}</span>
                          <span
                            className="goal-status"
                            style={
                              isActive
                                ? { background: "var(--violet-light)", color: "var(--violet-dark)" }
                                : { background: "#eef1f8", color: "var(--muted)" }
                            }
                          >
                            {isActive ? "Đang thực hiện" : "Lên kế hoạch"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div>
                <div className="section-head">
                  <div className="section-title">Lộ trình chiến lược tổng thể</div>
                </div>
                <div className="timeline">
                  <div className="empty-hint">Chưa có tính năng lập lộ trình theo giai đoạn — sẽ cập nhật khi có.</div>
                </div>
              </div>

              <div className="map-plan-row">
                <div className="map-card">
                  <div className="empty-hint">Chưa có tính năng bản đồ chiến lược.</div>
                </div>
                <div className="plan-card">
                  <div className="card-head">
                    <h4>Kế hoạch hành động ưu tiên</h4>
                  </div>
                  <div className="empty-hint">Chưa có tính năng kế hoạch hành động chi tiết — sẽ cập nhật khi có.</div>
                </div>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Tiến độ tổng thể</h4>
                </div>
                <div className="donut-wrap">
                  <div className="donut" style={donutStyle}>
                    <div className="donut-inner">
                      <div className="pct">{pct(completed)}%</div>
                      <div className="lbl">Hoàn thành</div>
                    </div>
                  </div>
                  {goals.length === 0 ? (
                    <div className="empty-hint">Chưa có mục tiêu nào.</div>
                  ) : (
                    <div className="legend">
                      <div className="legend-row">
                        <span>
                          <span className="dot" style={{ background: "var(--violet)" }} />
                          Hoàn thành
                        </span>
                        <b>{pct(completed)}%</b>
                      </div>
                      <div className="legend-row">
                        <span>
                          <span className="dot" style={{ background: "var(--green)" }} />
                          Đang thực hiện
                        </span>
                        <b>{pct(active)}%</b>
                      </div>
                      <div className="legend-row">
                        <span>
                          <span className="dot" style={{ background: "var(--gold)" }} />
                          Khác
                        </span>
                        <b>{pct(other)}%</b>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Nguyên tắc chiến lược của tôi</h4>
                </div>
                <div className="empty-hint">Chưa có tính năng lưu nguyên tắc cá nhân — sẽ cập nhật khi có.</div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Nguồn lực chiến lược</h4>
                </div>
                <div className="resource-row" onClick={() => go("/v2/he-tri-thuc")}>
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                    </svg>
                  </div>
                  <div>
                    Kho tri thức AI
                    <div className="sub">Tài liệu, công cụ, prompt</div>
                  </div>
                </div>
                <div className="resource-row" onClick={() => go("/v2/cong-dong-ai")}>
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="8" cy="8" r="3" />
                      <circle cx="17" cy="9" r="3" />
                      <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
                    </svg>
                  </div>
                  <div>Cộng đồng AI</div>
                </div>
                <div className="resource-row" onClick={() => go("/v2/companion")}>
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  </div>
                  <div>Companion AI</div>
                </div>
              </div>

              <div className="card note-card">
                <div className="card-head">
                  <h4>Ghi chú nhanh</h4>
                </div>
                <div className="empty-hint">Chưa có tính năng ghi chú chiến lược — sẽ cập nhật khi có.</div>
              </div>
            </aside>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
