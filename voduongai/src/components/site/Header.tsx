import { getSupabaseServer } from "@/lib/supabase-server";
import { HeaderClient } from "@/components/site/HeaderClient";
import type { SiteSettings } from "@/lib/site-settings";

async function getCurrentUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function Header({ settings }: { settings: SiteSettings }) {
  const user = await getCurrentUser();
  const meta = user?.user_metadata ?? {};

  return (
    <HeaderClient
      siteName={settings.siteName}
      slogan={settings.slogan}
      userEmail={user?.email}
      fullName={meta.full_name}
    />
  );
}
