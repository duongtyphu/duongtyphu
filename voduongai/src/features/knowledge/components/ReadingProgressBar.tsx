"use client";

import { useEffect, useState } from "react";

/** Feature 06 — Reading Experience: Scroll Progress, fixed thin bar, không màu mè. */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, percent)));
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-30 -mx-4 h-0.5 bg-gray-100 md:-mx-8">
      <div className="h-full bg-blue-500 transition-[width]" style={{ width: `${progress}%` }} />
    </div>
  );
}
