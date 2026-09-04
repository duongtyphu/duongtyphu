"use client";

/**
 * View "Từ điển" (5/10) — `/v2/moi-ngay-mot-y-tuong/tu-dien`, 1:1 với
 * mockup dòng 564-696: 4 chế độ (Lưới/Danh sách/Thẻ lật/Kiểm tra), thanh
 * chữ cái A-Z, chip danh mục + cấp độ, tìm kiếm, lưu/sao chép thuật ngữ,
 * "Thuật ngữ liên quan" (bấm nhảy tới đúng thuật ngữ đó).
 *
 * Chế độ Thẻ lật dùng đúng thuật toán lặp ngắt quãng Leitner của mockup
 * gốc (5 hộp: 1/3/7/21/60 ngày) — LƯU THẬT qua `saveMnytTermSrs()` (Giai
 * đoạn 4), khác mockup chỉ lưu `localStorage`. Chế độ Kiểm tra sinh câu
 * hỏi bằng RNG có seed (LCG), y hệt công thức mockup — không lưu điểm lên
 * server (điểm chỉ có ý nghĩa trong phiên đang luyện, đúng hành vi gốc).
 */

import { useCallback, useMemo, useRef, useState } from "react";

import type { MnytGlossaryTerm } from "@/lib/portal/live-mnyt";
import type { MnytStateBundle } from "@/lib/portal/mnyt-sync";
import { saveMnytTermSrs, toggleMnytSavedTerm } from "@/lib/portal/mnyt-sync";
import { MNYT_GLOSSARY_CATEGORIES, getMnytGlossaryCategoryMeta } from "@/lib/mnyt/glossary-categories";

type TermWithMeta = MnytGlossaryTerm & { level: "basic" | "advanced"; relatedIds: number[] };
type TermSrsMap = MnytStateBundle["termSrs"];

type Props = {
  lang: "vi" | "en";
  terms: TermWithMeta[];
  savedTermIds: number[];
  termSrs: TermSrsMap;
};

type Mode = "grid" | "list" | "flash" | "quiz";
type FlashScope = "all" | "due" | "saved";
type LevelFilter = "all" | "basic" | "advanced" | "saved";

const SRS_DAYS = [1, 3, 7, 21, 60];

function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function initialOf(label: string): string {
  const ch = stripDiacritics(label).charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : "#";
}

/**
 * Sinh 1 câu hỏi trắc nghiệm bằng RNG có seed (LCG, 1:1 công thức mockup
 * gốc) — hàm THUẦN cấp module (không phải component/hook), để biến cục bộ
 * `qs` được phép tái gán qua closure `qr()` mà không vi phạm quy tắc
 * React Compiler "không tái gán biến trong thân component" (cùng lý do
 * `seeded()`/`fibonacciPoint()` ở `MnytHomeClient.tsx` đặt ở cấp module).
 */
