import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";

import { BoNhoCaNhanHoaClient } from "./BoNhoCaNhanHoaClient";

export const metadata = { title: "Bộ nhớ & Cá nhân hoá | VO DUONG AI" };

/**
 * `/v2/bo-nho-ca-nhan-hoa` — Bước F. Chỉ tải `members.created_at` (ngày tham
 * gia thật) ở server — phần còn lại (ký ức/mục tiêu) đọc localStorage nên
 * phải ở Client Component (xem chú thích đầu `BoNhoCaNhanHoaClient.tsx`).
 *
 * `getCachedAuthUser()` (thay vì tự gọi `auth.getUser()` riêng ở đây) —
 * dedupe với lần gọi bên trong `getPremiumStatus()` ngay phía trên, tránh 2
 * lần xác thực mạng thật giống hệt nhau trong cùng 1 lượt render (xem
 * docblock hàm này trong `supabase-server.ts`).
 */
export default async function BoNhoCaNhanHoaPage() {
  const premium = await getPremiumStatus();

  let joinedAt: string | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const user = await getCachedAuthUser();
    if (user) {
      const supabase = await getSupabaseServer();
      const { data: member } = await supabase
        .from("members")
        .select("created_at")
        .eq("id", user.id)
        .maybeSingle();
      joinedAt = (member?.created_at as string | null) ?? null;
    }
  }

  return <BoNhoCaNhanHoaClient premium={premium} joinedAt={joinedAt} />;
}
