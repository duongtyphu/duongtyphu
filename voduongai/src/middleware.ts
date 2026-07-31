import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isProtectedRoute } from "@/lib/protected-routes";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Portal is intentionally left public when Supabase isn't configured (local/demo use).
    // Admin must never be reachable in that state — there's no safe "open admin" fallback.
    if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPortalRoute = isProtectedRoute(pathname);
  const isOnboardingRoute = pathname === "/onboarding";
  const isPortalOnlyRoute = isPortalRoute && !isOnboardingRoute;
  const isLoginRoute = pathname === "/login" || pathname === "/register";
  const isAdminLoginRoute = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin") && !isAdminLoginRoute;

  if (isPortalRoute && !data.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && data.user) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  // Onboarding gate: user mới (chưa có members.onboarding_completed_at)
  // phải hoàn tất hồ sơ trước khi vào bất kỳ trang /portal/* nào — không
  // áp dụng cho chính /onboarding (tránh redirect loop) hay /admin/*.
  if (isPortalOnlyRoute && data.user) {
    const { data: member } = await supabase
      .from("members")
      .select("onboarding_completed_at")
      .eq("id", data.user.id)
      .single();

    if (!member?.onboarding_completed_at) {
      const onboardingUrl = new URL("/onboarding", request.url);
      onboardingUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(onboardingUrl);
    }
  }

  if (isAdminRoute || isAdminLoginRoute) {
    let isAdmin = false;
    if (data.user) {
      const { data: member } = await supabase.from("members").select("is_admin").eq("id", data.user.id).single();
      isAdmin = Boolean(member?.is_admin);
    }

    if (isAdminRoute && !isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      if (data.user) loginUrl.searchParams.set("error", "not_admin");
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminLoginRoute && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return response;
}

// Next.js requires matcher patterns to be static string literals — keep
// this list in sync with PROTECTED_ROUTE_PREFIXES in src/lib/protected-routes.ts.
export const config = {
  matcher: ["/portal/:path*", "/onboarding", "/login", "/register", "/admin/:path*"],
};
