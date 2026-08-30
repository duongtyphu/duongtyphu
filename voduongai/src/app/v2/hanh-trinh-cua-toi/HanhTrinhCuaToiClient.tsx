"use client";

/* =============================================================================
 * HanhTrinhCuaToiClient — 1:1 với `Hanh trinh cua toi.html`, tiền tố `.htct`.
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh (đọc thật qua `getJourneyOverview()` — xem
 * docblock đầy đủ ở `src/lib/portal/live-journey-overview.ts` — hoặc ô
 * trống trung thực khi chưa có hệ thống backing):
 *
 *  1. `.progress-card` — "Tổng tiến độ hành trình" = % bài học Học viện AI
 *     đã hoàn thành thật (`getAcademyProgress()`, tái dùng từ Bước E.2,
 *     không bịa công thức mới). "Khóa học đã hoàn thành"/"Giờ học tích
 *     luỹ" đọc thật cùng nguồn. "Mục tiêu đang theo đuổi" đọc
 *     `goal-runtime.ts` (localStorage) qua `useEffect` — giống
 *     `ChienLuocCaNhanClient.tsx`. "Điểm kinh nghiệm (XP)" — dự án CHƯA có
 *     hệ gamification nào (đã xác nhận nhiều lần) — hiện `—`.
 *  2. "Lộ trình của tôi" — bản thiết kế có 5 chặng đặt tên riêng KHÔNG khớp
 *     `learning_paths` thật (4 giai đoạn, đã chốt taxonomy ở Bước C: Nhập
 *     môn AI/Làm chủ công cụ AI/Xây dựng hệ thống AI/Tạo giá trị & mở
 *     rộng) — dùng ĐÚNG 4 giai đoạn thật, không bịa thêm 1 chặng cho khớp
 *     số 5 trong mockup. % mỗi chặng = bài học đã hoàn thành thật/tổng bài
 *     học Published của chặng đó.
 *  3. "Tiếp tục học" (course-grid) — khoá học Course Builder thật có nội
 *     dung (`getAcademyFeaturedCourses()`), % = bài học đã hoàn thành/tổng
 *     bài học của khoá. Nhãn danh mục màu (`.course-tag`) — bảng `courses`
 *     không có cột phân loại nào — dùng chung 1 nhãn trung thực "Học viện
 *     AI" cho mọi thẻ (không bịa 4 danh mục màu như mockup).
 *  4. "Chuỗi ngày học tập" — số ngày liên tục + 6 chấm tuần (đúng 6 chấm
 *     như markup gốc — khác 7 chấm Mon-Sun của Nhật ký học tập) đọc thật
 *     từ `user_lesson_progress.completed_at`.
 *  5. "Hoạt động gần đây" — gộp bài học hoàn thành/chiêm nghiệm/ghi chú
 *     thật, sắp theo thời gian gần nhất.
 *  6. "Thành tựu của tôi" — bảng `badges`/`user_badges` (Phase 30) có thật
 *     nhưng **0 huy hiệu nào được định nghĩa trong hệ thống** (không chỉ 0
 *     người đạt) — hiện `.empty-hint` trung thực, không bịa 4 huy hiệu mẫu.
 *  7. "Liên kết nhanh" — 2 đích điều hướng THẬT còn lại: Mục tiêu của tôi
 *     (`/v2/muc-tieu`). (Giai đoạn 7 bỏ "Cộng đồng VO DUONG AI"; Giai đoạn
 *     8 bỏ nốt "Nhật ký học tập"/"Khu vườn của bạn" — cả 2 route đã xoá,
 *     nội dung giờ nằm trong khối 5-tab mới bên dưới, không còn là "liên
 *     kết nhanh" điều hướng SANG trang khác nữa.)
 *  8. Khối `.promo` sidebar — bản thiết kế này dùng minh hoạ đồi núi +
 *     nút "Tiếp tục học" (khác khối "Nâng cấp Premium" chuẩn) — đã tổng
 *     quát hoá `PortalV2Shell` thêm `promoVisual`/`promoButtonLabel`/
 *     `promoButtonTarget` để giữ đúng 1:1, trỏ nút này tới Học viện AI.
 *
 * ---------------------------------------------------------------------------
 * GIAI ĐOẠN 8 (mid-turn Founder yêu cầu, KHÔNG có trong mockup gốc) — gộp
 * `/v2/nhat-ky-hoc-tap` + `/v2/khu-vuon-cua-ban` (2 route đã xoá) vào
 * chính trang này dưới dạng 1 khối 5-tab MỚI ("Nhật ký học tập"/"Khu vườn
 * của bạn"/"My Story"/"Mirror"/"Bản đồ hành trình"), đặt ngay sau
 * `.page-head`, TRƯỚC `.progress-card` — mọi nội dung khác của trang GIỮ
 * NGUYÊN 100% như trên. 2 tab đầu port nguyên từ 2 route đã xoá
 * (`NhatKyHocTapTab.tsx`/`KhuVuonCuaBanTab.tsx`, cùng CSS `.nkt`/`.kvcb`).
 * 3 tab sau render lại NGUYÊN 3 component thật của Portal 1.0
 * (`MyStoryBook.tsx`/`MirrorChamber.tsx`/`JourneyMapAtlas.tsx`, dùng chung
 * với `/portal/story`/`/portal/mirror`/`/portal/hanhtrinhcuatoi/ban-do` —
 * Single Source of Truth, không copy nội dung) bọc `.htct-native` (loại
 * trừ khỏi reset Preflight của `/v2`, xem `v2-tokens.css`) + href override
 * trỏ `/v2/*` (NGUYÊN TẮC BẤT BIẾN — không link ngược `/portal/*`):
 * `academyHref="/v2/hoc-vien-ai"`, `premiumHref="/v2/premium"`,
 * `workspaceHref="/v2/muc-tieu"` (chưa có bản 2.0 của Companion Workspace
 * Task→Output→Review, `/v2/muc-tieu` là đích 2.0 gần nhất — cùng quyết
 * định đã áp dụng cho `/v2/muc-tieu`'s "Bắt đầu nhiệm vụ"), và với riêng
 * "Bản đồ hành trình": đích "Cộng đồng" trong 5-Chương-cuộc-đời đổi thành
 * `/v2/affiliate` (Cộng đồng AI 2.0 đã xoá ở Giai đoạn 7 — "Giúp người
 * khác" diễn giải lại thành chia sẻ/giới thiệu qua Affiliate, gần nghĩa
 * nhất còn tồn tại ở 2.0). Cross-link My Story↔Mirror chuyển thứ tab
 * (không `<Link>` điều hướng sang route khác) qua callback `onSwitchTab`.
 * ========================================================================== */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import type { JourneyOverview } from "@/lib/portal/live-journey-overview";
