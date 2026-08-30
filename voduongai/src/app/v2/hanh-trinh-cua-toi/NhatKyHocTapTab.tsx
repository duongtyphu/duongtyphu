"use client";

/* =============================================================================
 * NhatKyHocTapTab — tab "Nhật ký học tập" bên trong `/v2/hanh-trinh-cua-toi`
 * (Giai đoạn 8, gộp 3 trang). PORT nội dung từ `NhatKyHocTapClient.tsx`
 * (route `/v2/nhat-ky-hoc-tap` đã xoá — xem CLAUDE.md) — bỏ khung
 * `PortalV2Shell`/`.app` (trang cha `HanhTrinhCuaToiClient` đã có sẵn 1
 * shell duy nhất, không lồng 2 shell).
 *
 * ĐIỀU CHỈNH LAYOUT (Founder yêu cầu sau khi xem trước) — bản gốc 2 cột
 * (center-col 1fr + right-col 300px) chỉ hợp với 1 TRANG RIÊNG đủ rộng;
 * khi nhúng làm 1 tab bên trong trang khác, cột phải 300px bị bóp méo/mất
 * chữ. Đổi sang 1 CỘT DUY NHẤT full-width, dùng lưới linh hoạt cho các thẻ
 * phụ thay vì cột 300px cố định. Bỏ thẻ "Chuỗi ngày học tập" (trùng lặp
 * 100% với thẻ cùng tên ở tab "Hành trình của tôi" — cùng ý nghĩa số ngày
 * liên tục, đúng quyền tự dọn nội dung dư thừa Founder đã cấp cho phạm vi
 * trang này) — 3 thẻ còn lại (Thời gian học trong tuần/Ghi chú nổi bật/
 * Tài liệu & liên kết gần đây) không trùng ý nghĩa, giữ nguyên, chỉ đổi vị
 * trí xuống dưới `.log-list`, xếp lưới 3 cột full-width.
 * ========================================================================== */

import { useState } from "react";

import type { LearningLogData, LearningLogEntry } from "@/lib/portal/live-learning-log";

import "./nhat-ky-hoc-tap-tab.css";

