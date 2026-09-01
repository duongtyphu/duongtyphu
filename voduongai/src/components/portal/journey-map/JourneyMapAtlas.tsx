"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
import { getCurrentChapterFromClient, JOURNEY_CHAPTER_NAMES, type JourneyChapter } from "@/lib/portal/foundation/journey-chapter";
import { getGardenSummary, getModuleActivitySummary } from "@/lib/portal/foundation/growth-view";
import type { Reflection } from "@/lib/portal/reflections";
import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "@/components/portal/journey-map/EditModeContext";
import { EditableRegion } from "@/components/portal/journey-map/EditableRegion";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * JOURNEY PLATFORM — Phase P6: Journey Map, "Ancient Atlas".
 *
 * KHÔNG phải timeline/progress tracker/roadmap/checklist/kanban/LMS
 * progress page. Trả lời đúng một câu hỏi: "Tôi đang đi về đâu tiếp
 * theo?" — không đo tốc độ, chỉ chỉ hướng. Không bao giờ tạo áp lực,
 * không so sánh người dùng với ai khác.
 *
 * Cấu trúc 6 khối theo brief: La bàn → Vị trí hiện tại → 5 Chương cuộc
 * đời (3 trạng thái, KHÔNG %) → Kết nối tới Portal → Hướng tiếp theo
 * (một gợi ý duy nhất) → Lời khép của Companion.
 */

type ChapterState = "not-yet" | "current" | "walked";

/** Việc 9 — static chrome AN TOÀN đã tách khỏi hardcode, đọc live từ bảng
 * `map_chrome` (1 dòng, id='map'), fetch ở page.tsx rồi truyền props
 * xuống — cùng cách Mirror/Nhật ký học tập/My Story. KHÔNG bao gồm
 * CHAPTER_DESTINATIONS/PORTAL_CONNECTIONS (xem audit trong CLAUDE.md —
 * cả 2 gắn index/key thật, không phải chrome). */
export type MapChrome = {
  id: string;
  status: string;
  title: string;
  subtitle: string;
  emptyStateLine: string;
  emptyStateCtaLabel: string;
  currentPositionLabel: string;
  noChapterYetLine: string;
  chaptersSectionLabel: string;
  statesCaption: string;
  connectionsSectionLabel: string;
  premiumConnectionLabel: string;
  nextDirectionSectionLabel: string;
  closingLine: string;
};

const CHAPTER_DESTINATIONS = [
  { href: "/portal/hocvienai", label: "Học viện AI" },
  { href: "/portal/aiworkspace", label: "AI Workspace" },
  { href: "/portal/workspace", label: "Workspace" },
  { href: "/portal/premium", label: "Premium" },
  { href: "/portal/congdongai", label: "Cộng đồng" },
] as const;

/** Lệch dọc (px) từng Chương trên tuyến đường — khớp đúng 5 điểm neo của
 * `path d=` bên dưới (viewBox 500x70, gốc y=35) để marker luôn nằm đúng
 * trên đường vẽ dù container co giãn theo % chiều rộng thật. */
const CHAPTER_WAVE_OFFSET = [0, -20, 14, -20, 0] as const;

const PORTAL_CONNECTIONS = [
  { module: "ckos" as const, href: "/portal/hetrithucai", label: "Hệ tri thức AI" },
  { module: "academy" as const, href: "/portal/hocvienai", label: "Học viện AI" },
  { module: "khong-gian-ai" as const, href: "/portal/aiworkspace", label: "AI Workspace" },
  { module: "opportunities" as const, href: "/portal/duan-cohoi", label: "Dự án & Cơ hội" },
];

/** 8 điểm la bàn (viết tắt tiếng Việt: Bắc/Đông Bắc/Đông/...), toạ độ
    tính sẵn quanh vòng tròn r=44, tâm (56,56) — khớp `CompassRose` bên
    dưới, không tính lượng giác lúc render. */
