"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
import { listAllSessions, type WorkspaceSessionRecord } from "@/lib/portal/foundation/workspace-session-store";
import { listPortfolioItems, type PortfolioItemRecord } from "@/lib/portal/foundation/portfolio-store";
import { readGrowthEvents } from "@/lib/portal/foundation/growth-event-bus";
import { buildBehaviorLessons } from "@/lib/portal/foundation/learning-lessons";
import { todaysJournalIntention } from "@/lib/portal/growth-map/journal-intention";
import type { Reflection } from "@/lib/portal/reflections";
import type { GrowthEventType } from "@/lib/portal/foundation/data-model";

/**
 * JOURNEY PLATFORM — Phase P5: Learning Journal, "cuốn sổ học tập cá nhân".
 *
 * KHÔNG phải activity log/timeline/click history/audit log/dashboard.
 * Trả lời đúng một câu hỏi: "Hôm nay tôi thực sự đã học được gì?" — không
 * phải "tôi đã bấm gì". Mỗi entry trả lời (trung thực, có thể bỏ trống)
 * đúng 4 câu: chuyện gì xảy ra / học được gì / tạo ra gì / nên tiếp tục
 * gì. Companion là bạn học đồng hành, không phải giáo viên — không chấm
 * điểm, không tạo áp lực.
 */

const MODULE_LABEL: Record<string, string> = {
  "khong-gian-ai": "AI Workspace",
  ckos: "Hệ tri thức AI",
  academy: "Học viện AI",
  opportunities: "Dự án & Cơ hội",
  premium: "Premium",
  "learning-journal": "Nhật ký học tập",
  "my-journey": "Hành trình của tôi",
  "living-garden": "Khu vườn của bạn",
};

const TODAY_PRIORITY: { type: GrowthEventType; sentence: string }[] = [
  { type: "OUTPUT_CREATED", sentence: "Hôm nay bạn đã tạo ra một kết quả mới trong Workspace." },
  { type: "MISSION_COMPLETED", sentence: "Hôm nay bạn đã hoàn thành một hành trình học." },
  { type: "WORKSPACE_COMPLETED", sentence: "Hôm nay bạn đã hoàn thành một phiên làm việc." },
  { type: "OUTPUT_VERSIONED", sentence: "Hôm nay bạn đã chỉnh sửa và hoàn thiện thêm một kết quả." },
  { type: "MISSION_STARTED", sentence: "Hôm nay bạn đã bắt đầu một hành trình mới." },
];