import { listGoals, hydrateGoalRuntime, type GoalRecord } from "@/lib/portal/foundation/goal-runtime";
import type { LearningLogData } from "@/lib/portal/live-learning-log";
import { MyStoryBook, type StoryChrome } from "@/components/portal/story/MyStoryBook";
import { MirrorChamber, type MirrorChrome, type MirrorQuestionRow } from "@/components/portal/mirror/MirrorChamber";
import { JourneyMapAtlas, type MapChrome } from "@/components/portal/journey-map/JourneyMapAtlas";
import type { Reflection } from "@/lib/portal/reflections";
import type { MemoryCapsule } from "@/lib/portal/memoryCapsules";
import type { GrowthMilestone } from "@/lib/portal/growth-map/growth-milestones";

import { NhatKyHocTapTab } from "./NhatKyHocTapTab";
import { KhuVuonCuaBanTab } from "./KhuVuonCuaBanTab";

import "./hanh-trinh-cua-toi.css";

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

const COURSE_THUMBS = [
  { bg: "linear-gradient(160deg,#1a1044,#5a37e6)", stroke: "#c9bdff" },
  { bg: "linear-gradient(160deg,#0e2a44,#1d5fd8)", stroke: "#9fd4ff" },
  { bg: "linear-gradient(160deg,#241c4d,#8b5a2c)", stroke: "#e2b23c" },
  { bg: "linear-gradient(160deg,#0f3d33,#189a52)", stroke: "#9fe0c2" },
];

const ACTIVITY_ICON: Record<
  "lesson" | "reflection" | "capsule",
  { bg: string; color: string; path: string; prefix: string }
> = {
  lesson: { bg: "#e6f7ed", color: "#189a52", path: "M20 6L9 17l-5-5", prefix: "Hoàn thành bài học" },
  reflection: {
    bg: "#fdf1e0",
    color: "#a9822c",
    path: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z",
    prefix: "Viết chiêm nghiệm",
  },
  capsule: { bg: "var(--violet-light)", color: "var(--violet)", path: "M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z", prefix: "Lưu ghi chú" },
};

