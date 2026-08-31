"use client";

/* =============================================================================
 * KhuVuonCuaBanTab — tab "Khu vườn của bạn" bên trong `/v2/hanh-trinh-cua-toi`.
 *
 * GIAI ĐOẠN 10 (Founder yêu cầu thiết kế lại hoàn toàn — cây phải thật hơn
 * "có lá có hoa có quả", thêm chi tiết trừu tượng) — bỏ hẳn card trắng bọc
 * quanh cảnh vườn của bản cũ, toàn trang giờ LÀ khí quyển vườn đêm liên
 * tục (dãy núi xa, dải aurora trừu tượng, lá rơi, sương trôi). Mỗi cây vẽ
 * bằng SVG nhiều lớp tán lá + hoa (chấm hồng) + quả (elip đỏ) ở tier cao
 * nhất, thay hẳn khối tròn gradient đơn giản trước đây.
 *
 * Gộp thêm 2 khối thật chuyển từ tab "Hành trình của tôi" (đúng đề xuất
 * gộp nội dung đã duyệt — tránh trùng lặp giữa 2 tab): "Tiếp tục học"
 * (CTA tự nhiên đi cùng chỗ hiện tiến độ, dùng `journey.currentStageIndex`)
 * và "Thành tựu của tôi" (`journey.badges` thật) — thay 2 khối
 * "Nhiệm vụ hằng ngày"/"Vật phẩm của bạn" vốn luôn là empty-hint giả vì
 * tính năng chưa xây, biến 2 chỗ trống giả thành 1 chỗ có dữ liệu thật.
 * ========================================================================== */

import { useRouter } from "next/navigation";

import type { JourneyOverview } from "@/lib/portal/live-journey-overview";

import "./khu-vuon-cua-ban-tab.css";

const GN_STARS = [
  { left: "8%", top: "5%", delay: "0s" },
  { left: "22%", top: "3%", delay: "1.4s" },
  { left: "60%", top: "6%", delay: ".8s" },
  { left: "82%", top: "4%", delay: "2.1s" },
  { left: "38%", top: "9%", delay: "1.1s" },
  { left: "70%", top: "12%", delay: "2.6s" },
] as const;

const GN_FIREFLIES = [
  { left: "26%", bottom: "25%", color: "#FDE68A", delay: "0s" },
  { left: "52%", bottom: "42%", color: "#BEF264", delay: "2.1s" },
  { left: "14%", bottom: "30%", color: "#86EFAC", delay: "3.6s" },
  { left: "68%", bottom: "52%", color: "#FBCFE8", delay: "1.2s" },
] as const;

const GN_LEAVES = [
  { left: "20%", top: "8%", color: "#4ADE80", size: 12, delay: "0s" },
  { left: "48%", top: "3%", color: "#FDE68A", size: 10, delay: "4s" },
  { left: "75%", top: "6%", color: "#86EFAC", size: 11, delay: "8s" },
] as const;

type GardenTier = "seed" | "sapling" | "growing" | "bloom";

function tierOf(percent: number): GardenTier {
  if (percent <= 0) return "seed";
  if (percent < 50) return "sapling";
  if (percent < 100) return "growing";
  return "bloom";
}

/** Chiều cao khu vực lối đi + cây — đủ cho cây "bloom" cao nhất (~180px)
 * cộng biên độ lệch dọc lớn nhất, tránh bị cắt. */
const SCENE_HEIGHT = 460;

/** Vị trí (%, px) + đường nối uốn lượn cho N cây trên "lối đi" — chia đều
 * theo chiều ngang, lệch dọc xen kẽ để tạo cảm giác con đường thật, không
 * cần khớp cứng với số chương cố định (khác Bản đồ hành trình luôn có
 * đúng 5). Toạ độ path dùng chung hệ 0–1000 với % ngang để luôn thẳng hàng
 * dù khung co giãn theo chiều rộng thật. */
