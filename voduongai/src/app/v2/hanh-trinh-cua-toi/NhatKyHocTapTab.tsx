"use client";

/* =============================================================================
 * NhatKyHocTapTab — tab "Nhật ký học tập" bên trong `/v2/hanh-trinh-cua-toi`.
 *
 * GIAI ĐOẠN 10 (Founder yêu cầu thiết kế lại hoàn toàn — "không đơn điệu,
 * đơn giản, rẻ tiền", sáng tạo lên đặc biệt ở các ô) — bố cục bento-grid
 * bất đối xứng trên nền đen, thay hẳn dashboard thẻ trắng cũ: hero chuỗi
 * ngày có ngọn lửa, 3 chỉ số đếm dạng vòng tròn trang trí (không fill %
 * giả — các field này là SỐ ĐẾM tuyệt đối, không phải %, nên vòng tròn
 * luôn để trống, chỉ đóng vai trò khung trang trí trung thực), lịch dạng
 * ô vuông, hoạt động hôm nay dạng timeline có mốc nối, biểu đồ tuần dạng
 * đường sóng vẽ đúng theo `weekChart` thật. Danh sách nhật ký + bộ lọc +
 * chuyển view GIỮ NGUYÊN chức năng thật đã có (không rút gọn tính năng).
 * Mọi field vẫn đúng 100% `LearningLogData`, không bịa thêm.
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

const ENTRY_ICON: Record<LearningLogEntry["kind"], { bg: string; color: string; path: string; fill: boolean; label: string }> = {
  lesson: { bg: "rgba(96,165,250,.14)", color: "#93C5FD", path: "M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z", fill: false, label: "Học viện AI" },
  reflection: { bg: "rgba(251,191,36,.14)", color: "#FDE29B", path: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z", fill: true, label: "Chiêm nghiệm" },
  capsule: { bg: "rgba(244,114,182,.14)", color: "#F9A8D4", path: "M6 3h12v18l-6-4-6 4z", fill: true, label: "Ghi chú" },
};

const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const FILTERS = ["Tất cả", "Bài học", "Thực hành", "Chiêm nghiệm", "Tài liệu", "Ý tưởng"];

export function NhatKyHocTapTab({ log }: { log: LearningLogData }) {
  const [activeFilter, setActiveFilter] = useState(0);
  const [activeView, setActiveView] = useState(0);

  const { stats, entries, todayEntries, weekChart, weekTotalMinutes, calendar, featuredNote, recentDocuments } = log;
  const todayLabel = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const maxWeekMinutes = Math.max(...weekChart.map((d) => d.minutes), 1);

  const wavePoints = weekChart.map((d, i) => {
    const x = (i / Math.max(weekChart.length - 1, 1)) * 700;
    const y = 82 - (d.minutes / maxWeekMinutes) * 66;
    return { x, y };
  });
  const waveLine = wavePoints.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ");
  const waveFill = `M0 82 L ${waveLine} V90 H0Z`;
  const lastPoint = wavePoints[wavePoints.length - 1];

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      <div className="absolute inset-0 z-0" style={{ background: "#08090D" }} aria-hidden />
      <div
        className="jn-lamp absolute pointer-events-none"
        style={{ top: -160, right: -80, width: 640, height: 640, background: "radial-gradient(circle, rgba(96,165,250,.14), transparent 65%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(1000px circle at 85% -8%, rgba(30,73,118,.3), transparent 60%)" }}
        aria-hidden
      />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-.01em" }}>Nhật ký học tập</h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.5)", margin: 0 }}>Ghi lại hành trình học tập mỗi ngày. Học – Thực hành – Chiêm nghiệm – Tiến bộ.</p>
            </div>
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg,#60A5FA,#3B82F6)",
                color: "#06131F",
                border: "none",
                borderRadius: 999,
                padding: "13px 22px",
                fontSize: 13.5,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 10px 24px -8px rgba(59,130,246,.55)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#06131F" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
              Ghi chú mới
            </button>
          </div>

          {/* Dải chỉ số */}
          <div className="jn-stat-row" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 16 }}>
            <div className="jn-card" style={{ padding: 22, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "linear-gradient(160deg,#1A130A,#0F1116)" }}>
              <svg className="jn-flame" width="34" height="42" viewBox="0 0 46 56" style={{ marginBottom: 8 }}>
                <path
                  d="M23 2C10 18 6 28 6 36c0 11 8 18 17 18s17-7 17-18c0-6-3-13-8-19 1 6-2 10-5 10 2-8-2-16-4-25z"
                  fill="url(#jnFlameGrad)"
                />
                <defs>
                  <linearGradient id="jnFlameGrad" x1="0" y1="0" x2="0" y2="56">
                    <stop offset="0" stopColor="#FDBA74" />
                    <stop offset="1" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{stats.streakDays}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.45)", marginTop: 6 }}>ngày liên tục</div>
            </div>

            <StatRing glow="rgba(96,165,250,.15)" value={formatMinutes(stats.minutesToday)} label="Thời gian học hôm nay" />
            <StatRing glow="rgba(74,222,128,.15)" value={String(stats.lessonsCompletedTotal)} label="Bài học đã hoàn thành" />
            <StatRing glow="rgba(255,255,255,.06)" value="—" label="Điểm kinh nghiệm (chưa có hệ tính điểm)" dashed />
            <StatRing glow="rgba(251,191,36,.15)" value={String(stats.notesCount)} label="Ghi chú & chiêm nghiệm" />
          </div>

          <div className="jn-bento-2col" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Lịch học */}
            <div className="jn-card" style={{ padding: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>Lịch học — {calendar.monthLabel}</h3>
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" aria-label="Tháng trước" style={{ background: "rgba(255,255,255,.05)", border: "none", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
                  </button>
                  <button type="button" aria-label="Tháng sau" style={{ background: "rgba(255,255,255,.05)", border: "none", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, fontSize: 10.5, color: "rgba(255,255,255,.4)", textAlign: "center", marginBottom: 10 }}>
                {WEEK_LABELS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 }}>
                {calendar.days.map((d, i) => (
                  <span
                    key={`${d.day}-${i}`}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: d.isToday ? 800 : 400,
                      color: !d.inMonth ? "rgba(255,255,255,.2)" : d.isToday ? "#fff" : d.done ? "#93C5FD" : "rgba(255,255,255,.7)",
                      background: d.isToday
                        ? "linear-gradient(135deg,#60A5FA,#3B82F6)"
                        : d.done
                          ? "rgba(96,165,250,.12)"
                          : "rgba(255,255,255,.03)",
                      boxShadow: d.isToday ? "0 4px 14px -2px rgba(59,130,246,.5)" : undefined,
                    }}
                  >
                    {d.day}
                  </span>
                ))}
              </div>
            </div>

            {/* Hôm nay — timeline */}
            <div className="jn-card" style={{ padding: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>Hôm nay, {todayLabel}</h3>
                <a href="#" style={{ fontSize: 11.5, fontWeight: 700 }}>
                  Tất cả →
                </a>
              </div>
              {todayEntries.length === 0 ? (
                <div style={{ position: "relative", paddingLeft: 18 }}>
                  <span style={{ position: "absolute", left: 3, top: 2, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,.2)", border: "2px solid #0F1116" }} />
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.4)", fontStyle: "italic" }}>Chưa có hoạt động học tập nào hôm nay.</div>
                </div>
              ) : (
                <div style={{ position: "relative", paddingLeft: 18 }}>
                  <div style={{ position: "absolute", left: 3, top: 4, bottom: 4, width: 1, background: "rgba(255,255,255,.1)" }} />
                  {todayEntries.slice(0, 4).map((e) => {
                    const icon = ENTRY_ICON[e.kind];
                    return (
                      <div key={e.id} style={{ position: "relative", paddingBottom: 16 }}>
                        <span style={{ position: "absolute", left: -18, top: 2, width: 8, height: 8, borderRadius: "50%", background: icon.color, border: "2px solid #0F1116" }} />
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 2 }}>{formatTime(e.occurredAt)} · {icon.label}</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{e.title}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bộ lọc + danh sách nhật ký thật */}
          <div className="jn-card" style={{ padding: 26, marginBottom: 16 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {FILTERS.map((label, i) => (
                  <button key={label} type="button" className={i === activeFilter ? "jn-filter-chip active" : "jn-filter-chip"} onClick={() => setActiveFilter(i)}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,.04)", borderRadius: 10, padding: 2 }}>
                <button type="button" className={activeView === 0 ? "jn-view-btn active" : "jn-view-btn"} onClick={() => setActiveView(0)} aria-label="Dạng lưới">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </button>
                <button type="button" className={activeView === 1 ? "jn-view-btn active" : "jn-view-btn"} onClick={() => setActiveView(1)} aria-label="Dạng danh sách">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {entries.length === 0 ? (
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.4)", fontStyle: "italic" }}>Chưa có nhật ký nào — hoàn thành bài học hoặc viết chiêm nghiệm để bắt đầu.</div>
            ) : (
              <div style={activeView === 0 ? { display: "grid", gridTemplateColumns: "repeat(2,1fr)", columnGap: 24 } : undefined}>
                {entries.slice(0, 6).map((e) => {
                  const icon = ENTRY_ICON[e.kind];
                  return (
                    <div className="jn-log-row" key={e.id}>
                      <div className="ico" style={{ background: icon.bg, color: icon.color }}>
                        <svg viewBox="0 0 24 24" fill={icon.fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d={icon.path} />
                        </svg>
                      </div>
                      <div className="info">
                        <h6>{e.title}</h6>
                        <span className="tag">{icon.label}</span>
                      </div>
                      <span className="time">{formatRelativeTime(e.occurredAt)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="jn-bento-2col" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Thời gian học trong tuần — sóng */}
            <div className="jn-card" style={{ padding: 26 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>Thời gian học trong tuần</h3>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 14 }}>
                {formatMinutes(weekTotalMinutes)}
              </div>
              <svg width="100%" height="90" viewBox="0 0 700 90" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="jnWaveFill" x1="0" y1="0" x2="0" y2="90">
                    <stop offset="0" stopColor="#60A5FA" stopOpacity=".25" />
                    <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M ${waveLine}`} fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                <path d={waveFill} fill="url(#jnWaveFill)" />
                {lastPoint ? <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#93C5FD" /> : null}
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 6 }}>
                {weekChart.map((d) => (
                  <span key={d.label}>{d.label}</span>
                ))}
              </div>
            </div>

            {/* Ghi chú nổi bật */}
            <div className="jn-card" style={{ padding: 26, display: "flex", flexDirection: "column" }}>
              <svg width="26" height="20" viewBox="0 0 24 24" fill="#60A5FA" opacity=".5" style={{ marginBottom: 10 }}>
                <path d="M7 7c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5zm10 0c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5z" />
              </svg>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Ghi chú nổi bật</h3>
              {featuredNote ? (
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,.75)", fontStyle: "italic", margin: "0 0 10px" }}>&quot;{featuredNote.text}&quot;</p>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.4)" }}>— {featuredNote.authorName}</div>
                </div>
              ) : (
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.4)", fontStyle: "italic", flex: 1 }}>Chưa có ghi chú nào — viết chiêm nghiệm đầu tiên để lưu lại đây.</div>
              )}
            </div>
          </div>

          {/* Tài liệu & liên kết */}
          <div className="jn-card" style={{ padding: 26 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>Tài liệu &amp; liên kết gần đây</h3>
              <a href="/v2/hoc-vien-ai" style={{ fontSize: 11.5, fontWeight: 700 }}>
                Tất cả →
              </a>
            </div>
            {recentDocuments.length === 0 ? (
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.4)", fontStyle: "italic" }}>Chưa có tài liệu nào.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
                {recentDocuments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: "10px 14px", textDecoration: "none" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                    </svg>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 1 ô chỉ số dạng vòng tròn trang trí — CÁC FIELD Ở ĐÂY LÀ SỐ ĐẾM TUYỆT
    ĐỐI (không phải %), nên vòng tròn luôn để trống (không fill cung màu
    giả) — chỉ đóng vai trò khung trang trí trung thực quanh con số thật. */
function StatRing({ glow, value, label, dashed }: { glow: string; value: string; label: string; dashed?: boolean }) {
  return (
    <div className="jn-card" style={{ padding: 22, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <svg width="66" height="66" viewBox="0 0 76 76" style={{ marginBottom: 8 }}>
        <circle cx="38" cy="38" r="32" fill="none" stroke={glow} strokeWidth="7" strokeDasharray={dashed ? "3 5" : undefined} />
        <text x="38" y="44" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">
          {value}
        </text>
      </svg>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)" }}>{label}</div>
    </div>
  );
}
