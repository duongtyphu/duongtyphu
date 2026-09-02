"use client";

/**
 * View "Thẻ lật" (10/10) — `/v2/moi-ngay-mot-y-tuong/the-lat`, 1:1 với
 * mockup dòng 1218-1254: thẻ lật (mặt trước: lĩnh vực + tiêu đề; mặt sau:
 * hook + đoạn khái niệm), nút Trước/Xáo bài/Tiếp/Thoát, bàn phím ← → đổi
 * thẻ · Space/Enter lật thẻ (đúng `_onKeyDown` gốc, `s.view === 'flashcard'`).
 *
 * Bộ thẻ (`initialDeck`) chỉ mang cột NHẸ (`MnytTopicSummary`, không có
 * `content`) — đoạn "khái niệm" ở mặt sau tải LƯỜI đúng lúc lật thẻ, qua
 * `GET /api/mnyt/topics/[id]` có sẵn (dùng chung route trang Chi tiết ý
 * tưởng) — không tải trước `content` cho cả bộ (có thể tới 446 ý tưởng nếu
 * mở từ "Kho ý tưởng" với bộ lọc "Tất cả"), đúng nguyên tắc hiệu năng của
 * README. Kết quả tải cache theo `id` trong `conceptById`, không tải lại
 * khi quay về đúng thẻ đã xem trước đó (`fetchedRef`).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { MnytTopicFull, MnytTopicSummary } from "@/lib/portal/live-mnyt";
import { MNYT_ROUTES } from "@/app/v2/moi-ngay-mot-y-tuong/mnyt-routes";

type Props = {
  lang: "vi" | "en";
  initialDeck: MnytTopicSummary[];
};

type ConceptState = { status: "loading" } | { status: "ready"; concept: string; conceptEn: string } | { status: "error" };

export function MnytFlashcardClient({ lang, initialDeck }: Props) {
  const isVi = lang === "vi";
  const [deck, setDeck] = useState(initialDeck);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [conceptById, setConceptById] = useState<Record<string, ConceptState>>({});
  const fetchedRef = useRef<Set<string>>(new Set());

  const total = deck.length;
  const current = total > 0 ? deck[index] : null;

  const t = {
    progress: isVi ? "Thẻ" : "Card",
    noCards: isVi ? "Chưa có thẻ" : "No cards",
    emptyLabel: isVi
      ? "Bộ thẻ đang trống. Chọn một lĩnh vực trong kho ý tưởng rồi bắt đầu luyện thẻ."
      : "This deck is empty. Pick a field in the library, then start a flashcard round.",
    frontHint: isVi ? "Mặt trước" : "Front",
    prev: isVi ? "← Trước" : "← Prev",
    next: isVi ? "Tiếp →" : "Next →",
    shuffle: isVi ? "Xáo bài" : "Shuffle",
    exit: isVi ? "Thoát thẻ lật" : "Exit flashcards",
    archiveTitle: isVi ? "Kho ý tưởng" : "Idea library",
    kbdHint: isVi ? "Bàn phím: ← → đổi thẻ · Space lật thẻ" : "Keyboard: ← → change card · Space flips it",
    loading: isVi ? "Đang tải..." : "Loading...",
    loadError: isVi ? "Không tải được — bấm để thử lại" : "Couldn't load — click to retry",
  };

  const progressLabel = total > 0 ? `${t.progress} ${index + 1}/${total}` : t.noCards;

  const loadConcept = useCallback((id: string) => {
    if (fetchedRef.current.has(id)) return;
    fetchedRef.current.add(id);
    setConceptById((prev) => ({ ...prev, [id]: { status: "loading" } }));
    fetch(`/api/mnyt/topics/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json() as Promise<MnytTopicFull>;
      })
      .then((full) => {
        setConceptById((prev) => ({ ...prev, [id]: { status: "ready", concept: full.content.concept, conceptEn: full.content.conceptEn } }));
      })
      .catch(() => {
        fetchedRef.current.delete(id);
        setConceptById((prev) => ({ ...prev, [id]: { status: "error" } }));
      });
  }, []);

  const flip = useCallback(() => {
    setFlipped((f) => {
      const next = !f;
      if (next && current) loadConcept(current.id);
      return next;
    });
  }, [current, loadConcept]);

  const goNext = useCallback(() => {
    if (total === 0) return;
    setIndex((i) => (i + 1) % total);
    setFlipped(false);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total === 0) return;
    setIndex((i) => (i - 1 + total) % total);
    setFlipped(false);
  }, [total]);

  const shuffle = useCallback(() => {
    setDeck((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    setIndex(0);
    setFlipped(false);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["TEXTAREA", "INPUT"].includes(target.tagName)) return;
      if (target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === " " || e.key === "Enter") flip();
      else return;
      e.preventDefault();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext, flip]);

  const conceptState = current ? conceptById[current.id] : undefined;
  const conceptText = conceptState?.status === "ready" ? (isVi ? conceptState.concept : conceptState.conceptEn || conceptState.concept) : null;

  return (
    <section className="mnyt-flashcard" data-screen-label="Flashcards">
      <div className="mnyt-flashcard-progress">{progressLabel}</div>

      {total === 0 || !current ? (
        <>
          <div className="mnyt-flashcard-empty">{t.emptyLabel}</div>
          <div className="mnyt-flashcard-empty-cta-row">
            <Link href={MNYT_ROUTES.archive} className="mnyt-flashcard-empty-cta">
              {t.archiveTitle}
            </Link>
          </div>
        </>
      ) : (
        <>
          <div
            className="mnyt-flashcard-face"
            data-flipped={flipped}
            role="button"
            tabIndex={0}
            onClick={flip}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                flip();
              }
            }}
          >
            <span className="mnyt-flashcard-category" style={{ color: current.color }}>
              {isVi ? current.categoryName : current.categoryNameEn || current.categoryName}
            </span>
            <h2 className="mnyt-flashcard-title">{isVi ? current.title : current.titleEn || current.title}</h2>
            {flipped && (
              <>
                <p className="mnyt-flashcard-hook">{isVi ? current.hook : current.hookEn || current.hook}</p>
                <p className="mnyt-flashcard-concept" data-state={conceptState?.status ?? "idle"}>
                  {conceptText ?? (conceptState?.status === "error" ? t.loadError : t.loading)}
                </p>
              </>
            )}
            <p className="mnyt-flashcard-hint">{t.frontHint}</p>
          </div>

          <div className="mnyt-flashcard-actions">
            <button type="button" onClick={goPrev} className="mnyt-flashcard-btn">
              {t.prev}
            </button>
            <button type="button" onClick={shuffle} className="mnyt-flashcard-btn">
              {t.shuffle}
            </button>
            <button type="button" onClick={goNext} className="mnyt-flashcard-btn mnyt-flashcard-btn--primary">
              {t.next}
            </button>
            <Link href={MNYT_ROUTES.archive} className="mnyt-flashcard-exit">
              {t.exit}
            </Link>
          </div>
          <div className="mnyt-flashcard-kbd-hint">{t.kbdHint}</div>
        </>
      )}
    </section>
  );
}
