"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Gem, X } from "lucide-react";
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
 * GARDEN_VISUAL_DIRECTION.md (PO approved):
 *
 * - Canvas khí quyển midnight→bình minh phủ toàn trang (không nền grid,
 *   không card trắng, không dashboard/thống kê/game UI/checklist).
 * - TÁI SỬ DỤNG engine layer sẵn có (Tree/Wind/Sunlight/Bokeh/Sparkle —
 *   không viết lại engine); art direction dựng lại quanh nó. Ảnh cây
 *   chính thức (VDAI-GARDEN-001, ánh nắng bình minh) GIỮ NGUYÊN — định
 *   hướng cho phép "moonlight or sunrise light"; khung cảnh là ô cửa
 *   phát sáng giữa nền đêm. LeafChipLayer (8 chip hành động) tạm rút
 *   khỏi khung cảnh theo quy tắc TIẾT CHẾ của định hướng.
 * - Cây = trung tâm thị giác; giai đoạn cây gọi bằng LỜI từ ngưỡng dữ
 *   liệu thật (GARDEN_VISUAL_DIRECTION.md mục 4) — không "Lv.", không %.
 * - Ngọc = trung tâm cảm xúc: glow "thở", hắt sáng, chạm để mở ĐÚNG MỘT
 *   khoảnh khắc thật mỗi lần; không có dữ liệu → empty state thơ.
 * - Vườn trống (mọi chỉ số 0) → khung cảnh hạt mầm trung thực, không
 *   cây giả, không hoa giả.
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

