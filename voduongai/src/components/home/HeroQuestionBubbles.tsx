"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

// Fixed, hand-placed slots arranged in a ring around the glowing core.
// Positions never move — only their content cross-fades — so bubbles can
// never drift into each other and overlap, no matter how long a question
// is.
const BUBBLE_SLOTS = [
  { top: "15%", left: "50%" },
  { top: "34%", left: "23%" },
  { top: "34%", left: "77%" },
  { top: "68%", left: "23%" },
  { top: "68%", left: "77%" },
  { top: "87%", left: "50%" },
];

// Slow, slightly-desynced per-slot cadence (each slot cycles only the
// questions assigned to it, round-robin) so switches never line up and
// read as a calm, continuous flow rather than a synchronized flash.
const SLOT_INTERVAL_MS = [5700, 6250, 6800, 7350, 7900, 8450];
const SLOT_START_DELAY_MS = [0, 950, 1900, 2850, 3800, 4750];

export function HeroQuestionBubbles({ questions }: { questions: string[] }) {
  const slotCount = BUBBLE_SLOTS.length;
  const [indices, setIndices] = useState<number[]>(() =>
    BUBBLE_SLOTS.map((_, slot) => slot % questions.length)
  );
  // WCAG 2.2.2 (Pause, Stop, Hide) — the bubbles cross-fade to new content
  // indefinitely with no built-in way to stop them; `pausedRef` (not just
  // state) lets the still-running interval callbacks below check the latest
  // value without needing to tear down/restart the timers on every toggle.
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    BUBBLE_SLOTS.forEach((_, slot) => {
      const startDelay = SLOT_START_DELAY_MS[slot % SLOT_START_DELAY_MS.length];
      const cadence = SLOT_INTERVAL_MS[slot % SLOT_INTERVAL_MS.length];

      const timeout = setTimeout(() => {
        if (!pausedRef.current) {
          setIndices((prev) => {
            const next = [...prev];
            next[slot] = (next[slot] + slotCount) % questions.length;
            return next;
          });
        }

        intervals.push(
          setInterval(() => {
            if (pausedRef.current) return;
            setIndices((prev) => {
              const next = [...prev];
              next[slot] = (next[slot] + slotCount) % questions.length;
              return next;
            });
          }, cadence)
        );
      }, startDelay);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [questions.length, slotCount]);

  return (
    <>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Tiếp tục đổi câu hỏi" : "Tạm dừng đổi câu hỏi"}
        className="hero-bubble-pause pointer-events-auto absolute bottom-1 right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-md transition hover:text-white"
      >
        {paused ? <Play className="h-3 w-3" strokeWidth={2.25} /> : <Pause className="h-3 w-3" strokeWidth={2.25} />}
      </button>
      {BUBBLE_SLOTS.map((pos, slot) => (
        <div
          key={slot}
          className="hero-bubble-slot"
          style={{
            top: pos.top,
            left: pos.left,
            animationDelay: `${slot * 0.7}s`,
            animationDuration: `${6.5 + slot * 0.5}s`,
          }}
        >
          <AnimatePresence>
            <motion.span
              key={indices[slot]}
              initial={{ opacity: 0, scale: 0.82, y: 8, filter: "blur(2px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, y: -6, filter: "blur(1px)" }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="hero-bubble-pill"
            >
              {questions[indices[slot]]}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </>
  );
}
