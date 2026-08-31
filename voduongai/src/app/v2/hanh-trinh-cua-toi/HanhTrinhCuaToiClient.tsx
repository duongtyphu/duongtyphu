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

/** Hub — trang chủ tab "Hành trình của tôi" (Giai đoạn 10, thay hẳn
    progress-card/Lộ trình/Tiếp tục học/cột phụ cũ). 1 hộp jewel-tone cho
    MỖI tab trong 6 tab (kể cả chính nó) — bấm vào tương đương bấm tab đó
    trên thanh tab, dùng lại đúng `setActiveTab`. Không route/modal riêng. */
const HUB_CARD_STYLE: Record<
  TabKey,
  { bg: string; glow: string; iconBg: string; iconBorder: string; iconColor: string; descColor: string; statColor: string }
> = {
  "hanh-trinh-cua-toi": {
    bg: "linear-gradient(135deg,#3D2E75,#1B1638)",
    glow: "rgba(139,124,246,.28)",
    iconBg: "rgba(139,124,246,.16)",
    iconBorder: "rgba(139,124,246,.3)",
    iconColor: "#B8ADF9",
    descColor: "rgba(255,255,255,.62)",
    statColor: "#DDD5FC",
  },
  "nhat-ky-hoc-tap": {
    bg: "linear-gradient(135deg,#1E4976,#0E223A)",
    glow: "rgba(96,165,250,.26)",
    iconBg: "rgba(96,165,250,.16)",
    iconBorder: "rgba(96,165,250,.3)",
    iconColor: "#9DC5FB",
    descColor: "rgba(255,255,255,.62)",
    statColor: "#CFE3FC",
  },
  "khu-vuon-cua-ban": {
    bg: "linear-gradient(135deg,#0F3325,#081A2E)",
    glow: "rgba(74,222,128,.24)",
    iconBg: "rgba(74,222,128,.14)",
    iconBorder: "rgba(74,222,128,.28)",
    iconColor: "#7EE8A6",
    descColor: "rgba(255,255,255,.62)",
    statColor: "#BDF5D3",
  },
  "my-story": {
    bg: "linear-gradient(135deg,#8B6914,#2E2306)",
    glow: "rgba(251,191,36,.28)",
    iconBg: "rgba(251,191,36,.16)",
    iconBorder: "rgba(251,191,36,.32)",
    iconColor: "#FDE29B",
    descColor: "rgba(255,255,255,.68)",
    statColor: "#FCEBBE",
  },
  mirror: {
    bg: "linear-gradient(135deg,#1B2C3E,#0A141F)",
    glow: "rgba(34,211,238,.22)",
    iconBg: "rgba(34,211,238,.14)",
    iconBorder: "rgba(34,211,238,.28)",
    iconColor: "#8DE9F5",
    descColor: "rgba(255,255,255,.6)",
    statColor: "#C3F1F8",
  },
  "ban-do-hanh-trinh": {
    bg: "linear-gradient(135deg,#9A4B1F,#3D1D0C)",
    glow: "rgba(251,146,60,.26)",
    iconBg: "rgba(251,146,60,.16)",
    iconBorder: "rgba(251,146,60,.32)",
    iconColor: "#FDBE8B",
    descColor: "rgba(255,255,255,.62)",
    statColor: "#FCD9BC",
  },
};

const HUB_CARD_COPY: Record<TabKey, { headline: string; desc: string }> = {
  "hanh-trinh-cua-toi": { headline: "Toàn cảnh hành trình của bạn", desc: "Tiến độ, lộ trình học và gợi ý bước tiếp theo — mọi thứ ở một nơi." },
  "nhat-ky-hoc-tap": { headline: "Mỗi ngày một dòng nhật ký", desc: "Ghi lại buổi học, thực hành và điều bạn vừa nhận ra hôm nay." },
  "khu-vuon-cua-ban": { headline: "Một khu vườn lớn lên cùng bạn", desc: "Từng giai đoạn học nảy mầm thành một cái cây thật trong đêm." },
  "my-story": { headline: "Câu chuyện của riêng bạn", desc: "Khoảnh khắc, bước ngoặt và ký ức — ghim lại thành một tấm bảng sống động." },
  mirror: { headline: "Một khoảng lặng để nhìn lại", desc: "Không phải trả lời ai — chỉ để bạn thấy chính mình rõ hơn." },
  "ban-do-hanh-trinh": { headline: "Con đường bạn đang đi", desc: "5 chương cuộc đời — từ nơi bắt đầu đến nơi bạn chưa từng tới." },
};

