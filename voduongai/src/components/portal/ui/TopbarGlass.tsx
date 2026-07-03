export function TopbarGlass({
  children,
  companionTheme = false,
}: {
  children: React.ReactNode;
  /** Layer 05 patch — Companion Header Theme, chỉ bật khi route là /portal/companion*. */
  companionTheme?: boolean;
}) {
  return (
    <header className={`gemos-topbar sticky top-0 z-40 ${companionTheme ? "companion-topbar-theme" : ""}`}>
      {children}
    </header>
  );
}
