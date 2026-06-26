import { PortalShell } from "@/components/portal/PortalShell";
import { NotificationTicker } from "@/components/portal/NotificationTicker";
import { GoalOnboardingModal } from "@/components/portal/GoalOnboardingModal";
import { getSupabaseServer } from "@/lib/supabase-server";

async function getCurrentUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email) return null;
  return { email: data.user.email, fullName: data.user.user_metadata?.full_name as string | undefined };
}

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <PortalShell user={user}>
      <NotificationTicker />
      <GoalOnboardingModal />
      {children}
    </PortalShell>
  );
}