/** Founder từng yêu cầu thêm "chiều sâu, độ bóng" cho nền đặc của 3 tab
 * (My Story/Mirror/Bản đồ hành trình) — 2 lớp radial "ánh sáng gần đầu
 * trang" + vignette `boxShadow` (đã bỏ ở đợt trước vì gây cảm giác "lớp
 * phủ" dưới thanh tab). Giờ Founder yêu cầu BỎ HẲN toàn bộ hiệu ứng "chiều
 * sâu" còn lại, áp dụng cho cả 5 tab: mỗi hằng số chỉ còn ĐÚNG 1 chuỗi
 * `var(--bg)` — biến CSS đã được override theo tab đang mở ngay tại
 * `.htct` (`style={{"--bg": htctBg}}`), kế thừa tự nhiên xuống
 * `MyStoryBook`/`MirrorChamber`/`JourneyMapAtlas` qua prop `bgOverride`.
 * `TAB_HEADER_BG` vẫn là NƠI DUY NHẤT định nghĩa 5 giá trị hex thật trong
 * toàn bộ file — 3 hằng số này chỉ còn là cầu nối `var(--bg)` cho đúng 3
 * component dùng chung Portal 1.0. */
const STORY_BG = "var(--bg)";
const MIRROR_BG = "var(--bg)";
const MAP_BG = "var(--bg)";

/** Founder yêu cầu riêng: màu của mỗi tab (5 tab, KHÔNG tính Hub — Hub giữ
 * nguyên nền đen + 6 hộp màu) phải phủ luôn phần "header" — dòng tiêu đề
 * "Hành trình của tôi" + thanh 6 nút chuyển tab — chứ không chỉ riêng
 * `.tab-panel` (nội dung) bên dưới như trước. Dùng ĐÚNG màu đặc (base hex,
 * không kèm lớp radial "chiều sâu") của từng tab để khớp tông với nội dung
 * ngay bên dưới nó. `hanh-trinh-cua-toi` (Hub) → `undefined`, giữ nền đen. */
const TAB_HEADER_BG: Partial<Record<TabKey, string>> = {
  "nhat-ky-hoc-tap": "#0F3660",
  "khu-vuon-cua-ban": "#0D2C50",
  "my-story": "#5A4010",
  mirror: "#152A3D",
  "ban-do-hanh-trinh": "#4A3212",
};

