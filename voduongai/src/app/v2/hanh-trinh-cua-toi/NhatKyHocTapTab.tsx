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

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

const ENTRY_ICON: Record<LearningLogEntry["kind"], { bg: string; color: string; path: string; fill: boolean; label: string }> = {
  lesson: { bg: "rgba(96,165,250,.14)", color: "#93C5FD", path: "M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z", fill: false, label: "Học viện AI" },
  reflection: { bg: "rgba(251,191,36,.14)", color: "#FDE29B", path: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z", fill: true, label: "Chiêm nghiệm" },
  capsule: { bg: "rgba(244,114,182,.14)", color: "#F9A8D4", path: "M6 3h12v18l-6-4-6 4z", fill: true, label: "Ghi chú" },
};

const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function NhatKyHocTapTab({ log }: { log: LearningLogData }) {
  const { stats, todayEntries, weekChart, weekTotalMinutes, calendar, featuredNote } = log;
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
      {/* Founder yêu cầu (đợt sau, sau khi thấy ảnh chụp còn seam): KHÔNG
          "đắp" màu riêng lên khung giữa nữa — phải dùng CHUNG đúng 1 nguồn
          màu nền của cả trang. Base đổi từ literal `#0F3660` (trùng nhưng
          ĐỘC LẬP với `TAB_HEADER_BG` ở component cha) sang `var(--bg)` —
          biến CSS đã được `.htct` (component cha) override đúng theo tab
          đang mở, kế thừa tự nhiên xuống tới đây. Chỉ còn ĐÚNG 1 nơi định
          nghĩa màu (`TAB_HEADER_BG`), loại bỏ nguy cơ 2 nguồn lệch nhau.
          ĐÃ BỎ HẲN "chiều sâu, độ bóng" (2 lớp radial "ánh sáng gần đầu
          trang" + vignette `boxShadow` + glow góc `.jn-lamp` + lớp radial
          phụ) — Founder yêu cầu áp dụng cho cả 5 tab: chỉ giữ lại đúng
          màu nền gốc `var(--bg)`, không còn lớp hiệu ứng "chiều sâu" nào
          khác. Đây là bước cuối cùng của chuỗi sửa "lớp phủ dưới thanh
          tab" — vignette đã bỏ ở đợt trước không đủ, Founder muốn bỏ luôn
          cả phần glow còn lại. */}
      <div className="absolute inset-0 z-0" style={{ background: "var(--bg)" }} aria-hidden />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-.01em" }}>Nhật ký học tập</h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.5)", margin: 0 }}>Ghi lại hành trình học tập mỗi ngày. Học – Thực hành – Chiêm nghiệm – Tiến bộ.</p>
            </div>
            <button
              type="button"
              className="jn-cta-btn"
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

          {/* Dải chỉ số — Founder yêu cầu thu nhỏ lại cho vừa với kích thước
              trang giữa (padding/svg/font đều giảm so với bản trước). */}
          <div className="jn-stat-row" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 16 }}>
            <div className="jn-card" style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "linear-gradient(160deg, rgba(255,140,60,.10), rgba(255,255,255,.04))" }}>
              <svg className="jn-flame" width="26" height="32" viewBox="0 0 46 56" style={{ marginBottom: 6 }}>
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
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{stats.streakDays}</div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.45)", marginTop: 5 }}>ngày liên tục</div>
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
                  <button type="button" className="jn-icon-btn" aria-label="Tháng trước" style={{ background: "rgba(255,255,255,.05)", border: "none", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
                  </button>
                  <button type="button" className="jn-icon-btn" aria-label="Tháng sau" style={{ background: "rgba(255,255,255,.05)", border: "none", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
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
                <a href="#" className="jn-link" style={{ fontSize: 11.5, fontWeight: 700 }}>
                  Tất cả →
                </a>
              </div>
              {todayEntries.length === 0 ? (
                <div style={{ position: "relative", paddingLeft: 18 }}>
                  <span style={{ position: "absolute", left: 3, top: 2, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,.2)", border: "2px solid var(--bg)" }} />
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.4)", fontStyle: "italic" }}>Chưa có hoạt động học tập nào hôm nay.</div>
                </div>
              ) : (
                <div style={{ position: "relative", paddingLeft: 18 }}>
                  <div style={{ position: "absolute", left: 3, top: 4, bottom: 4, width: 1, background: "rgba(255,255,255,.1)" }} />
                  {todayEntries.slice(0, 4).map((e) => {
                    const icon = ENTRY_ICON[e.kind];
                    return (
                      <div key={e.id} style={{ position: "relative", paddingBottom: 16 }}>
                        <span style={{ position: "absolute", left: -18, top: 2, width: 8, height: 8, borderRadius: "50%", background: icon.color, border: "2px solid var(--bg)" }} />
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 2 }}>{formatTime(e.occurredAt)} · {icon.label}</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{e.title}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
    <div className="jn-card" style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <svg width="54" height="54" viewBox="0 0 76 76" style={{ marginBottom: 6 }}>
        <circle cx="38" cy="38" r="32" fill="none" stroke={glow} strokeWidth="7" strokeDasharray={dashed ? "3 5" : undefined} />
        <text x="38" y="44" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">
          {value}
        </text>
      </svg>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)" }}>{label}</div>
    </div>
  );
}
