"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Gem, X } from "lucide-react";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
import { TreeLayer } from "@/components/portal/garden/scene/TreeLayer";
import { WindLayer } from "@/components/portal/garden/scene/WindLayer";
import { SunlightLayer } from "@/components/portal/garden/scene/SunlightLayer";
import { BokehLayer } from "@/components/portal/garden/scene/BokehLayer";
import { SparkleLayer } from "@/components/portal/garden/scene/SparkleLayer";
import {
  getGardenSummary,
  getRecentActivity,
  getJourneyProgress,
  type GardenSummary,
} from "@/lib/portal/foundation/growth-view";

/**
 * KHU VƯỜN 2.0 — Journey Phase P2, triển khai trung thành theo
 * GARDEN_VISUAL_DIRECTION.md (PO approved), gồm LIVING DAY & NIGHT
 * CYCLE (mục 13):
 *
 * - MỘT khu vườn, BỐN khí quyển (Bình minh/Ban ngày/Hoàng hôn/Đêm) theo
 *   giờ thiết bị người dùng — không nút chuyển tay. Chỉ trời/ánh sáng/
 *   bóng/hạt/glow đổi qua data-garden-period + CSS variables; Cây và
 *   Ngọc không bao giờ bị thay. Chuyển cảnh crossfade 75s, vào trang là
 *   đúng khí quyển ngay (data-garden-ready chặn transition ban đầu).
 * - TÁI SỬ DỤNG engine layer sẵn có (Tree/Wind/Sunlight/Bokeh/Sparkle —
 *   không viết lại engine); ảnh cây chính thức (VDAI-GARDEN-001) GIỮ
 *   NGUYÊN, chỉ được "chiếu sáng" khác đi bằng lighting overlay.
 * - Cây = mỏ neo thị giác (giai đoạn bằng LỜI từ ngưỡng dữ liệu thật);
 *   Ngọc = mỏ neo cảm xúc (thở chậm, hắt sáng, rực nhất về đêm nhưng có
 *   trần thanh lịch — --g-gem-boost).
 * - Đèn lồng chỉ thắp lúc hoàng hôn KHI có suy ngẫm/ký ức thật.
 * - Không dashboard/game UI/card trắng; không fake growth/memory.
 */

export type GemMoment = {
  kind: "milestone" | "reflection" | "memory" | "output" | "summary";
  label: string;
  title: string;
  text: string;
  dateLabel?: string;
};

const GEM_KIND_LABEL: Record<GemMoment["kind"], string> = {
  milestone: "Cột mốc",
  reflection: "Suy ngẫm gần nhất",
  memory: "Ký ức được gìn giữ",
  output: "Kết quả thật gần đây",
  summary: "Những gì bạn đã nuôi dưỡng",
};

/** Băng giờ 4 khí quyển — GARDEN_VISUAL_DIRECTION.md mục 13.1 (giờ
 * thiết bị người dùng; Admin tương lai chỉnh được — mục 13.5). */
export type GardenPeriod = "dawn" | "day" | "sunset" | "night";

/**
 * Extension point — TIME-BAND CONFIGURATION (mục 13.5/13.9).
 * Băng giờ gom về MỘT nơi duy nhất, dạng dữ liệu thuần (không hardcode
 * rải rác) để Admin Platform sau này đọc/ghi trực tiếp mà không cần
 * đụng vào logic render. `startHour` bao gồm, kết thúc là `startHour`
 * của mục kế tiếp (vòng qua nửa đêm ở "night"). KHÔNG có UI Admin nào
 * được xây ở bước này — đây chỉ là điểm nối sạch cho bước đó.
 */
export const GARDEN_TIME_BANDS: { period: GardenPeriod; startHour: number }[] = [
  { period: "night", startHour: 0 }, // 00:00–04:59 vẫn thuộc khí quyển Đêm của hôm trước
  { period: "dawn", startHour: 5 },
  { period: "day", startHour: 8 },
  { period: "sunset", startHour: 17 },
  { period: "night", startHour: 19 },
];

function resolvePeriodFromBands(
  hour: number,
  bands: { period: GardenPeriod; startHour: number }[],
): GardenPeriod {
  const sorted = [...bands].sort((a, b) => a.startHour - b.startHour);
  let current: GardenPeriod = sorted[sorted.length - 1].period;
  for (const band of sorted) {
    if (hour >= band.startHour) current = band.period;
  }
  return current;
}

function resolvePeriod(hour: number): GardenPeriod {
  return resolvePeriodFromBands(hour, GARDEN_TIME_BANDS);
}