const HUB_CARD_ICON: Record<TabKey, React.ReactNode> = {
  "hanh-trinh-cua-toi": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14l3-3.5 2 2 4-4.5" />
    </svg>
  ),
  "nhat-ky-hoc-tap": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </svg>
  ),
  "khu-vuon-cua-ban": (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9 7 6 10 6 14a6 6 0 0012 0c0-4-3-7-6-12z" />
    </svg>
  ),
  "my-story": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M15 2v5h5" />
    </svg>
  ),
  mirror: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" opacity=".6" />
    </svg>
  ),
  "ban-do-hanh-trinh": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
};

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
  const { stages } = journey;

  /** Chỉ số rút gọn hiện trong từng hộp Hub — luôn lấy đúng field props đã
      có sẵn (không tính lại field nào cần đọc localStorage phía client như
      `chapter`/`corkNotes`, vốn chỉ tính được bên trong chính component của
      tab đó) — Bản đồ hành trình vì vậy dùng 1 dòng cấu trúc thật cố định
      (5 chương) thay vì suy đoán lại chương hiện tại ở đây. */
  const hubStat: Record<TabKey, string> = {
    "hanh-trinh-cua-toi": `${journey.overallPercent}% hoàn thành${goals.length > 0 ? ` · ${activeGoals}/${goals.length} mục tiêu` : ""}`,
    "nhat-ky-hoc-tap": log.stats.notesCount > 0 ? `${log.stats.notesCount} ghi chú đã lưu` : "Chưa có ghi chú nào",
    "khu-vuon-cua-ban": stages.length > 0 ? `${stages.filter((s) => s.percent > 0).length} / ${stages.length} giai đoạn đang lớn` : "Chưa có giai đoạn nào",
    "my-story":
      story.capsules.length + story.milestones.length > 0
        ? `${story.capsules.length + story.milestones.length} ký ức & bước ngoặt đã lưu`
        : "Chưa có ký ức nào",
    mirror: mirror.reflectionCount > 0 ? `${mirror.reflectionCount} chiêm nghiệm đã ghi lại` : "Chưa có chiêm nghiệm nào",
    "ban-do-hanh-trinh": "5 chương cuộc đời",
  };

  /* Founder đổi quyết định (sau khi thấy ảnh chụp "màu nền liền mạch"): màu
     riêng của tab đang mở phải kéo lên TỚI CẢ topbar (ô tìm kiếm/chuông/
     avatar), không dừng ở dòng tiêu đề như bản trước — áp dụng cho cả 5 tab
     (không tính Hub). Giải pháp gọn nhất: `.topbar{background:var(--bg)}`
     (hanh-trinh-cua-toi.css dòng 83) VÀ toàn bộ `.content`/`.center-col`/
     `.page-head`/`.tab-bar`/khe hở giữa chúng đều KHÔNG có background riêng
     — chỉ kế thừa `background:var(--bg)` đặt trên chính `.htct` (dòng 49-59)
     — nên override đúng 1 biến CSS `--bg` ngay tại gốc `.htct` là màu lan
     tự động khắp mọi vùng chưa được tô màu riêng, kể cả topbar, KHÔNG cần
     bọc div/margin âm/padding bù thủ công như bản trước (đã revert). Hub
     (`activeTab==="hanh-trinh-cua-toi"`) không có trong `TAB_HEADER_BG` →
     giữ nguyên mặc định `#0a0a0f` (đen) của class `.htct`. */
  const htctBg = TAB_HEADER_BG[activeTab];

  return (
    <div className="htct" style={htctBg ? ({ "--bg": htctBg } as React.CSSProperties) : undefined}>
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

              <div className="tab-panel">
                {activeTab === "hanh-trinh-cua-toi" && (
                  <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
                    <div className="absolute inset-0 z-0" style={{ background: "#0A0A0F" }} aria-hidden />
                    <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
                      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
                        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-.01em" }}>
                          Chào bạn, đây là hành trình của bạn
                        </h1>
                        <p style={{ color: "rgba(255,255,255,.5)", fontSize: 14.5, margin: "0 0 36px", maxWidth: 580 }}>
                          6 không gian — mỗi nơi một cách nhìn khác về cùng một hành trình học AI của bạn.
                        </p>

                        <div className="hub-grid">
                          {TABS.map((t) => {
                            const style = HUB_CARD_STYLE[t.key];
                            const copy = HUB_CARD_COPY[t.key];
                            return (
                              <button
                                key={t.key}
                                type="button"
                                className="hub-card"
                                style={{ background: style.bg }}
                                onClick={() => setActiveTab(t.key)}
                              >
                                <div className="hub-card-grain" aria-hidden />
                                <div className="hub-card-glow" style={{ background: `radial-gradient(circle, ${style.glow}, transparent 70%)` }} aria-hidden />
                                <div className="hub-card-inner">
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div className="hub-icon" style={{ background: style.iconBg, border: `1px solid ${style.iconBorder}`, color: style.iconColor }}>
                                      {HUB_CARD_ICON[t.key]}
                                    </div>
                                    <svg className="hub-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={style.iconColor} strokeWidth="2.2">
                                      <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                  </div>
                                  <h3>{copy.headline}</h3>
                                  <p style={{ color: style.descColor }}>{copy.desc}</p>
                                  <div className="hub-stat">
                                    <span className="dot" style={{ background: style.statColor }} />
                                    <span style={{ color: style.statColor }}>{hubStat[t.key]}</span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "nhat-ky-hoc-tap" && <NhatKyHocTapTab log={log} />}
                {activeTab === "khu-vuon-cua-ban" && <KhuVuonCuaBanTab journey={journey} />}
                {activeTab === "my-story" && (
                  <div className="htct-native">
                    <MyStoryBook
                      {...story}
                      backHref={null}
                      workspaceHref="/v2/muc-tieu"
                      onOpenMirror={() => setActiveTab("mirror")}
                      mirrorInviteText={{ prefix: "Muốn im lặng một chút?", label: "Ghé qua Mirror" }}
                      variant="corkboard"
                      bgOverride={STORY_BG}
                    />
                  </div>
                )}
                {activeTab === "mirror" && (
                  <div className="htct-native">
                    <MirrorChamber
                      {...mirror}
                      backHref={null}
                      academyHref="/v2/hoc-vien-ai"
                      onOpenStory={() => setActiveTab("my-story")}
                      storyInviteLabel="Chép lại câu trả lời trong My Story"
                      bgOverride={MIRROR_BG}
                      hideCompanionLogo
                      artAlign="right"
                    />
                  </div>
                )}
                {activeTab === "ban-do-hanh-trinh" && (
                  <div className="htct-native">
                    <JourneyMapAtlas
                      {...map}
                      backHref={null}
                      academyHref="/v2/hoc-vien-ai"
                      storyHref="/v2/hanh-trinh-cua-toi"
                      workspaceHref="/v2/muc-tieu"
                      premiumHref="/v2/premium"
                      bgOverride={MAP_BG}
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
