"use client";

/* =============================================================================
 * KhuVuonCuaBanTab — tab "Khu vườn của bạn" bên trong `/v2/hanh-trinh-cua-toi`
 * (Giai đoạn 8, gộp 3 trang). PORT nội dung từ `KhuVuonCuaBanClient.tsx`
 * (route `/v2/khu-vuon-cua-ban` đã xoá — xem CLAUDE.md) — bỏ khung
 * `PortalV2Shell`/`.app` (trang cha đã có 1 shell duy nhất), và bỏ nút
 * "Xem chi tiết vườn →" (trước trỏ thẳng `/v2/hanh-trinh-cua-toi` — nay
 * dư thừa vì tab này đã nằm ngay trong trang đó).
 *
 * ĐIỀU CHỈNH LAYOUT (Founder yêu cầu sau khi xem trước, cùng đợt với
 * Nhật ký học tập) — đổi từ 2 cột (center-col 1fr + right-col 300px, chỉ
 * hợp trang riêng) sang 1 CỘT DUY NHẤT full-width. Bỏ 3 thẻ ở cột phải cũ
 * TRÙNG LẶP 100% với nội dung đã có ở tab "Hành trình của tôi" (đúng
 * quyền tự dọn nội dung dư thừa Founder đã cấp cho phạm vi trang này):
 * "Tổng quan khu vườn" (4 số — bài học/streak/giờ học/huy hiệu — cả 4 đều
 * đã hiện ở progress-card + Thành tựu của tôi của tab kia), "Huy hiệu của
 * bạn" (đúng `journey.badges`, trùng "Thành tựu của tôi"), "Hoạt động gần
 * đây" (đúng `journey.activities`, trùng thẻ cùng tên ở tab kia). Giữ
 * nguyên "Nhiệm vụ hằng ngày"/"Vật phẩm của bạn" (honest empty-state,
 * tính năng CHƯA xây, không trùng đâu khác) + `quote-card2` (câu triết lý
 * tĩnh, nội dung riêng của trang này).
 * ========================================================================== */

import type { JourneyOverview } from "@/lib/portal/live-journey-overview";

import "./khu-vuon-cua-ban-tab.css";

/** Vẽ chậu cây trang trí thuần tuý — cycle theo index, KHÔNG gắn ý nghĩa dữ liệu nào. */
const POT_ART = [
  {
    fill: "#8b6bff",
    ellipse: "#a08bff",
    stem: "#3a7d3f",
    plant: "M40 45c-10-14-26-10-26-2s16 8 26 -2M40 40c10-10 24-6 24 2s-14 8-24 -2",
  },
  {
    fill: "#5a37e6",
    ellipse: "#7c5aef",
    stem: "#3a7d3f",
    plant: "M40 48c-11-16-28-11-28-2s18 9 28-2M40 42c11-11 26-6 26 3s-16 8-26-3",
  },
  {
    fill: "#5f8fff",
    ellipse: "#7fa6ff",
    stem: "#3a7d3f",
    plant: "M40 50c-9-13-22-9-22-1s14 7 22-1",
  },
  {
    fill: "#189a52",
    ellipse: "#3ab873",
    stem: "#2e7d4f",
    plant: "",
  },
];