const COMPASS_POINTS = [
  { label: "B", x: 56, y: 12 },
  { label: "ĐB", x: 87, y: 25 },
  { label: "Đ", x: 100, y: 56 },
  { label: "ĐN", x: 87, y: 87 },
  { label: "N", x: 56, y: 100 },
  { label: "TN", x: 25, y: 87 },
  { label: "T", x: 12, y: 56 },
  { label: "TB", x: 25, y: 25 },
] as const;

/** La bàn 8 hướng — thay lucide `Compass` đơn giản cũ (Giai đoạn 10, chi
    tiết hơn cho khí quyển bản đồ): 2 vòng viền + 8 điểm B/Đ/N/T + kim
    xoay rất chậm (`.map-compass-needle`, khác `.map-compass` lay nhẹ cả
    khối bên ngoài). */
function CompassRose() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" className="map-compass mx-auto" aria-hidden>
      <defs>
        <linearGradient id="mapNeedleGrad" x1="56" y1="18" x2="56" y2="94" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#7c5c3a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
      </defs>
      <circle cx="56" cy="56" r="50" fill="none" stroke="rgba(251,146,60,0.28)" strokeWidth="1" />
      <circle cx="56" cy="56" r="38" fill="none" stroke="rgba(251,146,60,0.18)" strokeWidth="1" />
      {COMPASS_POINTS.map((p) => (
        <text
          key={p.label}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7"
          fontWeight="700"
          fill="rgba(253,186,116,0.65)"
        >
          {p.label}
        </text>
      ))}
      <g className="map-compass-needle">
        <path d="M56 18 L63 56 L56 94 L49 56 Z" fill="url(#mapNeedleGrad)" />
      </g>
      <circle cx="56" cy="56" r="4.5" fill="#FDBA74" />
    </svg>
  );
}

/** Dãy núi — 3 lớp silhouette cuối khung, chỉ khí quyển trang trí ("còn
    nhiều chặng đường phía trước"), không phải nội dung. Mỗi lớp đung đưa
    ngang rất nhẹ (`.map-mountain-layer-{1,2,3}`, tốc độ khác nhau theo
    độ sâu — parallax) + 3 "vệt gió" (`.map-wind-wisp`) trôi ngang theo
    chu kỳ, gợi cảm giác gió thổi qua rặng núi (Founder yêu cầu riêng, đợt
    khôi phục khí quyển sau khi bug "2 lớp nền" đã sửa tận gốc — xem
    `globals.css`). */
