"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    BUBBLE_SLOTS.forEach((_, slot) => {
      const startDelay = SLOT_START_DELAY_MS[slot % SLOT_START_DELAY_MS.length];
      const cadence = SLOT_INTERVAL_MS[slot % SLOT_INTERVAL_MS.length];

      const timeout = setTimeout(() => {
        setIndices((prev) => {
          const next = [...prev];
          next[slot] = (next[slot] + slotCount) % questions.length;
          return next;
        });

        intervals.push(
          setInterval(() => {
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
