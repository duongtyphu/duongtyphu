"use client";

import { createContext, useContext, useEffect, useState } from "react";

type LandingTheme = "dark" | "light";

const STORAGE_KEY = "vdai-landing-theme";

const LandingThemeContext = createContext<{
  theme: LandingTheme;
  toggleTheme: () => void;
} | null>(null);

// Scoped to the "/" landing page only — components elsewhere (Portal,
// Admin, other public pages) simply never read this context, so wrapping
// the whole app here has no visual effect outside the toggle's own usage.
export function LandingThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<LandingTheme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // One-time hydration from localStorage after mount — SSR has no
    // access to it, so this can't be a lazy useState initializer instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <LandingThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </LandingThemeContext.Provider>
  );
}

export function useLandingTheme() {
  const ctx = useContext(LandingThemeContext);
  if (!ctx) throw new Error("useLandingTheme must be used within LandingThemeProvider");
  return ctx;
}