/** Giọng Companion đổi nhẹ theo khí quyển (13.1) — chỉ dữ liệu thật;
 * chưa có hoạt động thì lời mời/tự sự trung thực, không bịa "nhớ". */
function companionLineFor(period: GardenPeriod, lastActivity: string | null): string {
  const act = lastActivity ? lastActivity.toLowerCase() : null;
  switch (period) {
    case "dawn":
      return act
        ? `Một ngày mới cho khu vườn. Gần nhất, bạn đã ${act} — hôm nay bạn muốn gieo gì tiếp?`
        : "Một ngày mới cho khu vườn. Bạn muốn gieo gì hôm nay?";
    case "day":
      return act
        ? `Khu vườn lớn lên vào những giờ bạn làm việc thật. Gần nhất, bạn đã ${act}.`
        : "Khu vườn lớn lên vào những giờ bạn làm việc thật.";
    case "sunset":
      return act
        ? `Hôm nay đã trôi qua — có điều gì đáng giữ lại? Gần nhất, bạn đã ${act}.`
        : "Hôm nay đã trôi qua — có điều gì đáng giữ lại?";
    case "night":
      return act
        ? `Tôi vẫn ở đây, dưới tán cây. Gần nhất, bạn đã ${act} — khu vườn đã nhận được nước tưới thật.`
        : "Tôi vẫn giữ những khoảnh khắc của bạn, dưới ánh ngọc. Sự im lặng cũng là một phần của mùa vụ.";
  }
}

/** Ngưỡng giai đoạn cây — GARDEN_VISUAL_DIRECTION.md mục 4. Giữ ở một
 * chỗ duy nhất để Admin Platform sau này quản trị được (mục 11). */
function treeStage(s: GardenSummary): { name: string; line: string } | null {
  const empty =
    s.missionsCompleted === 0 && s.journeysTouched === 0 && s.competenciesPracticed === 0 && s.totalOutputs === 0;
  if (empty) return null;
  if (s.missionsCompleted >= 10 && s.competenciesPracticed >= 3)
    return { name: "Cây trưởng thành", line: "Tán cây đã đủ rộng để người khác nhận ra bóng mát của nó." };
  if (s.missionsCompleted >= 3 || s.journeysTouched >= 2)
    return { name: "Cây non", line: "Thân cây đã cứng cáp — mỗi phiên làm việc thật là một vòng gỗ mới." };
  return { name: "Mầm non", line: "Mầm cây đầu tiên đã nhú lên từ việc học thật của bạn." };
}

/** Các phần tử có nghĩa — chỉ hiện nhóm CÓ dữ liệu thật, tối đa 3
 * (quy tắc tiết chế, mục 3). */
type GardenElement = { key: string; emoji: string; name: string; meaning: string };