function isSameDay(a: string | Date, b: string | Date): boolean {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  return da.toDateString() === db.toDateString();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

type JournalEntry = {
  id: string;
  dateLabel: string;
  moduleLabel: string;
  whatHappened: string;
  whatLearned?: string;
  whatCreated?: string;
  whatNext?: string;
};

function buildEntries(sessions: WorkspaceSessionRecord[], reflections: Reflection[]): JournalEntry[] {
  return [...sessions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 15)
    .map((s) => {
      const learnedToday = reflections.find((r) => isSameDay(r.createdAt, s.startedAt));
      return {
        id: s.sessionId,
        dateLabel: formatDate(s.startedAt),
        moduleLabel: MODULE_LABEL[s.context.module] ?? s.context.module,
        whatHappened: s.context.userGoal ?? s.context.title ?? s.context.source,
        whatLearned: learnedToday?.answer,
        whatCreated: s.outputs.length > 0 ? `${s.outputs.length} kết quả thật.` : undefined,
        whatNext: s.status !== "completed" ? "Phiên này còn dang dở — có thể tiếp tục trong Workspace." : undefined,
      };
    });
}

export function LearningJournalNotebook({ reflections }: { reflections: Reflection[] }) {
  const [sessions, setSessions] = useState<WorkspaceSessionRecord[] | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItemRecord[]>([]);
  const [todayHighlight, setTodayHighlight] = useState<string | null>(null);

  useEffect(() => {
    const all = listAllSessions();
    const today = new Date();
    const todaysEvents = readGrowthEvents().filter((e) => isSameDay(e.timestamp, today));
    const reflectionToday = reflections.some((r) => isSameDay(r.createdAt, today));
    const matched = TODAY_PRIORITY.find((p) => todaysEvents.some((e) => e.eventType === p.type));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc localStorage chỉ có ở client sau mount
    setSessions(all);
    setPortfolio(listPortfolioItems());
    setTodayHighlight(matched?.sentence ?? (reflectionToday ? "Hôm nay bạn đã dừng lại để suy ngẫm." : null));
  }, [reflections]);

  const entries = useMemo(() => (sessions ? buildEntries(sessions, reflections) : []), [sessions, reflections]);
  const behaviorLessons = useMemo(() => (sessions ? buildBehaviorLessons(sessions) : []), [sessions]);

  const highlights = useMemo(() => {
    if (!sessions) return [];
    const events = readGrowthEvents();
    const list: { label: string; date: string }[] = [];
    const firstOutput = events.find((e) => e.eventType === "OUTPUT_CREATED");
    if (firstOutput) list.push({ label: "Buổi thực hành đầu tiên tạo ra kết quả thật trong Workspace.", date: firstOutput.timestamp });
    const firstCompleted = events.find((e) => e.eventType === "MISSION_COMPLETED");
    if (firstCompleted) list.push({ label: "Hành trình học đầu tiên bạn đi trọn vẹn.", date: firstCompleted.timestamp });
    const firstReflection = [...reflections].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
    if (firstReflection) list.push({ label: "Lần đầu tiên bạn dừng lại để viết Reflection.", date: firstReflection.createdAt });
    const sortedByTime = [...sessions].sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
    const distinctModules = new Set(sortedByTime.map((s) => s.context.module));
    if (distinctModules.size >= 2 && sortedByTime[0]) {
      const label = MODULE_LABEL[sortedByTime[0].context.module] ?? sortedByTime[0].context.module;
      list.push({ label: `Lĩnh vực đầu tiên bạn thử: ${label}.`, date: sortedByTime[0].startedAt });
    }
    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sessions, reflections]);

  const totalRawOutputs = sessions?.reduce((sum, s) => sum + s.outputs.length, 0) ?? 0;

  const isLoading = sessions === null;
  const isFullyEmpty = !isLoading && entries.length === 0 && reflections.length === 0;

  if (isLoading) {
    return <div className="journal-notebook-bg -mx-4 -my-6 min-h-[60vh] md:-mx-8 md:-my-8" aria-hidden />;
  }

  return (
    <div className="relative -mx-4 -my-6 min-h-full md:-mx-8 md:-my-8">
      <div className="journal-notebook-bg" aria-hidden />
      <div className="journal-notebook-lines" aria-hidden />
      <div className="journal-bookmark right-8 md:right-16" aria-hidden />

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-10 sm:px-8 md:py-14">
        <PortalBackLink href="/portal/hanhtrinhcuatoi" label="Hành trình của tôi" tone="light" />

        <header className="journal-page-fade mt-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-700/70">
            <BookOpen className="h-4 w-4" /> Nhật ký học tập
          </div>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-stone-800 sm:text-3xl">
            Bản ghi những gì tôi thực sự đã học
          </h1>
        </header>

        {isFullyEmpty ? (
          <div className="journal-page-fade mt-16 text-center">
            <p className="text-base italic leading-relaxed text-stone-500">
              Trang đầu tiên luôn là trang nhiều hy vọng nhất.
            </p>
            <Link
              href="/portal/hocvienai"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 underline decoration-orange-700/30 underline-offset-4 hover:decoration-orange-700"
            >
              Bắt đầu bài học đầu tiên <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── 1. Reflection hôm nay ──────────────────────────────────── */}
            <section className="journal-page-fade mt-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Hôm nay</p>
              <p className="mt-2 text-base leading-relaxed text-stone-700">
                {todayHighlight ?? "Hôm nay chưa có gì để ghi lại — cuốn sổ vẫn đang mở, chờ bạn."}
              </p>
            </section>

            {/* ── 2. Journal Entries — mỗi entry 4 câu hỏi ──────────────── */}
            {entries.length > 0 && (
              <section className="journal-page-fade mt-12">
                <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Các trang đã viết</p>
                <div className="mt-4 space-y-5">
                  {entries.map((e) => (
                    <article key={e.id} className="rounded-xl border border-stone-900/8 bg-white/50 p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-stone-800">{e.whatHappened}</p>
                        <span className="text-[11px] text-stone-400">
                          {e.dateLabel} · {e.moduleLabel}
                        </span>
                      </div>
                      <dl className="mt-2 space-y-1 text-xs leading-relaxed text-stone-600">
                        {e.whatLearned && (
                          <div className="flex gap-1.5">
                            <dt className="shrink-0 font-semibold text-stone-500">Đã học:</dt>
                            <dd>{e.whatLearned}</dd>
                          </div>
                        )}
                        {e.whatCreated && (
                          <div className="flex gap-1.5">
                            <dt className="shrink-0 font-semibold text-stone-500">Đã tạo:</dt>
                            <dd>{e.whatCreated}</dd>
                          </div>
                        )}
                        {e.whatNext && (
                          <div className="flex gap-1.5">
                            <dt className="shrink-0 font-semibold text-stone-500">Tiếp tục:</dt>
                            <dd>{e.whatNext}</dd>
                          </div>
                        )}
                      </dl>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ── 3. Learning Highlights — chỉ những lần đầu có ý nghĩa ─── */}
            {highlights.length > 0 && (
              <section className="journal-page-fade mt-12">
                <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Khoảnh khắc đáng nhớ</p>
                <div className="mt-4 space-y-2">
                  {highlights.map((h, i) => (
                    <p key={i} className="text-sm leading-relaxed text-stone-700">
                      <span className="text-stone-400">{formatDate(h.date)} — </span>
                      {h.label}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* ── 4. Created Outputs — tách khỏi "học", chỉ tác phẩm thật ── */}
            <section className="journal-page-fade mt-12">
              <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Những gì đã tạo ra</p>
              {portfolio.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {portfolio.slice(0, 8).map((p) => (
                    <p key={p.portfolioItemId} className="text-sm leading-relaxed text-stone-700">
                      <span className="font-semibold">{p.title}</span>{" "}
                      <span className="text-stone-400">({p.outputType} · {formatDate(p.createdAt)})</span>
                    </p>
                  ))}
                </div>
              ) : totalRawOutputs > 0 ? (
                <p className="mt-3 text-sm italic leading-relaxed text-stone-500">
                  {totalRawOutputs} kết quả thật trong Workspace, chưa qua đánh giá + suy ngẫm để vào Portfolio.
                </p>
              ) : (
                <p className="mt-3 text-sm italic leading-relaxed text-stone-400">
                  Chưa có tác phẩm nào — trang này sẽ tự viết khi bạn tạo ra kết quả đầu tiên.
                </p>
              )}
            </section>

            {/* ── 5. Lessons Worth Remembering — bài học cá nhân, không phải CKOS ── */}
            {behaviorLessons.length > 0 && (
              <section className="journal-page-fade mt-12">
                <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  Những bài học đáng nhớ
                </p>
                <div className="mt-4 space-y-2">
                  {behaviorLessons.map((l) => (
                    <p key={l} className="text-sm leading-relaxed text-stone-700">
                      {l}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ── 6. Ý định học tiếp theo — một lời mời duy nhất ─────────────── */}
        <section className="journal-page-fade mt-14 text-center">
          <p className="text-sm italic leading-relaxed text-stone-600">{todaysJournalIntention()}</p>
        </section>

        <p className="journal-page-fade mx-auto mt-10 max-w-sm text-center text-[11px] leading-relaxed text-stone-400">
          Đây là bản ghi việc học của bạn — không phải nhật ký hoạt động của hệ thống.
        </p>
      </div>
    </div>
  );
}
