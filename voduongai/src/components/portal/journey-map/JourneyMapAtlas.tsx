"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
import { getCurrentChapterFromClient, JOURNEY_CHAPTER_NAMES, type JourneyChapter } from "@/lib/portal/foundation/journey-chapter";
import { getGardenSummary, getModuleActivitySummary } from "@/lib/portal/foundation/growth-view";
import type { Reflection } from "@/lib/portal/reflections";

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

const PORTAL_CONNECTIONS = [
  { module: "ckos" as const, href: "/portal/hetrithucai", label: "Hệ tri thức AI" },
  { module: "academy" as const, href: "/portal/hocvienai", label: "Học viện AI" },
  { module: "khong-gian-ai" as const, href: "/portal/aiworkspace", label: "AI Workspace" },
  { module: "opportunities" as const, href: "/portal/duan-cohoi", label: "Dự án & Cơ hội" },
];

export function JourneyMapAtlas({
  reflections,
  premiumCount,
  chrome,
}: {
  reflections: Reflection[];
  premiumCount: number;
  chrome: MapChrome;
}) {
  const [chapter, setChapter] = useState<JourneyChapter | undefined>(undefined);
  const [connections, setConnections] = useState<{ label: string; href: string; count: number }[]>([]);
  const [hasAnyJourney, setHasAnyJourney] = useState<boolean | null>(null);

  useEffect(() => {
    const summary = getGardenSummary();
    const conns = PORTAL_CONNECTIONS.map((c) => ({
      label: c.label,
      href: c.href,
      count: getModuleActivitySummary(c.module).sessionCount,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc localStorage chỉ có ở client sau mount
    setChapter(getCurrentChapterFromClient(premiumCount));
    setConnections(conns);
    setHasAnyJourney(summary.journeysTouched > 0);
  }, [premiumCount]);

  if (chapter === undefined || hasAnyJourney === null) {
    return <div className="map-parchment-bg min-h-[70vh] rounded-3xl" aria-hidden />;
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
      ? { text: "Viết suy ngẫm đầu tiên của bạn.", href: "/portal/story" }
      : !hasAnyJourney
        ? { text: "Bắt đầu hành trình học đầu tiên của bạn.", href: "/portal/hocvienai" }
        : { text: "Tiếp tục thực hành trong Workspace.", href: "/portal/workspace" };

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      <div className="map-parchment-bg" aria-hidden />
      <div className="map-topo-lines" aria-hidden />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — giữ nguyên đúng khoảng cách trước đây, chỉ khí
       * quyển nền phía sau mới full-bleed. */}
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 md:py-14">
        <PortalBackLink
          href="/portal/hanhtrinhcuatoi"
          label="Hành trình của tôi"
          colorClassName="text-amber-950/40 hover:text-amber-950/70"
        />

        {/* ── 1. La bàn ────────────────────────────────────────────────── */}
        <header className="mt-8 text-center">
          <Compass className="map-compass mx-auto h-12 w-12 text-amber-800/70" strokeWidth={1.25} />
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-amber-950/90 sm:text-3xl">
            {chrome.title}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-amber-950/55">
            {chrome.subtitle}
          </p>
        </header>

        {isFullyEmpty ? (
          <div className="mt-20 text-center">
            <p className="mx-auto max-w-sm text-base italic leading-relaxed text-amber-950/60">
              {chrome.emptyStateLine}
            </p>
            <Link
              href="/portal/hocvienai"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 underline decoration-amber-800/30 underline-offset-4 hover:decoration-amber-800"
            >
              {chrome.emptyStateCtaLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── 2. Vị trí hiện tại ─────────────────────────────────────── */}
            <section className="mt-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-800/50">{chrome.currentPositionLabel}</p>
              {currentChapter ? (
                <>
                  <p className="mt-2 text-xl font-bold text-amber-950/90">{currentChapter.name}</p>
                  <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-amber-950/55">{currentChapter.evidence}</p>
                </>
              ) : (
                <p className="mx-auto mt-2 max-w-sm text-sm italic leading-relaxed text-amber-950/55">
                  {chrome.noChapterYetLine}
                </p>
              )}
            </section>

            {/* ── 3. Năm Chương cuộc đời — tuyến đường trên bản đồ ───────── */}
            <section className="mt-14">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-amber-800/50">
                {chrome.chaptersSectionLabel}
              </p>
              <div className="relative mt-8">
                <svg
                  aria-hidden
                  className="pointer-events-none absolute left-0 right-0 top-[13px] h-[2px] w-full"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    className="map-route-path"
                    stroke="rgba(146,106,48,0.4)"
                    strokeWidth="2"
                  />
                </svg>
                <ol className="relative grid grid-cols-5 gap-1">
                  {JOURNEY_CHAPTER_NAMES.map((name, i) => {
                    const idx = i + 1;
                    const state = chapterState(idx);
                    return (
                      <li key={name} className="flex flex-col items-center text-center">
                        <span
                          title={`Chương ${idx} — ${name}`}
                          aria-label={`Chương ${idx}: ${name} — ${
                            state === "current" ? "đang sống" : state === "walked" ? "đã đi qua" : "chưa bắt đầu"
                          }`}
                          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                            state === "current"
                              ? "border-amber-600 bg-amber-500 text-white shadow-[0_0_0_4px_rgba(217,158,58,0.25)]"
                              : state === "walked"
                                ? "border-amber-700/70 bg-amber-700/70 text-white"
                                : "border-amber-800/25 bg-[#EDE0C4] text-amber-800/30"
                          }`}
                        >
                          {idx}
                        </span>
                        <span
                          className={`mt-2 text-[10px] leading-tight ${
                            state === "not-yet" ? "text-amber-950/30" : "text-amber-950/70"
                          }`}
                        >
                          {name}
                        </span>
                        {state !== "not-yet" && (
                          <Link
                            href={CHAPTER_DESTINATIONS[i].href}
                            className="mt-1 text-[9px] font-semibold text-amber-800/60 underline decoration-amber-800/25 underline-offset-2 hover:text-amber-800"
                          >
                            {CHAPTER_DESTINATIONS[i].label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
              <p className="mx-auto mt-6 max-w-sm text-center text-[11px] leading-relaxed text-amber-950/40">
                {chrome.statesCaption}
              </p>
            </section>

            {/* ── 4. Kết nối tới Portal ──────────────────────────────────── */}
            <section className="mt-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-800/50">{chrome.connectionsSectionLabel}</p>
              <div className="mt-4 space-y-2.5">
                {connections.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="flex items-center justify-between rounded-lg border border-amber-900/10 bg-white/30 px-4 py-2.5 text-sm transition hover:border-amber-900/25 hover:bg-white/50"
                  >
                    <span className="font-semibold text-amber-950/80">{c.label}</span>
                    <span className="text-xs text-amber-950/45">
                      {c.count > 0 ? `Đã chạm tới — ${c.count} phiên thật` : "Chưa chạm tới"}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/portal/premium"
                  className="flex items-center justify-between rounded-lg border border-amber-900/10 bg-white/30 px-4 py-2.5 text-sm transition hover:border-amber-900/25 hover:bg-white/50"
                >
                  <span className="font-semibold text-amber-950/80">{chrome.premiumConnectionLabel}</span>
                  <span className="text-xs text-amber-950/45">
                    {premiumCount > 0 ? `Đang đồng hành — ${premiumCount} chương trình` : "Chưa tham gia"}
                  </span>
                </Link>
              </div>
            </section>

            {/* ── 5. Hướng tiếp theo — một gợi ý duy nhất ─────────────────── */}
            <section className="mt-14 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-800/50">{chrome.nextDirectionSectionLabel}</p>
              <Link
                href={nextDirection.href}
                className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold text-amber-900 underline decoration-amber-900/30 underline-offset-4 hover:decoration-amber-900"
              >
                {nextDirection.text} <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </>
        )}

        {/* ── 6. Lời khép của Companion ──────────────────────────────────── */}
        <p className="mx-auto mt-16 max-w-sm text-center text-sm italic leading-relaxed text-amber-950/45">
          {chrome.closingLine}
        </p>
      </div>
      </div>
    </div>
  );
}
