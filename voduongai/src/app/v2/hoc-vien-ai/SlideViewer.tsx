"use client";

import { useEffect, useState } from "react";

import type { AcademySlideLessonDetail } from "@/lib/portal/live-academy-slides";

/**
 * Trình chiếu slide native cho 1 bài học "Học AI theo nhu cầu/công cụ/nghề
 * nghiệp" — đúng yêu cầu brief gốc mục 4b: dựng trong Portal, KHÔNG nhúng
 * công cụ trình chiếu ngoài (Google Slides/PowerPoint...). Modal đơn giản,
 * điều hướng bàn phím + nút prev/next + progress dot.
 */
export function SlideViewer({ lesson, onClose }: { lesson: AcademySlideLessonDetail; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const total = lesson.slides.length;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, total - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, total]);

  if (total === 0) return null;
  const slide = lesson.slides[index];

  return (
    <div className="slide-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="slide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="slide-modal-head">
          <div>
            <span className="slide-modal-cat">{lesson.categoryLabel}</span>
            <h3>{lesson.title}</h3>
          </div>
          <button type="button" className="slide-close" onClick={onClose} aria-label="Đóng">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="slide-stage">
          <h4>{slide.heading}</h4>
          <p>{slide.body}</p>
        </div>

        <div className="slide-modal-foot">
          <button type="button" className="slide-nav-btn" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
            ← Trước
          </button>
          <div className="slide-dots">
            {lesson.slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === index ? "slide-dot active" : "slide-dot"}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="slide-nav-btn"
            disabled={index === total - 1}
            onClick={() => setIndex((i) => i + 1)}
          >
            Tiếp →
          </button>
        </div>
      </div>
    </div>
  );
}