const BADGE_GRADIENTS = [
  "radial-gradient(circle at 35% 30%,#c9b6ff,#7c5cff 55%,#5a37e6 100%)",
  "radial-gradient(circle at 35% 30%,#ffe8b0,#f0c96a 55%,#c2660a 100%)",
  "radial-gradient(circle at 35% 30%,#bcdcff,#5f8fff 55%,#1d5fd8 100%)",
  "radial-gradient(circle at 35% 30%,#bdf3d3,#3ecf7e 55%,#189a52 100%)",
];

type StoryTabProps = {
  memberSince: Date | null;
  reflections: Reflection[];
  capsules: MemoryCapsule[];
  milestones: GrowthMilestone[];
  firstPremium: { title: string; occurredAt: string } | null;
  premiumCount: number;
  storageReady: boolean;
  seedChrome: StoryChrome;
};

type MirrorTabProps = {
  invitation: string | null;
  narrativeLines: React.ComponentProps<typeof MirrorChamber>["narrativeLines"];
  reflectionMoments: React.ComponentProps<typeof MirrorChamber>["reflectionMoments"];
  firstFootprint: React.ComponentProps<typeof MirrorChamber>["firstFootprint"];
  quietSeasonLine: string | null;
  originLine: string | null;
  reflectionCount: number;
  capsuleCount: number;
  premiumCount: number;
  seedChrome: MirrorChrome;
  seedQuestions: MirrorQuestionRow[];
};

type MapTabProps = {
  reflections: Reflection[];
  premiumCount: number;
  seedChrome: MapChrome;
};

const TABS = [
  { key: "hanh-trinh-cua-toi", label: "Hành trình của tôi" },
  { key: "nhat-ky-hoc-tap", label: "Nhật ký học tập" },
  { key: "khu-vuon-cua-ban", label: "Khu vườn của bạn" },
  { key: "my-story", label: "My Story" },
  { key: "mirror", label: "Mirror" },
  { key: "ban-do-hanh-trinh", label: "Bản đồ hành trình" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const TAB_ICON: Record<TabKey, React.ReactNode> = {
  "hanh-trinh-cua-toi": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  "nhat-ky-hoc-tap": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
    </svg>
  ),
  "khu-vuon-cua-ban": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    </svg>
  ),
  "my-story": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
    </svg>
  ),
  mirror: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v.01M12 16v-5" />
    </svg>
  ),
  "ban-do-hanh-trinh": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
};

/** Màu viền `.tab-panel` đổi theo tông của tab đang mở — 2 tab "bản địa"
    (Hành trình của tôi/Nhật ký học tập) dùng đúng --violet của `.htct`;
    Khu vườn dùng xanh lá (khớp icon lá đã dùng trong trang); 3 "cửa" thật
    của Portal 1.0 dùng đúng tông khí quyển riêng của chính chúng (hổ
    phách cho My Story, tím than tối cho Mirror, hổ phách giấy da cho Bản
    đồ hành trình) — không bịa màu mới, lấy từ chính CSS gốc mỗi cửa. */
const TAB_ACCENT: Record<TabKey, string> = {
  "hanh-trinh-cua-toi": "#6d4aff",
  "nhat-ky-hoc-tap": "#6d4aff",
  "khu-vuon-cua-ban": "#189a52",
  "my-story": "#a9660f",
  mirror: "#2a2160",
  "ban-do-hanh-trinh": "#92661f",
};

/** Dải nhãn nhỏ đầu tab-panel — CHỈ cho 3 "cửa" thật của Portal 1.0 (My
    Story/Mirror/Bản đồ hành trình), báo trước sắp đổi khí quyển (chữ
    serif ấm/nền tối tĩnh lặng/giấy da) trước khi mắt chạm vào bên trong —
    2 tab "bản địa" đầu không cần vì đã cùng tông sáng-tím của `.htct`. */
