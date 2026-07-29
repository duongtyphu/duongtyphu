/**
 * Single source of truth for which top-level route prefixes require
 * authentication. `middleware.ts` uses `isProtectedRoute()` for the actual
 * runtime decision. `middleware.ts`'s `config.matcher` still needs its own
 * static, literal string patterns (Next.js requires matcher values to be
 * statically analyzable at build time — it cannot be derived from an
 * imported array), so it must be kept in sync with this list by hand;
 * this file exists so that sync point has a name and a comment instead of
 * being an unlabeled string buried inside a boolean expression.
 *
 * PORTAL_ROUTE_MIGRATION_PLAN.md Phase 1: when/if the `/portal/` prefix is
 * ever removed, this is the one array that needs a second entry (the new
 * prefix) while both old and new routes are served in parallel.
 */
export const PROTECTED_ROUTE_PREFIXES = ["/portal", "/onboarding"] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