function MapMountains() {
  return (
    <svg className="map-mountains" viewBox="0 0 500 160" preserveAspectRatio="none" height="160" aria-hidden>
      <path
        className="map-mountain-layer-1"
        d="M0 160 L0 96 L60 58 L120 100 L180 40 L240 96 L300 64 L360 108 L420 52 L470 92 L500 70 L500 160 Z"
        fill="rgba(251,146,60,0.05)"
      />
      <path
        className="map-mountain-layer-2"
        d="M0 160 L0 122 L80 84 L150 128 L220 78 L290 130 L360 90 L430 132 L500 100 L500 160 Z"
        fill="rgba(251,146,60,0.08)"
      />
      <path
        className="map-mountain-layer-3"
        d="M0 160 L0 140 L100 112 L200 146 L300 108 L400 144 L500 118 L500 160 Z"
        fill="rgba(251,146,60,0.12)"
      />
      <path className="map-wind-wisp" d="M-40 70 Q -10 62 20 70 T 80 70" stroke="rgba(253,222,155,.4)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path className="map-wind-wisp" d="M-40 95 Q -10 89 20 95 T 80 95" stroke="rgba(253,222,155,.32)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path className="map-wind-wisp" d="M-40 50 Q -10 44 20 50 T 80 50" stroke="rgba(253,222,155,.28)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Nhóm field cho panel Live-edit luôn hiện — `isFullyEmpty` và
 * `currentChapter === null` là 2 điều kiện runtime khác nhau, phụ thuộc
 * dữ liệu thật của phiên đang xem; không đảm bảo 100% reachability nếu
 * chỉ bọc EditableRegion tại vị trí hiển thị tự nhiên. */
const HEADER_FIELDS: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "subtitle", label: "Câu phụ đề", type: "textarea", full: true, required: true },
];
const EMPTY_STATE_FIELDS: FieldConfig[] = [
  { key: "emptyStateLine", label: "Trạng thái trống — dòng chữ", type: "textarea", full: true, required: true },
  { key: "emptyStateCtaLabel", label: "Nhãn nút ở trạng thái trống", type: "text", required: true },
];
const SECTION_LABEL_FIELDS: FieldConfig[] = [
  { key: "currentPositionLabel", label: "Nhãn mục 'Vị trí hiện tại'", type: "text", required: true },
  { key: "noChapterYetLine", label: "Dòng chữ khi chưa có chương nào", type: "textarea", full: true, required: true },
  { key: "chaptersSectionLabel", label: "Nhãn mục 'Năm chương cuộc đời'", type: "text", required: true },
  { key: "statesCaption", label: "Chú thích 3 trạng thái", type: "textarea", full: true, required: true },
  { key: "connectionsSectionLabel", label: "Nhãn mục 'Kết nối tới Portal'", type: "text", required: true },
  { key: "premiumConnectionLabel", label: "Nhãn khối 'Premium'", type: "text", required: true },
  { key: "nextDirectionSectionLabel", label: "Nhãn mục 'Hướng tiếp theo'", type: "text", required: true },
];
const FOOTER_FIELDS: FieldConfig[] = [
  { key: "closingLine", label: "Lời khép của Companion", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export function JourneyMapAtlas({
  reflections,
  premiumCount,
  seedChrome,
  backHref = "/portal/hanhtrinhcuatoi",
  academyHref = "/portal/hocvienai",
  storyHref = "/portal/story",
  workspaceHref = "/portal/workspace",
  premiumHref = "/portal/premium",
  chapterDestinations = CHAPTER_DESTINATIONS,
  portalConnections = PORTAL_CONNECTIONS,
  bgOverride,
  bgShadow,
  fullBleed = true,
}: {
  reflections: Reflection[];
  premiumCount: number;
  seedChrome: MapChrome;
  /** Đích nút "← Hành trình của tôi" — `null` để ẩn hẳn (khi nhúng làm 1
      tab bên trong `/v2/hanh-trinh-cua-toi`). */
  backHref?: string | null;
  /** Đích CTA trạng thái trống + "hướng tiếp theo" khi chưa có hành trình. */
  academyHref?: string;
  /** Đích "hướng tiếp theo" khi chưa có suy ngẫm nào. */
  storyHref?: string;
  /** Đích "hướng tiếp theo" khi đã có hành trình (tiếp tục thực hành). */
  workspaceHref?: string;
  /** Đích dòng "Kết nối tới Portal" — Premium. */
  premiumHref?: string;
  /** 5 đích của "Năm Chương cuộc đời" — GIỮ NGUYÊN index-bound với
      `JOURNEY_CHAPTER_NAMES`, chỉ đổi được nguyên mảng, không đổi lẻ 1 phần
      tử (xem CLAUDE.md — rủi ro cao nhất đã audit). */
  chapterDestinations?: readonly { href: string; label: string }[];
  /** 4 đích "Kết nối tới Portal" — GIỮ NGUYÊN field `module` (khoá tra cứu
      thật vào `getModuleActivitySummary()`), chỉ đổi `href`/`label`. */
  portalConnections?: readonly { module: (typeof PORTAL_CONNECTIONS)[number]["module"]; href: string; label: string }[];
  /** Founder yêu cầu riêng cho tab nhúng: màu nền ĐẶC phủ toàn trang giữa
      (thay `.map-parchment-bg` gradient góc mặc định của 1.0) — override
      qua inline style, không đụng `/portal/hanhtrinhcuatoi/ban-do`. */
  bgOverride?: string;
  /** Founder yêu cầu thêm "chiều sâu, độ bóng" cho nền — `boxShadow`
      vignette (px cố định, an toàn cho trang dài) áp cùng div với
      `bgOverride`. */
  bgShadow?: string;
  /** RỦI RO CAO — Founder báo "vẫn còn 2 lớp nền" NHIỀU LẦN dù màu đã
      khớp tuyệt đối. Root cause thật sự: `-mx-4 -my-6 md:-mx-8 md:-my-8`
      viết cho ngữ cảnh 1.0 (`/portal/hanhtrinhcuatoi/ban-do`, trang cha
      CÓ padding cần phá) — ở tab nhúng 2.0, `.tab-panel` KHÔNG có padding
      nào để bù, margin âm vẫn kéo div tràn 32px mỗi cạnh, lấn vào khe hở
      trên `.tab-bar` — đây MỚI là "2 lớp" thật. `fullBleed=false` (chỉ
      set ở tab nhúng 2.0) bỏ margin âm — an toàn vì không có padding nào
      cần bù. Mặc định `true` giữ nguyên 100% hành vi 1.0. */
  fullBleed?: boolean;
}) {
  const editMode = useEditMode();
  const { items: chromeItems, update: updateChrome } = useCollection<MapChrome>("map-chrome", [seedChrome], {
    enabled: editMode,
  });
  const chrome = chromeItems[0] ?? seedChrome;
  const [chapter, setChapter] = useState<JourneyChapter | undefined>(undefined);
  const [connections, setConnections] = useState<{ label: string; href: string; count: number }[]>([]);
  const [hasAnyJourney, setHasAnyJourney] = useState<boolean | null>(null);

  useEffect(() => {
    const summary = getGardenSummary();
    const conns = portalConnections.map((c) => ({
      label: c.label,
      href: c.href,
      count: getModuleActivitySummary(c.module).sessionCount,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc localStorage chỉ có ở client sau mount
    setChapter(getCurrentChapterFromClient(premiumCount));
    setConnections(conns);
    setHasAnyJourney(summary.journeysTouched > 0);
  }, [premiumCount, portalConnections]);

  if (chapter === undefined || hasAnyJourney === null) {
    return (
      <div
        className="map-parchment-bg min-h-[70vh] rounded-3xl"
        style={bgOverride ? { background: bgOverride, boxShadow: bgShadow } : undefined}
        aria-hidden
      />
    );
  }
  // Gán lại thành hằng số mới để TypeScript giữ nguyên kiểu đã hẹp
  // (JourneyChapter, không còn `undefined`) bên trong các closure phía dưới.
  const currentChapter = chapter;

  const isFullyEmpty = currentChapter === null && connections.every((c) => c.count === 0) && reflections.length === 0;

  function chapterState(index: number): ChapterState {
    if (currentChapter === null) return "not-yet";
    if (index === currentChapter.index) return "current";
    return index < currentChapter.index ? "walked" : "not-yet";
  }

  // Hướng tiếp theo — MỘT gợi ý duy nhất, ưu tiên theo dữ liệu thật.
  const nextDirection =
    reflections.length === 0
      ? { text: "Viết suy ngẫm đầu tiên của bạn.", href: storyHref }
      : !hasAnyJourney
        ? { text: "Bắt đầu hành trình học đầu tiên của bạn.", href: academyHref }
        : { text: "Tiếp tục thực hành trong Workspace.", href: workspaceHref };

  return (
    <div className={fullBleed ? "relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8" : "relative min-h-full overflow-hidden"}>
      <div className="map-parchment-bg" style={bgOverride ? { background: bgOverride, boxShadow: bgShadow } : undefined} aria-hidden />
      {/* ĐÃ KHÔI PHỤC theo yêu cầu Founder — 3 lớp khí quyển (lưới toạ độ/
          đường topo/silhouette núi) từng bị gate `!bgOverride` (PR #99/
          #101, khi "lớp phủ" còn bị nhầm là do các lớp này) — root cause
          THẬT của "2 lớp nền" hoá ra là margin âm phá khung sai ngữ cảnh
          (PR #105, đã sửa tận gốc, không liên quan các lớp khí quyển
          này). Giờ render KHÔNG ĐIỀU KIỆN, giống hệt
          `/portal/hanhtrinhcuatoi/ban-do` 1.0 — an toàn vì `fullBleed`
          (PR #105) đã đảm bảo khung chứa các lớp này khớp khít
          `.tab-panel`, không còn tràn ra ngoài nữa. */}
      <div className="map-coordinate-grid" aria-hidden />
      <div className="map-topo-lines" aria-hidden />
      <MapMountains />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — giữ nguyên đúng khoảng cách trước đây, chỉ khí
       * quyển nền phía sau mới full-bleed. */}
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 md:py-14">
        {backHref !== null && (
          <PortalBackLink
            href={backHref}
            label="Hành trình của tôi"
            colorClassName="text-white/40 hover:text-white/70"
          />
        )}

        {editMode && (
          <div className="mt-6 space-y-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">Live-edit — Nội dung Bản đồ hành trình</p>
            <EditableRegion record={chrome} fields={HEADER_FIELDS} update={updateChrome}>
              <p className="text-sm text-white/70">Tiêu đề &amp; câu phụ đề</p>
            </EditableRegion>
            <EditableRegion record={chrome} fields={EMPTY_STATE_FIELDS} update={updateChrome}>
              <p className="text-sm text-white/70">Trạng thái trống (dòng chữ + CTA)</p>
            </EditableRegion>
            <EditableRegion record={chrome} fields={SECTION_LABEL_FIELDS} update={updateChrome}>
              <p className="text-sm text-white/70">7 nhãn mục nội dung</p>
            </EditableRegion>
            <EditableRegion record={chrome} fields={FOOTER_FIELDS} update={updateChrome}>
              <p className="text-sm text-white/70">Lời khép Companion + trạng thái: {chrome.status}</p>
            </EditableRegion>
          </div>
        )}

        {/* ── 1. La bàn ────────────────────────────────────────────────── */}
        {/* Founder yêu cầu: tăng kích cỡ chữ vừa phải (h1/subtitle) — cụm
            này vốn đã `mx-auto`/`text-center`, đã căn giữa đúng cấu trúc
            có sẵn (không có max-width cha nào giới hạn lệch trái/phải). */}
        <header className="mt-8 text-center">
          <CompassRose />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white/90 sm:text-4xl">
            {chrome.title}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-white/55">
            {chrome.subtitle}
          </p>
        </header>

        {isFullyEmpty ? (
          <div className="mt-20 text-center">
            <p className="mx-auto max-w-sm text-base italic leading-relaxed text-white/60">
              {chrome.emptyStateLine}
            </p>
            <Link
              href={academyHref}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-300 underline decoration-orange-300/30 underline-offset-4 hover:decoration-orange-200"
            >
              {chrome.emptyStateCtaLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── 2. Vị trí hiện tại ─────────────────────────────────────── */}
            <section className="mt-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-300/60">{chrome.currentPositionLabel}</p>
              {currentChapter ? (
                <>
                  <p className="mt-2 text-xl font-bold text-white/90">{currentChapter.name}</p>
                  <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-white/55">{currentChapter.evidence}</p>
                </>
              ) : (
                <p className="mx-auto mt-2 max-w-sm text-sm italic leading-relaxed text-white/55">
                  {chrome.noChapterYetLine}
                </p>
              )}
            </section>

            {/* ── 3. Năm Chương cuộc đời — tuyến đường trên bản đồ ───────── */}
            <section className="mt-14">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-orange-300/60">
                {chrome.chaptersSectionLabel}
              </p>
              <div className="relative mt-6 h-[130px] sm:h-[110px]">
                <svg
                  aria-hidden
                  className="pointer-events-none absolute left-0 right-0 top-0 h-[70px] w-full"
                  viewBox="0 0 500 70"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 50 35 C 90 35, 110 15, 150 15 C 190 15, 210 49, 250 49 C 290 49, 310 15, 350 15 C 390 15, 410 35, 450 35"
                    className="map-route-path"
                    stroke="rgba(251,146,60,0.4)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
                <ol className="relative grid h-[70px] grid-cols-5 gap-1">
                  {JOURNEY_CHAPTER_NAMES.map((name, i) => {
                    const idx = i + 1;
                    const state = chapterState(idx);
                    const wave = CHAPTER_WAVE_OFFSET[i] ?? 0;
                    return (
                      <li
                        key={name}
                        className="relative flex flex-col items-center text-center"
                        style={{ transform: `translateY(${wave}px)` }}
                      >
                        <span
                          title={`Chương ${idx} — ${name}`}
                          aria-label={`Chương ${idx}: ${name} — ${
                            state === "current" ? "đang sống" : state === "walked" ? "đã đi qua" : "chưa bắt đầu"
                          }`}
                          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                            state === "current"
                              ? "map-chapter-pulse border-orange-400 bg-orange-500 text-white"
                              : state === "walked"
                                ? "border-orange-600/70 bg-orange-600/70 text-white"
                                : "border-white/15 bg-white/5 text-white/25 opacity-70 blur-[0.3px]"
                          }`}
                        >
                          {idx}
                        </span>
                        {state === "walked" && (
                          <svg aria-hidden width="14" height="8" viewBox="0 0 14 8" className="mt-1 opacity-50">
                            <ellipse cx="3" cy="2.5" rx="2" ry="2.5" fill="#FDBA74" />
                            <ellipse cx="11" cy="5.5" rx="2" ry="2.5" fill="#FDBA74" />
                          </svg>
                        )}
                        <span
                          className={`mt-1.5 text-[10px] leading-tight ${
                            state === "not-yet" ? "text-white/25" : "text-white/70"
                          }`}
                        >
                          {name}
                        </span>
                        {state !== "not-yet" && (
                          <Link
                            href={chapterDestinations[i].href}
                            className="mt-1 text-[9px] font-semibold text-orange-300/70 underline decoration-orange-300/25 underline-offset-2 hover:text-orange-200"
                          >
                            {chapterDestinations[i].label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
              <p className="mx-auto mt-6 max-w-sm text-center text-[11px] leading-relaxed text-white/40">
                {chrome.statesCaption}
              </p>
            </section>

            {/* ── 4. Kết nối tới Portal ──────────────────────────────────── */}
            <section className="mt-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-300/60">{chrome.connectionsSectionLabel}</p>
              <div className="mt-4 space-y-2.5">
                {connections.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition hover:border-white/20 hover:bg-white/10"
                  >
                    <span className="font-semibold text-white/80">{c.label}</span>
                    <span className="text-xs text-white/45">
                      {c.count > 0 ? `Đã chạm tới — ${c.count} phiên thật` : "Chưa chạm tới"}
                    </span>
                  </Link>
                ))}
                <Link
                  href={premiumHref}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition hover:border-white/20 hover:bg-white/10"
                >
                  <span className="font-semibold text-white/80">{chrome.premiumConnectionLabel}</span>
                  <span className="text-xs text-white/45">
                    {premiumCount > 0 ? `Đang đồng hành — ${premiumCount} chương trình` : "Chưa tham gia"}
                  </span>
                </Link>
              </div>
            </section>

            {/* ── 5. Hướng tiếp theo — một gợi ý duy nhất ─────────────────── */}
            <section className="mt-14 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-300/60">{chrome.nextDirectionSectionLabel}</p>
              <Link
                href={nextDirection.href}
                className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold text-orange-300 underline decoration-orange-300/30 underline-offset-4 hover:decoration-orange-200"
              >
                {nextDirection.text} <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </>
        )}

        {/* ── 6. Lời khép của Companion ──────────────────────────────────── */}
        <p className="mx-auto mt-16 max-w-sm text-center text-sm italic leading-relaxed text-white/40">
          {chrome.closingLine}
        </p>
      </div>
      </div>
    </div>
  );
}
