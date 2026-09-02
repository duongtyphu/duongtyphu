"use client";

/**
 * View "Chi tiết ý tưởng" (2/10) — `/v2/moi-ngay-mot-y-tuong/y-tuong/[id]`,
 * 1:1 với mockup dòng 697-913. 5 bước CÓ GATE (chỉ đi tới bằng nút "Tiếp"/
 * phím →, chấm bước chỉ bấm được nếu đã ghé qua): Khái niệm (3 tab: khái
 * niệm/cơ chế/rủi ro) → Prompt (3 tab: ngắn/chi tiết/nâng cao + hộp prompt
 * copy được) → Trắc nghiệm (câu chính + áp dụng + tình huống, nếu có) → Áp
 * dụng (checklist 3 mục, lưu server) → Tổng kết (takeaway + ý tưởng liên
 * quan + báo lỗi thời).
 *
 * Chế độ nhanh (`?mode=quick`, từ nút "Học nhanh 60 giây" ở Trang chủ) gộp
 * khái niệm + câu hỏi chính vào 1 thẻ, "Hoàn thành nhanh" gọi thẳng
 * `completeMnytTopic()` — bỏ qua toàn bộ 5 bước.
 *
 * Hoàn thành gọi `completeMnytTopic()` (Server Action, Giai đoạn 4 — streak/
 * XP/huy hiệu tính Ở SERVER) → hiện thẻ chúc mừng (nhật ký, gợi ý ý tưởng
 * tiếp theo cùng lĩnh vực, yêu thích/chia sẻ/ý tưởng khác).
 *
 * Không có TOOL COMPARE (mockup's `toolCompare`) — dữ liệu thật KHÔNG có
 * nội dung "công cụ nào tốt nhất cho việc gì/cần lưu ý gì" theo từng cặp
 * công cụ — bịa nội dung này sẽ vi phạm nguyên tắc không tạo dữ liệu giả,
 * nên bỏ hẳn khối này (đúng tinh thần README "chỉ hiển thị dữ liệu thật").
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { MnytQuiz, MnytTopicFull, MnytTopicSummary } from "@/lib/portal/live-mnyt";
import { completeMnytTopic, reportMnytOutdated, saveMnytChecklist, saveMnytJournalEntry, toggleMnytFavorite } from "@/lib/portal/mnyt-sync";
import { MNYT_ROUTES, mnytDetailHref } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";

type Props = {
  lang: "vi" | "en";
  topic: MnytTopicFull;
  quickMode: boolean;
  prevTopic: MnytTopicSummary | null;
  nextTopic: MnytTopicSummary | null;
  relatedTopics: MnytTopicSummary[];
  isFavorite: boolean;
  alreadyCompleted: boolean;
  initialJournal: string;
  initialChecklist: [boolean, boolean, boolean];
  signedIn: boolean;
};

const STEP_COUNT = 5;

export function MnytDetailClient({
  lang,
  topic,
  quickMode,
  prevTopic,
  nextTopic,
  relatedTopics,
  isFavorite: initialFavorite,
  alreadyCompleted,
  initialJournal,
  initialChecklist,
  signedIn,
}: Props) {
  const router = useRouter();
  const isVi = lang === "vi";
  const c = topic.content;

  const [currentStep, setCurrentStep] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [conceptTab, setConceptTab] = useState(0);
  const [promptTab, setPromptTab] = useState(0);
  const [mainQuizAnswer, setMainQuizAnswer] = useState<number | null>(null);
  const [applyQuizAnswer, setApplyQuizAnswer] = useState<number | null>(null);
  const [scenarioQuizAnswer, setScenarioQuizAnswer] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<[boolean, boolean, boolean]>(initialChecklist);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [journalText, setJournalText] = useState(initialJournal);
  const [lessonDone, setLessonDone] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completeResult, setCompleteResult] = useState<{ newBadges: { id: string; label: string }[] } | null>(null);
  const [reported, setReported] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [quickAnswer, setQuickAnswer] = useState<number | null>(null);

  const journalDirty = useRef(false);

  const mainQuiz: MnytQuiz = isVi ? c.quiz : c.quizEn;
  const applyQuiz: MnytQuiz = isVi ? c.applyQuiz : c.applyQuizEn;
  const scenarioQuiz: MnytQuiz = isVi ? c.scenarioQuiz : c.scenarioQuizEn;
  const hasApplyQuiz = Boolean(applyQuiz?.question);
  const hasScenario = Boolean(scenarioQuiz?.question);
  const hasRemix = relatedTopics.length > 0;

  const conceptTabs = useMemo(
    () => [
      { label: isVi ? "Khái niệm" : "Concept", text: isVi ? c.concept : c.conceptEn },
      { label: isVi ? "Cách hoạt động" : "How it works", text: isVi ? c.mechanism : c.mechanismEn },
      { label: isVi ? "Rủi ro cần biết" : "Risks to know", text: isVi ? c.risk : c.riskEn },
    ],
    [c, isVi],
  );

  const promptTabs = useMemo(
    () => [
      { label: isVi ? "Ngắn gọn" : "Short", text: isVi ? c.promptShort : c.promptShortEn },
      { label: isVi ? "Chi tiết" : "Detailed", text: isVi ? c.promptDetailed : c.promptDetailedEn },
      { label: isVi ? "Nâng cao" : "Advanced", text: isVi ? c.promptAdvanced : c.promptAdvancedEn },
    ],
    [c, isVi],
  );

  const flowSteps = useMemo(
    () => [
      { icon: "📋", cap: isVi ? "Sao chép" : "Copy", body: isVi ? "Copy prompt bên dưới, thay phần trong ngoặc [ ] bằng thông tin thật của bạn." : "Copy the prompt below, replace the bracketed [ ] parts with your real details." },
      {
        icon: "🤖",
        cap: isVi ? "Dán vào công cụ" : "Paste into a tool",
        body: isVi ? `Dán vào ${topic.tools[0] ?? "ChatGPT"} hoặc công cụ AI bạn quen dùng.` : `Paste it into ${topic.tools[0] ?? "ChatGPT"} or the AI tool you use.`,
      },
      { icon: "✅", cap: isVi ? "Kiểm tra & tinh chỉnh" : "Review & refine", body: isVi ? "Đọc lại kết quả, chỉnh sửa cho khớp thực tế rồi lưu lại phần dùng được." : "Review the output, adjust it to fit reality, then save what's usable." },
    ],
    [isVi, topic.tools],
  );

  const checklistLabels = isVi
    ? ["Đã thử prompt với đúng tình huống thật của tôi", "Đã so sánh kết quả AI với cách làm cũ", "Đã lưu lại thành quy trình dùng lại được"]
    : ["I tried the prompt with my own real situation", "I compared the AI result with my old approach", "I saved it as a reusable process"];

  const activePromptText = promptTabs[promptTab]?.text || "";

  const handleCopyPrompt = useCallback(() => {
    if (!activePromptText) return;
    navigator.clipboard
      ?.writeText(activePromptText)
      .then(() => {
        setCopyFeedback(isVi ? "Đã sao chép!" : "Copied!");
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch(() => {});
  }, [activePromptText, isVi]);

  const handleShare = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { share?: (data: { title?: string; url?: string }) => Promise<void> }) : null;
    if (nav?.share) {
      nav.share({ title: topic.title, url }).catch(() => {});
      return;
    }
    nav?.clipboard
      ?.writeText(url)
      .then(() => {
        setCopyFeedback(isVi ? "Đã sao chép liên kết!" : "Link copied!");
        setTimeout(() => setCopyFeedback(null), 2000);
      })
      .catch(() => {});
  }, [topic.title, isVi]);

  const goToStep = useCallback(
    (n: number) => {
      if (n < 0 || n >= STEP_COUNT) return;
      if (!visited.has(n) && n > currentStep) return;
      setCurrentStep(n);
    },
    [visited, currentStep],
  );

  const handleComplete = useCallback(async () => {
    if (!signedIn || completing) return;
    setCompleting(true);
    const result = await completeMnytTopic(topic.id);
    setCompleting(false);
    if (result.ok) {
      setCompleteResult({ newBadges: result.newBadges });
      setLessonDone(true);
    }
  }, [signedIn, completing, topic.id]);

  const nextStep = useCallback(() => {
    if (currentStep < STEP_COUNT - 1) {
      const n = currentStep + 1;
      setVisited((prev) => new Set(prev).add(n));
      setCurrentStep(n);
    } else {
      void handleComplete();
    }
  }, [currentStep, handleComplete]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  useEffect(() => {
    if (quickMode || lessonDone) return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["TEXTAREA", "INPUT"].includes(target.tagName)) return;
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickMode, lessonDone, nextStep, prevStep]);

  const toggleChecklistItem = useCallback(
    (i: 0 | 1 | 2) => {
      setChecklist((prev) => {
        const next = [...prev] as [boolean, boolean, boolean];
        next[i] = !next[i];
        void saveMnytChecklist(topic.id, next);
        return next;
      });
    },
    [topic.id],
  );

  const handleToggleFavorite = useCallback(async () => {
    setIsFavorite((v) => !v);
    const result = await toggleMnytFavorite(topic.id);
    if (result.ok) setIsFavorite(result.isFavorite);
  }, [topic.id]);

  const handleJournalBlur = useCallback(() => {
    if (!journalDirty.current) return;
    journalDirty.current = false;
    void saveMnytJournalEntry(topic.id, journalText);
  }, [topic.id, journalText]);

  const handleReportOutdated = useCallback(async () => {
    setReported(true);
    await reportMnytOutdated(topic.id);
  }, [topic.id]);

  const t = {
    back: isVi ? "← Quay lại kho ý tưởng" : "← Back to library",
    pathMap: isVi ? "🗺 Bản đồ lộ trình" : "🗺 Path map",
    estMinutes: isVi ? `${topic.estMinutes} phút` : `${topic.estMinutes} min`,
    toolsLabel: isVi ? "Công cụ:" : "Tools:",
    pathNav: isVi ? `Bước ${topic.pathStep}/${topic.pathTotal} trong lộ trình ${topic.categoryName}` : `Step ${topic.pathStep}/${topic.pathTotal} in the ${topic.categoryNameEn || topic.categoryName} path`,
    stepLabels: isVi
      ? ["KHÁI NIỆM", "PROMPT MẪU", "TRẮC NGHIỆM", "ÁP DỤNG", "TỔNG KẾT"]
      : ["CONCEPT", "SAMPLE PROMPT", "QUIZ", "APPLY", "RECAP"],
    flowLabel: isVi ? "QUY TRÌNH SỬ DỤNG" : "USAGE FLOW",
    checklistDone: isVi ? "đã đánh dấu" : "checked",
    relatedLabel: isVi ? "Ý tưởng liên quan" : "Related ideas",
    reportOutdated: reported ? (isVi ? "Đã báo cáo, cảm ơn bạn!" : "Reported, thank you!") : isVi ? "Nội dung này đã lỗi thời?" : "Is this content outdated?",
    back_: isVi ? "← Trước" : "← Back",
    next: currentStep < STEP_COUNT - 1 ? (isVi ? "Tiếp →" : "Next →") : completing ? (isVi ? "Đang lưu…" : "Saving…") : isVi ? "Hoàn thành ✓" : "Complete ✓",
    kbdHint: isVi ? "Dùng phím ← → để chuyển bước" : "Use ← → to move between steps",
    doneLabel: isVi ? "Đã hoàn thành" : "Completed",
    doneTitle: isVi ? "Bạn vừa học xong" : "You just finished",
    journalLabel: isVi ? "Ghi chú của bạn" : "Your notes",
    journalPlaceholder: isVi ? "Bạn sẽ áp dụng điều này thế nào?" : "How will you apply this?",
    remixLabel: isVi ? "Ý tưởng tiếp theo gợi ý" : "Suggested next idea",
    remixCta: isVi ? "Khám phá ý tưởng này →" : "Explore this idea →",
    favLabel: isFavorite ? (isVi ? "★ Đã yêu thích" : "★ Favorited") : isVi ? "☆ Yêu thích" : "☆ Favorite",
    shareCardLabel: isVi ? "🖼 Thẻ chia sẻ" : "🖼 Share card",
    shareLabel: copyFeedback ?? (isVi ? "Chia sẻ" : "Share"),
    anotherLabel: isVi ? "Ý tưởng khác →" : "Another idea →",
    prevPath: isVi ? "Ý tưởng trước" : "Previous idea",
    nextPath: isVi ? "Ý tưởng tiếp" : "Next idea",
    quickKicker: isVi ? "HỌC NHANH 60 GIÂY" : "60-SECOND MODE",
    quickComplete: completing ? (isVi ? "Đang lưu…" : "Saving…") : isVi ? "Hoàn thành nhanh" : "Quick complete",
    copyPrompt: isVi ? "Sao chép prompt" : "Copy prompt",
    alreadyDoneBadge: isVi ? "✓ Đã hoàn thành trước đây" : "✓ Completed before",
  };

  function renderQuizBlock(quiz: MnytQuiz, answer: number | null, setAnswer: (i: number) => void, key: string) {
    return (
      <div className="mnyt-detail-quiz-block" key={key}>
        <p className="mnyt-detail-quiz-question">{quiz.question}</p>
        <div className="mnyt-detail-quiz-options">
          {quiz.options.map((opt, i) => {
            let state: "correct" | "wrong" | "reveal" | undefined;
            if (answer !== null) {
              if (i === quiz.correct) state = "correct";
              else if (i === answer) state = "wrong";
              else state = "reveal";
            }
            return (
              <button key={i} type="button" className="mnyt-detail-quiz-opt" data-state={state} onClick={() => answer === null && setAnswer(i)} disabled={answer !== null}>
                {opt}
              </button>
            );
          })}
        </div>
        {answer !== null && quiz.why && <div className="mnyt-detail-quiz-why">{quiz.why}</div>}
      </div>
    );
  }

  if (quickMode && !lessonDone) {
    return (
      <section className="mnyt-view mnyt-detail">
        <Link href={MNYT_ROUTES.archive} className="mnyt-detail-back">
          {t.back}
        </Link>
        <div className="mnyt-detail-meta-row" style={{ marginTop: 16 }}>
          <span className="mnyt-detail-meta-cat" style={{ color: topic.color }}>
            {isVi ? topic.categoryName : topic.categoryNameEn || topic.categoryName}
          </span>
          <span className="mnyt-detail-meta-day">
            {isVi ? "Ý tưởng" : "Idea"} #{topic.day}
          </span>
        </div>
        <h1 className="mnyt-detail-title">{isVi ? topic.title : topic.titleEn || topic.title}</h1>
        <div className="mnyt-detail-quick" style={{ ["--card-accent" as string]: topic.color }}>
          <div className="mnyt-detail-quick-kicker">{t.quickKicker}</div>
          <p className="mnyt-detail-quick-concept">{isVi ? c.concept : c.conceptEn}</p>
          {renderQuizBlock(mainQuiz, quickAnswer, setQuickAnswer, "quick")}
          <button type="button" className="mnyt-detail-quick-complete-btn" onClick={handleComplete} disabled={completing || !signedIn}>
            {t.quickComplete}
          </button>
          {!signedIn && (
            <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 10, textAlign: "center" }}>
              {isVi ? "Đăng nhập để lưu tiến độ." : "Sign in to save your progress."}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mnyt-view mnyt-detail">
      <Link href={MNYT_ROUTES.archive} className="mnyt-detail-back">
        {t.back}
      </Link>

      <div className="mnyt-detail-cover" style={{ background: `linear-gradient(135deg, ${topic.color}33, #0a0b12)` }} aria-hidden />

      <div className="mnyt-detail-meta-row">
        <span className="mnyt-detail-meta-cat" style={{ color: topic.color }}>
          {isVi ? topic.categoryName : topic.categoryNameEn || topic.categoryName}
        </span>
        <span className="mnyt-detail-meta-day">
          {isVi ? "Ý tưởng" : "Idea"} #{topic.day}
        </span>
        <span className="mnyt-detail-meta-pill">{topic.difficulty}</span>
        <span className="mnyt-detail-meta-pill">{t.estMinutes}</span>
        {topic.tools.length > 0 && (
          <span className="mnyt-detail-meta-tools">
            {t.toolsLabel} {topic.tools.join(", ")}
          </span>
        )}
        <Link href={MNYT_ROUTES.path} className="mnyt-detail-pathmap-btn">
          {t.pathMap}
        </Link>
      </div>

      <h1 className="mnyt-detail-title">{isVi ? topic.title : topic.titleEn || topic.title}</h1>
      <div className="mnyt-detail-pathnav">
        {t.pathNav}
        {alreadyCompleted && !lessonDone && <span style={{ marginLeft: 10, color: "var(--green)" }}>{t.alreadyDoneBadge}</span>}
      </div>

      {!lessonDone && (
        <div className="mnyt-detail-dots" role="tablist" aria-label={isVi ? "Các bước học" : "Lesson steps"}>
          {t.stepLabels.map((label, i) => (
            <button
              key={i}
              type="button"
              className="mnyt-detail-dot"
              data-state={i === currentStep ? "active" : visited.has(i) && i < currentStep ? "done" : undefined}
              data-clickable={visited.has(i)}
              onClick={() => goToStep(i)}
              aria-label={label}
              aria-current={i === currentStep ? "step" : undefined}
            />
          ))}
        </div>
      )}

      {lessonDone ? (
        <div className="mnyt-detail-done">
          <div className="mnyt-detail-done-kicker">{t.doneLabel}</div>
          <h2 className="mnyt-detail-done-title">
            {t.doneTitle} {isVi ? topic.title : topic.titleEn || topic.title}
          </h2>
          <p className="mnyt-detail-done-takeaway">{isVi ? c.takeaway : c.takeawayEn}</p>
          {completeResult && completeResult.newBadges.length > 0 && (
            <p style={{ color: "var(--amber)", fontSize: 13, fontWeight: 600, marginTop: -14, marginBottom: 20 }}>
              🏅 {isVi ? "Huy hiệu mới: " : "New badges: "}
              {completeResult.newBadges.map((b) => b.label).join(", ")}
            </p>
          )}
          <div className="mnyt-detail-journal">
            <label htmlFor="mnyt-journal">{t.journalLabel}</label>
            <textarea
              id="mnyt-journal"
              rows={3}
              value={journalText}
              placeholder={t.journalPlaceholder}
              onChange={(e) => {
                journalDirty.current = true;
                setJournalText(e.target.value);
              }}
              onBlur={handleJournalBlur}
            />
          </div>
          {hasRemix && (
            <Link href={mnytDetailHref(relatedTopics[0].id)} className="mnyt-detail-remix">
              <div className="mnyt-detail-remix-label">{t.remixLabel}</div>
              <div className="mnyt-detail-remix-topic">
                {relatedTopics[0].categoryName} · {isVi ? relatedTopics[0].title : relatedTopics[0].titleEn || relatedTopics[0].title}
              </div>
              <div className="mnyt-detail-remix-cta">{t.remixCta}</div>
            </Link>
          )}
          <div className="mnyt-detail-done-actions">
            <button type="button" className="mnyt-detail-fav-btn" data-active={isFavorite} onClick={handleToggleFavorite}>
              {t.favLabel}
            </button>
            <button type="button" className="mnyt-detail-share-btn" disabled title={isVi ? "Sắp ra mắt" : "Coming soon"}>
              {t.shareCardLabel}
            </button>
            <button type="button" className="mnyt-detail-outline-btn" onClick={handleShare}>
              {t.shareLabel}
            </button>
            <button type="button" className="mnyt-detail-another-btn" onClick={() => router.push(MNYT_ROUTES.archive)}>
              {t.anotherLabel}
            </button>
          </div>
        </div>
      ) : (
        <>
          {currentStep === 0 && (
            <div className="mnyt-detail-card" style={{ ["--card-accent" as string]: topic.color }}>
              <div className="mnyt-detail-card-kicker">{t.stepLabels[0]}</div>
              <div className="mnyt-detail-tabs">
                {conceptTabs.map((tab, i) => (
                  <button key={i} type="button" className="mnyt-detail-tab" data-active={conceptTab === i} onClick={() => setConceptTab(i)}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <p className="mnyt-detail-body-text">{conceptTabs[conceptTab].text}</p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="mnyt-detail-card" style={{ ["--card-accent" as string]: topic.color }}>
              <div className="mnyt-detail-card-kicker">{t.stepLabels[1]}</div>
              <div className="mnyt-detail-tabs">
                {promptTabs.map((tab, i) => (
                  <button key={i} type="button" className="mnyt-detail-tab" data-active={promptTab === i} onClick={() => setPromptTab(i)}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mnyt-detail-flow-label">{t.flowLabel}</div>
              <div className="mnyt-detail-flow-row">
                {flowSteps.map((fw, i) => (
                  <div className="mnyt-detail-flow-card" key={i}>
                    <div className="mnyt-detail-flow-cap">
                      <span>{fw.icon}</span>
                      {fw.cap}
                    </div>
                    <div className="mnyt-detail-flow-body">{fw.body}</div>
                  </div>
                ))}
              </div>
              <div className="mnyt-detail-prompt-box">{activePromptText}</div>
              <button type="button" className="mnyt-detail-copy-btn" onClick={handleCopyPrompt}>
                {copyFeedback ?? t.copyPrompt}
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mnyt-detail-card" style={{ ["--card-accent" as string]: topic.color }}>
              <div className="mnyt-detail-card-kicker">{t.stepLabels[2]}</div>
              {renderQuizBlock(mainQuiz, mainQuizAnswer, setMainQuizAnswer, "main")}
              {hasApplyQuiz && renderQuizBlock(applyQuiz, applyQuizAnswer, setApplyQuizAnswer, "apply")}
              {hasScenario && renderQuizBlock(scenarioQuiz, scenarioQuizAnswer, setScenarioQuizAnswer, "scenario")}
            </div>
          )}

          {currentStep === 3 && (
            <div className="mnyt-detail-card" style={{ ["--card-accent" as string]: topic.color }}>
              <div className="mnyt-detail-card-kicker">{t.stepLabels[3]}</div>
              <p className="mnyt-detail-body-text" style={{ marginBottom: 20 }}>
                {isVi ? c.apply : c.applyEn}
              </p>
              <div className="mnyt-detail-checklist">
                {checklistLabels.map((label, i) => (
                  <button key={i} type="button" className="mnyt-detail-checklist-row" onClick={() => toggleChecklistItem(i as 0 | 1 | 2)}>
                    <span className="mnyt-detail-checklist-box" data-checked={checklist[i]}>
                      {checklist[i] ? "✓" : ""}
                    </span>
                    <span className="mnyt-detail-checklist-text" data-checked={checklist[i]}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="mnyt-detail-card" style={{ ["--card-accent" as string]: topic.color }}>
              <div className="mnyt-detail-card-kicker">{t.stepLabels[4]}</div>
              <p className="mnyt-detail-body-text">{isVi ? c.takeaway : c.takeawayEn}</p>
              {relatedTopics.length > 0 && (
                <div className="mnyt-detail-related-row">
                  <div className="mnyt-detail-card-kicker" style={{ marginBottom: 10 }}>
                    {t.relatedLabel}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {relatedTopics.map((rt) => (
                      <Link key={rt.id} href={mnytDetailHref(rt.id)} className="mnyt-detail-related-item">
                        <span className="mnyt-detail-related-dot" style={{ background: rt.color }} />
                        <span className="mnyt-detail-related-title">{isVi ? rt.title : rt.titleEn || rt.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="mnyt-detail-outdated-row">
                <button type="button" className="mnyt-detail-outdated-link" onClick={handleReportOutdated} disabled={reported}>
                  {t.reportOutdated}
                </button>
              </div>
            </div>
          )}

          <div className="mnyt-detail-nav-row">
            <button type="button" className="mnyt-detail-nav-btn" onClick={prevStep} disabled={currentStep === 0}>
              {t.back_}
            </button>
            <button type="button" className="mnyt-detail-nav-btn mnyt-detail-nav-btn--primary" onClick={nextStep} disabled={completing || (currentStep === STEP_COUNT - 1 && !signedIn)}>
              {t.next}
            </button>
          </div>
          <div className="mnyt-detail-kbd-hint">{t.kbdHint}</div>
        </>
      )}

      <div className="mnyt-detail-pathfoot">
        {prevTopic ? (
          <Link href={mnytDetailHref(prevTopic.id)} className="mnyt-detail-pathfoot-btn">
            <div className="mnyt-detail-pathfoot-kicker">{t.prevPath}</div>
            <div className="mnyt-detail-pathfoot-title">{isVi ? prevTopic.title : prevTopic.titleEn || prevTopic.title}</div>
          </Link>
        ) : (
          <div />
        )}
        {nextTopic ? (
          <Link href={mnytDetailHref(nextTopic.id)} className="mnyt-detail-pathfoot-btn mnyt-detail-pathfoot-btn--next">
            <div className="mnyt-detail-pathfoot-kicker">{t.nextPath}</div>
            <div className="mnyt-detail-pathfoot-title">{isVi ? nextTopic.title : nextTopic.titleEn || nextTopic.title}</div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
