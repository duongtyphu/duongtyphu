"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Feather, Mail } from "lucide-react";
import { getCurrentChapterFromClient, type JourneyChapter } from "@/lib/portal/foundation/journey-chapter";
import { getJourneyProgress } from "@/lib/portal/foundation/growth-view";
import { readGrowthEvents } from "@/lib/portal/foundation/growth-event-bus";
import {
  buildUnderstandingNote,
  detectGrowthPattern,
  buildGrowingQualities,
  buildInsightMemoryLine,
} from "@/lib/portal/human-understanding";
import { buildLetter, type MonthlyLetterStats } from "@/components/portal/story/MonthlyLetterCard";
import { useReflections, type Reflection } from "@/lib/portal/reflections";
import { useMemoryCapsules, deleteMemoryCapsule, type MemoryCapsule, type MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";
import type { GrowthMilestone } from "@/lib/portal/growth-map/growth-milestones";

/**
 * JOURNEY PLATFORM — Phase P3: My Story, cuốn sách cá nhân.
 *
 * KHÔNG phải blog/timeline/dashboard/feed. Trả lời đúng một câu hỏi:
 * "Qua quá trình này, tôi đã trở thành ai?" — bằng cấu trúc CHƯƠNG, không
 * phải theo ngày. Companion là người thuật lại (narrator), không phải
 * tác giả — không tô vẽ, không tán dương, không bịa cảm xúc.
 *
 * Mỗi phần chỉ hiển thị khi có DỮ LIỆU THẬT tương ứng; không có gì thì
 * trang tự nhận là "trang đầu còn trắng" một cách đẹp đẽ (mục Empty
 * State), không giả vờ đã có nội dung.
 */

const KIND_LABEL: Record<MemoryCapsuleKind, string> = {
  milestone: "Cột mốc",
  lesson: "Bài học",
  decision: "Quyết định",
  breakthrough: "Vượt qua khó khăn",
  achievement: "Thành tựu",
  living_story: "Câu chuyện đã lưu",
  companion_story: "Companion kể lại",
  wisdom_story: "Chiêm nghiệm",
  garden_story: "Khu vườn",
  first_footprint: "Dấu chân đầu tiên",
  birthday: "Sinh nhật",
  annual_mirror: "Soi lại một năm",
  first_portal_day: "Ngày đầu ở Portal",
  return_after_silence: "Trở lại sau khoảng lặng",
};

function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

type ImportantMoment = { id: string; label: string; title: string; date: Date };

/** Gỡ một ký ức tự lưu khỏi cuốn sách — xác nhận nhẹ, ngay tại chỗ,
 * không modal tối phủ trang giấy ấm. */
function RemovableEntry({
  capsuleId,
  onRemoved,
  children,
}: {
  capsuleId: string;
  onRemoved: () => void;
  children: React.ReactNode;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <div className="group/entry relative">
      {children}
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="story-serif mt-1 text-[11px] italic text-amber-900/0 transition group-hover/entry:text-amber-900/40 hover:!text-amber-900/70"
        >
          Gỡ khỏi cuốn sách
        </button>
      ) : (
        <p className="story-serif mt-1 text-[11px] italic text-amber-900/60">
          Chắc chắn?{" "}
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const ok = await deleteMemoryCapsule(capsuleId);
              setBusy(false);
              if (ok) onRemoved();
              setConfirming(false);
            }}
            className="font-semibold underline hover:text-amber-900"
          >
            Xoá
          </button>{" "}
          ·{" "}
          <button type="button" onClick={() => setConfirming(false)} className="underline hover:text-amber-900">
            Giữ lại
          </button>
        </p>
      )}
    </div>
  );
}