function buildGlossaryQuiz(pool: TermWithMeta[], terms: TermWithMeta[], seed: number): { answer: TermWithMeta; options: TermWithMeta[] } {
  let qs = seed;
  const qr = () => {
    qs = (qs * 9301 + 49297) % 233280;
    return qs / 233280;
  };
  const qAns = pool[Math.floor(qr() * pool.length) % pool.length];
  const sameCat = terms.filter((t) => t.id !== qAns.id && t.category === qAns.category);
  const others = terms.filter((t) => t.id !== qAns.id && t.category !== qAns.category);
  const distract: TermWithMeta[] = [];
  const pull = (arr: TermWithMeta[]) => {
    if (!arr.length) return;
    distract.push(arr.splice(Math.floor(qr() * arr.length), 1)[0]);
  };
  pull(sameCat);
  pull(sameCat);
  pull(others);
  while (distract.length < 3 && (others.length || sameCat.length)) pull(others.length ? others : sameCat);
  const options = [...distract, qAns];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(qr() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { answer: qAns, options };
}

export function MnytGlossaryClient({ lang, terms, savedTermIds, termSrs: initialTermSrs }: Props) {
  const isVi = lang === "vi";
  const label = useCallback((t: TermWithMeta) => (isVi ? t.term : t.termEn || t.term), [isVi]);
  const def = useCallback((t: TermWithMeta) => (isVi ? t.definition : t.definitionEn || t.definition), [isVi]);

  const [mode, setMode] = useState<Mode>("grid");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterLetter, setFilterLetter] = useState("all");
  const [filterLevel, setFilterLevel] = useState<LevelFilter>("all");

  const [savedIds, setSavedIds] = useState(() => new Set(savedTermIds));
  const [termSrs, setTermSrs] = useState<TermSrsMap>(initialTermSrs);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [flashScope, setFlashScope] = useState<FlashScope>("all");
  const [flashIdx, setFlashIdx] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);

  const [gqSeed, setGqSeed] = useState(1);
  const [gqPicked, setGqPicked] = useState<number | null>(null);
  const [gqScore, setGqScore] = useState(0);
  const [gqTotal, setGqTotal] = useState(0);

  const isDue = useCallback(
    (id: number) => {
      const r = termSrs[id];
      return !r || !r.dueAt || new Date(r.dueAt).getTime() <= Date.now();
    },
    [termSrs],
  );

  const termById = useMemo(() => new Map(terms.map((t) => [t.id, t])), [terms]);

  const matched = useMemo(() => {
    const q = search.trim().toLowerCase();
    return terms
      .filter((t) => filterCat === "all" || t.category === filterCat)
      .filter((t) => filterLetter === "all" || initialOf(label(t)) === filterLetter)
      .filter((t) => (filterLevel === "saved" ? savedIds.has(t.id) : filterLevel === "all" || t.level === filterLevel))
      .filter(
        (t) =>
          !q ||
          t.term.toLowerCase().includes(q) ||
          t.termEn.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          t.definitionEn.toLowerCase().includes(q),
      )
      .sort((a, b) => label(a).localeCompare(label(b)));
  }, [terms, search, filterCat, filterLetter, filterLevel, savedIds, label]);

  const letters = useMemo(() => {
    const present = new Set(terms.map((t) => initialOf(label(t))));
    return ["all", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((l) => present.has(l))];
  }, [terms, label]);

  const catCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const t of terms) out[t.category] = (out[t.category] ?? 0) + 1;
    return out;
  }, [terms]);

  const jumpToTerm = useCallback(
    (termEn: string) => {
      setFilterCat("all");
      setFilterLetter("all");
      setFilterLevel("all");
      setSearch(termEn);
      setMode((m) => (m === "flash" || m === "quiz" ? "grid" : m));
    },
    [],
  );

  const toggleSave = useCallback((id: number) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    void toggleMnytSavedTerm(id);
  }, []);

  const handleCopy = useCallback(
    (t: TermWithMeta) => {
      navigator.clipboard?.writeText(label(t)).catch(() => {});
      setCopiedId(t.id);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedId(null), 1600);
    },
    [label],
  );

  // ---- Thẻ lật (SRS) ---------------------------------------------------
  const flashPool = useMemo(
    () =>
      matched.filter((t) => {
        if (flashScope === "saved") return savedIds.has(t.id);
        if (flashScope === "due") return isDue(t.id);
        return true;
      }),
    [matched, flashScope, savedIds, isDue],
  );
  const fIdx = flashPool.length ? flashIdx % flashPool.length : 0;
  const flashCard = flashPool.length ? flashPool[fIdx] : null;
  const dueCount = terms.filter((t) => isDue(t.id)).length;
  const learnedCount = Object.values(termSrs).filter((r) => (r.box ?? 0) >= 2).length;

  const flashStep = useCallback(
    (dir: 1 | -1) => {
      setFlashFlipped(false);
      setFlashIdx((i) => {
        const total = flashPool.length;
        return total > 0 ? (i + dir + total) % total : 0;
      });
    },
    [flashPool.length],
  );

  const gradeTerm = useCallback(
    (id: number, grade: "again" | "hard" | "good") => {
      const cur = termSrs[id] ?? { box: 0, dueAt: null, seenAt: null };
      const box = grade === "again" ? 0 : grade === "hard" ? Math.max(0, cur.box) : Math.min(SRS_DAYS.length - 1, (cur.box || 0) + 1);
      const waitDays = grade === "again" ? 1 : SRS_DAYS[box];
      const dueAt = new Date(Date.now() + waitDays * 86400000).toISOString();
      const seenAt = new Date().toISOString();
      setTermSrs((prev) => ({ ...prev, [id]: { box, dueAt, seenAt } }));
      void saveMnytTermSrs(id, { box, dueAt, seenAt });
      setFlashFlipped(false);
      setFlashIdx((i) => i + 1);
    },
    [termSrs],
  );

  // ---- Kiểm tra (quiz) ---------------------------------------------------
  const quiz = useMemo(() => {
    if (terms.length < 4) return null;
    const pool = matched.length >= 4 ? matched : terms;
    return buildGlossaryQuiz(pool, terms, gqSeed * 7919 + 13);
  }, [terms, matched, gqSeed]);

  const gqPick = useCallback(
    (i: number, correct: boolean) => {
      if (gqPicked !== null) return;
      setGqPicked(i);
      setGqScore((s) => s + (correct ? 1 : 0));
      setGqTotal((t) => t + 1);
    },
    [gqPicked],
  );
  const gqNext = useCallback(() => {
    setGqSeed((s) => s + 1);
    setGqPicked(null);
  }, []);
  const gqReset = useCallback(() => {
    setGqScore(0);
    setGqTotal(0);
    setGqPicked(null);
    setGqSeed(Date.now() % 9973);
  }, []);

  const t = {
    title: isVi ? "Từ điển AI" : "AI Glossary",
    desc: isVi ? "Các thuật ngữ AI thường gặp, giải thích dễ hiểu." : "Common AI terms, explained simply.",
    modes: {
      grid: isVi ? "▦ Lưới" : "▦ Cards",
      list: isVi ? "☰ Danh sách" : "☰ List",
      flash: isVi ? "⇄ Thẻ lật" : "⇄ Flashcards",
      quiz: isVi ? "◎ Kiểm tra" : "◎ Quiz",
    },
    searchPlaceholder: isVi ? "Tìm trong 100 thuật ngữ…" : "Search 100 terms…",
    all: isVi ? "Tất cả" : "All",
    levels: {
      all: isVi ? "Mọi cấp độ" : "All levels",
      basic: isVi ? "Cơ bản" : "Basic",
      advanced: isVi ? "Nâng cao" : "Advanced",
      saved: isVi ? "★ Đã lưu" : "★ Saved",
    },
    count: (n: number, total: number) => (isVi ? `${n}/${total} thuật ngữ` : `${n} of ${total} terms`),
    noResults: isVi ? "Không có thuật ngữ phù hợp với bộ lọc." : "No terms match your filters.",
    related: isVi ? "Liên quan" : "Related",
    save: isVi ? "Lưu thuật ngữ" : "Save term",
    saved: isVi ? "Đã lưu" : "Saved",
    copy: isVi ? "Sao chép" : "Copy",
    flashScopes: {
      all: isVi ? "Tất cả" : "All",
      due: isVi ? "Đến hạn" : "Due today",
      saved: isVi ? "★ Đã lưu" : "★ Saved",
    },
    flashHint: (flipped: boolean) => (flipped ? (isVi ? "Bấm để xem lại thuật ngữ" : "Click to see the term") : isVi ? "Bấm để xem giải nghĩa" : "Click to reveal the meaning"),
    flashEmpty: isVi ? "Chưa có thẻ nào — hãy lưu vài thuật ngữ trước." : "No cards here yet — save some terms first.",
    srsHint: isVi ? "Tự đánh giá — thẻ sẽ quay lại đúng lịch ôn" : "Rate yourself — the card comes back on schedule",
    srsProgress: isVi ? `${learnedCount} thuật ngữ đã vào bộ nhớ · ${dueCount} đến hạn ôn hôm nay` : `${learnedCount} learned · ${dueCount} due today`,
    srsButtons: {
      again: isVi ? "Chưa nhớ" : "Not yet",
      hard: isVi ? "Còn khó" : "Hard",
      good: isVi ? "Nhớ rồi" : "Got it",
    },
    quizPrompt: isVi ? "Đây là giải nghĩa của thuật ngữ nào?" : "Which term does this describe?",
    quizScore: isVi ? `Đúng ${gqScore}/${gqTotal}` : `${gqScore}/${gqTotal} correct`,
    quizReset: isVi ? "Xoá điểm" : "Reset score",
    quizNext: isVi ? "Câu tiếp theo →" : "Next question →",
    quizAnswer: isVi ? "Đáp án" : "Answer",
    quizEmpty: isVi ? "Cần ít nhất 4 thuật ngữ để tạo câu hỏi." : "Need at least 4 terms to build a question.",
  };

  const isBrowse = mode === "grid" || mode === "list";

  return (
    <section className="mnyt-glossary" data-screen-label="Glossary">
      <h1 className="mnyt-glossary-title">{t.title}</h1>
      <p className="mnyt-glossary-desc">{t.desc}</p>

      <div className="mnyt-glossary-modes">
        {(Object.keys(t.modes) as Mode[]).map((m) => (
          <button key={m} type="button" className="mnyt-glossary-mode-btn" data-active={mode === m} onClick={() => setMode(m)}>
            {t.modes[m]}
          </button>
        ))}
      </div>

      <input
        type="search"
        className="mnyt-glossary-search"
        aria-label={t.searchPlaceholder}
        placeholder={t.searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isBrowse && (
        <>
          <div className="mnyt-glossary-cat-chips">
            <button type="button" className="mnyt-glossary-cat-chip" data-active={filterCat === "all"} onClick={() => setFilterCat("all")}>
              {t.all} {terms.length}
            </button>
            {MNYT_GLOSSARY_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className="mnyt-glossary-cat-chip"
                data-active={filterCat === cat.key}
                style={filterCat === cat.key ? { borderColor: cat.color, color: cat.color, background: `${cat.color}22` } : undefined}
                onClick={() => setFilterCat(cat.key)}
              >
                {isVi ? cat.labelVi : cat.labelEn} {catCounts[cat.key] ?? 0}
              </button>
            ))}
          </div>
          <div className="mnyt-glossary-level-chips">
            {(["all", "basic", "advanced", "saved"] as LevelFilter[]).map((lv) => (
              <button key={lv} type="button" className="mnyt-glossary-level-chip" data-active={filterLevel === lv} onClick={() => setFilterLevel(lv)}>
                {lv === "saved" ? `${t.levels.saved} ${savedIds.size}` : t.levels[lv]}
              </button>
            ))}
          </div>
        </>
      )}

      {isBrowse && (
        <div className="mnyt-glossary-browse">
          <div className="mnyt-glossary-rail">
            {letters.map((l) => (
              <button key={l} type="button" className="mnyt-glossary-rail-btn" data-active={filterLetter === l} onClick={() => setFilterLetter(l)}>
                {l === "all" ? "·" : l}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mnyt-glossary-count">{t.count(matched.length, terms.length)}</div>
            {matched.length === 0 && <div className="mnyt-glossary-empty">{t.noResults}</div>}
            <div className="mnyt-glossary-grid" data-mode={mode}>
              {matched.map((term) => {
                const cat = getMnytGlossaryCategoryMeta(term.category);
                const isSaved = savedIds.has(term.id);
                const related = term.relatedIds.map((id) => termById.get(id)).filter((r): r is TermWithMeta => Boolean(r));
                return (
                  <div
                    key={term.id}
                    className="mnyt-glossary-card"
                    data-mode={mode}
                    style={{ ["--cat-color" as string]: cat.color, ["--cat-tint" as string]: `${cat.color}14`, ["--cat-border" as string]: `${cat.color}4d` }}
                  >
                    <div className="mnyt-glossary-card-head">
                      <div className="mnyt-glossary-card-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d={cat.iconPath} />
                        </svg>
                      </div>
                      <span className="mnyt-glossary-card-tag">{isVi ? cat.labelVi : cat.labelEn}</span>
                      <div style={{ flex: 1 }} />
                      <button type="button" className="mnyt-glossary-card-icon-btn" title={t.copy} aria-label={t.copy} onClick={() => handleCopy(term)}>
                        {copiedId === term.id ? "✓" : "⧉"}
                      </button>
                      <button
                        type="button"
                        className="mnyt-glossary-card-icon-btn"
                        data-saved={isSaved}
                        title={isSaved ? t.saved : t.save}
                        aria-label={isSaved ? t.saved : t.save}
                        onClick={() => toggleSave(term.id)}
                      >
                        {isSaved ? "★" : "☆"}
                      </button>
                    </div>
                    <div className="mnyt-glossary-card-term-row">
                      <div className="mnyt-glossary-card-term">{label(term)}</div>
                      <span className="mnyt-glossary-card-level" data-level={term.level}>
                        {term.level === "advanced" ? t.levels.advanced : t.levels.basic}
                      </span>
                    </div>
                    <div className="mnyt-glossary-card-def">{def(term)}</div>
                    {related.length > 0 && (
                      <div className="mnyt-glossary-card-related">
                        <span className="mnyt-glossary-card-related-label">{t.related}</span>
                        {related.map((r) => (
                          <button key={r.id} type="button" className="mnyt-glossary-related-chip" style={{ borderColor: cat.color, color: cat.color }} onClick={() => jumpToTerm(r.termEn)}>
                            {label(r)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {mode === "flash" && (
        <div className="mnyt-glossary-flash-wrap">
          <div className="mnyt-glossary-flash-toolbar">
            {(["all", "due", "saved"] as FlashScope[]).map((scope) => {
              const n = scope === "all" ? matched.length : scope === "due" ? dueCount : savedIds.size;
              return (
                <button key={scope} type="button" className="mnyt-glossary-flash-scope-btn" data-active={flashScope === scope} onClick={() => { setFlashScope(scope); setFlashIdx(0); setFlashFlipped(false); }}>
                  {t.flashScopes[scope]} {n}
                </button>
              );
            })}
            <div style={{ flex: 1 }} />
            <span className="mnyt-glossary-flash-pos">{flashPool.length ? `${fIdx + 1} / ${flashPool.length}` : "0 / 0"}</span>
          </div>
          <div className="mnyt-glossary-flash-srs-label">{t.srsProgress}</div>

          {flashCard ? (
            <>
              <div
                className="mnyt-glossary-flash-face"
                data-flipped={flashFlipped}
                style={{ ["--cat-color" as string]: getMnytGlossaryCategoryMeta(flashCard.category).color }}
                onClick={() => setFlashFlipped((f) => !f)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setFlashFlipped((f) => !f);
                }}
              >
                <span className="mnyt-glossary-flash-level" data-level={flashCard.level}>
                  {flashCard.level === "advanced" ? t.levels.advanced : t.levels.basic}
                </span>
                <div className="mnyt-glossary-flash-term" data-flipped={flashFlipped}>
                  {label(flashCard)}
                </div>
                {flashFlipped && <div className="mnyt-glossary-flash-def">{def(flashCard)}</div>}
                <span className="mnyt-glossary-flash-hint">{t.flashHint(flashFlipped)}</span>
              </div>

              <div className="mnyt-glossary-srs-buttons">
                {(["again", "hard", "good"] as const).map((grade) => (
                  <button key={grade} type="button" className="mnyt-glossary-srs-btn" data-grade={grade} onClick={() => gradeTerm(flashCard.id, grade)}>
                    {t.srsButtons[grade]}
                  </button>
                ))}
              </div>
              <div className="mnyt-glossary-srs-hint">{t.srsHint}</div>

              <div className="mnyt-glossary-flash-nav">
                <button type="button" className="mnyt-glossary-flash-nav-btn" aria-label={isVi ? "Trước" : "Previous"} onClick={() => flashStep(-1)}>
                  ←
                </button>
                <button
                  type="button"
                  className="mnyt-glossary-flash-save-btn"
                  data-saved={savedIds.has(flashCard.id)}
                  title={savedIds.has(flashCard.id) ? t.saved : t.save}
                  aria-label={savedIds.has(flashCard.id) ? t.saved : t.save}
                  onClick={() => toggleSave(flashCard.id)}
                >
                  {savedIds.has(flashCard.id) ? "★" : "☆"}
                </button>
                <button type="button" className="mnyt-glossary-flash-nav-btn" aria-label={isVi ? "Tiếp" : "Next"} onClick={() => flashStep(1)}>
                  →
                </button>
              </div>
            </>
          ) : (
            <div className="mnyt-glossary-flash-empty">{t.flashEmpty}</div>
          )}
        </div>
      )}

      {mode === "quiz" && (
        <div className="mnyt-glossary-quiz-wrap">
          <div className="mnyt-glossary-quiz-toolbar">
            <span className="mnyt-glossary-quiz-score">{t.quizScore}</span>
            <button type="button" className="mnyt-glossary-quiz-reset-btn" onClick={gqReset}>
              {t.quizReset}
            </button>
          </div>
          {quiz ? (
            <>
              <div className="mnyt-glossary-quiz-card">
                <span className="mnyt-glossary-quiz-cat" style={{ color: getMnytGlossaryCategoryMeta(quiz.answer.category).color, background: `${getMnytGlossaryCategoryMeta(quiz.answer.category).color}1f`, borderColor: `${getMnytGlossaryCategoryMeta(quiz.answer.category).color}55` }}>
                  {isVi ? getMnytGlossaryCategoryMeta(quiz.answer.category).labelVi : getMnytGlossaryCategoryMeta(quiz.answer.category).labelEn}
                </span>
                <div className="mnyt-glossary-quiz-prompt">{t.quizPrompt}</div>
                <div className="mnyt-glossary-quiz-question">{def(quiz.answer)}</div>
              </div>
              <div className="mnyt-glossary-quiz-options">
                {quiz.options.map((opt, i) => {
                  const correct = opt.id === quiz.answer.id;
                  const chosen = gqPicked === i;
                  const reveal = gqPicked !== null;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className="mnyt-glossary-quiz-option"
                      data-state={reveal ? (correct ? "correct" : chosen ? "wrong" : "neutral") : "idle"}
                      onClick={() => gqPick(i, correct)}
                    >
                      {label(opt)}
                    </button>
                  );
                })}
              </div>
              {gqPicked !== null && (
                <div className="mnyt-glossary-quiz-explain">
                  <span className="mnyt-glossary-quiz-explain-label">{t.quizAnswer}</span>
                  <span className="mnyt-glossary-quiz-explain-term" style={{ color: getMnytGlossaryCategoryMeta(quiz.answer.category).color }}>
                    {label(quiz.answer)}
                  </span>
                  <div style={{ flex: 1 }} />
                  <button type="button" className="mnyt-glossary-quiz-next-btn" onClick={gqNext}>
                    {t.quizNext}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mnyt-glossary-flash-empty">{t.quizEmpty}</div>
          )}
        </div>
      )}
    </section>
  );
}