function PortalTabLabel({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: string }) {
  return (
    <div className="portal-tab-label" style={{ color: tone, borderColor: tone }}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

export function HanhTrinhCuaToiClient({
  premium,
  journey,
  log,
  story,
  mirror,
  map,
}: {
  premium: PremiumStatus;
  journey: JourneyOverview;
  log: LearningLogData;
  story: StoryTabProps;
  mirror: MirrorTabProps;
  map: MapTabProps;
}) {
  const router = useRouter();
  const [goals, setGoals] = useState<GoalRecord[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("hanh-trinh-cua-toi");

  useEffect(() => {
    (async () => {
      await hydrateGoalRuntime();

      setGoals(listGoals());
    })();
  }, []);
  const activeGoals = goals.filter((g) => g.status === "active").length;

  const { stages, currentStageIndex } = journey;
  const n = stages.length;
  const offsetPct = n > 0 ? 50 / n : 0;
  const currentDotFraction = currentStageIndex != null && n > 0 ? ((currentStageIndex + 0.5) / n) * 100 : 0;
  const fillWidthPct = Math.max(currentDotFraction - offsetPct, 0);
  const currentStage = currentStageIndex != null ? stages[currentStageIndex] : null;

  return (
    <div className="htct">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          searchPlaceholder="Tìm kiếm bài học, công cụ, tài liệu, ..."
          promoText="Tiếp tục hành trình học tập và chinh phục mục tiêu của bạn!"
          promoTitle="Bạn đã sẵn sàng bứt phá?"
          promoButtonLabel="Tiếp tục học"
          promoButtonTarget="Hoc vien AI.html"
          activeHtmlFile="Hanh trinh cua toi.html"
          promoVisual={
            <svg className="hike-visual" viewBox="0 0 200 90" fill="none">
              <path d="M0 80l40-50 25 28 20-14 30 22 20-30 40 42v22H0z" fill="url(#mtGrad)" />
              <circle cx="90" cy="16" r="9" fill="#fff" opacity=".85" />
              <path d="M64 66l-4-14 6-3 4 8 2-2 3 6z" fill="#fff" />
              <rect x="66" y="46" width="2" height="10" fill="#e2b23c" />
              <path d="M67 46l7 3-7 3z" fill="#8bb4ff" />
              <defs>
                <linearGradient id="mtGrad" x1="0" y1="30" x2="200" y2="90">
                  <stop offset="0" stopColor="#9b7bff" />
                  <stop offset="1" stopColor="#3d2a8f" />
                </linearGradient>
              </defs>
            </svg>
          }
        >
          <div className="content">
            <div className="center-col">
              <div className="page-head">
                <div>
                  <h1>Hành trình của tôi</h1>
                  <p>Theo dõi tiến độ, mục tiêu và thành tựu trên hành trình phát triển cùng AI.</p>
                </div>
                <button className="edit-goal-btn" onClick={() => router.push("/v2/muc-tieu")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4v16h16v-7" />
                    <path d="M17.5 3.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z" />
                  </svg>
                  Chỉnh sửa mục tiêu
                </button>
              </div>

              <div className="tab-bar">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    className={activeTab === t.key ? "tab-btn active" : "tab-btn"}
                    onClick={() => setActiveTab(t.key)}
                  >
                    {TAB_ICON[t.key]}
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="tab-panel" style={{ "--tab-accent": TAB_ACCENT[activeTab] } as React.CSSProperties}>
                {activeTab === "hanh-trinh-cua-toi" && (
                  <div className="journey-split">
                    <div className="center-col">
                      <div className="progress-card">
                        <div className="progress-main">
                          <h5>Tổng tiến độ hành trình</h5>
                          <div className="progress-pct">{journey.overallPercent}%</div>
                          <div className="progress-sub">
                            {journey.overallPercent > 0 ? "Bạn đang đi đúng hướng! Tiếp tục phát huy nhé." : "Bắt đầu bài học đầu tiên để mở khoá tiến độ."}
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${journey.overallPercent}%` }}></div>
                          </div>
                        </div>
                        <div className="mini-metric">
                          <div className="top">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="9" />
                              <circle cx="12" cy="12" r="4" />
                              <circle cx="12" cy="12" r=".5" fill="currentColor" />
                            </svg>
                            Mục tiêu đang theo đuổi
                          </div>
                          <div className="val">
                            {activeGoals}
                            <span> / {goals.length} mục tiêu</span>
                          </div>
                        </div>
                        <div className="mini-metric">
                          <div className="top">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                            </svg>
                            Khóa học đã hoàn thành
                          </div>
                          <div className="val">
                            {journey.completedCourses}
                            <span> / {journey.totalCourses} khóa học</span>
                          </div>
                        </div>
                        <div className="mini-metric">
                          <div className="top">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 7v5l3 3" />
                            </svg>
                            Giờ học tích lũy
                          </div>
                          <div className="val">
                            {journey.totalHours}
                            <span> giờ</span>
                          </div>
                        </div>
                        <div className="mini-metric">
                          <div className="top">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                            </svg>
                            Điểm kinh nghiệm (XP)
                          </div>
                          <div className="val">—</div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-head">
                          <h4>Lộ trình của tôi</h4>
                          <a onClick={() => router.push("/v2/hoc-vien-ai")} style={{ cursor: "pointer" }}>
                            Xem toàn bộ lộ trình →
                          </a>
                        </div>
                        {n === 0 ? (
                          <div className="empty-hint">Chưa có lộ trình nào — bắt đầu học tại Học viện AI để mở khoá.</div>
                        ) : (
                          <>
                            <div className="stepper">
                              <div className="step-connector" style={{ left: `${offsetPct}%`, right: `${offsetPct}%` }}></div>
                              <div
                                className="step-connector-fill"
                                style={{ left: `${offsetPct}%`, width: `${fillWidthPct}%` }}
                              ></div>
                              {stages.map((s, i) => {
                                const status = s.percent === 100 ? "done" : i === currentStageIndex ? "current" : "";
                                return (
                                  <div className={status ? `step ${status}` : "step"} key={s.slug}>
                                    <div className="step-dot">
                                      {s.percent === 100 ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                          <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                      ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <circle cx="12" cy="12" r="9" />
                                          <path d="M12 7v5l3 3" />
                                        </svg>
                                      )}
                                    </div>
                                    <h6>{s.title}</h6>
                                    <div className="pct">{s.percent}%</div>
                                  </div>
                                );
                              })}
                            </div>
                            {currentStage ? (
                              <div className="stage-notice">
                                <div className="left">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 8v5M12 16h.01" />
                                  </svg>
                                  <div>
                                    <h6>
                                      Bạn đang ở giai đoạn {(currentStageIndex ?? 0) + 1}: {currentStage.title}
                                    </h6>
                                    <p>{currentStage.description}</p>
                                  </div>
                                </div>
                                <button onClick={() => router.push("/v2/hoc-vien-ai")}>Tiếp tục học</button>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>

                      <div>
                        <div className="card-head" style={{ marginBottom: 14 }}>
                          <h4>Tiếp tục học</h4>
                          <a onClick={() => router.push("/v2/hoc-vien-ai")} style={{ cursor: "pointer" }}>
                            Xem tất cả →
                          </a>
                        </div>
                        {journey.courses.length === 0 ? (
                          <div className="empty-hint">Chưa có khoá học nào đang học — bắt đầu tại Học viện AI.</div>
                        ) : (
                          <div className="course-grid">
                            {journey.courses.map((c, i) => {
                              const thumb = COURSE_THUMBS[i % COURSE_THUMBS.length];
                              return (
                                <div
                                  className="course-card"
                                  key={c.id}
                                  onClick={() => router.push("/v2/hoc-vien-ai")}
                                >
                                  <div className="course-thumb" style={{ background: thumb.bg }}>
                                    <span className="pct-badge">{c.percent}%</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke={thumb.stroke} strokeWidth="1.4">
                                      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                                    </svg>
                                  </div>
                                  <div className="course-body">
                                    <span className="course-tag" style={{ background: "var(--violet-light)", color: "var(--violet)" }}>
                                      Học viện AI
                                    </span>
                                    <h5>{c.name}</h5>
                                    <div className="course-meta">
                                      Bài {c.completedCount}/{c.lessonCount}
                                    </div>
                                    <div className="course-track">
                                      <div className="course-fill" style={{ width: `${c.percent}%` }}></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <aside className="right-col">
                      <div className="card">
                        <div className="card-head">
                          <h4>Chuỗi ngày học tập</h4>
                        </div>
                        <div className="streak-num">
                          <svg className="streak-flame" viewBox="0 0 24 24" fill="#ff6b45" stroke="none">
                            <path d="M12 2.5c2.4 1.8 3.8 4.6 3.8 8.3 0 2-.5 3.8-1.3 5.3l-2.5 2.4-2.5-2.4c-.8-1.5-1.3-3.3-1.3-5.3 0-3.7 1.4-6.5 3.8-8.3z" />
                          </svg>
                          {journey.streakDays} <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>ngày liên tiếp</span>
                        </div>
                        <div className="week-dots">
                          {journey.weekDots.map((d, i) => (
                            <div className={d.done ? "week-dot" : "week-dot off"} key={`${d.label}-${i}`}>
                              <div className="c">
                                {d.done ? (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                ) : null}
                              </div>
                              <span>{d.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-head">
                          <h4>Hoạt động gần đây</h4>
                        </div>
                        {journey.activities.length === 0 ? (
                          <div className="empty-hint">Chưa có hoạt động nào gần đây.</div>
                        ) : (
                          journey.activities.map((a) => {
                            const icon = ACTIVITY_ICON[a.kind];
                            return (
                              <div className="act-row" key={a.id}>
                                <div className="ico" style={{ background: icon.bg, color: icon.color }}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d={icon.path} />
                                  </svg>
                                </div>
                                <div className="info">
                                  <h6>
                                    {icon.prefix} &quot;{a.title}&quot;
                                  </h6>
                                  <span>{formatRelativeTime(a.occurredAt)}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="card">
                        <div className="card-head">
                          <h4>Thành tựu của tôi</h4>
                        </div>
                        {journey.badges.length === 0 ? (
                          <div className="empty-hint">Hệ thống huy hiệu đang được xây dựng — chưa có huy hiệu nào.</div>
                        ) : (
                          <div className="badge-grid">
                            {journey.badges.slice(0, 4).map((b, i) => (
                              <div className="badge-tile" style={{ background: BADGE_GRADIENTS[i % BADGE_GRADIENTS.length] }} key={b.id} title={b.name}>
                                {b.icon ? (
                                  <span style={{ position: "relative", zIndex: 1, fontSize: 20 }}>{b.icon}</span>
                                ) : (
                                  <svg viewBox="0 0 24 24" fill="#fff" stroke="none">
                                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                                  </svg>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="card">
                        <div className="card-head">
                          <h4>Liên kết nhanh</h4>
                        </div>
                        <div className="link-row" onClick={() => router.push("/v2/muc-tieu")}>
                          <div className="ico">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                            </svg>
                          </div>
                          <span>Mục tiêu của tôi</span>
                          <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </div>
                      </div>
                    </aside>
                  </div>
                )}
                {activeTab === "nhat-ky-hoc-tap" && <NhatKyHocTapTab log={log} />}
                {activeTab === "khu-vuon-cua-ban" && <KhuVuonCuaBanTab journey={journey} />}
                {activeTab === "my-story" && (
                  <div className="htct-native">
                    <PortalTabLabel icon="📖" label="Không gian riêng — My Story" tone={TAB_ACCENT["my-story"]} />
                    <MyStoryBook
                      {...story}
                      backHref={null}
                      workspaceHref="/v2/muc-tieu"
                      onOpenMirror={() => setActiveTab("mirror")}
                      mirrorInviteText={{ prefix: "Muốn im lặng một chút?", label: "Ghé qua Mirror" }}
                    />
                  </div>
                )}
                {activeTab === "mirror" && (
                  <div className="htct-native">
                    <PortalTabLabel icon="🌙" label="Không gian riêng — Mirror" tone={TAB_ACCENT.mirror} />
                    <MirrorChamber
                      {...mirror}
                      backHref={null}
                      academyHref="/v2/hoc-vien-ai"
                      onOpenStory={() => setActiveTab("my-story")}
                      storyInviteLabel="Chép lại câu trả lời trong My Story"
                    />
                  </div>
                )}
                {activeTab === "ban-do-hanh-trinh" && (
                  <div className="htct-native">
                    <PortalTabLabel icon="🧭" label="Không gian riêng — Bản đồ hành trình" tone={TAB_ACCENT["ban-do-hanh-trinh"]} />
                    <JourneyMapAtlas
                      {...map}
                      backHref={null}
                      academyHref="/v2/hoc-vien-ai"
                      storyHref="/v2/hanh-trinh-cua-toi"
                      workspaceHref="/v2/muc-tieu"
                      premiumHref="/v2/premium"
                      chapterDestinations={[
                        { href: "/v2/hoc-vien-ai", label: "Học viện AI" },
                        { href: "/v2/hoc-vien-ai", label: "AI Workspace" },
                        { href: "/v2/muc-tieu", label: "Workspace" },
                        { href: "/v2/premium", label: "Premium" },
                        { href: "/v2/affiliate", label: "Cộng đồng" },
                      ]}
                      portalConnections={[
                        { module: "ckos", href: "/v2/hoc-vien-ai", label: "Hệ tri thức AI" },
                        { module: "academy", href: "/v2/hoc-vien-ai", label: "Học viện AI" },
                        { module: "khong-gian-ai", href: "/v2/hoc-vien-ai", label: "AI Workspace" },
                        { module: "opportunities", href: "/v2/du-an-co-hoi", label: "Dự án & Cơ hội" },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