function buildGardenPath(n: number) {
  const baseY = 140;
  const amp = 90;
  const points = Array.from({ length: n }, (_, i) => {
    const leftPct = ((i + 1) / (n + 1)) * 100;
    const bottomPx = baseY + (i % 2 === 0 ? -amp * 0.7 : amp);
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

/** Cây SVG thật — nhiều lớp tán lá xếp chồng (không phải 1 khối tròn),
 * "bloom" (100%) có thêm hoa (chấm hồng) + quả (elip đỏ), "growing" (50–99%)
 * có hoa chưa có quả, "sapling" (<50%) chỉ có tán lá. */
function TreeSVG({ tier }: { tier: Exclude<GardenTier, "seed"> }) {
  if (tier === "bloom") {
    return (
      <svg width="150" height="180" viewBox="0 0 150 180">
        <path d="M75 180 L73 128 Q71 108 75 96" stroke="#5A3A22" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M75 118 L52 100" stroke="#5A3A22" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M75 112 L98 94" stroke="#5A3A22" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <circle cx="75" cy="64" r="40" fill="#15803D" />
        <circle cx="48" cy="80" r="28" fill="#16A34A" />
        <circle cx="102" cy="80" r="28" fill="#16A34A" />
        <circle cx="75" cy="36" r="30" fill="#22C55E" />
        <circle cx="52" cy="52" r="22" fill="#4ADE80" opacity=".85" />
        <circle cx="98" cy="55" r="20" fill="#4ADE80" opacity=".8" />
        <g fill="#FBCFE8">
          <circle cx="42" cy="58" r="4.2" /><circle cx="100" cy="46" r="4.2" /><circle cx="68" cy="18" r="4.2" />
          <circle cx="108" cy="72" r="4.2" /><circle cx="34" cy="84" r="4.2" /><circle cx="86" cy="24" r="4.2" />
        </g>
        <g fill="#F87171">
          <ellipse cx="56" cy="94" rx="5.5" ry="6" /><ellipse cx="88" cy="96" rx="5.5" ry="6" /><ellipse cx="72" cy="102" rx="5.5" ry="6" />
        </g>
      </svg>
    );
  }
  if (tier === "growing") {
    return (
      <svg width="110" height="140" viewBox="0 0 110 140">
        <path d="M55 140 L53 100 Q52 84 55 74" stroke="#5A3A22" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="55" cy="52" r="30" fill="#65A30D" />
        <circle cx="36" cy="64" r="20" fill="#84CC16" />
        <circle cx="74" cy="64" r="20" fill="#84CC16" />
        <circle cx="55" cy="30" r="22" fill="#A3E635" />
        <g fill="#FEF3C7">
          <circle cx="34" cy="48" r="3.4" /><circle cx="76" cy="42" r="3.4" /><circle cx="55" cy="16" r="3.4" />
        </g>
      </svg>
    );
  }
  return (
    <svg width="70" height="90" viewBox="0 0 70 90">
      <path d="M35 90 L34 66 Q34 56 35 50" stroke="#5A3A22" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="36" r="18" fill="#A16207" />
      <circle cx="24" cy="42" r="11" fill="#CA8A04" />
      <circle cx="46" cy="42" r="11" fill="#CA8A04" />
      <circle cx="35" cy="22" r="13" fill="#EAB308" />
    </svg>
  );
}

export function KhuVuonCuaBanTab({ journey }: { journey: JourneyOverview }) {
  const router = useRouter();
  const { stages, currentStageIndex, badges } = journey;
  const { points: gardenPoints, d: gardenPathD } = buildGardenPath(stages.length);
  const currentStage = currentStageIndex != null ? stages[currentStageIndex] : null;

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      <div className="absolute inset-0 z-0" style={{ background: "#070a12" }} aria-hidden />
      {/* Chiều sâu + đồng nhất màu với hộp Hub "Khu vườn của bạn"
          (HUB_CARD_STYLE["khu-vuon-cua-ban"], linear-gradient(135deg,#0F3325,#081A2E)). */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(15,51,37,.5) 0%, rgba(8,26,46,.5) 45%, transparent 75%)" }}
        aria-hidden
      />

      {/* dải aurora trừu tượng vắt ngang trời */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -80, left: -100, right: -100, height: 420, opacity: 0.35,
          background: "linear-gradient(100deg, transparent 10%, rgba(74,222,128,.18) 30%, rgba(34,211,238,.14) 45%, rgba(139,124,246,.16) 62%, transparent 80%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: 0, right: 0, height: 680,
          background: "radial-gradient(ellipse 75% 45% at 50% 95%, rgba(74,222,128,.12), transparent 70%), radial-gradient(ellipse 50% 30% at 78% 10%, rgba(139,124,246,.10), transparent 70%)",
        }}
        aria-hidden
      />

      {/* dãy đồi xa 2 lớp */}
      <svg width="1440" height="200" viewBox="0 0 1440 200" style={{ position: "absolute", bottom: 280, left: 0, opacity: 0.5, width: "100%" }} preserveAspectRatio="none">
        <path d="M0 140 Q 200 80 420 120 T 860 100 T 1300 130 L1440 110 V200 H0Z" fill="#0F2A22" />
      </svg>
      <svg width="1440" height="160" viewBox="0 0 1440 160" style={{ position: "absolute", bottom: 260, left: 0, opacity: 0.7, width: "100%" }} preserveAspectRatio="none">
        <path d="M0 110 Q 260 60 540 100 T 1000 80 T 1440 100 V160 H0Z" fill="#0A1D18" />
      </svg>

      <div className="gd-mistband" style={{ left: "5%", bottom: 250, width: 340, height: 36, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.05), transparent 70%)", filter: "blur(6px)" }} />
      <div className="gd-mistband" style={{ left: "55%", bottom: 300, width: 280, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.04), transparent 70%)", filter: "blur(6px)", animationDelay: "6s" }} />

      {GN_STARS.map((star, i) => (
        <div key={i} className="gd-star" style={{ width: 2, height: 2, left: star.left, top: star.top, animationDelay: star.delay }} />
      ))}
      <div
        aria-hidden
        style={{ position: "absolute", right: "9%", top: "5%", width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle,#F6F0D8 0%,rgba(246,240,216,.5) 55%,transparent 75%)", boxShadow: "0 0 40px rgba(246,240,216,.35)" }}
      />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ color: "#fff", maxWidth: 640, marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#7EE8A6", marginBottom: 8 }}>
              Hành trình của tôi
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>Khu vườn của bạn</h1>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,.55)", margin: 0 }}>
              Mỗi cây trên lối đi là một giai đoạn học — cây càng lớn, hoa càng nở, quả càng chín, bạn càng đi xa trong giai đoạn đó.
            </p>
          </div>
        </div>

        {/* Lối đi + cây — full-bleed, không giới hạn maxWidth 900 như phần chữ */}
        <div style={{ position: "relative", height: SCENE_HEIGHT, marginTop: 8 }}>
          {GN_LEAVES.map((leaf, i) => (
            <svg key={i} className="gd-leaf" width={leaf.size} height={leaf.size} viewBox="0 0 12 12" style={{ left: leaf.left, top: leaf.top, animationDelay: leaf.delay }}>
              <path d="M6 0C9 3 12 6 6 12C0 6 3 3 6 0Z" fill={leaf.color} opacity=".6" />
            </svg>
          ))}

          {stages.length === 0 ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.5)", fontSize: 13, fontStyle: "italic" }}>
              Chưa có giai đoạn học tập nào — bắt đầu học tại Học viện AI.
            </div>
          ) : (
            <>
              {gardenPathD && (
                <svg viewBox={`0 0 1000 ${SCENE_HEIGHT}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                  <path d={gardenPathD} stroke="rgba(190,242,210,.25)" strokeWidth="2.5" strokeDasharray="1 12" strokeLinecap="round" fill="none" />
                </svg>
              )}
              {GN_FIREFLIES.map((f, i) => (
                <div
                  key={i}
                  className="gd-firefly"
                  style={{ width: 4, height: 4, left: f.left, bottom: f.bottom, background: f.color, boxShadow: `0 0 9px ${f.color}`, animationDelay: f.delay }}
                />
              ))}
              {stages.map((s, i) => {
                const point = gardenPoints[i];
                const tier = tierOf(s.percent);
                return (
                  <div className="gd-tree" key={s.slug} style={{ position: "absolute", left: `${point.leftPct}%`, bottom: point.bottomPx, textAlign: "center", transform: "translateX(-50%)" }}>
                    {tier === "seed" ? (
                      <svg width="30" height="30" viewBox="0 0 30 30" style={{ margin: "0 auto" }}>
                        <circle cx="15" cy="15" r="7" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.4" strokeDasharray="2 3" />
                        <circle cx="15" cy="15" r="2.4" fill="rgba(255,255,255,.5)" />
                      </svg>
                    ) : (
                      <TreeSVG tier={tier} />
                    )}
                    <div style={{ marginTop: 2, fontSize: 11, fontWeight: 700, color: "#fff" }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: tier === "seed" ? "rgba(255,255,255,.4)" : "rgba(74,222,128,.85)" }}>
                      {tier === "seed" ? "Chưa bắt đầu" : `${s.percent}% · ${s.lessonCount} bài`}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Tiếp tục học — chuyển từ tab Hành trình của tôi, gắn liền chỗ hiện tiến độ */}
          {currentStage && (
            <div
              style={{
                background: "linear-gradient(135deg,rgba(74,222,128,.08),rgba(255,255,255,.02))",
                border: "1px solid rgba(74,222,128,.28)",
                borderRadius: 18,
                padding: "24px 28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, background: "rgba(74,222,128,.16)", border: "1px solid rgba(74,222,128,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#7EE8A6" strokeWidth="2">
                    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#7EE8A6", marginBottom: 6 }}>
                    Bạn đang ở giai đoạn {(currentStageIndex ?? 0) + 1}: {currentStage.title}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", maxWidth: 460 }}>{currentStage.description}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push("/v2/hoc-vien-ai")}
                className="gd-cta-btn"
                style={{
                  background: "linear-gradient(135deg,#4ADE80,#16A34A)",
                  color: "#06210F",
                  border: "none",
                  padding: "13px 24px",
                  borderRadius: 11,
                  fontWeight: 800,
                  fontSize: 13.5,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 8px 20px -6px rgba(74,222,128,.5)",
                }}
              >
                Tiếp tục học →
              </button>
            </div>
          )}

          {/* Thành tựu của tôi — badges thật, thay 2 ô "Nhiệm vụ hằng ngày"/"Vật phẩm" giả cũ */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>Thành tựu của tôi</h3>
            {badges.length === 0 ? (
              <div style={{ background: "#111318", border: "1px solid rgba(74,222,128,.14)", borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, background: "rgba(255,255,255,.04)", border: "1px dashed rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.8">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M8.5 13l-2 7 5.5-3 5.5 3-2-7" />
                  </svg>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontStyle: "italic" }}>Chưa có huy hiệu nào — huy hiệu thật sẽ hiện ở đây khi bạn đạt được.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 }}>
                {badges.map((b) => (
                  <div key={b.id} title={b.name} style={{ background: "#111318", border: "1px solid rgba(74,222,128,.16)", borderRadius: 14, padding: 16, textAlign: "center" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        margin: "0 auto 10px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 30%,#86EFAC,#16A34A 70%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 16px rgba(74,222,128,.35)",
                      }}
                    >
                      {b.icon ? (
                        <span style={{ fontSize: 18 }}>{b.icon}</span>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                        </svg>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>{b.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Câu triết lý — nội dung riêng của trang này, giữ nguyên */}
          <div style={{ background: "linear-gradient(150deg,rgba(74,222,128,.08),rgba(255,255,255,.02))", border: "1px solid rgba(74,222,128,.16)", borderRadius: 16, padding: 22, position: "relative", overflow: "hidden" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4ADE80" style={{ marginBottom: 10, opacity: 0.7 }}>
              <path d="M7 7c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5zm10 0c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5z" />
            </svg>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
              Bạn không cần tuyệt vời ngay hôm nay. Chỉ cần tốt hơn ngày hôm qua một chút. Và khu vườn của bạn sẽ nở hoa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
