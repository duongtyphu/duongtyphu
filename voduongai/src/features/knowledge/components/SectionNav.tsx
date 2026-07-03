"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { SEED_CONTENT_SECTIONS } from "./TableOfContents";

function currentSectionIndex(): number {
  let current = 0;
  SEED_CONTENT_SECTIONS.forEach((section, i) => {
    const el = document.getElementById(section.id);
    if (el && el.getBoundingClientRect().top <= 120) current = i;
  });
  return current;
}

function scrollToSection(index: number) {
  const section = SEED_CONTENT_SECTIONS[index];
  if (!section) return;
  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Feature 06 — Next Section / Previous Section, di chuyển giữa các phần trong 1 Seed. */
export function SectionNav() {
  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2">
      <button
        type="button"
        aria-label="Phần trước"
        onClick={() => scrollToSection(Math.max(0, currentSectionIndex() - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-500 shadow-md backdrop-blur-sm transition hover:text-blue-600"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Phần tiếp theo"
        onClick={() => scrollToSection(Math.min(SEED_CONTENT_SECTIONS.length - 1, currentSectionIndex() + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-500 shadow-md backdrop-blur-sm transition hover:text-blue-600"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}
