import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase-server";
import { sanitizeNextParam } from "@/lib/auth/safe-next";
import { OnboardingIdentityForm } from "@/components/auth/OnboardingIdentityForm";
import { authTheme } from "@/lib/site/auth-theme";

export const metadata = { title: "Hoàn tất hồ sơ", robots: { index: false } };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = sanitizeNextParam(rawNext, "/v2/trang-chu");

  // Cùng fallback với cổng chính Portal 2.0 (xem `safe-next.ts`/`middleware.ts`)
  // — khi Supabase chưa cấu hình (local/demo), không có khái niệm session/
  // onboarding thật để gate.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect(next);
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/onboarding")}`);
  }

  const { data: member } = await supabase
    .from("members")
    .select("full_name, onboarding_completed_at")
    .eq("id", user.id)
    .single();

  // Đã hoàn thành onboarding từ trước (vd. bấm Back sau khi xong) — không
  // cho xem lại form, đưa thẳng tới đích.
  if (member?.onboarding_completed_at) {
    redirect(next);
  }

  const initialFullName = member?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? "";

  // Đọc trực tiếp cookie theme ở server (cùng nguồn `initialTheme` mà
  // LandingThemeProvider dùng ở root layout.tsx) để h1/p trên trang này
  // khớp theme ngay từ lần render đầu, không cần đợi client hydrate.
  const cookieStore = await cookies();
  const theme = cookieStore.get("vdai-landing-theme")?.value === "dark" ? "dark" : "light";
  const t = authTheme[theme];

  return (
    <div className={t.pageBg}>
      <section className="mx-auto flex max-w-sm flex-col px-5 py-20 md:py-28">
        <h1 className={`text-2xl font-extrabold ${t.heading}`}>Hoàn tất hồ sơ của bạn</h1>
        <p className={`mt-2 text-sm leading-relaxed ${t.subtext}`}>
          Vài thông tin nhanh để Companion cá nhân hoá hành trình học AI cho bạn.
        </p>
        <OnboardingIdentityForm next={next} initialFullName={initialFullName} />
      </section>
    </div>
  );
}
