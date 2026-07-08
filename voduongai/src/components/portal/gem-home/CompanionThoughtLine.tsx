"use client";

import { useEffect, useState } from "react";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";

/**
 * Portal 4.0 Home Emotional Experience — the one memorable moment on Home.
 * A single quiet line from the same curated Thought Seeds already used on
 * /portal/companion — real editorial content, not fabricated personalization,
 * chosen once per visit. Deliberately small and easy to miss on purpose:
 * subtle, not dramatic.
 */
export function CompanionThoughtLine() {
  const [thought, setThought] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time pick from a static list, no SSR equivalent
    setThought(getRandomThoughtSeed());
  }, []);

  if (!thought) return null;
  return (
    <p className="mt-4 text-center text-sm italic leading-relaxed text-gray-400">&ldquo;{thought}&rdquo;</p>
  );
}
