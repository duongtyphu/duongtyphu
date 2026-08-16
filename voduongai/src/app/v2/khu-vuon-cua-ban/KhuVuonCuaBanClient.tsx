"use client";

/* =============================================================================
 * KhuVuonCuaBanClient — 1:1 layout/CSS với `Khu vuon cua ban.html`, tiền tố
 * `.kvcb`. Đây là trang có PHẦN LỚN NỘI DUNG không có hệ thống backing thật
 * — bản thiết kế là 1 lớp gamification hoàn chỉnh (cấp độ vườn, tiền tệ
 * "giọt nước", nhiệm vụ hằng ngày kèm phần thưởng, kho vật phẩm) mà dự án
 * CHƯA từng xây bất kỳ phần nào (đã xác nhận nhiều lần ở các trang trước:
 * Chiến lược cá nhân/Hành trình của tôi/Nhật ký học tập — không có XP/
 * currency/quest system nào tồn tại). Áp dụng đúng nguyên tắc "honest
 * empty-state là lựa chọn an toàn, không cần dừng hỏi" — liệt kê đầy đủ
 * từng quyết định:
 *
 *  1. **Ô cây trong vườn** — bản thiết kế gán 5 chậu cây cho 5 kỹ năng đặt
 *     tên riêng + "Lv.X" + đồng hồ đếm ngược "Còn X giờ" (không có timer
 *     thật). Đổi sang đúng 4 GIAI ĐOẠN THẬT của `learning_paths` (tái dùng
 *     `getJourneyOverview()` — cùng 4 giai đoạn đã dùng ở Hành trình của
 *     tôi, không bịa giai đoạn thứ 5). Tooltip hiện tên giai đoạn + % hoàn
 *     thành thật (thay "Lv.X"). Thanh dưới chậu (`.water-track`, vốn là
 *     "mực nước tưới") đổi ý nghĩa thành % hoàn thành thật — giữ nguyên vẽ
 *     progress bar, chỉ đổi số đằng sau. BỎ HẲN `.time-pill` (không có cơ
 *     chế đếm giờ chờ cây lớn nào là thật).
 *  2. **"Nhiệm vụ hằng ngày"** (5 thẻ, mỗi thẻ có phần thưởng 💧/⭐/🔥) —
 *     KHÔNG có hệ nhiệm vụ/phần thưởng nào tồn tại — đây là 1 TÍNH NĂNG
 *     MỚI hoàn toàn (cần bảng quest/tiền tệ/trạng thái hoàn thành riêng),
 *     không phải nội dung có sẵn cần nối dây → empty-state trung thực,
 *     đúng phạm vi "convert trang + nối dữ liệu có thật", không tự xây
 *     tính năng mới.
 *  3. **"Hoạt động gần đây"** — tái dùng ĐÚNG `journey.activities` (Hành
 *     trình của tôi) — bài học/chiêm nghiệm/ghi chú thật. BỎ cột phần
 *     thưởng (🌱/💧/⭐, không có tiền tệ thật).
 *  4. **"Tổng quan khu vườn"** (4 ô) — đổi 3/4 nhãn "Cây đang trồng"/"Giọt
 *     nước"/"Tổng XP" (không có gì thật) sang 3 số liệu thật đã có sẵn từ
 *     `journey`: bài học hoàn thành/chuỗi ngày học/giờ học tích luỹ. Ô thứ
 *     4 "Huy hiệu" giữ nguyên ý nghĩa gốc (thật, `journey.badges.length`).
 *     Bỏ dòng `.sub` "+X so với hôm qua" (không có snapshot lịch sử).
 *  5. **"Huy hiệu của bạn"** — bảng `badges`/`user_badges` thật (Phase 30,
 *     0 huy hiệu định nghĩa hệ thống) — empty-state trung thực như Hành
 *     trình của tôi, không bịa 4 huy hiệu mẫu.
 *  6. **"Vật phẩm của bạn"** (kho đồ: bình tưới/phân bón/ánh sáng) — KHÔNG
 *     có hệ thống kho vật phẩm/shop nào tồn tại — empty-state trung thực.
 *  7. **Khối `.quote-card2`** — câu triết lý tĩnh của chính bản thiết kế
 *     (không phải dữ liệu người dùng, giống các dòng "Tuyệt vời 🔥"/
 *     manifesto tĩnh đã giữ nguyên ở các trang trước) — giữ NGUYÊN VĂN.
 *  8. **Khối `.promo` sidebar** — bản thiết kế có "Cấp độ: Nhà kiến tạo"/
 *     "Lv. 7"/"32 cây"/"💧 1,250" — toàn bộ là số liệu gamification không
 *     thật. Dùng lại khối "Nâng cấp Premium" MẶC ĐỊNH của `PortalV2Shell`
 *     (không tự bịa cấp độ/tiền tệ để khớp hình) — đây là lựa chọn empty-
 *     state an toàn duy nhất khi TOÀN BỘ nội dung khối này không có gì
 *     thật để hiển thị.
 * ========================================================================== */

