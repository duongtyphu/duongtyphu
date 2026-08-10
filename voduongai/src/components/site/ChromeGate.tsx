"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ChromeGate({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isPortal = pathname?.startsWith("/portal");
  // Portal & Admin 2.0 mang shell riêng (sidebar + topbar của bộ thiết kế mới),
  // không dùng header/footer marketing — giống /portal và /admin hiện tại.
  const isV2 = pathname?.startsWith("/v2");

  // Next.js resets scroll to top after hydrating a fresh navigation, which
  // races with (and wins over) the browser's native "#hash" scroll-into-view
  // — so a Link like "/#trai-nghiem-hoc-vien-ai" lands at the top instead of
  // the target section. Re-run the scroll ourselves once hydration settles.
  useEffect(() => {
    let cancelled = false;
    let timer: number;

    // The target section may not be mounted yet right after a client-side
    // route change (the rest of the page is still rendering), so retry a
    // few times instead of a single fixed-delay attempt.
    function scrollToHash(attemptsLeft = 20) {
      const hash = window.location.hash.slice(1);
      if (!hash || cancelled) return;
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (attemptsLeft > 0) {
        timer = window.setTimeout(() => scrollToHash(attemptsLeft - 1), 50);
      }
    }

    const onHashChange = () => scrollToHash();
    timer = window.setTimeout(() => scrollToHash(), 50);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  if (isAdmin || isPortal || isV2) return <>{children}</>;

  return (
    <>
      {header}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
      {footer}
    </>
  );
}
