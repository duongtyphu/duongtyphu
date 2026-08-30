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

/** Vị trí sao/đom đóm trang trí thuần tuý — cố định, không gắn ý nghĩa dữ liệu. */
const GN_STARS = [
  { left: "8%", top: "9%", delay: ".2s" },
  { left: "18%", top: "5%", delay: "1.4s" },
  { left: "30%", top: "13%", delay: ".8s" },
  { left: "44%", top: "6%", delay: "2.1s" },
  { left: "58%", top: "11%", delay: "1.7s" },
  { left: "70%", top: "7%", delay: ".4s" },
  { left: "83%", top: "14%", delay: "2.6s" },
  { left: "92%", top: "8%", delay: "1s" },
] as const;

const GN_FIREFLIES = [
  { left: "26%", bottom: "22%", color: "#FDE68A", delay: ".3s" },
  { left: "52%", bottom: "38%", color: "#BEF264", delay: "2.1s" },
  { left: "68%", bottom: "52%", color: "#FDE68A", delay: "1.2s" },
  { left: "14%", bottom: "34%", color: "#86EFAC", delay: "3.4s" },
] as const;

type GardenTier = "seed" | "sapling" | "growing" | "bloom";

function tierOf(percent: number): GardenTier {
  if (percent <= 0) return "seed";
  if (percent < 50) return "sapling";
  if (percent < 100) return "growing";
  return "bloom";
}

const TIER_CANOPY: Record<Exclude<GardenTier, "seed">, { size: number; trunk: number; bg: string; glow: string }> = {
  sapling: { size: 34, trunk: 20, bg: "radial-gradient(circle at 35% 30%, #FDE68A, #A16207 70%)", glow: "0 0 12px rgba(250,204,21,.25)" },
  growing: { size: 54, trunk: 30, bg: "radial-gradient(circle at 35% 30%, #BEF264, #4D9F3A 70%)", glow: "0 0 20px rgba(163,230,53,.32)" },
  bloom: { size: 74, trunk: 38, bg: "radial-gradient(circle at 35% 30%, #86EFAC, #16A34A 70%)", glow: "0 0 28px rgba(74,222,128,.4)" },
};

/** Chiều cao `.garden-scene` (khớp `khu-vuon-cua-ban-tab.css`). Cây "bloom"
 * cao nhất (canopy 74 + trunk 38 + nhãn 2 dòng + % ≈ 165px) — `baseY`/`amp`
 * dưới đây được chọn để `bottomPx + 165 <= SCENE_HEIGHT` ở MỌI vị trí lệch
 * dọc, tránh bị cắt bởi `overflow:hidden` (đã xảy ra ở bản nháp đầu). */
const SCENE_HEIGHT = 320;

/** Vị trí (%, px) + đường nối uốn lượn cho N cây trên "lối đi" — chia đều
 * theo chiều ngang, lệch dọc xen kẽ để tạo cảm giác con đường thật, không
 * cần khớp cứng với số chương cố định (khác Bản đồ hành trình luôn có
 * đúng 5). Toạ độ path dùng chung hệ 0–1000 với % ngang để luôn thẳng hàng
 * dù khung co giãn theo chiều rộng thật. */
function buildGardenPath(n: number) {
  const baseY = 90;
  const amp = 28;
  const points = Array.from({ length: n }, (_, i) => {
    const leftPct = ((i + 1) / (n + 1)) * 100;
    const bottomPx = baseY + (i % 2 === 0 ? -amp : amp * 0.6);
    return { leftPct, bottomPx, svgY: SCENE_HEIGHT - bottomPx };
  });
  if (points.length < 2) return { points, d: "" };
  let d = `M ${points[0].leftPct * 10} ${points[0].svgY}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const midX = (prev.leftPct * 10 + cur.leftPct * 10) / 2;
    d += ` Q ${midX} ${prev.svgY} ${midX} ${(prev.svgY + cur.svgY) / 2} Q ${midX} ${cur.svgY} ${cur.leftPct * 10} ${cur.svgY}`;
  }
  return { points, d };
}

export function KhuVuonCuaBanTab({ journey }: { journey: JourneyOverview }) {
  const { stages } = journey;
  const { points: gardenPoints, d: gardenPathD } = buildGardenPath(stages.length);

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
              {GN_STARS.map((star, i) => (
                <div
                  key={i}
                  className="gn-star"
                  style={{ width: 2, height: 2, left: star.left, top: star.top, animationDelay: star.delay }}
                />
              ))}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  right: "9%",
                  top: "9%",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "radial-gradient(circle,#F6F0D8 0%,rgba(246,240,216,.5) 55%,transparent 75%)",
                  boxShadow: "0 0 32px rgba(246,240,216,.3)",
                }}
              />

              {stages.length === 0 ? (
                <div
                  className="empty-hint"
                  style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.55)" }}
                >
                  Chưa có giai đoạn học tập nào — bắt đầu học tại Học viện AI.
                </div>
              ) : (
                <>
                  {gardenPathD && (
                    <svg viewBox={`0 0 1000 ${SCENE_HEIGHT}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                      <path d={gardenPathD} stroke="rgba(190,242,210,.28)" strokeWidth="2" strokeDasharray="2 8" fill="none" />
                    </svg>
                  )}
                  {GN_FIREFLIES.map((f, i) => (
                    <div
                      key={i}
                      className="gn-firefly"
                      style={{ width: 4, height: 4, left: f.left, bottom: f.bottom, background: f.color, boxShadow: `0 0 8px ${f.color}`, animationDelay: f.delay }}
                    />
                  ))}
                  {stages.map((s, i) => {
                    const point = gardenPoints[i];
                    const tier = tierOf(s.percent);
                    return (
                      <div className="gn-tree" key={s.slug} style={{ left: `${point.leftPct}%`, bottom: point.bottomPx }}>
                        {tier === "seed" ? (
                          <div className="gn-seed" />
                        ) : (
                          <>
                            <div
                              className="gn-canopy"
                              style={{ width: TIER_CANOPY[tier].size, height: TIER_CANOPY[tier].size, background: TIER_CANOPY[tier].bg, boxShadow: TIER_CANOPY[tier].glow }}
                            />
                            <div className="gn-trunk" style={{ height: TIER_CANOPY[tier].trunk }} />
                          </>
                        )}
                        <div className="gn-label">{s.title}</div>
                        <div className="gn-percent">{tier === "seed" ? "Chưa bắt đầu" : `${s.percent}% · ${s.lessonCount} bài`}</div>
                      </div>
                    );
                  })}
                </>
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

