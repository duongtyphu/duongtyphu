import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { sanitizeNextParam } from "@/lib/auth/safe-next";

// Shared callback for Google OAuth, magic-link, and password-reset email
// links. `exchangeCodeForSession` verifies the PKCE code/state pair that
// Supabase's SDK generated at signInWithOAuth/signInWithOtp time — that's
// the CSRF protection for this flow, not something this route needs to
// implement itself. Account auto-linking (Google sign-in landing on an
// existing email/password account with the same, verified email) is a
// Supabase Dashboard setting (Authentication → Providers → email-based
// identity linking) — this route doesn't need special-case logic for it,
// it just exchanges whatever code Supabase issued.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNextParam(searchParams.get("next"));

  if (code) {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