export function KhuVuonCuaBanTab({ journey }: { journey: JourneyOverview }) {
  const { stages } = journey;

  return (
    <div className="kvcb">
      <div className="content-single">
        <div className="page-head">
            <h1>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
              </svg>
              Khu vườn của bạn
            </h1>
            <p>Nuôi dưỡng thói quen tốt, kiến thức và giá trị mỗi ngày.</p>
          </div>

          <div className="garden-card">
            <div className="garden-top">
              <div>
                <h3>Vườn của Võ Dương</h3>
                <span>4 giai đoạn học tập thật của bạn</span>
              </div>
              <button className="share-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
                </svg>
                Chia sẻ vườn
              </button>
            </div>
            <div className="garden-scene">
              <svg viewBox="0 0 1100 260" preserveAspectRatio="none">
                <rect width="1100" height="260" fill="url(#skyGrad)" />
                <circle cx="960" cy="55" r="34" fill="#ffe9a8" opacity=".85" />
                <circle cx="960" cy="55" r="46" fill="#fff3cf" opacity=".4" />
                <ellipse cx="150" cy="70" rx="55" ry="18" fill="#fff" opacity=".8" />
                <ellipse cx="200" cy="60" rx="40" ry="15" fill="#fff" opacity=".7" />
                <ellipse cx="700" cy="45" rx="60" ry="17" fill="#fff" opacity=".75" />
                <path d="M0 200c150-30 300 10 450-10s300-25 450 5 200-5 200-5v70H0z" fill="#8fc36a" />
                <path d="M0 215c150-20 300 5 450-5s300-18 450 6 200-3 200-3v52H0z" fill="#7ab556" />
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="260">
                    <stop offset="0" stopColor="#a8d8f0" />
                    <stop offset="1" stopColor="#dcf0e0" />
                  </linearGradient>
                </defs>
              </svg>
              {stages.length === 0 ? (
                <div className="pot-row" style={{ alignItems: "center", justifyItems: "center" }}>
                  <div className="empty-hint" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                    Chưa có giai đoạn học tập nào — bắt đầu học tại Học viện AI.
                  </div>
                </div>
              ) : (
                <div className="pot-row">
                  {stages.map((s, i) => {
                    const art = POT_ART[i % POT_ART.length];
                    return (
                      <div className="pot-item" key={s.slug}>
                        <div className="pot-tooltip">
                          {s.title}
                          <span>{s.percent}% hoàn thành</span>
                        </div>
                        <svg className="pot-svg" viewBox="0 0 80 110">
                          {art.plant ? (
                            <>
                              <path d="M40 30v40" stroke={art.stem} strokeWidth="4" strokeLinecap="round" />
                              <path d={art.plant} fill="none" stroke={art.stem} strokeWidth="3.5" />
                            </>
                          ) : (
                            <path
                              d="M40 18c-14 8-16 24-16 34 0 12 7 20 16 20s16-8 16-20c0-10-2-26-16-34z"
                              fill="#2e7d4f"
                            />
                          )}
                          <path d="M20 68h40l-4 32H24z" fill={art.fill} />
                          <ellipse cx="40" cy="68" rx="20" ry="6" fill={art.ellipse} />
                          <circle cx="40" cy="84" r="8" fill="#fff" opacity=".85" />
                        </svg>
                        <div className="water-track">
                          <div className="water-fill" style={{ width: `${s.percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="tip-strip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
              </svg>
              Mỗi hành động tốt là một giọt nước. Hãy chăm sóc vườn của bạn mỗi ngày!
            </div>
          </div>

          <div>
            <div className="section-head" style={{ marginBottom: 14 }}>
              <h3>Nhiệm vụ hằng ngày</h3>
            </div>
            <div className="empty-hint">Tính năng nhiệm vụ hằng ngày đang được xây dựng — sẽ cập nhật khi có.</div>
          </div>

        </div>

        <div className="secondary-grid">
          <div className="card">
            <div className="card-head">
              <h4>Vật phẩm của bạn</h4>
            </div>
            <div className="empty-hint">Chưa có hệ thống vật phẩm/kho đồ — sẽ cập nhật khi có.</div>
          </div>

          <div className="quote-card2">
            <svg className="quote-mark" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 7c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5zm10 0c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5z" />
            </svg>
            <p>
              Bạn không cần tuyệt vời ngay hôm nay. Chỉ cần tốt hơn ngày hôm qua một chút. Và khu vườn của bạn sẽ nở
              hoa.
            </p>
            <svg className="quote-plant" viewBox="0 0 60 70" fill="none">
              <path d="M30 20v40" stroke="#3a7d3f" strokeWidth="3" />
              <path
                d="M30 32c-8-10-20-6-20 0s14 8 20 0M30 26c8-8 18-4 18 1s-12 7-18-1"
                fill="none"
                stroke="#3a7d3f"
                strokeWidth="2.5"
              />
              <path d="M14 60h32l-3 8H17z" fill="#e2b23c" />
            </svg>
          </div>
        </div>
      </div>
  );
}