function formatMinutes(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0m";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Hôm qua";
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

const ENTRY_ICON: Record<LearningLogEntry["kind"], { bg: string; path: string; label: string }> = {
  lesson: { bg: "linear-gradient(145deg,#a08bff,#6d4aff)", path: "M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z", label: "Học viện AI" },
  reflection: { bg: "linear-gradient(145deg,#e2b23c,#a9660f)", path: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z", label: "Chiêm nghiệm" },
  capsule: { bg: "linear-gradient(145deg,#e879b9,#b4348a)", path: "M6 3h12v18l-6-4-6 4z", label: "Ghi chú" },
};

const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function NhatKyHocTapTab({ log }: { log: LearningLogData }) {
  const [activeFilter, setActiveFilter] = useState(0);
  const [activeView, setActiveView] = useState(0);

  const { stats, entries, todayEntries, weekChart, weekTotalMinutes, calendar, featuredNote, recentDocuments } = log;
  const today = new Date();
  const todayLabel = today.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const maxWeekMinutes = Math.max(...weekChart.map((d) => d.minutes), 1);

  return (
    <div className="nkt">
      <div className="content-single">
        <div className="page-head">
            <div>
              <h1>Nhật ký học tập</h1>
              <p>Ghi lại hành trình học tập mỗi ngày. Học – Thực hành – Chiêm nghiệm – Tiến bộ.</p>
            </div>
            <button className="new-note-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Ghi chú mới
            </button>
          </div>

          <div className="stat-row">
            <div className="stat-box">
              <div className="ico" style={{ background: "linear-gradient(145deg,#a08bff,#6d4aff)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <div className="num">{formatMinutes(stats.minutesToday)}</div>
              <div className="lbl">Thời gian học hôm nay</div>
            </div>
            <div className="stat-box">
              <div className="ico" style={{ background: "linear-gradient(145deg,#3ecf7e,#189a52)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                </svg>
              </div>
              <div className="num">{stats.lessonsCompletedTotal}</div>
              <div className="lbl">Bài học đã hoàn thành</div>
            </div>
            <div className="stat-box">
              <div className="ico" style={{ background: "linear-gradient(145deg,#ff6b45,#c2340a)" }}>
                <svg viewBox="0 0 24 24" fill="#fff" stroke="none">
                  <path d="M12 2.5c2.4 1.8 3.8 4.6 3.8 8.3 0 2-.5 3.8-1.3 5.3l-2.5 2.4-2.5-2.4c-.8-1.5-1.3-3.3-1.3-5.3 0-3.7 1.4-6.5 3.8-8.3z" />
                </svg>
              </div>
              <div className="num">{stats.streakDays} ngày</div>
              <div className="lbl">Ngày học liên tục</div>
              {stats.streakDays > 0 ? <div className="sub">Đang duy trì 🔥</div> : null}
            </div>
            <div className="stat-box">
              <div className="ico" style={{ background: "linear-gradient(145deg,#5f8fff,#1d5fd8)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
                </svg>
              </div>
              <div className="num">—</div>
              <div className="lbl">Điểm kinh nghiệm</div>
              <div className="sub" style={{ color: "var(--muted)" }}>
                Chưa có hệ thống tính điểm
              </div>
            </div>
            <div className="stat-box">
              <div className="ico" style={{ background: "linear-gradient(145deg,#e879b9,#b4348a)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                </svg>
              </div>
              <div className="num">{stats.notesCount}</div>
              <div className="lbl">Ghi chú & chiêm nghiệm</div>
            </div>
          </div>

          <div className="two-col">
            <div className="card">
              <div className="card-head">
                <h4>Lịch học</h4>
              </div>
              <div className="cal-nav">
                <button aria-label="Tháng trước">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <span>{calendar.monthLabel}</span>
                <button aria-label="Tháng sau">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <div className="cal-grid">
                {WEEK_LABELS.map((d) => (
                  <div className="dow" key={d}>
                    {d}
                  </div>
                ))}
                {calendar.days.map((d, i) => (
                  <div
                    key={`${d.day}-${i}`}
                    className={
                      !d.inMonth ? "cal-day muted" : d.isToday ? "cal-day today" : d.done ? "cal-day done" : "cal-day"
                    }
                  >
                    {d.day}
                  </div>
                ))}
              </div>
              <div className="cal-legend">
                <span>
                  <span className="dot" style={{ background: "#189a52" }}></span>Đã học
                </span>
                <span>
                  <span className="dot" style={{ background: "var(--violet)" }}></span>Hôm nay
                </span>
                <span>
                  <span className="dot" style={{ background: "#c7c2df" }}></span>Chưa học
                </span>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <h4>Hôm nay, {todayLabel}</h4>
                <a href="#">Xem tất cả →</a>
              </div>
              {todayEntries.length === 0 ? (
                <div className="empty-hint">Chưa có hoạt động học tập nào hôm nay.</div>
              ) : (
                todayEntries.slice(0, 4).map((e) => {
                  const icon = ENTRY_ICON[e.kind];
                  return (
                    <div className="today-row" key={e.id}>
                      <span className="time">{formatTime(e.occurredAt)}</span>
                      <div className="ico" style={{ background: icon.bg }}>
                        <svg viewBox="0 0 24 24" fill={e.kind === "reflection" ? "#fff" : "none"} stroke="#fff" strokeWidth="2">
                          <path d={icon.path} />
                        </svg>
                      </div>
                      <div className="info">
                        <h6>{e.title}</h6>
                        <span>{icon.label}</span>
                      </div>
                      <div className="status done">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="filter-toolbar">
            {["Tất cả", "Bài học", "Thực hành", "Chiêm nghiệm", "Tài liệu", "Ý tưởng"].map((label, i) => (
              <button
                key={label}
                className={i === activeFilter ? "f-tab active" : "f-tab"}
                onClick={() => setActiveFilter(i)}
              >
                {label}
              </button>
            ))}
            <div className="filter-right">
              <div className="cat-select">
                Tất cả danh mục
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <div className="view-toggle">
                <button className={activeView === 0 ? "active" : ""} onClick={() => setActiveView(0)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </button>
                <button className={activeView === 1 ? "active" : ""} onClick={() => setActiveView(1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="log-list">
            {entries.length === 0 ? (
              <div className="empty-hint">Chưa có nhật ký nào — hoàn thành bài học hoặc viết chiêm nghiệm để bắt đầu.</div>
            ) : (
              entries.slice(0, 6).map((e) => {
                const icon = ENTRY_ICON[e.kind];
                return (
                  <div className="log-row" key={e.id}>
                    <div className="ico" style={{ background: icon.bg }}>
                      <svg viewBox="0 0 24 24" fill={e.kind === "reflection" ? "#fff" : "none"} stroke="#fff" strokeWidth="2">
                        <path d={icon.path} />
                      </svg>
                    </div>
                    <div className="info">
                      <h6>{e.title}</h6>
                      <div className="log-tags">
                        <span className="log-tag" style={{ background: "var(--violet-light)", color: "var(--violet)" }}>
                          {icon.label}
                        </span>
                      </div>
                    </div>
                    <span className="time">{formatRelativeTime(e.occurredAt)}</span>
                    <button className="bm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 3h12v18l-6-4-6 4z" />
                      </svg>
                    </button>
                    <button className="more">⋯</button>
                  </div>
                );
              })
            )}
        </div>

        <div className="secondary-grid">
          <div className="card">
            <div className="card-head">
              <h4>Thời gian học trong tuần</h4>
            </div>
            <div className="week-total">{formatMinutes(weekTotalMinutes)}</div>
            <div className="week-chart">
              {weekChart.map((d) => (
                <div className="week-bar-col" key={d.label}>
                  <div
                    className="week-bar"
                    style={{
                      height: `${Math.max((d.minutes / maxWeekMinutes) * 100, d.minutes > 0 ? 8 : 2)}%`,
                      background: d.isToday ? "var(--violet)" : d.minutes > 0 ? "var(--violet)" : "var(--line)",
                    }}
                  ></div>
                  <span>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h4>Ghi chú nổi bật</h4>
            </div>
            {featuredNote ? (
              <>
                <div className="quote-card">
                  <div className="quote-star">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                    </svg>
                  </div>
                  <p>&quot;{featuredNote.text}&quot;</p>
                  <div className="author">- {featuredNote.authorName}</div>
                </div>
                <div className="dots-row">
                  <span className="active"></span>
                </div>
              </>
            ) : (
              <div className="empty-hint">Chưa có ghi chú nào — viết chiêm nghiệm đầu tiên để lưu lại đây.</div>
            )}
          </div>

          <div className="card">
            <div className="card-head">
              <h4>Tài liệu & liên kết gần đây</h4>
              <a href="/v2/hoc-vien-ai">Xem tất cả →</a>
            </div>
            {recentDocuments.length === 0 ? (
              <div className="empty-hint">Chưa có tài liệu nào.</div>
            ) : (
              recentDocuments.map((doc) => (
                <div className="doc-row2" key={doc.id}>
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                    </svg>
                  </div>
                  <div className="info">
                    <h6>{doc.title}</h6>
                  </div>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 21h16" />
                    </svg>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
