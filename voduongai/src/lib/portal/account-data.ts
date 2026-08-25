import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";
import { buildLifeProfile } from "@/lib/portal/life-profile/life-profile";

/**
 * Dữ liệu trang Tài khoản — tách ra từ `/portal/account/page.tsx` (Server
 * Component, logic gốc) để DÙNG CHUNG với `/v2/tai-khoan` (2.0). Single
 * Source of Truth: sửa cách đọc dữ liệu ở đây phản ánh cả 2 bản, không
 * copy lại 2 lần.
 */
export type AccountOrder = {
  id: number;
  product_name: string | null;
  status: string;
  created_at: string;
  confirmed_at: string | null;
  products: { title: string; icon: string | null; video_url: string | null; pdf_url: string | null } | null;
  lessons: { title: string; video_url: string | null; pdf_url: string | null } | null;
};

export async function getAccountData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { user: null, orders: [] as AccountOrder[], now: Date.now(), lifeProfile: buildLifeProfile({ dateOfBirth: null, dateOfBirthHidden: false }) };
  }
  const supabase = await getSupabaseServer();
  const user = await getCachedAuthUser();
  if (!user?.email) {
    return { user, orders: [] as AccountOrder[], now: Date.now(), lifeProfile: buildLifeProfile({ dateOfBirth: null, dateOfBirthHidden: false }) };
  }

  const [{ data }, { data: memberRow }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, product_name, status, created_at, confirmed_at, products(title, icon, video_url, pdf_url), lessons(title, video_url, pdf_url)")
      .eq("member_email", user.email)
      .order("created_at", { ascending: false }),
    supabase.from("members").select("date_of_birth, date_of_birth_hidden").eq("id", user.id).single(),
  ]);

  const lifeProfile = buildLifeProfile({
    dateOfBirth: memberRow?.date_of_birth ?? null,
    dateOfBirthHidden: memberRow?.date_of_birth_hidden ?? false,
  });

  return { user, orders: (data as unknown as AccountOrder[]) ?? [], now: Date.now(), lifeProfile };
}
