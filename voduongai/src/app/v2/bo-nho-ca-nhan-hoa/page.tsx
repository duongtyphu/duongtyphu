import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getSupabaseServer } from "@/lib/supabase-server";

import { BoNhoCaNhanHoaClient } from "./BoNhoCaNhanHoaClient";

export const metadata = { title: "Bộ nhớ & Cá nhân hoá | VO DUONG AI" };

/**
 * `/v2/bo-nho-ca-nhan-hoa` — Bước F. Chỉ tải `members.created_at` (ngày tham
 * gia thật) ở server — phần còn lại (ký ức/mục tiêu) đọc localStorage nên
 * phải ở Client Component (xem chú thích đầu `BoNhoCaNhanHoaClient.tsx`).
 */
export default async function BoNhoCaNhanHoaPage() {
  const premium = await getPremiumStatus();

  let joinedAt: string | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: member } = await supabase
        .from("members")
        .select("created_at")
        .eq("id", userData.user.id)
        .maybeSingle();
      joinedAt = (member?.created_at as string | null) ?? null;
    }
  }

  return <BoNhoCaNhanHoaClient premium={premium} joinedAt={joinedAt} />;
}
