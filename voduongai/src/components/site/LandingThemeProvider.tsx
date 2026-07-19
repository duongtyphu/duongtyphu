"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type LandingTheme = "dark" | "light";

const STORAGE_KEY = "vdai-landing-theme";
const COOKIE_KEY = "vdai-landing-theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const LandingThemeContext = createContext<{
  theme: LandingTheme;
  toggleTheme: () => void;
} | null>(null);

function writeTheme(theme: LandingTheme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
  document.cookie = `${COOKIE_KEY}=${theme}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

// Scoped to the "/" landing page only — components elsewhere (Portal,
// Admin, other public pages) simply never read this context, so wrapping
// the whole app here has no visual effect outside the toggle's own usage.
//
// `initialTheme` comes from the server (layout.tsx reads the theme cookie
// via next/headers) so the very first paint — SSR and client hydration —
// already matches the visitor's saved preference. No client-only "flip
// after mount" step means no flash of the wrong theme on load.
export function LandingThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: React.ReactNode;
  initialTheme?: LandingTheme;
}) {
  const [theme, setTheme] = useState<LandingTheme>(initialTheme);
  const migrated = useRef(false);

  useEffect(() => {
    if (migrated.current) return;
    migrated.current = true;
    // One-time migration for browsers that have a localStorage preference
    // from before the cookie existed, but no cookie yet — write the cookie
    // now so the *next* load is correct too. Doesn't touch the current
    // render, so it can't cause a flash on this load.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const hasCookie = document.cookie.includes(`${COOKIE_KEY}=`);
    if (!hasCookie && (stored === "light" || stored === "dark")) {
      document.cookie = `${COOKIE_KEY}=${stored}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      writeTheme(next);
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