export function MyStoryBook({
  memberSince,
  reflections,
  capsules: initialCapsules,
  milestones,
  firstPremium,
  premiumCount = 0,
  storageReady,
}: {
  memberSince: Date | null;
  reflections: Reflection[];
  capsules: MemoryCapsule[];
  milestones: GrowthMilestone[];
  firstPremium: { title: string; occurredAt: string } | null;
  premiumCount?: number;
  storageReady: boolean;
}) {
  const [capsules, setCapsules] = useState(initialCapsules);
  const [chapter, setChapter] = useState<JourneyChapter | undefined>(undefined);
  const [firstOutput, setFirstOutput] = useState<{ date: string } | null | undefined>(undefined);
  const [firstCompletedJourney, setFirstCompletedJourney] = useState<{ date: string } | null | undefined>(undefined);
  const [createdWorks, setCreatedWorks] = useState<{ title: string; outputCount: number }[]>([]);

  useEffect(() => {
    const events = readGrowthEvents();
    const firstOut = events.find((e) => e.eventType === "OUTPUT_CREATED");
    const firstJourney = events.find((e) => e.eventType === "MISSION_COMPLETED");
    const works = getJourneyProgress()
      .filter((j) => j.outputCount > 0)
      .map((j) => ({ title: j.missionGoal, outputCount: j.outputCount }));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc localStorage chỉ có ở client sau mount
    setChapter(getCurrentChapterFromClient(premiumCount));
    setFirstOutput(firstOut ? { date: firstOut.timestamp } : null);
    setFirstCompletedJourney(firstJourney ? { date: firstJourney.timestamp } : null);
    setCreatedWorks(works);
  }, [premiumCount]);

  const companionLine = useMemo(() => buildInsightMemoryLine(reflections), [reflections]);
  const understandingNote = useMemo(() => buildUnderstandingNote(reflections), [reflections]);
  const growthPattern = useMemo(() => detectGrowthPattern(reflections), [reflections]);
  const qualities = useMemo(() => buildGrowingQualities(reflections), [reflections]);

  const now = new Date();
  const monthlyStats: MonthlyLetterStats = {
    monthLabel: now.toLocaleDateString("vi-VN", { month: "long" }),
    reflectionCount: reflections.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
    capsuleCount: capsules.filter((c) => {
      const d = new Date(c.occurredAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
    hasAnyHistory: reflections.length > 0 || capsules.length > 0,
  };

  const importantMoments: ImportantMoment[] = useMemo(() => {
    const list: ImportantMoment[] = [];
    if (memberSince) list.push({ id: "day-one", label: "Bắt đầu", title: "Ngày đầu tiên bạn đến VO DUONG AI", date: memberSince });
    if (firstOutput) list.push({ id: "first-output", label: "Workspace", title: "Kết quả đầu tiên bạn tạo ra trong Workspace", date: new Date(firstOutput.date) });
    if (firstCompletedJourney) list.push({ id: "first-journey", label: "Hành trình", title: "Hành trình học đầu tiên bạn hoàn thành", date: new Date(firstCompletedJourney.date) });
    if (firstPremium) list.push({ id: "first-premium", label: "Premium", title: `Bắt đầu ${firstPremium.title}`, date: new Date(firstPremium.occurredAt) });
    return list.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [memberSince, firstOutput, firstCompletedJourney, firstPremium]);

  const isBookLoading = chapter === undefined || firstOutput === undefined;
  const bookIsEmpty =
    !isBookLoading &&
    chapter === null &&
    reflections.length === 0 &&
    capsules.length === 0 &&
    milestones.length === 0 &&
    importantMoments.length === 0 &&
    createdWorks.length === 0;

  function handleRemoved(id: string) {
    setCapsules((prev) => prev.filter((c) => c.id !== id));
  }

  if (isBookLoading) {
    return <div className="story-book-bg -mx-4 -my-6 min-h-[60vh] md:-mx-8 md:-my-8" aria-hidden />;
  }

  return (
    <div className="relative -mx-4 -my-6 min-h-full md:-mx-8 md:-my-8">
      <div className="story-book-bg" aria-hidden />

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-10 sm:px-8 md:py-14">
        {/* ── Opening Page ─────────────────────────────────────────────── */}
        <header className="story-fade-in text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-50 shadow-inner">
            <BookOpen className="h-6 w-6 text-amber-800/70" />
          </div>
          <h1 className="story-serif mt-5 text-3xl font-bold text-stone-900 sm:text-4xl">My Story</h1>
          <p className="story-serif mx-auto mt-3 max-w-md text-sm italic leading-relaxed text-stone-500 sm:text-base">
            Câu chuyện đang được viết bằng chính những điều bạn học, tạo ra và gìn giữ.
          </p>

          {chapter && (
            <p className="story-serif mt-6 text-sm font-semibold text-amber-900/80">
              Chương {chapter.index} — {chapter.name}
            </p>
          )}

          {companionLine && (
            <p className="story-serif mx-auto mt-4 max-w-sm text-sm italic leading-relaxed text-stone-500">
              &ldquo;{companionLine}&rdquo;
            </p>
          )}
        </header>

        {bookIsEmpty ? (
          <div className="story-page-block story-fade-in mt-14 text-center">
            <p className="story-serif text-base italic leading-relaxed text-stone-500">
              Mọi cuốn sách hay đều bắt đầu bằng một trang đầu còn trắng.
            </p>
            <p className="story-serif mt-3 text-sm leading-relaxed text-stone-400">
              Trang này sẽ tự viết khi bạn học, tạo ra hoặc gìn giữ điều gì đó thật trong Portal.
            </p>
            <WriteNook reflections={reflections} />
          </div>
        ) : (
          <>
            {/* ── Thư tháng — nhét trong chương, không phải một card ────── */}
            {monthlyStats.hasAnyHistory && (
              <section className="story-page-block story-fade-in mt-14">
                <div className="story-chapter-divider">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="story-serif whitespace-nowrap text-xs uppercase tracking-widest">
                    Lá thư tháng {monthlyStats.monthLabel}
                  </span>
                </div>
                <p className="story-serif mt-4 text-sm italic leading-relaxed text-stone-600">
                  {buildLetter(monthlyStats)}
                </p>
              </section>
            )}

            {/* ── Important Moments ──────────────────────────────────────── */}
            {importantMoments.length > 0 && (
              <section className="story-page-block story-fade-in mt-14">
                <div className="story-chapter-divider">
                  <span className="story-serif whitespace-nowrap text-xs uppercase tracking-widest">
                    Những khoảnh khắc quan trọng
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {importantMoments.map((m) => (
                    <div key={m.id} className="flex items-baseline gap-3">
                      <span className="story-serif w-24 shrink-0 text-xs text-stone-400">{formatDate(m.date)}</span>
                      <p className="story-serif text-sm leading-relaxed text-stone-700">{m.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Turning Points — milestones engine, nhấn mạnh thị giác ─── */}
            {milestones.length > 0 && (
              <section className="story-page-block story-fade-in mt-14">
                <div className="story-chapter-divider">
                  <span className="story-serif whitespace-nowrap text-xs uppercase tracking-widest">Bước ngoặt</span>
                </div>
                <div className="mt-5 space-y-6">
                  {milestones.map((m) => (
                    <div key={m.id} className="border-l-2 border-amber-300/60 pl-4">
                      <p className="story-serif text-[11px] text-stone-400">{formatDate(m.occurredAt)}</p>
                      <p className="story-serif mt-1 text-base font-semibold text-stone-800">{m.title}</p>
                      <p className="story-serif mt-1 text-sm leading-relaxed text-stone-600">{m.line}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Lessons That Changed Me — chỉ khi có dữ liệu thật ──────── */}
            {(understandingNote || growthPattern || qualities.length > 0) && (
              <section className="story-page-block story-fade-in mt-14">
                <div className="story-chapter-divider">
                  <span className="story-serif whitespace-nowrap text-xs uppercase tracking-widest">
                    Những bài học đã thay đổi tôi
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {understandingNote && (
                    <p className="story-serif text-sm leading-relaxed text-stone-700">{understandingNote}</p>
                  )}
                  {growthPattern && (
                    <p className="story-serif text-sm leading-relaxed text-stone-700">{growthPattern}</p>
                  )}
                  {qualities.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {qualities.map((q) => (
                        <li key={q} className="story-serif flex items-start gap-2 text-sm text-stone-600">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-700/50" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )}

            {/* ── What I Created — output thật, không phải "đã hoàn thành bài học" ── */}
            <section className="story-page-block story-fade-in mt-14">
              <div className="story-chapter-divider">
                <span className="story-serif whitespace-nowrap text-xs uppercase tracking-widest">
                  Những gì tôi đã tạo ra
                </span>
              </div>
              {createdWorks.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {createdWorks.map((w, i) => (
                    <p key={`${w.title}-${i}`} className="story-serif text-sm leading-relaxed text-stone-700">
                      <span className="font-semibold">{w.title}</span> — {w.outputCount} kết quả thật.
                    </p>
                  ))}
                </div>
              ) : (
                <p className="story-serif mt-5 text-sm italic leading-relaxed text-stone-400">
                  Chưa có tác phẩm nào — trang này sẽ tự viết khi bạn tạo ra kết quả đầu tiên trong Workspace.
                </p>
              )}
            </section>

            {/* ── Ký ức tự lưu (nếu có) — giữ khả năng gỡ, không phải danh
             * sách card, chỉ dòng văn xuôi có thể xoá. ─────────────────── */}
            {capsules.length > 0 && (
              <section className="story-page-block story-fade-in mt-14">
                <div className="story-chapter-divider">
                  <span className="story-serif whitespace-nowrap text-xs uppercase tracking-widest">
                    Những điều bạn tự gìn giữ
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {capsules.map((c) => (
                    <RemovableEntry key={c.id} capsuleId={c.id} onRemoved={() => handleRemoved(c.id)}>
                      <div className="flex items-baseline gap-3">
                        <span className="story-serif w-24 shrink-0 text-xs text-stone-400">{formatDate(c.occurredAt)}</span>
                        <div>
                          <p className="story-serif text-sm font-semibold text-stone-800">
                            {c.title}{" "}
                            <span className="text-xs font-normal italic text-stone-400">— {KIND_LABEL[c.kind]}</span>
                          </p>
                          {c.description && (
                            <p className="story-serif mt-0.5 text-sm leading-relaxed text-stone-600">{c.description}</p>
                          )}
                        </div>
                      </div>
                    </RemovableEntry>
                  ))}
                </div>
              </section>
            )}

            {!storageReady && (
              <p className="story-serif mt-8 text-center text-xs italic text-stone-400">
                Khu vực lưu ký ức đang được chuẩn bị. Bạn vẫn có thể đọc lại hành trình của mình.
              </p>
            )}

            {/* ── Viết một trang mới ──────────────────────────────────────── */}
            <section className="story-page-block story-fade-in mt-14">
              <div className="story-chapter-divider">
                <Feather className="h-3.5 w-3.5 shrink-0" />
                <span className="story-serif whitespace-nowrap text-xs uppercase tracking-widest">
                  Viết một trang mới
                </span>
              </div>
              <WriteNook reflections={reflections} />
            </section>
          </>
        )}

        {/* ── What Comes Next — một lời mời duy nhất, không checklist ──── */}
        <section className="story-page-block story-fade-in mt-14 text-center">
          <p className="story-serif text-base italic leading-relaxed text-stone-600">
            Chương tiếp theo bạn muốn bắt đầu là gì?
          </p>
          <Link
            href="/portal/workspace"
            className="story-serif mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-900 underline decoration-amber-900/30 underline-offset-4 transition hover:decoration-amber-900"
          >
            Bắt đầu viết tiếp <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <p className="story-serif mt-6 text-xs text-stone-400">
            Muốn nhìn sâu hơn?{" "}
            <Link href="/portal/mirror" className="underline decoration-stone-300 underline-offset-4 hover:text-stone-600">
              Mở Mirror
            </Link>
          </p>
          <Link
            href="/portal/hanhtrinhcuatoi"
            className="story-serif mt-10 inline-block text-xs text-stone-400 underline decoration-stone-300 underline-offset-4 hover:text-stone-600"
          >
            ← Hành trình của tôi
          </Link>
        </section>
      </div>
    </div>
  );
}

/** Trang trắng để viết — hợp nhất ReflectionJournalCard + AddMemoryCapsuleForm
 * cũ vào một khối duy nhất, tối giản, đúng tinh thần "Companion giúp gìn giữ
 * cuốn sách, không viết hộ". Hai hook tự quản lý vòng đời dữ liệu riêng
 * (đọc/ghi Supabase trực tiếp) — mục đã lưu chỉ hiện lại đầy đủ trong các
 * chương phía trên sau khi tải lại trang, giống các cửa Journey khác. */
function WriteNook({ reflections }: { reflections: Reflection[] }) {
  const { question, answeredToday, submitAnswer, signedIn, ready, tableReady } = useReflections();
  const { addCapsule, ready: capsuleReady, tableReady: capsuleTableReady } = useMemoryCapsules();
  const [draft, setDraft] = useState("");
  const [savedReflection, setSavedReflection] = useState(false);
  const [memoryTitle, setMemoryTitle] = useState("");
  const [savedMemory, setSavedMemory] = useState(false);

  if (!ready || !signedIn) return null;
  if (!tableReady || !capsuleReady || !capsuleTableReady) {
    return (
      <p className="story-serif mt-5 text-sm italic text-stone-400">
        Khu vực lưu ký ức đang được chuẩn bị — bạn có thể quay lại viết sau.
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-6">
      {answeredToday || savedReflection ? (
        <p className="story-serif text-sm italic leading-relaxed text-stone-500">
          Cảm ơn bạn đã dành chút thời gian để suy ngẫm hôm nay — dòng đó đã được cất vào cuốn sách.
        </p>
      ) : (
        <div>
          <p className="story-serif text-sm italic text-stone-500">{question}</p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Không cần dài, chỉ cần thật..."
            rows={2}
            className="story-serif mt-2 w-full rounded-lg border border-amber-900/15 bg-white/50 p-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700/30"
          />
          <button
            type="button"
            disabled={!draft.trim()}
            onClick={async () => {
              await submitAnswer(draft);
              setSavedReflection(true);
            }}
            className="story-serif mt-2 text-sm font-semibold text-amber-900 underline decoration-amber-900/30 underline-offset-4 transition hover:decoration-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Lưu dòng này vào cuốn sách
          </button>
        </div>
      )}

      <div>
        <p className="story-serif text-sm italic text-stone-500">Có một khoảnh khắc khác đáng giữ lại hôm nay?</p>
        <input
          value={memoryTitle}
          onChange={(e) => setMemoryTitle(e.target.value)}
          placeholder="Điều gì đáng nhớ với bạn?"
          className="story-serif mt-2 w-full rounded-lg border border-amber-900/15 bg-white/50 p-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700/30"
        />
        <button
          type="button"
          disabled={!memoryTitle.trim()}
          onClick={async () => {
            await addCapsule({ kind: "milestone", title: memoryTitle });
            setMemoryTitle("");
            setSavedMemory(true);
            setTimeout(() => setSavedMemory(false), 3000);
          }}
          className="story-serif mt-2 text-sm font-semibold text-amber-900 underline decoration-amber-900/30 underline-offset-4 transition hover:decoration-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {savedMemory ? "Đã cất giữ" : "Cất giữ vào cuốn sách"}
        </button>
      </div>
      {reflections.length === 0 && (
        <p className="story-serif text-xs italic text-stone-400">
          Chưa có suy ngẫm nào được lưu — dòng đầu tiên luôn là dòng khó viết nhất.
        </p>
      )}
    </div>
  );
}