function buildElements(s: GardenSummary, counts: { reflections: number; memories: number; milestones: number }): GardenElement[] {
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

export function GardenExperience({
  serverMoments,
  reflectionCount,
  memoryCount,
  milestoneCount,
}: {
  serverMoments: GemMoment[];
  reflectionCount: number;
  memoryCount: number;
  milestoneCount: number;
}) {
  const [summary, setSummary] = useState<GardenSummary | null>(null);
  const [localMoments, setLocalMoments] = useState<GemMoment[]>([]);
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const [gemOpen, setGemOpen] = useState(false);
  const [momentIndex, setMomentIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<GardenElement | null>(null);

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

  // Một câu chứng kiến của Companion — dữ liệu thật, im lặng cũng hợp lệ.
  const companionLine =
    summary === null
      ? null
      : lastActivity
        ? `Tôi vẫn ở đây, dưới tán cây. Gần nhất, bạn đã ${lastActivity.toLowerCase()} — khu vườn đã nhận được nước tưới thật.`
        : "Tuần này khu vườn yên tĩnh. Sự im lặng cũng là một phần của mùa vụ.";

  const currentMoment = moments.length > 0 ? moments[momentIndex % moments.length] : null;

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      {/* Khí quyển nền — nhiều lớp ánh sáng, không flat gradient */}
      <div className="garden-night-bg" aria-hidden />
      <div className="garden-mist" aria-hidden />
      {DUST_SPOTS.map((d, i) => (
        <span
          key={i}
          className="garden-dust"
          aria-hidden
          style={{ left: d.left, bottom: d.bottom, width: d.size, height: d.size, animationDelay: d.delay }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
        {/* Lối về Hub — một chạm */}
        <Link
          href="/portal/hanhtrinhcuatoi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 transition hover:text-white/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Hành trình của tôi
        </Link>

        {/* Cổng vào — chữ ít, hiểu bằng thị giác trước */}
        <header className="mt-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Khu vườn của bạn</h1>
          <p className="mx-auto mt-2 max-w-md text-sm italic leading-relaxed text-white/55">
            Nơi những gì bạn đã học và nuôi dưỡng trở thành một khu vườn sống.
          </p>
        </header>

        {/* Một câu chứng kiến của Companion */}
        {companionLine && (
          <p className="mx-auto mt-6 max-w-lg text-center text-sm leading-relaxed text-emerald-100/70">
            {companionLine}
          </p>
        )}

        {/* ── Khung cảnh vườn ─────────────────────────────────────────── */}
        {/* summary === null: dữ liệu client chưa nạp — giữ khoảng trời đêm
         * tĩnh thay vì render nhầm cảnh cây cho người có vườn trống. */}
        <div className="relative mx-auto mt-8 max-w-3xl">
          {summary === null ? (
            <div className="min-h-[380px]" aria-hidden />
          ) : gardenEmpty ? (
            /* Vườn trống — hạt mầm trung thực, không cây giả (mục 10) */
            <div className="relative flex min-h-[380px] flex-col items-center justify-end pb-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 rounded-[50%] bg-gradient-to-t from-emerald-950/70 to-transparent blur-sm"
              />
              <div className="garden-seed-glow relative flex h-16 w-16 items-center justify-center">
                <span className="absolute h-14 w-14 rounded-full bg-amber-300/20 blur-xl" aria-hidden />
                <span className="relative text-3xl" role="img" aria-label="Hạt mầm đang chờ nảy">
                  🌱
                </span>
              </div>
              <p className="relative mt-6 max-w-sm text-center text-sm leading-relaxed text-white/65">
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

              {/* Bảng gỗ — giai đoạn cây bằng LỜI, từ dữ liệu thật */}
              {stage && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md border border-amber-800/20 bg-gradient-to-b from-amber-100/90 to-amber-50/90 px-3 py-1.5 text-center shadow-sm backdrop-blur-sm">
                  <p className="text-[10px] font-semibold text-amber-900">{stage.name}</p>
                </div>
              )}

              {/* ── Viên ngọc dưới gốc cây — trung tâm cảm xúc ─────────── */}
              <button
                type="button"
                onClick={() => {
                  setGemOpen((v) => !v);
                  setSelectedElement(null);
                }}
                aria-expanded={gemOpen}
                aria-label="Viên ngọc — mở một khoảnh khắc thật được gìn giữ"
                className="group absolute bottom-[11%] left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
              >
                <span className="garden-gem-cast" aria-hidden />
                <Gem className="garden-gem-core relative h-8 w-8 text-teal-200 transition group-hover:text-teal-100" />
              </button>

              {/* Panel khoảnh khắc — nổi trong khung cảnh, không modal trắng */}
              {gemOpen && (
                <div className="absolute bottom-[22%] left-1/2 w-[88%] max-w-sm -translate-x-1/2 rounded-2xl border border-amber-200/25 bg-slate-950/85 p-5 shadow-[0_0_40px_-8px_rgba(251,191,36,0.35)] backdrop-blur-md">
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
            {elements.map((el) => (
              <button
                key={el.key}
                type="button"
                onClick={() => {
                  setSelectedElement((cur) => (cur?.key === el.key ? null : el));
                  setGemOpen(false);
                }}
                aria-pressed={selectedElement?.key === el.key}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur transition ${
                  selectedElement?.key === el.key
                    ? "border-amber-300/50 bg-amber-300/15 text-amber-100"
                    : "border-white/15 bg-white/[0.05] text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                <span aria-hidden>{el.emoji}</span> {el.name}
              </button>
            ))}
          </div>
        )}
        {selectedElement && (
          <p className="mx-auto mt-3 max-w-md text-center text-xs leading-relaxed text-white/65">
            {selectedElement.meaning}
          </p>
        )}

        {/* ── Trạng thái vườn bằng lời + MỘT hành động kế tiếp ─────────── */}
        <div className="mt-10 text-center">
          {stage && <p className="text-sm italic text-white/55">{stage.line}</p>}
          <Link
            href={gardenEmpty ? "/portal/hocvienai" : "/portal/workspace"}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-6 py-2.5 text-sm font-semibold text-emerald-100 backdrop-blur transition hover:bg-emerald-400/20"
          >
            {gardenEmpty ? "Gieo hạt mầm đầu tiên" : "Tưới cho khu vườn hôm nay"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Lời khép — không card, chỉ một dòng tan vào màn đêm */}
        <p className="mx-auto mt-12 max-w-md pb-4 text-center text-xs italic leading-relaxed text-white/35">
          Khu vườn của bạn phản chiếu đúng những gì bạn đã thật sự làm — không hơn, không kém.
        </p>
      </div>
    </div>
  );
}