function buildElements(
  s: GardenSummary,
  counts: { reflections: number; memories: number; milestones: number },
): GardenElement[] {
  const all: (GardenElement & { count: number })[] = [
    {
      key: "flowers",
      emoji: "🌸",
      name: "Hoa",
      meaning: `${s.missionsCompleted} bông hoa — mỗi bông là một nhiệm vụ bạn đã thực sự hoàn thành.`,
      count: s.missionsCompleted,
    },
    {
      key: "paths",
      emoji: "🛤️",
      name: "Lối đi",
      meaning: `${s.journeysTouched} lối đi — mỗi lối là một hành trình học bạn đã đặt chân tới.`,
      count: s.journeysTouched,
    },
    {
      key: "lanterns",
      emoji: "🏮",
      name: "Đèn lồng",
      meaning: `${counts.reflections + counts.memories} chiếc đèn — mỗi chiếc là một suy ngẫm hay ký ức bạn đã tự tay ghi lại.`,
      count: counts.reflections + counts.memories,
    },
    {
      key: "stones",
      emoji: "🪨",
      name: "Phiến đá",
      meaning: `${counts.milestones} phiến đá — mỗi phiến là một cột mốc thật trên hành trình của bạn.`,
      count: counts.milestones,
    },
  ];
  return all
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

const DUST_SPOTS = [
  { left: "8%", bottom: "12%", size: 4, delay: "0s" },
  { left: "22%", bottom: "6%", size: 3, delay: "4s" },
  { left: "44%", bottom: "10%", size: 5, delay: "9s" },
  { left: "67%", bottom: "5%", size: 3, delay: "2s" },
  { left: "82%", bottom: "14%", size: 4, delay: "12s" },
  { left: "93%", bottom: "8%", size: 3, delay: "7s" },
] as const;

/** Vị trí 2 đèn lồng hoàng hôn trong khung cảnh (gần mặt đất). */
const LANTERN_SPOTS = [
  { left: "18%", bottom: "9%" },
  { left: "78%", bottom: "12%" },
] as const;

export function GardenExperience({
  serverMoments,
  reflectionCount,
  memoryCount,
  milestoneCount,
  periodOverride = null,
}: {
  serverMoments: GemMoment[];
  reflectionCount: number;
  memoryCount: number;
  milestoneCount: number;
  /**
   * Extension point — ATMOSPHERE OVERRIDE (mục 13.5/13.9). Khi truyền
   * vào (ví dụ sau này từ Admin Platform để duyệt thiết kế), khí quyển
   * cố định theo giá trị này thay vì giờ thiết bị. Mặc định `null` =
   * hành vi thật (giờ thiết bị người dùng) — KHÔNG có UI nào gọi prop
   * này ở bước hiện tại, đây chỉ là điểm nối sạch cho Admin sau này.
   */
  periodOverride?: GardenPeriod | null;
}) {
  const [summary, setSummary] = useState<GardenSummary | null>(null);
  const [localMoments, setLocalMoments] = useState<GemMoment[]>([]);
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const [gemOpen, setGemOpen] = useState(false);
  const [momentIndex, setMomentIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<GardenElement | null>(null);
  const [period, setPeriod] = useState<GardenPeriod | null>(periodOverride);
  const [ready, setReady] = useState(false);

  // Khí quyển theo giờ thiết bị: áp ngay khi mount, kiểm lại mỗi 60s
  // (không rAF loop — 13.4/13.6). data-garden-ready bật SAU khi period
  // đầu tiên đã vẽ, để crossfade 75s chỉ chạy khi đổi băng giờ thật.
  // `periodOverride` (Admin extension point) tắt hẳn nhịp đọc giờ thật
  // khi có giá trị — chưa dùng ở bước này, mặc định null.
  useEffect(() => {
    if (periodOverride) {
      const readyTimer = setTimeout(() => setReady(true), 150);
      return () => clearTimeout(readyTimer);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- giờ thiết bị chỉ có ở client
    setPeriod(resolvePeriod(new Date().getHours()));
    const readyTimer = setTimeout(() => setReady(true), 150);
    const tick = setInterval(() => {
      setPeriod(resolvePeriod(new Date().getHours()));
    }, 60_000);
    return () => {
      clearTimeout(readyTimer);
      clearInterval(tick);
    };
    // periodOverride không đổi trong vòng đời trang ở bước này (chưa có
    // UI Admin nào set lại nó) — cố tình không đưa vào deps để tránh
    // reset interval mỗi lần Admin override đổi trong tương lai; sẽ xét
    // lại khi tính năng override thật sự được nối dây.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = "Khu vườn của bạn — VO DUONG AI";
    const s = getGardenSummary();
    const [latest] = getRecentActivity(1);
    const moments: GemMoment[] = [];
    const withOutputs = getJourneyProgress().find((j) => j.outputCount > 0);
    if (withOutputs) {
      moments.push({
        kind: "output",
        label: GEM_KIND_LABEL.output,
        title: withOutputs.missionGoal,
        text: `Bạn đã tạo ra ${withOutputs.outputCount} kết quả thật cho mục tiêu này — chúng là nước tưới của khu vườn.`,
      });
    }
    if (s.missionsCompleted + s.journeysTouched + s.totalOutputs > 0) {
      moments.push({
        kind: "summary",
        label: GEM_KIND_LABEL.summary,
        title: "Khu vườn được nuôi từ việc thật",
        text: `${s.missionsCompleted} nhiệm vụ hoàn thành, ${s.journeysTouched} hành trình đã chạm tới, ${s.totalOutputs} kết quả đã tạo ra — không hơn, không kém.`,
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc localStorage chỉ có ở client sau mount
    setSummary(s);
    setLocalMoments(moments);
    setLastActivity(latest ? latest.label : null);
  }, []);

  const moments = useMemo(() => [...serverMoments, ...localMoments], [serverMoments, localMoments]);
  const stage = summary ? treeStage(summary) : null;
  const gardenEmpty = summary !== null && stage === null;
  const elements = summary
    ? buildElements(summary, { reflections: reflectionCount, memories: memoryCount, milestones: milestoneCount })
    : [];
  const lanternsLit = reflectionCount + memoryCount > 0;

  const companionLine = summary === null || period === null ? null : companionLineFor(period, lastActivity);
  const currentMoment = moments.length > 0 ? moments[momentIndex % moments.length] : null;

  return (
    <div
      data-garden-period={period ?? "night"}
      data-garden-ready={ready ? "true" : "false"}
      className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8"
    >
      {/* Sky stack — 4 lớp trời, chỉ crossfade opacity (13.2) */}
      <div className="garden-sky garden-sky--dawn" aria-hidden />
      <div className="garden-sky garden-sky--day" aria-hidden />
      <div className="garden-sky garden-sky--sunset" aria-hidden />
      <div className="garden-sky garden-sky--night" aria-hidden />
      <div className="garden-stars" aria-hidden />
      <div className="garden-mist" aria-hidden />
      <div className="garden-dust-field" aria-hidden>
        {DUST_SPOTS.map((d, i) => (
          <span
            key={i}
            className="garden-dust"
            style={{ left: d.left, bottom: d.bottom, width: d.size, height: d.size, animationDelay: d.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — giữ nguyên đúng khoảng cách trước đây, chỉ khí
       * quyển nền phía sau mới full-bleed. */}
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
        {/* Lối về Hub — nút Back chuẩn hoá toàn Portal (Task 1) */}
        <PortalBackLink
          href="/portal/hanhtrinhcuatoi"
          label="Hành trình của tôi"
          colorClassName="g-fg-faint hover:opacity-80"
        />

        {/* Cổng vào — chữ ít, hiểu bằng thị giác trước */}
        <header className="mt-6 text-center">
          <h1 className="g-fg text-3xl font-extrabold tracking-tight md:text-4xl">Khu vườn của bạn</h1>
          <p className="g-fg-soft mx-auto mt-2 max-w-md text-sm italic leading-relaxed">
            Nơi những gì bạn đã học và nuôi dưỡng trở thành một khu vườn sống.
          </p>
        </header>

        {/* Một câu chứng kiến của Companion — đổi giọng theo khí quyển */}
        {companionLine && (
          <p className="g-companion mx-auto mt-6 max-w-lg text-center text-sm leading-relaxed">{companionLine}</p>
        )}

        {/* ── Khung cảnh vườn ─────────────────────────────────────────── */}
        {/* summary === null: dữ liệu client chưa nạp — giữ khoảng trời
         * tĩnh thay vì render nhầm cảnh cây cho người có vườn trống. */}
        <div className="relative mx-auto mt-8 max-w-3xl">
          {summary === null ? (
            <div className="min-h-[380px]" aria-hidden />
          ) : gardenEmpty ? (
            /* Vườn trống — hạt mầm trung thực, không cây giả (mục 10) */
            <div className="relative flex min-h-[380px] flex-col items-center justify-end pb-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 rounded-[50%] bg-gradient-to-t from-emerald-950/40 to-transparent blur-sm"
              />
              <div className="garden-seed-glow relative flex h-16 w-16 items-center justify-center">
                <span className="absolute h-14 w-14 rounded-full bg-amber-300/25 blur-xl" aria-hidden />
                <span className="relative text-3xl" role="img" aria-label="Hạt mầm đang chờ nảy">
                  🌱
                </span>
              </div>
              <p className="g-fg-soft relative mt-6 max-w-sm text-center text-sm leading-relaxed">
                Khu vườn mọc từ việc học thật. Hạt mầm đầu tiên đang chờ bạn.
              </p>
            </div>
          ) : (
            <div className="garden-scene relative w-full" style={{ aspectRatio: "1364 / 1153" }}>
              <WindLayer>
                <TreeLayer />
              </WindLayer>
              <SunlightLayer />
              <BokehLayer />
              <SparkleLayer />

              {/* Ánh sáng khí quyển phủ khung cảnh + bóng gốc cây (13.3) */}
              <div className="garden-scene-tint garden-scene-tint--dawn" aria-hidden />
              <div className="garden-scene-tint garden-scene-tint--day" aria-hidden />
              <div className="garden-scene-tint garden-scene-tint--sunset" aria-hidden />
              <div className="garden-scene-tint garden-scene-tint--night" aria-hidden />
              <div className="garden-tree-shadow" aria-hidden />

              {/* Đèn lồng — bắt đầu thắp lúc hoàng hôn, CHỈ khi có suy
               * ngẫm/ký ức thật (không thắp đèn giả). */}
              {period === "sunset" &&
                lanternsLit &&
                LANTERN_SPOTS.map((l, i) => (
                  <span key={i} className="garden-lantern" style={{ left: l.left, bottom: l.bottom }} aria-hidden />
                ))}

              {/* Bảng gỗ — giai đoạn cây bằng LỜI, từ dữ liệu thật */}
              {stage && (
                <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-md border border-amber-800/20 bg-gradient-to-b from-amber-100/90 to-amber-50/90 px-3 py-1.5 text-center shadow-sm backdrop-blur-sm">
                  <p className="text-[10px] font-semibold text-amber-900">{stage.name}</p>
                </div>
              )}

              {/* ── Viên ngọc dưới gốc cây — trung tâm cảm xúc, tồn tại cả
               * ngày, rực nhất về đêm (--g-gem-boost) ─────────────────── */}
              <button
                type="button"
                onClick={() => {
                  setGemOpen((v) => !v);
                  setSelectedElement(null);
                }}
                aria-expanded={gemOpen}
                aria-label="Viên ngọc — mở một khoảnh khắc thật được gìn giữ"
                className="garden-gem-wrap group absolute bottom-[11%] left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
              >
                <span className="garden-gem-cast" aria-hidden />
                <Gem className="garden-gem-core relative h-8 w-8 text-teal-200 transition group-hover:text-teal-100" />
              </button>

              {/* Panel khoảnh khắc — nổi trong khung cảnh, không modal trắng */}
              {gemOpen && (
                <div className="absolute bottom-[22%] left-1/2 z-20 w-[88%] max-w-sm -translate-x-1/2 rounded-2xl border border-amber-200/25 bg-slate-950/85 p-5 shadow-[0_0_40px_-8px_rgba(251,191,36,0.35)] backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setGemOpen(false)}
                    aria-label="Đóng"
                    className="absolute right-3 top-3 text-white/40 transition hover:text-white/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {currentMoment ? (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/80">
                        {currentMoment.label}
                      </p>
                      <p className="mt-1.5 text-sm font-bold text-white">{currentMoment.title}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/70">{currentMoment.text}</p>
                      {currentMoment.dateLabel && (
                        <p className="mt-2 text-[10px] text-white/40">{currentMoment.dateLabel}</p>
                      )}
                      {moments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setMomentIndex((i) => i + 1)}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-200/90 transition hover:text-amber-100"
                        >
                          Một khoảnh khắc khác <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </>
                  ) : (
                    /* Empty state thơ và trung thực — không bịa thành tựu */
                    <p className="text-sm italic leading-relaxed text-white/75">
                      Viên ngọc vẫn đang chờ những trải nghiệm đầu tiên của bạn.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Phần tử có nghĩa (tối đa 3, chỉ khi có dữ liệu thật) ─────── */}
        {elements.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {elements.map((el) => {
              const active = selectedElement?.key === el.key;
              return (
                <button
                  key={el.key}
                  type="button"
                  onClick={() => {
                    setSelectedElement((cur) => (cur?.key === el.key ? null : el));
                    setGemOpen(false);
                  }}
                  aria-pressed={active}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur transition hover:opacity-85"
                  style={
                    active
                      ? {
                          color: "var(--g-accent-fg)",
                          borderColor: "var(--g-accent-border)",
                          background: "var(--g-accent-bg)",
                        }
                      : {
                          color: "var(--g-chip-fg)",
                          borderColor: "var(--g-chip-border)",
                          background: "var(--g-chip-bg)",
                        }
                  }
                >
                  <span aria-hidden>{el.emoji}</span> {el.name}
                </button>
              );
            })}
          </div>
        )}
        {selectedElement && (
          <p className="g-fg-soft mx-auto mt-3 max-w-md text-center text-xs leading-relaxed">
            {selectedElement.meaning}
          </p>
        )}

        {/* ── Trạng thái vườn bằng lời + MỘT hành động kế tiếp ─────────── */}
        <div className="mt-10 text-center">
          {stage && <p className="g-fg-soft text-sm italic">{stage.line}</p>}
          <Link
            href={gardenEmpty ? "/portal/hocvienai" : "/portal/workspace"}
            className="mt-4 inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold backdrop-blur transition hover:opacity-85"
            style={{
              color: "var(--g-cta-fg)",
              borderColor: "var(--g-cta-border)",
              background: "var(--g-cta-bg)",
            }}
          >
            {gardenEmpty ? "Gieo hạt mầm đầu tiên" : "Tưới cho khu vườn hôm nay"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Lời khép — không card, chỉ một dòng tan vào khí quyển */}
        <p className="g-fg-faint mx-auto mt-12 max-w-md pb-4 text-center text-xs italic leading-relaxed">
          Khu vườn của bạn phản chiếu đúng những gì bạn đã thật sự làm — không hơn, không kém.
        </p>
      </div>
      </div>
    </div>
  );
}