import { useRouter } from "next/navigation";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import type { JourneyOverview } from "@/lib/portal/live-journey-overview";

import "./khu-vuon-cua-ban.css";

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

export function KhuVuonCuaBanClient({ premium, journey }: { premium: PremiumStatus; journey: JourneyOverview }) {
  const router = useRouter();
  const { stages } = journey;

  return (
    <div className="kvcb">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          searchPlaceholder="Tìm khóa học, công cụ, prompt, tài liệu..."
          promoText="Mở khoá toàn bộ khoá học, công cụ AI cao cấp và quyền lợi đặc biệt."
          activeHtmlFile="Khu vuon cua ban.html"
        >
          <div className="content">
            <div className="center-col">
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

              <div>
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <h3>Hoạt động gần đây</h3>
                </div>
                <div className="act-list">
                  {journey.activities.length === 0 ? (
                    <div className="empty-hint" style={{ padding: "13px 18px" }}>
                      Chưa có hoạt động nào gần đây.
                    </div>
                  ) : (
                    journey.activities.map((a) => (
                      <div className="act-row2" key={a.id}>
                        <div className="ico" style={{ background: "#e6f7ed", color: "#189a52" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                        <div className="txt">
                          {a.kind === "lesson" ? "Hoàn thành bài học" : a.kind === "reflection" ? "Viết chiêm nghiệm" : "Lưu ghi chú"} &quot;{a.title}&quot;
                        </div>
                        <div className="act-time">{formatRelativeTime(a.occurredAt)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Tổng quan khu vườn</h4>
                </div>
                <div className="ov-grid">
                  <div className="ov-box">
                    <div className="ico" style={{ background: "#e6f7ed", color: "#189a52" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="num">{journey.completedLessons}</div>
                      <div className="lbl">Bài học hoàn thành</div>
                    </div>
                  </div>
                  <div className="ov-box">
                    <div className="ico" style={{ background: "#e6f0ff", color: "#1d5fd8" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2.5c2.4 1.8 3.8 4.6 3.8 8.3 0 2-.5 3.8-1.3 5.3l-2.5 2.4-2.5-2.4c-.8-1.5-1.3-3.3-1.3-5.3 0-3.7 1.4-6.5 3.8-8.3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="num">{journey.streakDays}</div>
                      <div className="lbl">Ngày học liên tục</div>
                    </div>
                  </div>
                  <div className="ov-box">
                    <div className="ico" style={{ background: "#fdf1e0", color: "#a9822c" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                    </div>
                    <div>
                      <div className="num">{journey.totalHours}</div>
                      <div className="lbl">Giờ học tích luỹ</div>
                    </div>
                  </div>
                  <div className="ov-box">
                    <div className="ico" style={{ background: "var(--violet-light)", color: "var(--violet)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="num">{journey.badges.length}</div>
                      <div className="lbl">Huy hiệu</div>
                    </div>
                  </div>
                </div>
                <button className="ov-detail-btn" onClick={() => router.push("/v2/hanh-trinh-cua-toi")}>
                  Xem chi tiết vườn →
                </button>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Huy hiệu của bạn</h4>
                </div>
                {journey.badges.length === 0 ? (
                  <div className="empty-hint">Hệ thống huy hiệu đang được xây dựng — chưa có huy hiệu nào.</div>
                ) : (
                  <div className="badge-carousel">
                    {journey.badges.slice(0, 4).map((b) => (
                      <div className="badge-tile2" key={b.id}>
                        <div className="badge-hex" style={{ background: "linear-gradient(150deg,#5f8fff,#1d5fd8)" }}>
                          {b.icon ? (
                            <span style={{ fontSize: 20 }}>{b.icon}</span>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                              <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
                            </svg>
                          )}
                        </div>
                        <span>{b.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                  Bạn không cần tuyệt vời ngay hôm nay. Chỉ cần tốt hơn ngày hôm qua một chút. Và khu vườn của bạn sẽ
                  nở hoa.
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
            </aside>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
